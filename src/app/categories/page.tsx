import AddCategory from "@/components/AddCategory";
import DeleteCategory from "@/components/DeleteCategory";
import EditCategory from "@/components/EditCategory";
import { convertToNestedCategories } from "@/utils";
import { getCategories } from "@/actions/categoryActions";
import React from "react";
import { authOptions } from "../../utils/authOptions";
import { cookies } from "next/headers";

// export const dynamic = "force-dynamic";

async function Categories() {
  const categories = await getCategories();
  const modifiedCategories = convertToNestedCategories(categories);

  function renderCategories(categories, depth) {
    return categories.map((category, i) => {
      return (
        <div
          key={i}
          className={`mb-2 ${depth === 0 && "border-b-2 border-violet-400"}`}
        >
          <div className="mb-4">
            <span>
              {Array.from({ length: depth }, (_, i) => (
                <span key={i}>&emsp;</span>
              ))}
            </span>
            <span>{i + 1}. </span>
            <span className="">{category.name}</span>
            <>
              <DeleteCategory category_id={category.id} />
              <EditCategory category={category} />
            </>
          </div>
          {category.subCategories.length > 0
            ? renderCategories(category.subCategories, depth + 1)
            : null}
        </div>
      );
    });
  }

  return (
    <div className="pb-16">
      <h1 className="text-lg font-bold">All Categories & its SubCategories</h1>

      <AddCategory categories={categories} />

      {renderCategories(modifiedCategories, 0)}
      {/* {modifiedCategories.map((category, i) => {
        return (
          <div key={i} className="mb-4">
            <span>{i + 1}. </span>
            <span>{category.name}</span>
          </div>
        );
      })} */}
    </div>
  );
}

export default Categories;
