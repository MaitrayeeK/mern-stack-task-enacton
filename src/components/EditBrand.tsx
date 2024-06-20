"use client";
import { editBrand } from "@/actions/brandActions";
import { useState } from "react";
import { toast } from "react-toastify";

function EditBrand({ brand }) {
  const [isOpen, setIsOpen] = useState(false);

  async function handleEdit(formData: FormData) {
    const name = formData.get("name") as string;
    if (!name) {
      toast.error("brand name is required");
      return;
    }
    const website = formData.get("website") as string;
    const { error } = await editBrand(brand.id, { name, website });
    if (error) {
      toast.error(error);
      return;
    }
    toast.success(`Brand Id: ${brand.id} Edited`);
    setIsOpen(false);
  }

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6 inline-block cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
        />
      </svg>

      {isOpen && (
        <form action={handleEdit} className="mb-4 flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="select-none">
              Brand Name:{" "}
            </label>
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={brand.name}
            />
          </div>
          <div>
            <label htmlFor="website" className="select-none">
              Brand Website:{" "}
            </label>
            <input
              type="text"
              name="website"
              id="website"
              defaultValue={brand.website}
              placeholder="Enter brand website"
            />
          </div>
          <button className="bg-gray-200 text-black p-2 w-max">Edit</button>
        </form>
      )}
    </>
  );
}

export default EditBrand;
