"use server";

import seedBrands from "./seedBrands";
import seedCategories from "./seedCategories";
import seedComments from "./seedComments";
import seedProductCategories from "./seedProductCategories";
import seedProducts from "./seedProducts";
import seedReviews from "./seedReview";
import seedUsers from "./seedUsers";

export default async function seedDatabase() {
  // await seedUsers();
  // await seedProducts();
  // await seedCategories();
  // await seedProductCategories();
  // await seedBrands();
  // await seedReviews();
  // await seedComments();
  console.log("database seeded");
}

// TRUNCATE TABLE your_table_name; //This statement removes all data from the table and resets the AUTO_INCREMENT value to its starting point (usually 1).
