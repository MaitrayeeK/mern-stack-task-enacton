"use client";

import { addBrand } from "@/actions/brandActions";
import { InsertBrands } from "@/types";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

function AddBrand() {
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<any>();

  async function brandAction(formData: FormData) {
    const brand = formData.get("brand") as string;
    let website = formData.get("website") as string;
    if (!brand) {
      toast.error("brand name is required");
      return;
    }
    if (website && !website?.startsWith("http")) {
      website = `http://${website}`;
    }
    const value: InsertBrands = {
      name: brand,
      website,
    };
    const { error } = await addBrand(value);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Brand added successfully");
    setIsOpen(false);
  }

  return (
    <div>
      <button
        className="p-3 bg-white text-black mt-4 mb-4 text-sm"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        Add Brand
      </button>

      {isOpen && (
        <form
          action={brandAction}
          className="flex flex-col gap-4"
          ref={formRef}
        >
          <div>
            <label htmlFor="brand">Brand Name: </label>
            <input
              type="text"
              name="brand"
              id="brand"
              className="w-1/3"
              placeholder="Enter Brand Name"
              required
            />
          </div>
          <div>
            <label htmlFor="website">Brand Website: </label>
            <input
              type="text"
              name="website"
              id="website"
              className="w-1/3"
              placeholder="Enter Website URL"
            />
          </div>
          <button className="w-max bg-gray-200 text-black p-2 ml-2">Add</button>
        </form>
      )}
    </div>
  );
}

export default AddBrand;
