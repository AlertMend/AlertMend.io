import { Link } from "next-view-transitions";
import Image from "next/image";
import React from "react";

export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm mr-4  text-black px-2 py-1  relative z-20"
    >
      <Image
        src={`/img/favicon.png`}
        alt="hero"
        height={35}
        width={35}
      />
       

      <span className="text-white font-bold">AlertMend</span>
    </Link>
  );
};
