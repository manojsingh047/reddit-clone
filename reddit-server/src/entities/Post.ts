import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";

@ObjectType() //to decorate as a graphql entity
@Entity() //to decorate as mikroORM entity
export class Post {
  @Field() //to decorate as gql field
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "date" }) //to decorate as db field
  createdAt = new Date();

  // @Field(() => String) //commneted because i dont want graphql to expose this field
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()
  @Property({ type: "text" })
  title!: string;
}
