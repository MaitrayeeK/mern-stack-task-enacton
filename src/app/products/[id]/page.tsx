//@ts-nocheck
import { authOptions } from "@/utils/authOptions";
import AddComment from "@/components/AddComment";
import AddReview from "@/components/AddReview";
import CommentOperations from "@/components/CommentOperations";
import LoadMore from "@/components/LoadMore";
import ReviewOperations from "@/components/ReviewOperations";
import StarRating from "@/components/StarRating";
import { convertToNestedComments, parseDate } from "@/utils";
import {
  MapBrandIdsToName,
  getProduct,
  getAllProductCategories,
} from "@/actions/productActions";
import { getCommentsForProduct } from "@/actions/commentActions";
import { getReviewsForProduct } from "@/actions/reviewActions";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: string }) {
  const { id } = params;
  const productArr: any = await getProduct(+id);
  const product = productArr[0];

  return {
    title: product.name,
    description: product.description,
  };
}

async function Product({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { id } = params;

  if (!Number(id)) {
    notFound();
  }

  const productArr: any = await getProduct(+id);

  if (productArr.length === 0) {
    notFound();
  }

  const session = await getServerSession(authOptions);

  const product = productArr[0];
  const brandsMap = await MapBrandIdsToName([
    ...new Set(JSON.parse(product.brands)),
  ]);
  const productCategories = await getAllProductCategories(productArr);
  const { loadMoreReviews = "false" } = searchParams as any;

  const reviews = await getReviewsForProduct(+id, loadMoreReviews);

  const comments = await getCommentsForProduct(+id);

  const modifiedComments = convertToNestedComments(comments);

  function renderComments(comments, depth) {
    return comments.map((comment, i) => {
      return (
        <div key={i}>
          <div className={`${comment.parent_comment_id && "flex gap-2"}`}>
            {comment.parent_comment_id && (
              <span>
                {Array.from({ length: depth }, (_, i) => (
                  <span key={i}>&emsp;</span>
                ))}
                -
              </span>
            )}
            <div className="flex flex-col gap-1 bg-white p-4 text-black rounded-md mb-4">
              <p>
                {+session?.user?.id === comment.user_id
                  ? "You: " + comment.name
                  : comment.name}
              </p>
              <p>{comment.comment}</p>
              <p>Modified on: {parseDate(comment.updated_at)}</p>
              <div className="">
                {+session?.user?.id === comment.user_id && (
                  <CommentOperations
                    comment_id={comment.id}
                    comment={comment.comment}
                    product_id={id}
                  />
                )}
              </div>
              {session?.user?.isVerified && (
                <AddComment
                  text="Reply"
                  product_id={id}
                  parent_comment_id={comment.id}
                />
              )}
            </div>
          </div>
          {comment.subComments.length > 0
            ? renderComments(comment.subComments, depth + 1)
            : null}
        </div>
      );
    });
  }

  return (
    <div className="pb-12">
      <h1 className="text-xl mb-6 font-bold">Details for {product.name}</h1>
      <div className="flex gap-10 mb-12">
        <div>
          <Image
            src={product.image_url}
            width={400}
            height={300}
            alt="Product image"
          />
        </div>
        <div>
          <p> Product Name: {product.name} </p>
          <p> Description: {product.description} </p>
          <p> New Price: {product.price} </p>
          <p> Old Price: {product.old_price} </p>
          <p> discount: {product.discount} </p>
          <p> colors available: {product.colors} </p>
          <p> For gender: {product.gender} </p>
          <p> For occasion: {product.occasion} </p>
          <p className="flex flex-col mb-2">
            Available in following brands:
            {[...new Set(JSON.parse(product.brands))].map((brandId, i) => {
              return <span key={i}> - {brandsMap.get(brandId)}</span>;
            })}
          </p>
          <p className="flex flex-col ">
            Categories it belongs to:
            {productCategories.get(product.id).map((category, i) => {
              return <span key={i}> - {category.name}</span>;
            })}
          </p>
        </div>
      </div>
      <div className="">
        <div className="w-1/2 flex flex-col gap-4">
          <h1 className="text-lg font-bold">Reviews</h1>
          {!session ? (
            <p>you need to signin before posting any review</p>
          ) : session.user?.isVerified ? (
            <AddReview product_id={id} />
          ) : (
            <p>
              You need to verify your email before posting any reviews, check
              your email.
            </p>
          )}
          {reviews.length > 0 ? (
            reviews.map((review, i) => {
              return (
                <div
                  key={i}
                  className="flex flex-col gap-2 bg-white p-4 text-black rounded-md"
                >
                  <p>{review.message}</p>
                  <div className="flex gap-4 items-center justify-between">
                    <span>
                      {+session?.user?.id === review.user_id
                        ? "You: " + review.name
                        : review.name}
                    </span>
                    <span>
                      <StarRating
                        isPresentational={true}
                        defaultRating={+review.rating}
                        userRating={+review.rating}
                        onSetRating={undefined}
                        size={24}
                      />
                    </span>
                  </div>
                  {+session?.user?.id === review.user_id && (
                    <div>
                      <ReviewOperations
                        user_id={review.user_id}
                        review_id={review.review_id}
                        message={review.message}
                        initialRating={review.rating}
                        product_id={id}
                      />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p>There are no reviews on this product.</p>
          )}
          {reviews.length > 0 && <LoadMore id={id} />}
        </div>
        <div className="w-[80%] flex flex-col gap-4 mt-4">
          <h1 className="text-2xl font-bold">Comments</h1>
          {!session ? (
            <p>you need to signin before posting any comments</p>
          ) : session.user?.isVerified ? (
            <AddComment product_id={id} />
          ) : (
            <p>
              You need to verify your email before posting any comments, check
              your email.
            </p>
          )}
          <div>
            {modifiedComments.length !== 0 ? (
              renderComments(modifiedComments, 0)
            ) : (
              <p>There are no comments on this product</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;

/* 
<div className="flex flex-col gap-2 bg-white p-4 text-black rounded-md mb-4">
              <p>User name</p>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iusto
                voluptatum corporis eligendi aliquam quo nihil nam, nisi a
                quisquam dolorum maiores odio optio, necessitatibus officiis
                itaque veritatis laboriosam amet? Velit repellendus deleniti
                porro voluptates at praesentium in suscipit nostrum, quo
                doloremque molestiae, debitis a consectetur enim nam nesciunt,
                minus alias?
              </p>
              <p>13/12/2002</p>
            </div>
            <div className="flex gap-4">
              <span>-</span>
              <div className="flex flex-col gap-2 bg-white p-4 text-black rounded-md">
                <p>User name</p>
                <p>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Iusto voluptatum corporis eligendi aliquam quo nihil nam, nisi
                  a quisquam dolorum maiores odio optio, necessitatibus officiis
                  itaque veritatis laboriosam amet? Velit repellendus deleniti
                  porro voluptates at praesentium in suscipit nostrum, quo
                  doloremque molestiae, debitis a consectetur enim nam nesciunt,
                  minus alias?
                </p>
                <p>13/12/2002</p>
              </div>
            </div>
*/
