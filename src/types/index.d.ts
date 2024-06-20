import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";

export type Decimal = ColumnType<string, number | string, number | string>;

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface Brands {
  id: Generated<number>;
  name: string;
  website: string | null;
  updated_at: Generated<Date>;
  created_at: Generated<Date>;
}

export type SelectBrands = Selectable<Brands>;
export type InsertBrands = Insertable<Brands>;
export type UpdateBrands = Updateable<Brands>;

export interface Categories {
  id: Generated<number>;
  name: string;
  parent_id: number | null;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export type SelectCategories = Selectable<Categories>;
export type InsertCategories = Insertable<Categories>;
export type UpdateCategories = Updateable<Categories>;

export interface Comments {
  id: Generated<number>;
  user_id: number | null;
  product_id: number;
  comment: string | null;
  parent_comment_id: number | null;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export type SelectComments = Selectable<Comments>;
export type InsertComments = Insertable<Comments>;
export type UpdateComments = Updateable<Comments>;

export interface ProductCategories {
  category_id: number;
  created_at: Generated<Date>;
  id: Generated<number>;
  product_id: number;
  updated_at: Generated<Date>;
}

export type SelectProductCategories = Selectable<ProductCategories>;
export type InsertProductCategories = Insertable<ProductCategories>;
export type UpdateProductCategories = Updateable<ProductCategories>;

export interface Products {
  brands: string;
  colors: string;
  created_at: Generated<Date>;
  description: string;
  discount: Generated<Decimal>;
  gender: "boy" | "girl" | "men" | "women";
  id: Generated<number>;
  image_url: Generated<string | null>;
  name: string;
  occasion: string;
  old_price: Decimal;
  price: Decimal;
  rating: Decimal;
  updated_at: Generated<Date>;
}

export type SelectProducts = Selectable<Products>;
export type InsertProducts = Insertable<Products>;
export type UpdateProducts = Updateable<Products>;

export interface Reviews {
  created_at: Generated<Date>;
  id: Generated<number>;
  message: string;
  product_id: number;
  rating: Decimal;
  updated_at: Generated<Date>;
  user_id: number;
}

export type SelectReviews = Selectable<Reviews>;
export type InsertReviews = Insertable<Reviews>;
export type UpdateReviews = Updateable<Reviews>;

export interface Users {
  id: Generated<number>;
  email: string;
  name: string;
  password: string;
  address: string | null;
  city: string | null;
  is_verified: boolean | null;
  verify_token: string | null;
  verify_token_expiry: Date | null;
}

export type SelectUsers = Selectable<Users>;
export type InsertUsers = Insertable<Users>;
export type UpdateUsers = Updateable<Users>;

export interface Database {
  brands: Brands;
  categories: Categories;
  comments: Comments;
  product_categories: ProductCategories;
  products: Products;
  reviews: Reviews;
  users: Users;
}
