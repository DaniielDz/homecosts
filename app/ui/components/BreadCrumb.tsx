import Link from "next/link";
import React from "react";

const Breadcrumb = ({ items }) => {
    return (
        <div className="flex items-center text-sm text-[#2563EB]">
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    {index > 0 && <span className="mx-2 text-[#111827]">{'>'}</span>}
                    {index === items.length - 1 ? (
                        <span className="text-[#111827]">{item.name}</span>
                    ) : (
                        <Link href={item.href} className="hover:text-blue-500">
                            {item.name}
                        </Link>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default Breadcrumb;