import { ObjectType, Field } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType() //to decorate as a graphql entity
@Entity() //to decorate as ORM entity
export class Post extends BaseEntity {
  @Field() //to decorate as gql field
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  // @Field(() => String) //commneted because i dont want graphql to expose this field
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column() //to decorate as db field
  title!: string;
}
