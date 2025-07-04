"use client";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { AnimatePresence, motion } from "motion/react";
import { IconMenu } from "@tabler/icons-react";
import { CaseStudyWithSlug } from "@/lib/case-studies";

export function CaseStudyLayout({
  caseStudy,
  children,
}: {
  caseStudy: CaseStudyWithSlug;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto py-40 flex w-full max-w-7xl flex-col gap-4 px-4 md:flex-row md:px-8">
      <Toc links={caseStudy.links} />
      <div className="flex max-w-2xl flex-1 flex-col">
        {/* <Image
          src={caseStudy.image}
          alt={caseStudy.title}
          className="h-60 w-full rounded-3xl object-cover md:h-[30rem]"
          height={720}
          width={1024}
        /> */}
        <h2 className="mb-2 mt-6 text-2xl font-bold tracking-tight text-white">
          {caseStudy.title}
        </h2>

        <div className="prose prose-invert mt-10">
          {children}
        </div>

        <div className="mt-10 max-w-2xl">
          <div className="h-px w-full bg-neutral-900" />
          <div className="h-px w-full bg-neutral-800" />
        </div>
        <div className="mt-10 flex items-center">
         
         
          <div className="mx-2 h-1 w-1 rounded-full bg-neutral-700" />
        </div>
      </div>
    </div>
  );
}

const Toc = ({links}:{links:any[]}) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="sticky left-0 top-20 hidden max-w-xs flex-col self-start pr-10 md:flex">
        {links.map((link, index) => (
          <Link
            className="group/toc-link relative rounded-lg px-2 py-1 text-sm text-neutral-200"
            key={link.href}
            href={link.href}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
          >
            {hovered === index && (
              <motion.span
                layoutId="toc-indicator"
                className="absolute left-0 top-0 h-full w-1 rounded-br-full rounded-tr-full bg-neutral-700"
              />
            )}
            <span className="inline-block transition duration-200 group-hover/toc-link:translate-x-1">
              {link.title}
            </span>
          </Link>
        ))}
      </div>
      <div className="sticky right-2 top-20 flex w-full flex-col items-end justify-end self-start md:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white bg-neutral-900"
        >
          <IconMenu className="h-6 w-6 text-white" />
        </button>
        <AnimatePresence>
          x
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 flex flex-col items-end rounded-3xl border p-4 border-neutral-700 bg-neutral-900"
            >
              {links.map((link, index) => (
                <Link
                  className="group/toc-link relative rounded-lg px-2 py-1 text-right text-sm text-neutral-200"
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {hovered === index && (
                    <motion.span
                      layoutId="toc-indicator"
                      className="absolute left-0 top-0 h-full w-1 rounded-br-full rounded-tr-full bg-neutral-700"
                    />
                  )}
                  <span className="inline-block transition duration-200 group-hover/toc-link:translate-x-1">
                    {link.title}
                  </span>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

const dummyContentMarkdown = `

## Introduction

Artificial Intelligence (AI) has been rapidly evolving, transforming various aspects of our lives. From voice assistants to autonomous vehicles, AI is becoming increasingly integrated into our daily routines.

### Key Areas of AI Development

1. **Machine Learning**
   - Deep Learning
   - Neural Networks
   - Reinforcement Learning

2. **Natural Language Processing**
   - Language Translation
   - Sentiment Analysis
   - Chatbots and Virtual Assistants

3. **Computer Vision**
   - Image Recognition
   - Facial Recognition
   - Autonomous Vehicles

## Ethical Considerations

As AI continues to advance, it's crucial to address ethical concerns:

- Privacy and data protection
- Bias in AI algorithms
- Job displacement due to automation

## Conclusion

The future of AI is both exciting and challenging. As we continue to push the boundaries of what's possible, it's essential to balance innovation with responsible development and implementation.

> "The development of full artificial intelligence could spell the end of the human race." - Stephen Hawking

*This quote reminds us of the importance of careful consideration in AI advancement.*

![AI Concept Image](https://images.unsplash.com/photo-1719716136369-59ecf938a911?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)

For more information, visit [AI Research Center](https://example.com/ai-research).
`;

