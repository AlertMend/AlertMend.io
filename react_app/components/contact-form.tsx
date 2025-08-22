"use client"
import React, { useState } from "react";
import { Container } from "./container";
import { Heading } from "./heading";
import { Subheading } from "./subheading";
import { Button } from "./button";
import { Grid } from "./features/grid";
import { FeatureIconContainer } from "./features/feature-icon-container";
import { IconMailFilled } from "@tabler/icons-react";
import { SharedService } from "@/services/shared.service";

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    company: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const sharedService = SharedService.prototype

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();

    // Check if all fields are filled
    const isValid = Object.values(formData).every((val) => val.trim() !== '');
    if (!isValid) {
      // alert('All fields are required');
      return;
    }
    setSubmitted(true);
    sharedService.post('contact',formData).then(res=>{}).catch(()=>{})
  };

  return (
    <Container className="pt-40 pb-20 grid grid-cols-1 md:grid-cols-2 gap-10 px-6"
    data-section="Contact"
    >
      <div>
        {/* <div className="flex">
          <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
            <IconMailFilled className="h-6 w-6 text-cyan-500" />
          </FeatureIconContainer>
        </div> */}
        <Heading className="text-left">Get in Touch</Heading>
        <Subheading className="text-left text-neutral-400">
        Connect with Us, Simplify and Automate Your Kubernetes Incident Management with AlertMend
        </Subheading>

        
        <div className="text-sm mt-4">
          <p className="text-sm text-neutral-200">Support</p>
          <p className="text-sm text-neutral-400">hello@alertmend.io</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col items-start gap-4 max-w-2xl w-full mx-auto bg-gradient-to-b from-neutral-900 to-neutral-950 p-10 rounded-3xl relative overflow-hidden">
        <Grid size={20} />
        <div className="mb-4 w-full relative z-20">
          <label
            className="text-neutral-300 text-sm font-medium mb-2 inline-block"
            htmlFor="name"
          >
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={formData?.full_name}
            disabled={submitted}
            name="full_name"
            required
            onChange={handleChange}
            placeholder=""
            className="h-10 pl-4 w-full rounded-md text-sm bg-charcoal border border-neutral-800 text-white placeholder-neutral-500 outline-none focus:outline-none active:outline-none focus:ring-2 focus:ring-neutral-800"
          />
        </div>
        <div className="mb-4 w-full relative z-20">
          <label
            className="text-neutral-300 text-sm font-medium mb-2 inline-block"
            htmlFor="email"
          >
            Email Address<span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={formData?.email}
            disabled={submitted}
            name="email"
            required
            onChange={handleChange}
            placeholder=""
            className="h-10 pl-4 w-full rounded-md text-sm bg-charcoal border border-neutral-800 text-white placeholder-neutral-500 outline-none focus:outline-none active:outline-none focus:ring-2 focus:ring-neutral-800"
          />
        </div>
        <div className="mb-4 w-full relative z-20">
          <label
            className="text-neutral-300 text-sm font-medium mb-2 inline-block"
            htmlFor="company"
          >
            Company<span className="text-red-500">*</span>
          </label>
          <input
            id="company"
            type="text"
            value={formData?.company}
            disabled={submitted}
            required
            name="company"
            onChange={handleChange}
            placeholder=""
            className="h-10 pl-4 w-full rounded-md text-sm bg-charcoal border border-neutral-800 text-white placeholder-neutral-500 outline-none focus:outline-none active:outline-none focus:ring-2 focus:ring-neutral-800"
          />
        </div>
        <div className="mb-4 w-full relative z-20">
          <label
            className="text-neutral-300 text-sm font-medium mb-2 inline-block"
            htmlFor="message"
          >
            Message<span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            rows={5}
            value={formData?.message}
            disabled={submitted}
            required
            name="message"
            onChange={handleChange}
            placeholder=""
            className="pl-4 pt-4 w-full rounded-md text-sm bg-charcoal border border-neutral-800 text-white placeholder-neutral-500 outline-none focus:outline-none active:outline-none focus:ring-2 focus:ring-neutral-800"
          />
        </div>
        {
          submitted &&
          <Subheading className="text-left text-neutral-400">
          Thanks for contacting. Our team will get in touch with you soon.
          </Subheading>
        }
        {
          !submitted &&
          <Button variant="muted" type={'submit'}>Submit</Button>
        }
      </form>
    </Container>
  );
};
