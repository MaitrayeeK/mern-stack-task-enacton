import { faker } from "@faker-js/faker";

import { Users, Products, Decimal, Comments } from "../../types";
import bcrypt from "bcrypt";

import { db } from "../../../db";

function generateUser() {
  const email = faker.internet.email();
  const passwordHash = bcrypt.hashSync(email, 10);
  return {
    name: faker.person.fullName(),
    email: email,
    password: passwordHash,
    address: faker.location.streetAddress({ useFullAddress: true }),
    city: faker.location.city(),
  };
}

export default async function seedUsers(noOfUsers: number) {
  const brands = Array.from({ length: noOfUsers }, generateUser);
  await db.insertInto("users").values(brands).execute();
}
