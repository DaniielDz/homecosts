// components/SubCategoryDropdown.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { Calculator } from "../../types/calculator";
import Image from "next/image";
import clsx from "clsx";

interface SubCategoryDropdownProps {
  calculators: Calculator[];
  categorySlug: string;
  subCategoryName: string;
}

export default function SubCategoryDropdown({
  calculators,
  categorySlug,
  subCategoryName,
}: SubCategoryDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={clsx("flex flex-col", open ? "h-full" : "h-16")}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={clsx("flex items-center justify-between w-full h-full px-8 cursor-pointer", open ? "pt-5" : "pt-0")}
      >
        <h2 className="text-base text-gray-900 font-medium">{subCategoryName}</h2>
        <Image src={"/arrow.svg"} alt="arrow" width={16} height={16} className={`${open ? "rotate-180" : ""} w-4 h-4`} />
      </button>
      {open && (
        <div className="space-y-2 py-6">
          {calculators.map((calculator) => (
            <div key={calculator.id} className="px-12">
              <Link
                href={`/${categorySlug}/${calculator.slug}`}
                className="text-blue-600 hover:text-blue-800 hover:underline transition-all duration-400"
              >
                {calculator.title}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
