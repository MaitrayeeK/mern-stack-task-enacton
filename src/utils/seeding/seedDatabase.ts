"use server";

import { deleteAllRows } from "./deleteAllRows";
import seedBrands from "./seedBrands";
import seedCategories from "./seedCategories";
import seedComments from "./seedComments";
import seedProductCategories from "./seedProductCategories";
import seedProducts from "./seedProducts";
import seedReviews from "./seedReview";
import seedUsers from "./seedUsers";

const NO_OF_USERS = 50;
const NO_OF_PRODUCTS = 100;
const NO_OF_BRANDS = 50;

export default async function seedDatabase() {
  await deleteAllRows();
  await seedUsers(NO_OF_USERS);
  await seedProducts(NO_OF_PRODUCTS);
  await seedCategories();
  await seedProductCategories(NO_OF_PRODUCTS);
  await seedBrands(NO_OF_BRANDS);
  await seedReviews(NO_OF_PRODUCTS, NO_OF_USERS);
  await seedComments(NO_OF_PRODUCTS, NO_OF_USERS);
  console.log("database seeded");
}

// TRUNCATE TABLE your_table_name; //This statement removes all data from the table and resets the AUTO_INCREMENT value to its starting point (usually 1).
