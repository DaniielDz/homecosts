import { summaryLink } from "@/app/types/calculator";
import Link from "next/link";

export function ReferencesSection({ references }: { references: summaryLink[] }) {
    return (
        <section>
            <h2 className='text-[#111827] text-2xl font-bold mb-4'>References</h2>
            <ul className='list-disc pl-6'>
                {
                    references.map((reference, index) => (
                        <li key={index}>
                            <Link
                                className='text-[#2563EB] underline decoration-[#2563EB] hover:text-[#1E40AF] hover:decoration-[#1E40AF] transition-colors duration-200' 
                                href={reference.url}
                                target='_blank'>
                                {reference.text}
                            </Link>
                            {reference.afterText}
                        </li>
                    ))
                }
            </ul>
        </section>
    )
}