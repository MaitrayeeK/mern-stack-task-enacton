import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup.string().email("Email is not valid").required("Required"),
  pass: yup.string().min(6).required("Required"),
});
