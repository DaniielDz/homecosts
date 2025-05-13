import { FAQ } from "@/app/types/calculator";

export function FaqSection({ calculatorName, faqs }: { calculatorName: string, faqs: FAQ[] }) {

    return (
        <section className="text-base">
            <h2 className='text-[#111827] text-2xl font-bold mb-4 '>Frequently Asked Questions About {calculatorName}</h2>
            <ol>
                {faqs.map((faq, index) => (
                    <li key={index} className='mb-10 flex flex-col gap-3 text-gray-700'>
                        <h3
                            className='text-lg md:text-xl font-semibold'>
                            {faq.title}
                        </h3>
                        <p
                            className='text-base'
                            dangerouslySetInnerHTML={{ __html: faq.intro || '' }}></p>
                        <div>
                            {faq.list?.title && (
                                <h4 className='text-900 text-lg font-semibold mb-2'>
                                    {String(faq.list.title)}
                                </h4>
                            )}
                            {faq.list?.items && (
                                <ul className='list-disc list-inside pl-6 text-base'>
                                    {faq.list.items.map((item, itemIndex) => (
                                        <li
                                            className="mb-2"
                                            key={itemIndex}
                                            dangerouslySetInnerHTML={{ __html: item }
                                            }
                                        >
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <p
                            className='text-base'
                            dangerouslySetInnerHTML={{ __html: faq.outro || '' }}></p>
                    </li>
                ))}
            </ol>
        </section>
    )
}