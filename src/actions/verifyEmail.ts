import { revalidatePath } from "next/cache";
import { db } from "../../db";

export async function verifyEmail(token: string) {
  try {
    const users = await db
      .selectFrom("users")
      .selectAll()
      .where("verify_token", "=", token)
      .where("verify_token_expiry", ">", new Date(Date.now()))
      .executeTakeFirst();

    if (!users) {
      return { error: "Invalid token or expired or already used" };
    }

    users.is_verified = true;
    users.verify_token = null;
    users.verify_token_expiry = null;

    await db
      .updateTable("users")
      .set(users)
      .where("id", "=", users.id)
      .execute();

    revalidatePath("/products/[id]", "page");

    return {
      message: "Email verified successfully",
      success: true,
    };
  } catch (error: any) {
    return { error: error.message };
  }
}
