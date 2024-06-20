//@ts-nocheck
"use client";

import { postComment } from "@/actions/commentActions";
import { InsertComments } from "@/types";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

function AddComment({
  product_id,
  parent_comment_id = null,
  text = "Add comment",
}) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<any>();

  async function commentSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.target);
    const comment = formData.get("comment") as string;
    if (!comment) {
      toast.error("comment is required");
      setIsSubmitting(false);
      return;
    }
    const post: InsertComments = {
      user_id: session?.user?.id,
      product_id,
      comment,
      parent_comment_id,
    };
    const { error } = await postComment(post, product_id);

    if (error) {
      toast.error(error);
      setIsSubmitting(false);
      return;
    }

    toast.success("comment added");
    formRef?.current?.reset();
    setIsSubmitting(false);
    setIsOpen(false);
  }

  return (
    <>
      <button
        className="w-max text-sm p-2 bg-gray-200 text-black disabled:cursor-not-allowed"
        disabled={!session?.user?.id}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {text}
      </button>

      {isOpen && (
        <div className="mb-2">
          <form onSubmit={commentSubmit} ref={formRef}>
            <textarea
              name="comment"
              id=""
              rows={3}
              placeholder="post your comment"
              className="w-full text-black border-black border-2"
              disabled={isSubmitting}
              required
            />
            <button
              className="bg-white p-2 text-black border-2 border-black disabled:cursor-not-allowed"
              disabled={!session?.user?.id || isSubmitting}
            >
              post
            </button>
            {isSubmitting && <p className="text-white">Submitting..</p>}
          </form>
        </div>
      )}
    </>
  );
}

export default AddComment;
