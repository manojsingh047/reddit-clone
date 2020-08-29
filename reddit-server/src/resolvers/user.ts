import { Resolver, Ctx, Arg, Mutation, InputType, Field } from "type-graphql";
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

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg("options") options: UserRegisterInput,
    @Ctx() { em }: MyContext
  ): Promise<User> {
    const hashedPassword = await argon2.hash(options.loginInput.password);

    const user = em.create(User, {
      userName: options.loginInput.userName,
      password: hashedPassword,
      firstName: options.firstName,
      lastName: options.lastName,
    });
    await em.persistAndFlush(user);
    return user;
  }

  @Mutation(() => User)
  async login(@Arg("options") options: LoginInput, @Ctx() { em }: MyContext) {
    const user = await em.findOne(User, {
      userName: options.userName,
    });
    if(!user){
      return null;
    }
    //todo login error flow
    
    const isValidPass = await argon2.verify(user.password, options.password);

    console.log(isValidPass);

    return user;
  }
}
