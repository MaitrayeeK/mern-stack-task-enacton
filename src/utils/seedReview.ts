import { faker } from "@faker-js/faker";
import { db } from "../../db";

function generateReview(existingCombinations: Set<any>, productId: number) {
  let userId, combination;

  // Generates a unique combination for the given productId
  do {
    userId = faker.number.int({ min: 1, max: 50 });
    combination = `${userId}-${productId}`;
  } while (existingCombinations.has(combination));

  existingCombinations.add(combination);

  return {
    user_id: userId, // Random user ID between 1 and 50
    product_id: productId, // The provided product ID
    message: faker.lorem.sentences(),
    rating: faker.number.int({ min: 1, max: 5 }), // Random rating between 1 and 5
    created_at: faker.date.past({ years: 2 }), // Review created within the past 2 years
  };
}

export default async function seedReviews() {
  const uniqueCombination = new Set();

  // Generate reviews for each product (product IDs from 1 to 100)
  for (let productId = 1; productId <= 100; productId++) {
    const numberOfReviews = faker.number.int({ min: 5, max: 10 }); // Generate 5 to 10 reviews per product
    const productReviews = Array.from({ length: numberOfReviews }, () =>
      generateReview(uniqueCombination, productId)
    );
    await db.insertInto("reviews").values(productReviews).execute();
  }
}
