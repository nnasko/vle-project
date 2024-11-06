"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/api/placeholder/32/32" alt="Avatar" />
          <AvatarFallback>AK</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1 ">
          <p className="text-sm font-medium leading-none text-black">
            Atanas Kyurchiev
          </p>
          <p className="text-sm text-neutral-400">
            Submitted Assignment: React Basics
          </p>
        </div>
        <div className="ml-auto font-medium text-emerald-600">+12 pts</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/api/placeholder/32/32" alt="Avatar" />
          <AvatarFallback>JM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none text-black">
            Joseph Mitsi
          </p>
          <p className="text-sm text-neutral-400">Completed Quiz: JavaScript</p>
        </div>
        <div className="ml-auto font-medium text-emerald-600">+15 pts</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/api/placeholder/32/32" alt="Avatar" />
          <AvatarFallback>OW</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none text-black">
            Oliver Witmond
          </p>
          <p className="text-sm text-neutral-400">
            Joined Live Session: Data Structures
          </p>
        </div>
        <div className="ml-auto font-medium text-emerald-600">+5 pts</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/api/placeholder/32/32" alt="Avatar" />
          <AvatarFallback>JA</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none text-black">
            Jack Ames
          </p>
          <p className="text-sm text-neutral-400">
            Posted in Forum: Web Design Tips
          </p>
        </div>
        <div className="ml-auto font-medium text-emerald-600">+8 pts</div>
      </div>
    </div>
  );
}
