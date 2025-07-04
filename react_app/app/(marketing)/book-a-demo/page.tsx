'use client'
import { AmbientColor } from "@/components/ambient-color";
import dynamic from "next/dynamic";
const BookDemo = dynamic(()=>import('./BookDemo'),{ssr:false})
export default function BookingPage() {
  return (
    <div className="relative overflow-hidden py-20">
      <AmbientColor />
      <BookDemo/>
    </div>
  );
}
