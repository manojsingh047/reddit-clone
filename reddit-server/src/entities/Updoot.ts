import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity() //to decorate as ORM entity
export class Updoot extends BaseEntity {
    @Column({ type: "int" })
    value: number;


    @PrimaryColumn()
    userId: number;

    @Field(() => User)
    @ManyToOne(() => User, user => user.updoots)
    user: User;


    @PrimaryColumn()
    postId: number;


    @ManyToOne(() => Post, post => post.updoots)
    post: Post;

}
