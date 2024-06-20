//@ts-nocheck
"use server";

import { InsertReviews, UpdateReviews } from "@/types";
import { db } from "../../db";
import { authOptions } from "@/utils/authOptions";
import { revalidatePath } from "next/cache";

export async function getReviewsForProduct(
  productId: number,
  loadMoreReviews = "false"
) {
  try {
    let dbQuery = db
      .selectFrom("reviews")
      .innerJoin("users", "users.id", "reviews.user_id")
      .select([
        "users.id as user_id",
        "reviews.id as review_id",
        "users.name",
        "users.email",
        "reviews.message",
        "reviews.rating",
        "reviews.message",
        "reviews.created_at",
      ])
      .where("product_id", "=", productId)
      .orderBy("created_at desc");

    if (loadMoreReviews === "false") {
      dbQuery = dbQuery.limit(5);
    }

    const result = await dbQuery.execute();

    return result;
  } catch (err) {
    throw err;
  }
}

export async function postReview(data: InsertReviews, productId: number) {
  try {
    if (!data.user_id || !data.message || !data.product_id || !data.rating) {
      return { error: "All fields are required" };
    }

    const result = await db.insertInto("reviews").values(data).execute();

    revalidatePath(`/products/${productId}`);

    return { message: "success" };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function editReview(
  reviewId: number,
  data: UpdateReviews,
  productId: number
) {
  try {
    if (!data.message || !data.rating) {
      return { error: "All fields are required" };
    }

    const result = await db
      .updateTable("reviews")
      .set(data)
      .where("reviews.id", "=", reviewId)
      .executeTakeFirst();

    revalidatePath(`/products/${productId}`);

    return { message: "success" };
  } catch (err: any) {
    return { error: err.message };
  }
}
export async function deleteReview(reviewId: number, productId: number) {
  try {
    const result = await db
      .deleteFrom("reviews")
      .where("reviews.id", "=", reviewId)
      .executeTakeFirst();

    revalidatePath(`/products/${productId}`);

    return { message: "success" };
  } catch (err: any) {
    return { error: err.message };
  }
}
