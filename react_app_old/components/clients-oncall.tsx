"use client";
import Image from "next/image";
import React, { useState } from "react";
import Marquee from "react-fast-marquee";
import { BlurImage } from "./blur-image";

export const ClientsOnCall = () => {
  let [logos, setLogos] = useState([
    {
      title: "Polymer",
      src: "/img/polymer-logo.png",
    },
    {
      title: "Wareflex",
      src: "/img/wareflex-logo.svg",
    },
    {
      title: "Avios",
      src: "/img/avios-logo.svg",
    },
    {
      title: "Roombee",
      src: "/img/roombee-logo.png",
    },
    {
      title: "Polymer 2",
      src: "/img/polymer-logo.png",
    },
    {
      title: "Wareflex 2",
      src: "/img/wareflex-logo.svg",
    },
    {
      title: "Avios 2",
      src: "/img/avios-logo.svg",
    },
    {
      title: "Roombee 2",
      src: "/img/roombee-logo.png",
    },
    // {
    //   title: "netflix second",
    //   src: "/logos/netflix.png",
    // },
    // {
    //   title: "google second",
    //   src: "/logos/google.webp",
    // },
    // {
    //   title: "meta second",
    //   src: "/logos/meta.png",
    // },
    // {
    //   title: "onlyfans second",
    //   src: "/logos/onlyfans.png",
    // },
  ]);
  return (
    <div className="pb-20 h-40" data-section="Our Clients">
      <p className="text-neutral-400 text-center mb-4">
        Trusted by fast-moving SaaS and DevOps teams worldwide
      </p>
      <div className="flex justify-center gap-4 max-w-7xl mx-auto relative">
        <div className="absolute inset-0 bg-charcoal grayscale z-40 pointer-events-none [mask-image:_radial-gradient(circle,_transparent_10%,_#000000_100%)]" />
        <Marquee>
          {logos.map((logo, idx) => (
            <BlurImage
              key={logo.title + idx}
              src={logo.src}
              alt={logo.title}
              width={100}
              height={100}
              className=" mx-8 object-contain grayscale hover:grayscale-0 transition duration-200"
            />
          ))}
        </Marquee>
      </div>
    </div>
  );
};
