import * as yup from "yup";

export const basicSchema = yup.object().shape({
  name: yup.string().required("required"),
  description: yup.string().required("required"),
  old_price: yup
    .number()
    .positive("price must be positive")
    .required("required"),
  discount: yup.number().min(0).max(20).required("required"),
  colors: yup.string().required("required"),
  gender: yup.string().required("required"),
  brands: yup.array().required("required"),
  occasion: yup.array().required("required"),
  rating: yup.number().min(0).max(5).required("required"),
  categories: yup.array().required("required"),
  imageUrl: yup.string(),
});
