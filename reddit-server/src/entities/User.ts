import { ObjectType, Field } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType() //to decorate as a graphql entity
@Entity() //to decorate as ORM entity
export class User extends BaseEntity {
  @Field() //to decorate as gql field
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

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
}
