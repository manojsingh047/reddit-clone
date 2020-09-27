import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";

@ObjectType() //to decorate as a graphql entity
@Entity() //to decorate as mikroORM entity
export class User {
  @Field() //to decorate as gql field
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "date" }) //to decorate as db field
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field(() => String)
  @Property({ type: "text", unique: true })
  userName!: string;

  @Field(() => String)
  @Property({ type: "text", unique: true })
  email!: string;

  // @Field(() => String) //commneted because i dont want graphql to expose this field
  @Property({ type: "text" })
  password!: string;

  @Field(() => String)
  @Property({ type: "text" })
  firstName!: string;

  @Field(() => String, { nullable: true })
  @Property({ type: "text", nullable: true })
  lastName?: string;
}
