"use server";

import { sendEmail } from "@/utils/mailer";
import { db } from "../../db";
import bcrypt from "bcrypt";

export async function register(data) {
  try {
    const { name, email, pass, address, city } = data;
    const saltRounds = 10;

    if (!name || !email || !pass) {
      return {
        error: "Missing name, email or password",
      };
    }

    const exist = await db
      .selectFrom("users")
      .select("users.email")
      .where("email", "=", email)
      .executeTakeFirst();

    if (exist) {
      return { error: "User already exists" };
    }

    const hashedPass = await bcrypt.hash(pass, saltRounds);

    const user = await db
      .insertInto("users")
      .values({
        name,
        email,
        password: hashedPass,
        address,
        city,
      })
      .executeTakeFirst();

    await sendEmail(email, Number(user.insertId));

    return {
      message: "User registered",
      success: true,
    };
  } catch (err: any) {
    return {
      error: err?.message || "Something went wrong",
    };
  }
}
