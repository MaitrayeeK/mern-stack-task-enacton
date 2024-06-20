import * as yup from "yup";

export const registerSchema = yup.object().shape({
  name: yup.string().required("Required"),
  email: yup.string().email("Email is not valid").required("Required"),
  pass: yup.string().min(6).required("Required"),
  address: yup.string(),
  city: yup.string(),
});
