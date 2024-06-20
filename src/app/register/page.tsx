"use client";
import { register } from "@/actions/registerAction";
import { registerSchema } from "@/schemas/register";
import { useFormik } from "formik";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

function Register() {
  const router = useRouter();
  const {
    values,
    handleSubmit,
    handleChange,
    isSubmitting,
    errors,
    touched,
    handleBlur,
  } = useFormik({
    initialValues: {
      name: "",
      email: "",
      pass: "",
      address: "",
      city: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values, action) => {
      const data = await register(values);
      if (data?.error) {
        toast.error(data.error);
      }
      if (data?.success) {
        toast.success("User registered successfully");
        router.replace("/login");
      }
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Sign Up</h1>

      <form className="flex flex-col gap-6 mt-8" onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <label htmlFor="name">Name:</label>
          <input
            className=""
            id="name"
            type="text"
            name="name"
            placeholder="enter name"
            onBlur={handleBlur}
            value={values.name}
            onChange={handleChange}
            required
          />
          {errors.name && touched.name && (
            <p className="error">{errors.name}</p>
          )}
        </div>
        <div className="flex gap-2">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="enter email"
            onBlur={handleBlur}
            value={values.email}
            onChange={handleChange}
            required
          />
          {errors.email && touched.email && (
            <p className="error">{errors.email}</p>
          )}
        </div>
        <div className="flex gap-2">
          <label htmlFor="pass">Password:</label>
          <input
            id="pass"
            type="password"
            name="pass"
            placeholder="enter password"
            onBlur={handleBlur}
            value={values.pass}
            onChange={handleChange}
            required
          />
          {errors.pass && touched.pass && (
            <p className="error">{errors.pass}</p>
          )}
        </div>
        <div className="flex gap-2">
          <label htmlFor="address">Address:</label>
          <input
            id="address"
            type="text"
            name="address"
            placeholder="enter address"
            value={values.address}
            onChange={handleChange}
          />
        </div>
        <div className="flex gap-2">
          <label htmlFor="city">City:</label>
          <input
            id="city"
            type="text"
            name="city"
            placeholder="enter city"
            value={values.city}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="w-min bg-white text-black p-2 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          Register
        </button>
      </form>

      {isSubmitting && <p className="text-lg">Submitting...</p>}

      <p className="flex gap-2 mt-4">
        Already have an account?
        <Link href="/login">Sign In</Link>
      </p>
    </div>
  );
}

export default Register;
