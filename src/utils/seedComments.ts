import { faker } from "@faker-js/faker";
import { db } from "../../db";

async function insertCommentAndGetId(comment: any) {
  const result = await db
    .insertInto("comments")
    .values(comment)
    .executeTakeFirst();

  return Number(result.insertId);
}

async function generateNestedComments(
  productId: number,
  parentCommentId: number
) {
  const numberOfReplies = faker.number.int({ min: 0, max: 5 }); // Random number of replies

  for (let i = 0; i < numberOfReplies; i++) {
    const userId = faker.number.int({ min: 1, max: 50 });
    const comment = {
      comment: faker.lorem.sentences(),
      user_id: userId,
      product_id: productId,
      parent_comment_id: parentCommentId,
    };

    await insertCommentAndGetId(comment);
  }
}

export default async function seedComments() {
  const minPrimaryComments = 5;
  const maxPrimaryComments = 10;

  // Generate primary comments for each product (product IDs from 1 to 100)
  for (let productId = 1; productId <= 100; productId++) {
    const numberOfPrimaryComments = faker.number.int({
      min: minPrimaryComments,
      max: maxPrimaryComments,
    });

    for (let i = 0; i < numberOfPrimaryComments; i++) {
      const userId = faker.number.int({ min: 1, max: 50 });
      const primaryComment = {
        user_id: userId,
        product_id: productId,
        comment: faker.lorem.sentences(),
      };

      const primaryCommentId = await insertCommentAndGetId(primaryComment);

      await generateNestedComments(productId, primaryCommentId);
    }
  }
}

//  The below seeding function is for thread type nested comments

// async function generateAndInsertNestedComments(
//   productId: number,
//   maxDepth: number,
//   currentDepth = 1,
//   parentCommentId: number
// ) {
//   if (currentDepth === 0) return;
//   if (currentDepth > maxDepth) return;

//   const numberOfReplies = faker.number.int({ min: 1, max: 3 }); // Random number of replies

//   for (let i = 0; i < numberOfReplies; i++) {
//     const userId = faker.number.int({ min: 1, max: 50 });
//     const comment = {
//       comment: faker.lorem.sentences(),
//       user_id: userId,
//       product_id: productId,
//       parent_comment_id: parentCommentId,
//     };

//     const newCommentId = await insertCommentAndGetId(comment);

//     // Recursive call for further nested comments
//     await generateAndInsertNestedComments(
//       productId,
//       maxDepth,
//       currentDepth + 1,
//       newCommentId
//     );
//   }
// }

// export default async function seedComments() {
//   const numberOfPrimaryComments = 200; // Adjust as needed

//   for (let i = 0; i < numberOfPrimaryComments; i++) {
//     const userId = faker.number.int({ min: 1, max: 50 });
//     const productId = faker.number.int({ min: 1, max: 100 });

// const primaryComment = {
//   comment: faker.lorem.sentences(),
//   user_id: userId,
//   product_id: productId,
// };

//     const primaryCommentId = await insertCommentAndGetId(primaryComment);

//     // Determine the max depth of nesting for replies
//     const maxNestingDepth = faker.number.int({ min: 0, max: 3 });

//     // Generate nested comments for the primary comment
//     await generateAndInsertNestedComments(
//       productId,
//       maxNestingDepth,
//       1,
//       primaryCommentId
//     );
//   }
// }
