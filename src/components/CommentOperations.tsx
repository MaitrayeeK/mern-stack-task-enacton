"use client";

import { deleteCommentAndReplies, editComment } from "@/actions/commentActions";
import { UpdateComments } from "@/types";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

function CommentOperations({ comment_id, comment, product_id }) {
  const [isEdit, setIsEdit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formRef = useRef<any>();

  async function editCommentAction(event) {
    event.preventDefault();
    setIsEditing(true);
    const formData = new FormData(event.target);
    const comment = formData.get("comment") as string;

    if (!comment) {
      toast.error("comment is empty");
      setIsEditing(false);
      return;
    }

    const updatedComment: UpdateComments = {
      comment,
    };

    const { error } = await editComment(comment_id, updatedComment, product_id);

    if (error) {
      toast.error(error);
      setIsEditing(false);
      return;
    }
    toast.success("comment edited");
    formRef?.current?.reset();
    setIsEditing(false);
    setIsEdit(false);
  }

  async function deleteCommentAction() {
    if (confirm("Are you sure you want to delete your comment")) {
      setIsDeleting(true);
      const { error } = await deleteCommentAndReplies(comment_id, product_id);
      if (error) {
        toast.error(error);
        setIsDeleting(false);
        return;
      }
      setIsDeleting(false);
      toast.success("comment deleted");
    }
  }

  return (
    <>
      <div className={`flex gap-4 ${isEdit && "mb-2"}`}>
        <button
          className="bg-gray-200 p-2 text-sm"
          disabled={isDeleting || isEditing}
          onClick={() => setIsEdit((prev) => !prev)}
        >
          Edit
        </button>
        <button
          className="bg-gray-200 p-2 text-sm"
          onClick={deleteCommentAction}
          disabled={isDeleting || isEditing}
        >
          Delete
        </button>
      </div>

      {isEdit && (
        <div className="mb-2">
          <form onSubmit={editCommentAction} ref={formRef}>
            <textarea
              name="comment"
              disabled={isEditing}
              id=""
              rows={3}
              placeholder="post your comment"
              className="w-full text-black border-black border-2"
              defaultValue={comment}
              required
            />
            <button
              className="bg-white p-2 text-black border-2 border-black"
              disabled={isEditing}
            >
              post
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default CommentOperations;
