import {
  Resolver,
  Ctx,
  Arg,
  Mutation,
  InputType,
  Field,
  ObjectType,
  Query,
} from "type-graphql";
import { MyContext } from "src/types";
import argon2 from "argon2";
import { User } from "./../entities/User";
import { EntityManager } from "@mikro-orm/postgresql";
import { COOKIE_NAME } from "./../constants";
import { UserRegisterInput } from "./UserRegisterInput";
import { validateRegister } from "./../utils/validateRegister";
import { FieldError } from "./FieldError";

@InputType()
class LoginInput {
  @Field()
  userNameOrEmail: string;

  @Field()
  password: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })

  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: MyContext): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    }
    const currentUser = await em.findOne(User, { id: req.session.userId });

    return currentUser;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UserRegisterInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(options.password);

    // const user = em.create(User, {
    //   userName: options.loginInput.userName,
    //   password: hashedPassword,
    //   firstName: options.firstName,
    //   lastName: options.lastName,
    // });
    let user;
    try {
      // await em.persistAndFlush(user); //thowing unknown error - ValidationError: You cannot call em.flush() from inside lifecycle hook handlers

      const result = await (em as EntityManager).createQueryBuilder(User).getKnexQuery().insert({
        //need to provide actual column names that are in DB and need to provide all columns, since this is a raw query and we don't have ORM types and validations availe, and similarly we need to map the result that we get to our types bcecause that would be a raw result from DB 
        user_name: options.userName,
        email: options.email,
        password: hashedPassword,
        first_name: options.firstName,
        last_name: options.lastName,
        created_at: new Date(), //need to provide all columns vals since we are doing a insert manually
        updated_at: new Date(), //need to provide all columns vals since we are doing a insert manually
      }).returning('*');
      const mappedToEntitiesResults = result.map((item: User) => em.map(User, item)); //mapped raw result from DB to ORM type 
      user = mappedToEntitiesResults[0];
    } catch (error) {
      if (
        error.name === "UniqueConstraintViolationException" ||
        error.code === "23505"
      ) {
        return {
          errors: [
            {
              field: "userName",
              message: "userName already taken",
            },
          ],
        };
      }
      console.log(error);
      return {
        errors: [
          {
            field: "userName",
            message: error.detail || "something went wrong",
          },
        ],
      };
    }

    //setting up sessions
    //store user id in session
    //this will keep the user logged in
    req.session.userId = user.id;
    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: LoginInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, {
      [options.userNameOrEmail.includes("@") ? "email" : "userName"]: options.userNameOrEmail,
    });
    if (!user) {
      return {
        errors: [
          {
            field: "userNameOrEmail",
            message: "invalid userNameOrEmail",
          },
        ],
      };
    }
    const isValidPass = await argon2.verify(user.password, options.password);
    if (!isValidPass) {
      return {
        errors: [
          {
            field: "password",
            message: "invalid password",
          },
        ],
      };
    }

    //setting up sessions
    //store user id in session
    //this will keep the user logged in
    req.session.userId = user.id;
    return {
      user,
    };
  }
  @Mutation(() => Boolean)
  async logout(
    @Ctx() { req, res }: MyContext
  ) {
    return new Promise((resolve) => (
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      })
    ));

  }
}
