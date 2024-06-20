//@ts-nocheck
"use server";
import { InsertComments, UpdateComments } from "@/types";
import { db } from "../../db";
import { authOptions } from "@/utils/authOptions";
import { revalidatePath } from "next/cache";

export async function getCommentsForProduct(productId: number) {
  try {
    const result = await db
      .selectFrom("comments")
      .innerJoin("users", "users.id", "comments.user_id")
      .select([
        "comments.id",
        "comments.parent_comment_id",
        "users.id as user_id",
        "users.name",
        "users.email",
        "comments.comment",
        "comments.created_at",
        "comments.updated_at",
      ])
      .where("product_id", "=", productId)
      .orderBy("created_at desc")
      .execute();
    return result;
  } catch (err) {
    throw err;
  }
}

export async function postComment(data: InsertComments, productId: number) {
  try {
    const result = await db.insertInto("comments").values(data).execute();

    revalidatePath(`/products/${productId}`);
    return { message: "success" };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function editComment(
  comment_id: number,
  data: UpdateComments,
  productId: number
) {
  try {
    const result = await db
      .updateTable("comments")
      .set(data)
      .where("comments.id", "=", comment_id)
      .executeTakeFirst();

    revalidatePath(`/products/${productId}`);

    return { message: "success" };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deleteCommentAndReplies(
  commentId: number,
  productId: number
) {
  try {
    // This function deletes a comment and all its nested replies
    async function deleteReplies(parentId: number) {
      const replies = await db
        .selectFrom("comments")
        .select("id")
        .where("parent_comment_id", "=", parentId)
        .execute();

      // Delete each reply and its nested replies
      for (const reply of replies) {
        await deleteReplies(reply.id); // Recursive call to delete any nested replies
        await db.deleteFrom("comments").where("id", "=", reply.id).execute();
      }
    }

    // First delete all nested replies
    await deleteReplies(commentId);

    // Then delete the comment itself
    await db.deleteFrom("comments").where("id", "=", commentId).execute();

    revalidatePath(`/products/${productId}`);
    return { message: "success" };
  } catch (err: any) {
    return { error: err.message };
  }
}
