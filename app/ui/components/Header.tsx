"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState } from "react";

export default function Header() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const toggleMenu = () => {
        setOpen((prev) => !prev);
    };

    return (
        <header className="w-full h-16 px-4 py-2.5 flex items-center justify-between md:justify-start gap-11 bg-[#1F2937] relative xl:pl-12">
            <Link href="/">
                <Image
                    src="/logo.svg"
                    alt="HomeCosts Logo"
                    width={81}
                    height={44}
                    className="logo-image"
                />
            </Link>
            <button className="md:hidden" onClick={toggleMenu}>
                <Image className={clsx(open ? "hidden" : "block")} src={"/bars.svg"} alt="Bars" width={32} height={32} />
                <Image className={clsx(open ? "block" : "hidden")} src={"/cross.svg"} alt="Cross" width={32} height={32} />
            </button>
            <div
                className={clsx(
                    "font-medium text-sm gap-7 flex-col md:flex md:flex-row md:relative md:rounded-none md:top-0 md:p-0 z-50",
                    open
                        ? "flex absolute top-16 right-0 z-20 p-2 bg-inherit rounded-b-md"
                        : "hidden"
                )}
            >
                {[
                    { href: "/project_costs", label: "Remodeling Calculators" },
                    { href: "/services", label: "Installation Calculators" },
                    { href: "/maintenance_costs", label: "Maintenance Calculators" },
                    { href: "/mortgage", label: "Mortgage Calculator" },
                ].map(({ href, label }) => (
                    <Link
                        key={href}
                        href={href}
                        onClick={() => open && toggleMenu()}
                        className={clsx(
                            "transition-colors duration-200 px-2 py-1 rounded",
                            "hover:text-white hover:bg-gray-600 md:hover:bg-transparent",
                            "active:text-white active:bg-gray-700",
                            pathname === href ? "text-white" : "text-gray-400"
                        )}
                    >
                        {label}
                    </Link>
                ))}
            </div>
        </header>
    );
}
