import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-neutral-800 h-full  border-r-[#473BF0] border-r-2">
      <div className="flex flex-col items-center p-4">
        <div className="flex flex-row gap-2 text-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-pencil rounded-full border-2 mb-2 border-black bg-white contain-content"
          >
            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
            <path d="m15 5 4 4" />
          </svg>
          <a href="/" className="font-bold text-center text-white mt-0.5">
            AAA<span className=" font-extralight">+ College</span>
          </a>
        </div>
        <Separator orientation="horizontal" className="mx-auto w-32" />
        <div className="flex flex-row items-start mt-6 gap-2 text-white">
          <Avatar className="rounded-md">
            <AvatarImage src="https://i.seadn.io/gae/jCQAQBNKmnS_AZ_2jTqBgBLIVYaRFxLX6COWo-HCHrYJ1cg04oBgDfHvOmpqsWbmUaSfBDHIdrwKtGnte3Ph_VwQPJYJ6VFtAf5B?auto=format&dpr=1&w=1000"></AvatarImage>
          </Avatar>
          <p className="text-sm font-bold flex flex-col">
            <span className="text-lg font-light">WELCOME,</span> John Doe
          </p>
        </div>
      </div>
      <Separator
        orientation="horizontal"
        className="w-full h-0.5 bg-[#473BF0]"
      />

      <div className="flex flex-col items-center p-4 gap-8">
        <Button
          asChild
          className="text-white font-bold text-lg bg-neutral-800"
          variant={"default"}
        >
          <Link href={"staff"}>STAFF</Link>
        </Button>
        <Separator
          orientation="horizontal"
          className="w-32 h-0.5 bg-[#6665DD]"
        />
        <Button
          asChild
          className="text-white font-bold text-lg bg-neutral-800"
          variant={"default"}
        >
          <Link href={"students"}>STUDENTS</Link>
        </Button>
        <Separator
          orientation="horizontal"
          className="w-32 h-0.5 bg-[#6665DD]"
        />
        <Button
          asChild
          className="text-white font-bold text-lg bg-neutral-800"
          variant={"default"}
        >
          <Link href={"timetable"}>TIMETABLE</Link>
        </Button>
        <Separator
          orientation="horizontal"
          className="w-32 h-0.5 bg-[#6665DD]"
        />
      </div>
    </nav>
  );
};

export default Navbar;
