"use client";

import { ReactNode } from "react";
import "../app/globals.css";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  url: string;
}

export default function Button({ children, className = "", url }: ButtonProps) {
  const router = useRouter();
  return (
    <Link
      className={`box ${className} cursor-pointer`}
      // onClick={() => url && router.push(url)}
      href={url}
    >
      {children}
    </Link>
  );
}
