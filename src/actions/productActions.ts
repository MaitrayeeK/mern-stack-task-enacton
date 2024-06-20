//@ts-nocheck
"use server";

import { sql } from "kysely";
import { DEFAULT_PAGE_SIZE } from "../../constant";
import { db } from "../../db";
import { InsertProducts, UpdateProducts } from "@/types";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/utils/authOptions";
import { cache } from "react";
import fs from 'fs';
import path from 'path';
import multer from 'multer';

// Configure Multer for file uploads
const upload = multer({ dest: 'images/' });

export async function getProducts(pageNo = 1, pageSize = DEFAULT_PAGE_SIZE, sortBy = "", filters = {}) {
  try {
  //   let products;
  //   let dbQuery = db.selectFrom("products").selectAll();

  //   // const { count } = await dbQuery
  //   //   .select(sql`COUNT(*) as count`)
  //   //   .groupBy("products.id")
  //   //   .executeTakeFirst();
    
  //   if (sortBy) {
  //     switch (sortBy) {
  //       case "price-asc":
  //         dbQuery = dbQuery.orderBy("price", "asc");
  //         break;
  //       case "price-desc":
  //         dbQuery = dbQuery.orderBy("price", "desc");
  //         break;
  //       case "created_at-asc":
  //         dbQuery = dbQuery.orderBy("created_at", "asc");
  //         break;
  //       case "created_at-desc":
  //         dbQuery = dbQuery.orderBy("created_at", "desc");
  //         break;
  //       case "rating-asc":
  //         dbQuery = dbQuery.orderBy("rating", "asc");
  //         break;
  //       case "rating-desc":
  //         dbQuery = dbQuery.orderBy("rating", "desc");
  //         break;
  //       default:
  //         // Handle default case or error
  //         break;
  //     }
  //   }

  //   const result = await db.selectFrom("products")
  //   .select(sql`COUNT(*) as count`)
  //   .executeTakeFirst();
    
  //   const count = result.count;
    
  //   const lastPage = Math.ceil(count / pageSize);
    
  //   products = await dbQuery
  //     .distinct()
  //     .offset((pageNo - 1) * pageSize)
  //     .limit(pageSize)
  //     .execute();

  //   const numOfResultsOnCurPage = products.length;

  //   return { products, count, lastPage, numOfResultsOnCurPage };
  // } catch (error) {
  //   throw error;
  // }

  let products;
    let dbQuery = db.selectFrom("products").selectAll();

    const filterClauses = [];

    // Apply filters
    if (filters.categories && filters.categories.length > 0) {
      const categoryIds = filters.categories.map((category) => category.value);
      filterClauses.push(sql`products.id IN (
        SELECT product_id FROM product_categories WHERE category_id IN (${categoryIds})
      )`);
    }

    if (filters.brands && filters.brands.length > 0) {
      const brandIds = filters.brands.map((brand) => brand.value);
      filterClauses.push(sql`products.brand_id IN (${brandIds})`);
    }

    if (filters.priceRangeTo) {
      filterClauses.push(sql`products.price <= ${filters.priceRangeTo}`);
    }

    if (filters.gender) {
      filterClauses.push(sql`products.gender = ${filters.gender}`);
    }

    if (filters.occasions && filters.occasions.length > 0) {
      const occasionNames = filters.occasions.map((occasion) => occasion.value);
      filterClauses.push(sql`products.occasion IN (${occasionNames})`);
    }

    if (filters.discount) {
      const [from, to] = filters.discount.split("-");
      filterClauses.push(sql`products.discount BETWEEN ${from} AND ${to}`);
    }

    // Apply sorting
    if (sortBy) {
      switch (sortBy) {
        case "price-asc":
          dbQuery = dbQuery.orderBy("price", "asc");
          break;
        case "price-desc":
          dbQuery = dbQuery.orderBy("price", "desc");
          break;
        case "created_at-asc":
          dbQuery = dbQuery.orderBy("created_at", "asc");
          break;
        case "created_at-desc":
          dbQuery = dbQuery.orderBy("created_at", "desc");
          break;
        case "rating-asc":
          dbQuery = dbQuery.orderBy("rating", "asc");
          break;
        case "rating-desc":
          dbQuery = dbQuery.orderBy("rating", "desc");
          break;
        default:
          // Handle default case or error
          break;
      }
    }

    // Count total matching products
    const countQuery = db.selectFrom("products").select(sql`COUNT(*) as count`);
    if (filterClauses.length > 0) {
      countQuery.where(...filterClauses);
    }
    const { count } = await countQuery.executeTakeFirst();
    const lastPage = Math.ceil(count / pageSize);

    // Apply filters and pagination
    dbQuery = dbQuery.distinct().offset((pageNo - 1) * pageSize).limit(pageSize);
    if (filterClauses.length > 0) {
      dbQuery.where(...filterClauses);
    }

    // Execute query to fetch products
    products = await dbQuery.execute();
    const numOfResultsOnCurPage = products.length;

    return { products, count, lastPage, numOfResultsOnCurPage };
  } catch (error) {
    throw error;
  }
}

