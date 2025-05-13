"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { AnyCalculator } from "@/app/types/calculator"

export function AsideContent({
    categorySlug,
    relatedCalculators,
    citySlug,
    calculatorName
}: {
    categorySlug: string
    relatedCalculators: AnyCalculator[]
    citySlug?: string,
    calculatorName: string
}) {
    const pathname = usePathname()

    const shareUrl =
        typeof window !== "undefined"
            ? window.location.href
            : `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}`
        ;
    ;

    const shareText = `Check out this ${calculatorName}!`
    
    const socialLinks: Record<string, string> = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl
        )}`,
        X: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            shareUrl
        )}&text=${encodeURIComponent(shareText)}`,
        pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
            shareUrl
        )}&description=${encodeURIComponent(shareText)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            shareUrl
        )}`,
        reddit: `https://reddit.com/submit?url=${encodeURIComponent(
            shareUrl
        )}&title=${encodeURIComponent(shareText)}`,
        messenger: `https://www.facebook.com/dialog/send?link=${encodeURIComponent(
            shareUrl
        )}&app_id=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(
            shareUrl
        )}`,
    }

    const openPopup = (url: string) => {
        window.open(url, "_blank", "width=600,height=500,noopener")
    }

    return (
        <aside className="w-full xl:w-[30%] p-8 pr-4 xl:pl-12 mt-8 flex flex-col gap-8 items-start md:items-start md:flex-row md:justify-around xl:flex-col">
            <div className="flex flex-col gap-5 xl:mt-[640px] xl:mb-[290px]">
                <p className="text-gray-900 text-lg font-semibold">Share This</p>
                <div className="flex gap-4">
                    {Object.entries(socialLinks).map(([key, href]) => (
                        <button
                            key={key}
                            onClick={() => openPopup(href)}
                            aria-label={`Share on ${key}`}
                            className="cursor-pointer"
                        >
                            <Image src={`/${key}.svg`} alt={key} width={32} height={32} />
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-5 xl:mt-10">
                <p className="text-gray-900 text-lg font-semibold">
                    Explore Related Calculators
                </p>
                <ul>
                    {relatedCalculators.map((calculator) => (
                        <li key={calculator.id}>
                            <Link
                                className="text-sm lg:text-base text-blue-600 hover:text-blue-700 hover:underline"
                                href={`/${categorySlug}/${calculator.slug}/${citySlug ?? ""}`}
                            >
                                {calculator.listName}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    )
}
