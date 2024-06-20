"use client";

import { deleteProduct } from "@/actions/productActions";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

function DeleteProduct({ productId, numOfResultsOnCurPage }) {
  const router = useRouter();
  const searchParams = useQueryParams();

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this product?")) {
      const { error } = await deleteProduct(productId);
      if (error) {
        toast.error(error);
        return;
      }
      toast.success("Product deleted successfully");
      if (numOfResultsOnCurPage === 1) {
        const pageNo = Number(searchParams.get("page")) || 1;
        if (pageNo === 1) {
          return;
        }
        searchParams.set("page", `${pageNo - 1}`);
        router.push(`/products?${searchParams.toString()}`);
      }
    }
  }

  return (
    <>
      <button onClick={handleDelete}>Delete Product</button>
    </>
  );
}

export default DeleteProduct;
