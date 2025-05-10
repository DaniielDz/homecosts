import { FAQ } from "@/app/types/calculator";

export function FaqSection({ calculatorName, faqs }: { calculatorName: string, faqs: FAQ[] }) {

    return (
        <section>
            <h2 className='text-[#111827] text-xl md:text-2xl font-bold mb-4 '>Frequently Asked Questions About {calculatorName}</h2>
            <ol>
                {faqs.map((faq, index) => (
                    <li key={index} className='mb-10 flex flex-col gap-3 text-gray-700'>
                        <h3
                            className='text-lg font-semibold'>
                            {faq.title}
                        </h3>
                        <p
                            className='text-sm'
                            dangerouslySetInnerHTML={{ __html: faq.intro || '' }}></p>
                        <div>
                            {faq.list?.title && (
                                <h4 className='text-900 text-sm font-semibold mb-2'>
                                    {String(faq.list.title)}
                                </h4>
                            )}
                            {faq.list?.items && (
                                <ul className='list-disc list-inside pl-6 text-sm'>
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
                            className='text-sm'
                            dangerouslySetInnerHTML={{ __html: faq.outro || '' }}></p>
                    </li>
                ))}
            </ol>
        </section>
    )
}