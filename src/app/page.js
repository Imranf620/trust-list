import Navbar from "@/components/Navbar";
import Service from "@/components/Service";
import Image from "next/image";

// app/page.js
export default function HomePage() {
  return (
    <div className="flex flex-col gap-10 items-center">
    <Navbar/>
    <Image src="/header.jpeg" width={1200} height={600} className="w-[60%]" alt="Header" />
   <Service/>
    </div>
  );
}
