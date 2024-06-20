"use client";

import { deleteReview, editReview } from "@/actions/reviewActions";
import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { UpdateReviews } from "@/types";
import { toast } from "react-toastify";

function ReviewOperations({
  user_id,
  review_id,
  message,
  initialRating,
  product_id,
}) {
  const [isEdit, setIsEdit] = useState(false);
  const [rating, setRating] = useState(+initialRating);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formRef = useRef<any>();

  useEffect(() => {
    setRating(+initialRating);
  }, [initialRating, isEdit]);

  async function editReviewAction(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    setIsEditing(true);
    const review = String(formData.get("review"));
    if (review === "") {
      toast.error("write something in the review edit field to edit");
      setIsEditing(false);
      return;
    }
    const editedReview: UpdateReviews = {
      message: review,
      rating: parseFloat(rating?.toString()).toFixed(1),
    };
    const { error } = await editReview(review_id, editedReview, product_id);

    if (error) {
      toast.error(error);
      setIsEditing(false);
      return;
    }
    toast.success("review edited");
    setIsEdit(false);
    setIsEditing(false);
    formRef?.current?.reset();
  }

  async function deleteReviewAction() {
    if (confirm("Are you sure you want to delete your review")) {
      setIsDeleting(true);
      const { error } = await deleteReview(review_id, product_id);
      if (error) {
        toast.error(error);
        setIsDeleting(false);
        return;
      }
      toast.success("review deleted");
    }
  }

  return (
    <>
      <div className={`flex gap-4 ${isEdit && "mb-2"}`}>
        <button
          className="bg-gray-200 p-2"
          onClick={() => setIsEdit((prev) => !prev)}
        >
          Edit
        </button>
        <button
          className="bg-gray-200 p-2"
          onClick={deleteReviewAction}
          disabled={isDeleting}
        >
          Delete
        </button>
      </div>
      {isEdit && (
        <form onSubmit={editReviewAction} ref={formRef}>
          <textarea
            name="review"
            id=""
            rows={3}
            placeholder="edit your review"
            className="w-full text-black border-black border-2"
            defaultValue={message}
            disabled={isEditing}
            required
          />
          <div className="flex gap-2">
            <span>Product Rating: </span>
            <StarRating
              defaultRating={Number(initialRating)}
              userRating={rating}
              onSetRating={setRating}
              size={24}
              isPresentational={isEditing}
            />
          </div>
          <button
            className="bg-white p-2 text-black border-2 border-black"
            disabled={isEditing}
          >
            Post
          </button>
        </form>
      )}
    </>
  );
}

export default ReviewOperations;
