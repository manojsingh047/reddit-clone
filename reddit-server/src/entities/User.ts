import { ObjectType, Field } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./Post";
import { Updoot } from "./Updoot";

@ObjectType() //to decorate as a graphql entity
@Entity() //to decorate as ORM entity
export class User extends BaseEntity {
  @Field() //to decorate as gql field
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => Post, post => post.creator)
  posts: Post[];

  @OneToMany(() => Updoot, updoot => updoot.user)
  updoots: Updoot[];

  @Field(() => String)
  @Column({ unique: true }) //to decorate as db field
  userName!: string;

  @Field(() => String)
  @Column({ unique: true })
  email!: string;

  // @Field(() => String) //commneted because i dont want graphql to expose this field
  @Column()
  password!: string;

  @Field(() => String)
  @Column()
  firstName!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  lastName?: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