export const getProduct = cache(async function getProduct(productId: number) {
  // console.log("run");
  try {
    const product = await db
      .selectFrom("products")
      .selectAll()
      .where("id", "=", productId)
      .execute();

    return product;
  } catch (error) {
    return { error: "Could not find the product" };
  }
});

async function enableForeignKeyChecks() {
  await sql`SET foreign_key_checks = 1`.execute(db);
}

async function disableForeignKeyChecks() {
  await sql`SET foreign_key_checks = 0`.execute(db);
}

export async function deleteProduct(productId: number) {
  try {
    await disableForeignKeyChecks();
    await db
      .deleteFrom("product_categories")
      .where("product_categories.product_id", "=", productId)
      .execute();
    await db
      .deleteFrom("reviews")
      .where("reviews.product_id", "=", productId)
      .execute();

    await db
      .deleteFrom("comments")
      .where("comments.product_id", "=", productId)
      .execute();

    await db.deleteFrom("products").where("id", "=", productId).execute();

    await enableForeignKeyChecks();
    revalidatePath("/products");
    return { message: "success" };
  } catch (error) {
    return { error: "Something went wrong, Cannot delete the product" };
  }
}

export async function MapBrandIdsToName(brandsId) {
  const brandsMap = new Map();
  try {
    for (let i = 0; i < brandsId.length; i++) {
      const brandId = brandsId.at(i);
      const brand = await db
        .selectFrom("brands")
        .select("name")
        .where("id", "=", +brandId)
        .executeTakeFirst();
      brandsMap.set(brandId, brand?.name);
    }
    return brandsMap;
  } catch (error) {
    throw error;
  }
}

export async function getAllProductCategories(products: any) {
  try {
    const productsId = products.map((product) => product.id);
    const categoriesMap = new Map();

    for (let i = 0; i < productsId.length; i++) {
      const productId = productsId.at(i);
      const categories = await db
        .selectFrom("product_categories")
        .innerJoin(
          "categories",
          "categories.id",
          "product_categories.category_id"
        )
        .select("categories.name")
        .where("product_categories.product_id", "=", productId)
        .execute();
      categoriesMap.set(productId, categories);
    }
    return categoriesMap;
  } catch (error) {
    throw error;
  }
}

export async function getProductCategories(productId: number) {
  try {
    const categories = await db
      .selectFrom("product_categories")
      .innerJoin(
        "categories",
        "categories.id",
        "product_categories.category_id"
      )
      .select(["categories.id", "categories.name"])
      .where("product_categories.product_id", "=", productId)
      .execute();

    return categories;
  } catch (error) {
    throw error;
  }
}

export async function updateProduct(product: UpdateProducts) {
  try {
    console.log(product.image_url);
    await disableForeignKeyChecks();
    await db
      .updateTable("products")
      .set({
        name: product.name,
        description: product.description,
        old_price: product.old_price,
        discount: product.discount,
        rating: product.rating,
        colors: product.colors,
        brands: JSON.stringify(product.brands),
        gender: product.gender,
        occasion: product.occasion,
        image_url: product.image_url,
      })
      .where("id", "=", product.id)
      .execute();
    await enableForeignKeyChecks();
    revalidatePath(`/products/${product.id}`);
    return { message: "success" };
  } catch (error) {
    return { error: "Could not update the product" };
  }
}

export async function updateProductCategories(productId: number, categoryIds: number[]) {
  try {
    await disableForeignKeyChecks();
    await db
      .deleteFrom("product_categories")
      .where("product_id", "=", productId)
      .execute();
    await Promise.all(
      categoryIds.map(async (categoryId) => {
        await db
          .insertInto("product_categories")
          .values({ product_id: productId, category_id: categoryId })
          .execute();
      })
    );
    await enableForeignKeyChecks();
    revalidatePath(`/products/${productId}`);
    return { message: "success" };
  } catch (error) {
    return { error: "Could not update product categories" };
  }
}

export async function insertProduct(product: InsertProducts) {
  try {

    const price = product.old_price - (product.old_price * (product.discount / 100));
    const brandIds = product.brands.map(brand => brand.value);
    const occasions = product.occasion.map(occ => occ.value).join(',');

    await db
      .insertInto("products")
      .values({
        name: product.name,
        description: product.description,
        price: parseFloat(price.toFixed(2)),
        old_price: product.old_price,
        discount: product.discount,
        rating: product.rating,
        colors: product.colors,
        brands: JSON.stringify(brandIds),
        gender: product.gender,
        occasion: occasions,
        image_url: product.image_url,
      })
      .execute();
    
    revalidatePath("/products");
    return { message: "success" };
  } catch (error) {
    console.error("Error inserting product:", error);
    return { error: "Could not insert the product" };
  }
}