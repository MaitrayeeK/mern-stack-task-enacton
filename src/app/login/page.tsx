"use client";
import { useQueryParams } from "@/hooks/useQueryParams";
import { loginSchema } from "@/schemas/login";
import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

function Login() {
  const router = useRouter();
  const searchParams = useQueryParams();
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
      email: "",
      pass: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values, action) => {
      try {
        const res = await signIn("credentials", {
          email: values.email,
          password: values.pass,
          redirect: false,
        });
        if (res?.ok && !res.error) {
          toast.success("logged in successfully");
          router.refresh();
          router.replace("/products");
        }
        if (res?.error) {
          toast.error("Incorrect email or password");
        }
      } catch (err: any) {
        console.log(err.message);
      }
    },
  });

  // useEffect(() => {
  //   console.log("run");
  //   const message = searchParams.get("message");
  //   if (message) {
  //     toast.error(message);
  //   }
  //   // if (searchParams.get("redirect")) {
  //   //   redirect(searchParams.get("redirect") as string);
  //   return () => toast.dismiss();
  //   // }
  // }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Login</h1>
      <form className="flex flex-col gap-6 mt-4" onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="enter email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
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
            value={values.pass}
            onChange={handleChange}
          />
          {errors.pass && touched.pass && (
            <p className="error">{errors.pass}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-min bg-white text-black p-2 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          Login
        </button>
        {isSubmitting && <p className="text-lg">Submitting...</p>}
      </form>

      <p className="flex gap-2 mt-4">
        Don&apos;t have an account?
        <Link href="/register">Sign Up</Link>
      </p>
    </div>
  );
}

export default Login;
