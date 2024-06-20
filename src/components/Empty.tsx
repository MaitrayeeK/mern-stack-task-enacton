"use client";

import { useRouter } from "next/navigation";

function Empty() {
  const router = useRouter();

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4 text-red-400">
        Sorry, there are no products available for the following filter
      </h1>
    </div>
  );
}

export default Empty;
