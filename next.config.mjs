/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["loremflickr.com"],
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "loremflickr.com",
    //     port: "",
    //     pathname: "/*",
    //   },
    // ],
  },
};

export default nextConfig;
