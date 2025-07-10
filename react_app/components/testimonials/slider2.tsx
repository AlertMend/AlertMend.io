"use client";

import { useState, useRef, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import { Transition } from "@headlessui/react";
import { SparklesCore } from "../ui/sparkles";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../button";
// import Particles from './particles'

interface Item {
  src: StaticImageData;
  quote: string;
  name: string;
  designation?: string;
}

export const TestimonialsSlider2 = ({page_testimonials=[]}:{page_testimonials:any[]}) => {
  const [active, setActive] = useState<number>(0);
  const [autorotate, setAutorotate] = useState<boolean>(false);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  const testimonials = page_testimonials;

  useEffect(() => {
    if (!autorotate) return;
    const interval = setInterval(() => {
      setActive(
        active + 1 === testimonials.length ? 0 : (active) => active + 1
      );
    }, 7000);
    return () => clearInterval(interval);
  }, [active, autorotate, testimonials.length]);

  const heightFix = () => {
    setTimeout(() => {
      if (testimonialsRef.current && testimonialsRef.current.parentElement){
        testimonialsRef.current.parentElement.style.height = `${testimonialsRef.current.clientHeight}px`;
      }
    }, 1000);
  };

  useEffect(() => {
    heightFix();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        heightFix();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <section>
      <div className="max-w-7xl mx-auto relative mt-20 z-40">
        <div className="relative">
          {/* Particles animation */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-2 -z-10 w-80 h-20 -mt-6">
            <SparklesCore
              id="new-particles"
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={100}
              className="w-full h-full"
              particleColor="#FFFFFF"
            />
          </div>

          {/* Carousel */}
          <div className="text-center">
            {/* Testimonial image */}
            {/* <div className="relative h-40 [mask-image:_linear-gradient(0deg,transparent,#FFFFFF_30%,#FFFFFF)] md:[mask-image:_linear-gradient(0deg,transparent,#FFFFFF_40%,#FFFFFF)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[480px] h-[480px] -z-10 pointer-events-none before:rounded-full rounded-full before:absolute before:inset-0 before:bg-gradient-to-b before:from-neutral-400/20 before:to-transparent before:to-20% after:rounded-full after:absolute after:inset-0 after:bg-neutral-900 after:m-px before:-z-20 after:-z-20">
                {testimonials.map((item, index) => (
                  <Transition
                    key={index}
                    show={active === index}
                    enter="transition ease-[cubic-bezier(0.68,-0.3,0.32,1)] duration-700 order-first"
                    enterFrom="opacity-0 -rotate-[60deg]"
                    enterTo="opacity-100 rotate-0"
                    leave="transition ease-[cubic-bezier(0.68,-0.3,0.32,1)] duration-700"
                    leaveFrom="opacity-100 rotate-0"
                    leaveTo="opacity-0 rotate-[60deg]"
                    beforeEnter={() => heightFix()}
                  >
                    <div className="absolute inset-0 h-full -z-10">
                      <Image
                        className="relative top-11 left-1/2 -translate-x-1/2 rounded-full"
                        src={item.src}
                        width={56}
                        height={56}
                        alt={item.name}
                      />
                    </div>
                  </Transition>
                ))}
              </div>
            </div> */}
            {/* Text */}
            <div className="mb-0 m-auto transition-all duration-150 delay-300 ease-in-out px-8 sm:px-6">
              <div className="relative flex my-auto align-items-center overflow" ref={testimonialsRef}>
                {testimonials.map((item, index) => (
                  <Transition
                    key={index}
                    show={active === index}
                    enter="transition ease-in-out duration-500 delay-200 order-first"
                    enterFrom="opacity-0 -translate-x-1"
                    enterTo="opacity-100 translate-x-0"
                    leave="transition ease-out duration-300 delay-300 absolute"
                    leaveFrom="opacity-100 translate-x-0"
                    leaveTo="opacity-0 translate-x-4"
                    beforeEnter={() => heightFix()}
                  >
                    <div className="p-8" 
                    data-section={"Testimonial:" + item.title}
                    >
                    <div style={{minWidth:'fit-content'}} 
                    className=
                    "w-full grid grid-cols-1 md:grid-cols-3 justify-start relative z-20 max-w-7xl mx-auto bg-gradient-to-br from-neutral-900 to-neutral-950">
                      <GridLineHorizontal className="top-0" offset="200px" />
                      <GridLineHorizontal className="bottom-0 top-auto" offset="200px" />
                      <GridLineVertical className="left-0" offset="80px" />
                      <GridLineVertical className="left-auto right-0" offset="80px" />
                      <div className="md:col-span-2 p-8 md:p-14">
                        <h2 className="text-left text-neutral-200 text-xl md:text-3xl tracking-tight font-medium">
                          {item.title}
                        </h2>
                        <div className="flex items-start sm:items-center flex-col sm:flex-row sm:gap-4">
                        <Link href={`/case-studies/${item.slug}`}>
                        <button className="mt-8 flex space-x-2 items-center group text-base px-4 py-2 rounded-lg bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]">
                          <span>View Full Case Study</span>
                        </button>
                        </Link>
                        </div>
                      </div>
                      <div className="border-t md:border-t-0 md:border-l border-dashed border-[#7c7c7c] p-8 md:p-14">
                        <p className="text-base text-neutral-200">
                          &quot;{item.description}&quot;
                        </p>
                        <div className="flex flex-col text-sm items-start mt-4 gap-1">
                          <p className="font-bold text-neutral-200">
                            {item?.author?.name}
                          </p>
                          <p className="text-neutral-500 text-neutral-400">
                            {item?.author?.designation}
                          </p>
                        </div>
                      </div>
                    </div>
                    </div>
                  </Transition>
                ))}
              </div>
            </div>
            {/* Buttons */}
            <div className="flex flex-wrap justify-center m-0 px-8 sm:px-6">
              {testimonials.map((item, index) => (
                <button
                  className={cn(
                    `px-2 py-1 rounded-full m-1.5 text-xs border border-transparent text-neutral-300 transition duration-150 ease-in-out [background:linear-gradient(theme(colors.neutral.900),_theme(colors.neutral.900))_padding-box,_conic-gradient(theme(colors.neutral.400),_theme(colors.neutral.700)_25%,_theme(colors.neutral.700)_75%,_theme(colors.neutral.400)_100%)_border-box] relative before:absolute before:inset-0 before:bg-neutral-800/30 before:rounded-full before:pointer-events-none ${
                      active === index
                        ? "border-secondary/50"
                        : "border-transparent opacity-70"
                    }`
                  )}
                  key={index}
                  onClick={() => {
                    setActive(index);
                    setAutorotate(false);
                  }}
                  data-section={"Testimonial:" + item?.author?.name}
                >
                  <span className="relative">
                    <span className="text-neutral-50 font-bold">
                      {item?.author?.name}
                    </span>{" "}
                    <br className="block sm:hidden" />
                    <span className="text-neutral-600 hidden sm:inline-block">
                      -
                    </span>{" "}
                    <span className="hidden sm:inline-block">
                      {item?.author?.designation}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const GridLineHorizontal = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "#7c7c7c",
          "--height": "1px",
          "--width": "5px",
          "--fade-stop": "90%",
          "--offset": offset || "200px", //-100px if you want to keep the line inside
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute w-[calc(100%+var(--offset))] h-[var(--height)] left-[calc(var(--offset)/2*-1)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className
      )}
    ></div>
  );
};
 
const GridLineVertical = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "#7c7c7c",
          "--height": "5px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": offset || "150px", //-100px if you want to keep the line inside
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute h-[calc(100%+var(--offset))] w-[var(--width)] top-[calc(var(--offset)/2*-1)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className
      )}
    ></div>
  );
};
