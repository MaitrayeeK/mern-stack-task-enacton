import nodemailer from "nodemailer";
import { db } from "../../db";

export async function sendEmail(email: string, userId: number) {
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "2e28089cd1054c",
      pass: "2f5bcb93e4592b",
    },
  });

  const token = `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(
    /-/g,
    ""
  );

  await db
    .updateTable("users")
    .set({
      verify_token: token,
      verify_token_expiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // expiry after 24 hours,
    })
    .where("id", "=", userId)
    .execute();

  var mailOptions = {
    from: "hussain.gagan2@gmail.com",
    to: email,
    subject: "Verify your email",
    html: `Hello, verify your mail by clicking on <a href="http://localhost:3000/verifyemail?token=${token}">this link</a>`,
  };

  const mailResponse = await transport.sendMail(mailOptions);
  return mailResponse;
}
