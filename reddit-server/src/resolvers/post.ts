import { Resolver, Query, Ctx, Arg, Int, Mutation, UseMiddleware, FieldResolver, Root, ObjectType, Field } from "type-graphql";
import { MyContext } from "src/types";
import { Post } from "./../entities/Post";
import { isAuthMiddleware } from "../middleware/isAuthMiddleware";
import { getConnection } from "typeorm";
import { Updoot } from "../entities/Updoot";

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

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthMiddleware)
  async vote(
    @Arg('postId', () => Int) postId: number,
    @Arg('value', () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const { userId } = req.session;
    const isUpdoot = value !== -1;
    const realValue = isUpdoot ? 1 : -1;
    const updoot = await Updoot.findOne({ where: { postId, userId } });

    if (updoot && updoot.value !== realValue) {
      await getConnection().transaction(async (tm) => {
        await tm.query(`
          update updoot set value = $1
          where "postId" = $2 and "userId" = $3
        `, [realValue, postId, userId]);
        await tm.query(`
          update post set points = points + $1
          where id = $2
        `, [2 * realValue, postId]);
      });

    } else if (!updoot) {
      await getConnection().transaction(async (tm) => {
        await tm.query(`
          insert into updoot ("userId", "postId", value)
          values ($1, $2, $3)
        `, [userId, postId, realValue]);
        await tm.query(`
          update post set points = points + $1
          where id = $2
        `, [realValue, postId]);
      });
    }
    return true;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Ctx() { req }: MyContext
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const extendedLimit = realLimit + 1;

    // const qb = getConnection()
    //   .getRepository(Post)
    //   .createQueryBuilder("p")
    //   .orderBy('"createdAt"', "DESC")
    //   .take(extendedLimit)

    // if (cursor) {
    //   qb.where('"createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) });
    // }


    // const posts = await getConnection()
    //   .query(`
    // SELECT p.*,
    // json_build_object(
    //   'id', u.id,
    //   'userName', u."userName",
    //   'email', u.email,
    //   'createdAt', u."createdAt",
    //   'updatedAt', u."updatedAt"
    // ) creator
    // from post p    
    // inner join public.user u on u.id = p."creatorId"
    // ${cursor ? `WHERE p."createdAt" < $2` : ''} 
    // ORDER BY p."createdAt" DESC 
    // LIMIT $1
    // `, replacements);

    const replacements: any[] = [extendedLimit];
    if (req.session.userId) {
      replacements.push(req.session.userId);
    }
    let cursorIdx = 3;
    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
      cursorIdx = replacements.length;
    }

    const posts = await getConnection()
      .query(`
    SELECT p.*,
    json_build_object(
      'id', u.id,
      'userName', u."userName",
      'email', u.email,
      'createdAt', u."createdAt",
      'updatedAt', u."updatedAt"
    ) creator,

    ${!!req.session.userId ? '(select value from updoot where "userId" = $2 and "postId" = p.id) as "voteStatus"' : 'null as "voteStatus"'}

    from post p    
    inner join public.user u on u.id = p."creatorId"
    ${cursor ? `WHERE p."createdAt" < $${cursorIdx}` : ''} 
    ORDER BY p."createdAt" DESC 
    LIMIT $1
    `, replacements);

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
