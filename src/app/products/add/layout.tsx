import type { Metadata } from "next";

import ProtectedRoute from "@/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "Product Management",
  description: "Add Product",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
