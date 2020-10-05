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
import { COOKIE_NAME, FORGOT_PASSWORD_PREFIX } from "./../constants";
import { UserRegisterInput } from "./UserRegisterInput";
import { validateRegister } from "./../utils/validateRegister";
import { FieldError } from "./FieldError";
import { sendMail } from "../utils/sendMail";
import { v4 as uuidv4 } from 'uuid';
import { getConnection } from "typeorm";

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
  @Query(() => UserResponse)
  async me(@Ctx() { req }: MyContext): Promise<UserResponse> {
    if (!req.session.userId) {
      return {
        errors: [{
          field: 'me',
          message: 'user not found'
        }]
      };
    }
    const currentUser = await User.findOne({
      where: {
        id: req.session.userId
      }
    });
    if (!currentUser) {
      return {
        errors: [{
          field: 'me',
          message: 'user not found'
        }]
      };
    }
    return {
      user: currentUser
    };
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UserRegisterInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }
    const hashedPassword = await argon2.hash(options.password);
    let user;
    try {

      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          userName: options.userName,
          email: options.email,
          password: hashedPassword,
          firstName: options.firstName,
          lastName: options.lastName,
        })
        .returning('*')
        .execute();

      user = result.raw[0];

      console.log('user', user);

      // const mappedToEntitiesResults = result.map((item: User) => em.map(User, item)); //mapped raw result from DB to ORM type 
      // user = mappedToEntitiesResults[0];
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
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({
      where: {
        [options.userNameOrEmail.includes("@") ? "email" : "userName"]: options.userNameOrEmail,
      }
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
  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redisClient }: MyContext
  ) {
    const user = await User.findOne({
      where: {
        email: email
      }
    })
    console.log('user***', user);
    
    if (!user) {
      return true;
    }
    const uuid = uuidv4();
    await redisClient.set(
      FORGOT_PASSWORD_PREFIX + uuid,
      user.id,
      'ex',
      1000 * 60 * 60 * 24 * 3);//3days
    await sendMail(email, `
      <h2>
        <a href='http://localhost:3000/change-password/${uuid}' target='_blank'>Click this link to reset password</a>
      </h2>
    `);

    return true;
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("password") password: string,
    @Arg("rePassword") rePassword: string,
    @Arg("token") token: string,
    @Ctx() { redisClient, req }: MyContext
  ): Promise<UserResponse> {
    const trimmedPassword = (password || "").trim();
    const trimmedRePassword = (rePassword || "").trim();
    if (trimmedPassword.length <= 2) {
      return {
        errors: [
          {
            field: "password",
            message: "provide password with atleast 3 characters",
          }
        ]
      }
    }
    if (trimmedPassword !== trimmedRePassword) {
      return {
        errors: [
          {
            field: "rePassword",
            message: "passwords does not match",
          }
        ]
      }
    }

    const userID = await redisClient.get(FORGOT_PASSWORD_PREFIX + token);

    if (!userID) {
      return {
        errors: [{
          field: 'token',
          message: 'invalid token'
        }]
      }
    }
    const userIdNum = parseInt(userID);
    const user = await User.findOne(userIdNum)

    console.log(user);


    if (!user) {
      return {
        errors: [{
          field: 'token',
          message: 'weird issue, user not found'
        }]
      }
    }

    User.update(
      { id: userIdNum },
      { password: await argon2.hash(trimmedPassword) }
    );

    //login user after change password 
    req.session.userId = user.id;

    return { user };
  }
}
