import { Resolver, Query, Ctx, Arg, Int, Mutation, UseMiddleware, FieldResolver, Root } from "type-graphql";
import { MyContext } from "src/types";
import { Post } from "./../entities/Post";
import { isAuthMiddleware } from "../middleware/isAuthMiddleware";
import { getConnection } from "typeorm";

@Resolver(Post)
export class PostResolver {

  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return `${root.text.slice(0, 20)}...`;
  }

  @Query(() => [Post])
  posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
  ): Promise<Post[]> {
    const realLimit = Math.min(50, limit);
    const qb = getConnection()
      .getRepository(Post)
      .createQueryBuilder("p")
      .orderBy('"createdAt"', "DESC")
      .take(realLimit)

    if (cursor) {
      qb.where('"createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) });
    }

    return qb.getMany();
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
