"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import seedDatabase from "@/utils/seeding/seedDatabase";

export default function NavMenu() {
  return (
    <div className="flex gap-8">
      <Link href={"/products"}>Products</Link>
      <Link href={"/products/add"}>Add Product</Link>
      <Link href={"/categories"}>Categories</Link>
      <Link href={"/brands"}>Brands</Link>

      {/* <button
        className="ml-auto"
        onClick={async () => {
          await seedDatabase();
        }}
      >
        Seed Database
      </button> */}
    </div>
  );
}
