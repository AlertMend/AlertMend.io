import { useRouter } from "next/navigation";
import { BlogWithSlug } from "@/lib/blog";
import { IconArrowLeft } from "@tabler/icons-react";
import { Container } from "./container";
import Image from "next/image";
import { Logo } from "./logo";
import Link from "next/link";
import { format } from "date-fns";
export function BlogLayout({
  blog,
  children,
}: {
  blog: BlogWithSlug;
  children: React.ReactNode;
}) {
  return (
    <Container className="mt-16 lg:mt-32"  data-section={"Blog Detail Page: "+ blog.title}>
      <div className="flex justify-between items-center px-2 py-8">
        <Link href="/blogs" className="flex space-x-2 items-center">
          <IconArrowLeft className="w-4 h-4 text-muted" />
          <span className="text-sm text-muted">Back</span>
        </Link>
      </div>
      <div className="w-full mx-auto">
        {blog.image ? (
          <Image
            src={blog.image}
            height="800"
            width="800"
            className="h-40 md:h-96 w-full aspect-square object-cover rounded-3xl [mask-image:radial-gradient(circle,white,transparent)]"
            alt={blog.title}
          />
        ) : (
          <div className="h-40 md:h-96 w-full aspect-squace rounded-3xl shadow-derek bg-neutral-900 flex items-center justify-center">
            <Logo />
          </div>
        )}
      </div>
      <div className="xl:relative">
        <div className="mx-auto max-w-7xl px-5">
          <article className="pb-8">
            <header className="flex flex-col">
              <h1 className="mt-8 text-4xl font-bold tracking-tight text-neutral-200 sm:text-5xl ">
                {blog.title}
              </h1>
            </header>
            <div className="mt-8 max-w-7xl mx-auto prose prose-sm prose-invert" data-mdx-content>
              {children}
            </div>
            <div className="flex space-x-2 items-center pt-12 border-t border-neutral-800 mt-12">
              <div className="flex space-x-2 items-center ">
                <Image
                  src={blog.author.src}
                  alt={blog.author.name}
                  width={20}
                  height={20}
                  className="rounded-full h-5 w-5"
                />
                <p className="text-sm font-normal text-muted">
                  {blog.author.name}
                </p>
              </div>
              <div className="h-5 rounded-lg w-0.5 bg-neutral-700" />
              <time
                dateTime={blog.date}
                className="flex items-center text-base "
              >
                <span className="text-muted text-sm">
                  {format(new Date(blog.date), "MMMM dd, yyyy")}
                </span>
              </time>
            </div>
          </article>
        </div>
      </div>
    </Container>
  );
}
