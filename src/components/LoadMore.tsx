"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

function LoadMore({ id }) {
  const router = useRouter();
  const query = useSearchParams();
  const searchParams = new URLSearchParams(query);

  const loadMoreReviews = searchParams.get("loadMoreReviews");

  return (
    <div>
      <button
        onClick={() => {
          if (loadMoreReviews === "true") {
            searchParams.delete("loadMoreReviews");
          } else {
            searchParams.set("loadMoreReviews", "true");
          }
          router.push(`/products/${id}/?${searchParams.toString()}`, {
            scroll: false,
          });
        }}
        className="bg-gray-500 p-2 text-white"
      >
        {loadMoreReviews === "true" ? "See less" : "Load more"}
      </button>
    </div>
  );
}

export default LoadMore;
