import Link from "next/link";
import React from "react";
import { Logo } from "@/components/logo";

export const Footer = () => {
  const links = [
    {
      name: "Pricing",
      href: "/pricing",
    },
    {
      name: "Blogs",
      href: "/blogs",
    },
    {
      name: "Contact",
      href: "/contact",
    },
  ];
  const legal = [
    {
      name: "Privacy Policy",
      href: "https://docs.google.com/document/d/1-0dRnRwBy7DGAh-7f4qDDjX6fPBVOifXCd2j3OEIjOI/edit?tab=t.0#heading=h.sndgwapwljbv",
    },
    // {
    //   name: "Terms of Service",
    //   href: "#",
    // },
    // {
    //   name: "Refund Policy",
    //   href: "#",
    // },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/alertmend",
    },
    {
      name: "You Tube",
      href: "https://www.youtube.com/@AlertMend",
    },
  ];
  const socials = [
    // {
    //   name: "Twitter",
    //   href: "https://twitter.com/mannupaaji",
    // },
    // {
    //   name: "LinkedIn",
    //   href: "https://www.linkedin.com/company/alertmend",
    // },
    // {
    //   name: "You Tube",
    //   href: "https://www.youtube.com/@AlertMend",
    // },
  ];
  return (
    <div className="relative">
      <div className="border-t border-neutral-900 px-8 pt-20 pb-32 relative bg-primary">
        <div className="max-w-5xl mx-auto text-sm text-neutral-500 dark:text-neutral-400 flex sm:flex-row flex-col justify-between items-start ">
          <div>
            <div className="mr-4  md:flex mb-4">
              <Logo />
            </div>
            <div>32 PEKIN STREET, #05-01, SINGAPORE 048762</div>
            <div>Copyright &copy; AlertMend 2025.</div>
            <div className="mt-2">All rights reserved</div>
          </div>
          <div className="flex justify-center mt-2">
              <div className="text-center">
              <p className="text-lg font-semibold mb-4 text-white">Backed by</p>
            <img
             src="img/Antler-Logo.png"
             alt="Antler"
             className="h-10 mx-auto"
             />
            </div>
            </div>
          <div className="grid grid-cols-2 gap-10 items-start mt-10 md:mt-0">
            <div className="flex justify-center space-y-4 flex-col mt-4">
              {links.map((link) => (
                <Link
                  key={link.name}
                  className="transition-colors hover:text-black text-muted dark:text-muted-dark dark:hover:text-neutral-400 text-xs sm:text-sm"
                  href={link.href}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex justify-center space-y-4 flex-col mt-4">
              {legal.map((link) => (
                <Link
                  key={link.name}
                  className="transition-colors hover:text-black text-muted dark:text-muted-dark dark:hover:text-neutral-400 text-xs sm:text-sm"
                  href={link.href}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            {/* <div className="flex justify-center space-y-4 flex-col mt-4">
              {socials.map((link) => (
                <Link
                  key={link.name}
                  className="transition-colors hover:text-black text-muted dark:text-muted-dark dark:hover:text-neutral-400 text-xs sm:text-sm"
                  href={link.href}
                >
                  {link.name}
                </Link>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
