import Link from "next/link";
import React from "react";

type BreadcrumbItem = {
    name: string;
    href: string;
};

type BreadcrumbProps = {
    items: BreadcrumbItem[];
};

const Breadcrumb = ({ items }: BreadcrumbProps) => {
    return (
        <div className="flex items-center gap-4 text-xs md:text-sm text-[#2563EB] px-4 pt-6 lg:w-full lg:max-w-[875px] lg:mx-auto lg:pl-0 lg:pt-12 lg:pb-6 xl:max-w-[calc(875px+25%)]">
            {items.map((item, index) => (
                <div className="w-max flex gap-4 items-center" key={index}>
                    {index > 0 && <span className="text-[#111827]">{'>'}</span>}
                    {index === items.length - 1 ? (
                        <span className="text-[#111827]">{item.name}</span>
                    ) : (
                        <Link
                            href={item.href}
                            className="hover:text-blue-500"
                        >
                            {item.name}
                        </Link>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Breadcrumb;