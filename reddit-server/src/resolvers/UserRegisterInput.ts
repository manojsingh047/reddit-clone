import {
    InputType,
    Field
} from "type-graphql";


@InputType()
export class UserRegisterInput {
    @Field()
    userName: string;
    @Field()
    email: string;

    @Field()
    password: string;
    @Field()
    firstName: string;

    @Field({ nullable: true })
    lastName?: string;
}
