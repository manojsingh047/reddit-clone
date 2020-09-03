import {
  Resolver,
  Ctx,
  Arg,
  Mutation,
  InputType,
  Field,
  ObjectType,
} from "type-graphql";
import { MyContext } from "src/types";
import argon2 from "argon2";
import { User } from "./../entities/User";

@InputType()
class LoginInput {
  @Field()
  userName: string;

  @Field()
  password: string;
}

@InputType()
class UserRegisterInput {
  @Field()
  loginInput: LoginInput;

  @Field()
  firstName: string;

  @Field({ nullable: true })
  lastName?: string;
}
@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
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
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UserRegisterInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    if (options.loginInput.userName.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "provide username with atleast 3 characters",
          },
        ],
      };
    }
    if (options.loginInput.password.length <= 2) {
      return {
        errors: [
          {
            field: "password",
            message: "provide password with atleast 3 characters",
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(options.loginInput.password);

    const user = em.create(User, {
      userName: options.loginInput.userName,
      password: hashedPassword,
      firstName: options.firstName,
      lastName: options.lastName,
    });
    try {
      await em.persistAndFlush(user);
    } catch (error) {
      if (
        error.name === "UniqueConstraintViolationException" ||
        error.code === "23505"
      ) {
        return {
          errors: [
            {
              field: "username",
              message: "username already taken",
            },
          ],
        };
      }
      console.log(error);
      return {
        errors: [
          {
            field: "username",
            message: error.detail || "something went wrong",
          },
        ],
      };
    }
    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: LoginInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, {
      userName: options.userName,
    });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "invalid username",
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

    return {
      user,
    };
  }
}
