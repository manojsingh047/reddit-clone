import { ObjectType, Field, Int } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Updoot } from "./Updoot";
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

  @Field(() => Int, { nullable: true })
  voteStatus: number | null; //1,-1,null

  @Field()
  @ManyToOne(() => User, user => user.posts)
  creator: User;

  @OneToMany(() => Updoot, updoot => updoot.post)
  updoots: Updoot[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String) //commented because i dont want graphql to expose this field
  @UpdateDateColumn()
  updatedAt: Date;
}
