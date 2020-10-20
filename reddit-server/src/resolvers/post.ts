import { Resolver, Query, Ctx, Arg, Int, Mutation, UseMiddleware, FieldResolver, Root, ObjectType, Field } from "type-graphql";
import { MyContext } from "src/types";
import { Post } from "./../entities/Post";
import { isAuthMiddleware } from "../middleware/isAuthMiddleware";
import { getConnection } from "typeorm";

@ObjectType()
class PaginatedPosts {

  @Field(() => [Post])
  posts: Post[];

  @Field()
  hasMore: Boolean
}

@Resolver(Post)
export class PostResolver {

  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return `${root.text.slice(0, 20)}...`;
  }


  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const extendedLimit = realLimit + 1;

    const qb = getConnection()
      .getRepository(Post)
      .createQueryBuilder("p")
      .orderBy('"createdAt"', "DESC")
      .take(extendedLimit)

    if (cursor) {
      qb.where('"createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) });
    }

    const posts = await qb.getMany();
    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === extendedLimit
    };

  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => Int) id: number
  ): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @UseMiddleware(isAuthMiddleware)
  @Mutation(() => Post)
  async createPost(
    @Arg("title", () => String) title: string,
    @Arg("text", () => String) text: string,
    @Ctx() { req }: MyContext,
  ): Promise<Post> {
    const userId = parseInt(req.session.userId);
    const post = Post.create({ title, text, creatorId: userId }).save();
    return post;
  }

  @UseMiddleware(isAuthMiddleware)
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id", () => Number) id: number,
    @Arg("title", () => String) title: string,
    @Arg("text", () => String) text: string,
  ): Promise<Post | null> {
    const post = await Post.findOne({ where: { id: id } });
    if (!post) {
      return null;
    }
    if (!!title) {
      Post.update({ id }, { title, text })
    }
    return post;
  }

  @UseMiddleware(isAuthMiddleware)
  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id", () => Number) id: number,
  ): Promise<Boolean> {
    try {
      await Post.delete(id);
    } catch (err) {
      return false;
    }
    return true;
  }
}
