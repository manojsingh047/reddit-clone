import { Resolver, Query, Ctx, Arg, Int, Mutation, UseMiddleware } from "type-graphql";
import { MyContext } from "src/types";
import { Post } from "./../entities/Post";
import { isAuthMiddleware } from "../middleware/isAuthMiddleware";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(): Promise<Post[]> {
    return Post.find();
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
