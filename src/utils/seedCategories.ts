import { faker } from "@faker-js/faker";
import { db } from "../../db";
import short from "short-uuid";

export default async function seedCategories() {
  const uniqueMainCategoryNames = new Set();
  const uniqueSubcategoryNames = new Set();
  const maxAttempts = 10; // Maximum attempts to find a unique name

  // Step 1: Generate and insert unique main categories
  let mainCategories: any = [];
  while (uniqueMainCategoryNames.size < 10) {
    let attempts = 0;
    let categoryName;
    do {
      categoryName = faker.commerce.department();
      attempts++;
    } while (
      uniqueMainCategoryNames.has(categoryName) &&
      attempts < maxAttempts
    );

    uniqueMainCategoryNames.add(categoryName);
    mainCategories.push({ name: categoryName, parent_id: null });
  }
  await db.insertInto("categories").values(mainCategories).execute();

  // Step 2: Retrieve main categories IDs
  const mainCategoriesIds = await db
    .selectFrom("categories")
    .select("id")
    .where("parent_id", "is", null)
    .execute();

  // Step 3: Generate unique subcategories for each main category
  let subcategories: { name: string; parent_id: number }[] = [];
  mainCategoriesIds.forEach((mainCategory) => {
    for (let i = 0; i < 5; i++) {
      let attempts = 0;
      let subcategoryName;
      do {
        subcategoryName = faker.commerce.product();
        attempts++;
      } while (
        uniqueSubcategoryNames.has(subcategoryName) &&
        attempts < maxAttempts
      );

      if (attempts >= maxAttempts) {
        subcategoryName += `_${short.generate()}`; // Append a suffix for uniqueness
      }
      uniqueSubcategoryNames.add(subcategoryName);
      subcategories.push({ name: subcategoryName, parent_id: mainCategory.id });
    }
  });

  // Step 4: Insert subcategories
  await db.insertInto("categories").values(subcategories).execute();
}

// export default async function seedCategories() {
//   // Step 1: Generate and insert main categories
//   const mainCategories = Array.from({ length: 10 }, () => ({
//     name: faker.commerce.department(),
//     parent_id: null,
//   }));

//   await db.insertInto("categories").values(mainCategories).execute();

//   // Step 2: Retrieve main categories IDs
//   const mainCategoriesIds = await db
//     .selectFrom("categories")
//     .select("id")
//     .where("parent_id", "is", null)
//     .execute();

//   // Step 3: Generate subcategories for each main category
//   let subcategories: { name: string; parent_id: number }[] = [];
//   mainCategoriesIds.forEach((mainCategory) => {
//     const subcategoriesForThisMain = Array.from({ length: 5 }, () => ({
//       name: faker.commerce.product(),
//       parent_id: mainCategory.id,
//     }));

//     subcategories = [...subcategories, ...subcategoriesForThisMain];
//   });

//   // Step 4: Insert subcategories
//   await db.insertInto("categories").values(subcategories).execute();
// }

/* 
export default async function seedCategories() {
  const uniqueMainCategoryNames = new Set();
  const uniqueSubcategoryNames = new Set();

  // Step 1: Generate and insert unique main categories
  const mainCategories = Array.from({ length: 10 }, () => {
    let name;
    do {
      name = faker.commerce.department();
    } while (uniqueMainCategoryNames.has(name));
    uniqueMainCategoryNames.add(name);

    return { name, parent_id: null };
  });

  await db.insertInto("categories").values(mainCategories).execute();

  // Step 2: Retrieve main categories IDs
  const mainCategoriesIds = await db
    .selectFrom("categories")
    .select("id")
    .where("parent_id", "is", null)
    .execute();

  // Step 3: Generate unique subcategories for each main category
  let subcategories = [];
  mainCategoriesIds.forEach(mainCategory => {
    const subcategoriesForThisMain = Array.from({ length: 5 }, () => {
      let name;
      do {
        name = faker.commerce.product();
      } while (uniqueSubcategoryNames.has(name));
      uniqueSubcategoryNames.add(name);

      return { name, parent_id: mainCategory.id };
    });

    subcategories = [...subcategories, ...subcategoriesForThisMain];
  });

  // Step 4: Insert subcategories
  await db.insertInto("categories").values(subcategories).execute();
}
*/
