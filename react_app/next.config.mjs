import rehypePrism from "@mapbox/rehype-prism";
import nextMDX from "@next/mdx";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "unsplash.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "github.com" },
      { hostname: "i.pravatar.cc" },
    ],
  },
  pageExtensions: ["ts", "tsx", "mdx"],

  // 👇 Add this redirects function
  // async redirects() {
  //   return [
  //     {
  //       source: "/:path*.html",
  //       destination: "/:path*",
  //       permanent: true,
  //     },
  //   ];
  // },
};

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrism],
  },
});

export default withMDX(nextConfig);
