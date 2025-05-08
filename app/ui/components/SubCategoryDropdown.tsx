"use client";
import { useState } from "react";
import Link from "next/link";
import { Calculator } from "../../types/calculator";
import Image from "next/image";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion"

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
  const [activeId, setActiveId] = useState<number | null>(null);


  return (
    <div className="flex flex-col w-full">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={clsx(
          "flex items-center justify-between w-full px-8 cursor-pointer text-left",
          open ? "pt-5" : "h-16"
        )}
      >
        <h2 className="text-base text-gray-900 font-medium">
          {subCategoryName}
        </h2>
        <motion.div
          animate={{ rotate: open ? -180 : 0 }}
          transition={{ duration: 0.3 }}
          className="w-4 h-4"
        >
          <Image src="/arrow.svg" alt="arrow" width={16} height={16} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 py-6">
              {calculators.map((calculator) => (
                <div key={calculator.id} className="px-12">
                  <Link
                    href={`/${categorySlug}/${calculator.slug}`}
                    className={`transition-all duration-400 hover:text-blue-800 hover:underline ${activeId === calculator.id ? 'text-blue-900 underline' : 'text-blue-600'
                      }`}
                    onClick={() => setActiveId(calculator.id)}
                  >
                    {calculator.listName}
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
