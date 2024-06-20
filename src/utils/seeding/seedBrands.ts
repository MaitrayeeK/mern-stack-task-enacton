import { faker } from "@faker-js/faker";
import { db } from "../../../db";

function generateBrand() {
  return {
    name: faker.company.name(),
    website: faker.datatype.boolean() ? faker.internet.url() : null, // Randomly decide if a website is present
  };
}

export default async function seedBrands(noOfBrands) {
  const brands = Array.from({ length: noOfBrands }, generateBrand); // Generate 50 brands
  await db.insertInto("brands").values(brands).execute();
}
