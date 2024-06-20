import { faker } from "@faker-js/faker";
import { db } from "../../../db";

function generateProduct() {
  const oldPrice = parseFloat(faker.commerce.price({ min: 100, max: 2000 }));
  const discountPercentage = faker.number.int({ min: 0, max: 15 });
  const discountAmount = (discountPercentage / 100) * oldPrice;
  const price = oldPrice - discountAmount;

  const occasions = [
    "casual",
    "business",
    "formal",
    "sport",
    "party",
    "travel",
  ];

  // Array of random brand IDs (assuming you have 10 brands, for example)
  const numberOfBrands = faker.number.int({ min: 1, max: 5 }); // Number of brands per product
  const brands = Array.from({ length: numberOfBrands }, () =>
    faker.number.int({ min: 1, max: 50 })
  );

  // Generate an array of random color hex codes
  const numberOfColors = faker.number.int({ min: 1, max: 5 }); // Number of colors per product
  const colors = Array.from({ length: numberOfColors }, () =>
    faker.internet.color()
  );

  const numberOfOccasions = faker.number.int({ min: 1, max: 3 });
  const selectedOccasions = faker.helpers
    .shuffle(occasions)
    .slice(0, numberOfOccasions);

  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    brands: JSON.stringify(brands),
    colors: colors.toString(),
    discount: discountPercentage.toFixed(2).toString(),
    // prettier-ignore
    gender: faker.helpers.arrayElement(["boy", "girl", "men", "women"]) as ("boy" | "girl" | "men" | "women"),
    occasion: selectedOccasions.join(","),
    image_url: faker.image.urlLoremFlickr({
      width: 300,
      height: 200,
      category: "nature",
    }),
    old_price: oldPrice.toFixed(2).toString(),
    price: price.toFixed(2).toString(),
    rating: String(faker.number.int({ min: 1, max: 5 })),
  };
}

export default async function seedProducts(noOfProducts: number) {
  const products = Array.from({ length: noOfProducts }, generateProduct);
  await db.insertInto("products").values(products).execute();
}
