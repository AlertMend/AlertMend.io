import { type Metadata } from "next";
import { getAllBlogs } from "@/lib/blog";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";
import { BlogCard } from "@/components/blog-card";
import { FeatureIconContainer } from "@/components/features/feature-icon-container";
import { IconClipboardText } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { truncate } from "@/lib/utils";
import { format } from "date-fns";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Blog | AlertMend ",
  description:
    "",
  openGraph: {
    images: [ {
      url: 'https://www.alertmend.io/img/AlertMend Ai 3.2.gif',
      width: 1200,
      height: 630,
      alt: 'AlertMend Logo',
    },
  ],
  },
};

export default async function ArticlesIndex() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.alertmend.io/",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blogs",
        "item": "https://www.alertmend.io/blogs",
      },
    ],
  };
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://www.alertmend.io/blogs#webpage",
    url: "https://www.alertmend.io/blogs",
    name: "Blogs | AlertMend",
    description:
      "Insights on automation, reliability engineering, and productivity. Read product updates, tutorials, and best practices from the AlertMend team.",
    isPartOf: { "@type": "WebSite", url: "https://www.alertmend.io", name: "AlertMend" },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement:[
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.alertmend.io"
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blogs",
          item: "https://www.alertmend.io/blogs"
        }
      ]
    }
  };
  let blogs = await getAllBlogs();

  return (
    <>
    <Script
      id="ld-breadcrumbs"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
     <Script
      id="ld-webpage"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
    />
    <div className="relative overflow-hidden py-20 md:py-0" data-section="Blogs">
      <Container className="flex flex-col items-center justify-between pb-20">
        <div className="relative z-20 py-10 md:pt-40">
          {/* <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
            <IconClipboardText className="h-6 w-6 text-cyan-500" />
          </FeatureIconContainer> */}
          <Heading as="h1" className="mt-4">
            Blogs
          </Heading>
          <Subheading className="text-center">
          Real-world solutions, engineering deep-dives, and lessons from scaling modern systems.
          </Subheading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full relative z-20">
          {blogs.slice(0, 52).map((blog, index) => (
            <BlogCard blog={blog} key={blog.title + index} />
          ))}
        </div>

        <div className="w-full py-20">
          <p className="text-2xl font-bold text-white mb-10">More Posts</p>

          <div className="divide-y divide-neutral-800">
            {blogs.slice(0, 52).map((blog, index) => (
              <Link
                href={`/blogs/${blog.slug}`}
                key={blog.slug + index}
                className="flex md:flex-row flex-col items-start justify-between md:items-center group py-4"
              >
                <div>
                  <p className="text-neutral-300 text-lg font-medium group-hover:text-white transition duration-200">
                    {blog.title}
                  </p>
                  <p className="text-neutral-300 text-sm mt-2 max-w-xl group-hover:text-white transition duration-200">
                    {truncate(blog.description, 80)}
                  </p>

                  <p className="text-neutral-300 text-sm mt-2 max-w-xl group-hover:text-white transition duration-200">
                    {format(new Date(blog.date), "MMMM dd, yyyy")}
                  </p>
                </div>
                <Image
                  src={blog.author.src}
                  alt={blog.author.name}
                  width={40}
                  height={40}
                  className="rounded-full md:h-10 md:w-10 h-6 w-6 mt-4 md:mt-0 object-cover"
                />
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </div>
    </>
  );
}
