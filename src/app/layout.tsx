import NavMenu from "@/components/NavMenu";
import SessionProvider from "@/components/SessionProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { getServerSession } from "next-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Product Management",
  description: "Demo Product Management web application",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <Suspense>
          <Analytics />
        </Suspense> */}
        <SessionProvider session={session}>
          <main className="container mx-auto flex flex-col gap-4">
            <NavMenu />
            {children}
          </main>
        </SessionProvider>

        <ToastContainer
          position="top-center"
          theme="dark"
          closeOnClick
          pauseOnHover={false}
        />
      </body>
      {/* <GoogleTagManager gtmId="GTM-THSM25B4" /> */}
    </html>
  );
}

{
  /* <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-THSM25B4');</script> */
}

{
  /* <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-THSM25B4"
height="0" width="0" style="display:none;visibility:hidden"></iframe> */
}
