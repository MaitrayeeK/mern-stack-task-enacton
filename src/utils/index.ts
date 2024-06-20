export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

export function parseDate(inputDate) {
  try {
    const date = new Date(inputDate);

    // Format the date in the desired format (e.g., "January 31, 2024, 11:49 AM")
    const formattedDate = date.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return formattedDate;
  } catch (error) {
    // Handle any parsing errors here
    console.error("Error parsing date:", error);
    return "Invalid Date";
  }
}

export function convertToNestedComments(comments) {
  const commentMap: any = new Map();
  const nestedComments: any = [];

  // Create a map of comments using their IDs as keys
  comments.forEach((comment) => {
    const { id, ...rest } = comment;
    commentMap.set(id, { id, ...rest, subComments: [] });
  });

  // Iterate through the comments and add sub-comments to their parent comment's subComments array
  comments.forEach((comment) => {
    const { id, parent_comment_id } = comment;
    if (parent_comment_id === null) {
      // If it's a top-level comment, add it directly to the nestedComments array
      nestedComments.push(commentMap.get(id));
    } else {
      // If it's a reply, add it to its parent comment's subComments array
      const parentComment = commentMap.get(parent_comment_id);
      if (parentComment) {
        parentComment.subComments.push(commentMap.get(id));
      }
    }
  });

  return nestedComments;
}

export function convertToNestedCategories(categories) {
  const categoryMap: any = new Map();
  const nestedCategories: any = [];

  // Create a map of comments using their IDs as keys
  categories.forEach((category) => {
    const { id, ...rest } = category;
    categoryMap.set(id, { id, ...rest, subCategories: [] });
  });

  // Iterate through the comments and add sub-comments to their parent comment's subComments array
  categories.forEach((category) => {
    const { id, parent_id } = category;
    if (parent_id === null) {
      // If it's a top-level comment, add it directly to the nestedCategories array
      nestedCategories.push(categoryMap.get(id));
    } else {
      // If it's a reply, add it to its parent comment's subComments array
      const parentCategory = categoryMap.get(parent_id);
      if (parentCategory) {
        parentCategory.subCategories.push(categoryMap.get(id));
      }
    }
  });

  return nestedCategories;
}

export function selectCategoriesFormat(categories) {
  const categoriesOption = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));
  return [{ value: "", label: "None" }, ...categoriesOption];
}
