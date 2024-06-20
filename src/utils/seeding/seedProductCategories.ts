import { faker } from "@faker-js/faker";
import { db } from "../../../db";

export default async function seedProductCategories(noOfProducts: number) {
  let productCategories: any = [];

  for (let productId = 1; productId <= noOfProducts; productId++) {
    // Each product is associated with 1 to 3 categories
    const numberOfCategories = faker.number.int({ min: 1, max: 3 });

    for (let i = 0; i < numberOfCategories; i++) {
      const categoryId = faker.number.int({ min: 1, max: 60 });

      productCategories.push({
        product_id: productId,
        category_id: categoryId,
      });
    }
  }

  // Removing duplicates
  // The key part is comparing index with the index returned by findIndex. If they are the same, it means the current element (value) is the first occurrence of this combination of product_id and category_id in the array.
  // If they are not the same, it means the current element is a duplicate (i.e., there was an earlier occurrence of this combination), and hence, it should be filtered out.
  productCategories = productCategories.filter(
    (value, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.product_id === value.product_id &&
          t.category_id === value.category_id
      )
  );

  await db.insertInto("product_categories").values(productCategories).execute();
}
