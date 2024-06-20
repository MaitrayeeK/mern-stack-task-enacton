//@ts-nocheck
"use client";

import { postReview } from "@/actions/reviewActions";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import StarRating from "./StarRating";
import { InsertReviews } from "@/types";
import { toast } from "react-toastify";

function AddReview({ product_id }) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<any>();

  async function reviewSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    setSubmitting(true);
    const review = formData.get("review") as string;

    if (!review || !rating) {
      toast.error("please fill all the fields");
      setSubmitting(false);
      return;
    }

    const post: InsertReviews = {
      user_id: session?.user?.id,
      product_id,
      message: review,
      rating: parseFloat(rating?.toString()).toFixed(1),
    };
    const { error } = await postReview(post, product_id);

    if (error) {
      toast.error(error);
      setSubmitting(false);
      return;
    }

    toast.success("review added");
    setSubmitting(false);
    setRating(0);
    formRef?.current?.reset();
  }

  return (
    <div>
      <form ref={formRef} onSubmit={reviewSubmit}>
        <textarea
          name="review"
          id=""
          rows={3}
          placeholder="post your review"
          className="w-full text-black"
          disabled={submitting}
          required
        />
        <div className="flex gap-2">
          <span>Product Rating: </span>
          <StarRating
            userRating={rating}
            onSetRating={setRating}
            size={24}
            isPresentational={submitting}
          />
        </div>
        {/* <input
          type="number"
          className="text-black mr-4"
          name="rating"
          id="rating"
          defaultValue={0}
          min={0}
          max={5}
          required
          step={0.1}
        ></input> */}
        <button
          className="bg-white p-2 text-black disabled:cursor-not-allowed"
          disabled={submitting}
        >
          Post
        </button>
        {submitting && <p className="text-white">Submitting..</p>}
      </form>
      {!session && <p>You need to sigin before posting any review</p>}
    </div>
  );
}

export default AddReview;
