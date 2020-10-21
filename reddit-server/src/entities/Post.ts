import { ObjectType, Field } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

@ObjectType() //to decorate as a graphql entity
@Entity() //to decorate as ORM entity
export class Post extends BaseEntity {
  @Field() //to decorate as gql field
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column() //to decorate as db field
  title!: string;

  @Field()
  @Column({ type: "int", default: 0 }) //to decorate as db field
  points!: number;

  @Field()
  @Column() //to decorate as db field
  text!: string;

  @Field()
  @Column()
  creatorId: number;

  @Field()
  @ManyToOne(() => User, user => user.posts)
  creator: User;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String) //commented because i dont want graphql to expose this field
  @UpdateDateColumn()
  updatedAt: Date;
}
