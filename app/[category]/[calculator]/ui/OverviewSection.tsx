export function OverviewSection({ title, calculatorName, city, state }: { title: string, calculatorName: string, city?: string, state?: string }) {

    function fixGrammar(text: string) {
        let corrected = text.replace(/\bhow much it cost to\b/gi, 'how much it costs to')
                            .replace(/\bhow much cost to\b/gi, 'how much it costs to');
        const isGerundOrSubject = /\b(remodeling|installation|construction|staining|painting|repair|assembl(y|ing)|design|renovation)\b/i.test(title);
    
        if (isGerundOrSubject) {
          corrected = corrected.replace(/\bhow much it\b/gi, 'how much')
                              .replace(/\bcosts\?\s*$/i, '?'); // Eliminar "costs" duplicado al final
        } else {
          corrected = corrected.replace(/\bhow much\b(?! it)/gi, 'how much it')
                              .replace(/\bcosts\?\s*$/i, '?'); // Eliminar "costs" duplicado al final
        }
    
        return corrected;
      }
    
      const dynamicText = `<strong>Wondering how much ${title.toLowerCase()}${city ? ` in ${city}, ${state}` : ''}?</strong>`;

    return (
        <section className='flex flex-col gap-4 text-sm md:text-base'>
            <div>
                <p className="inline" dangerouslySetInnerHTML={{ __html: fixGrammar(dynamicText)}} />{' '}
                <p className="inline">
                    Use our free <strong>{calculatorName}</strong> to get a fast, accurate estimate based on <strong>real-time material and labor costs</strong> in your area. Whether you&apos;re budgeting for a small <strong>DIY project</strong> or <strong>hiring a professional contractor</strong>, our tool helps you plan with confidence.
                </p>
            </div>
            <div>
                <h3>Our estimates include:</h3>
                <ul className='pl-1'>
                    <li>✅ <span className='font-semibold'>Material costs</span> (low and high-end options)</li>
                    <li>✅ <span className='font-semibold'>Labor costs</span> (varies by region and complexity)</li>
                    <li>✅ <span className='font-semibold'>Total project cost range</span> for better budgeting</li>
                    <li>✅ <span className='font-semibold'>Additional factors</span> that may affect your final price</li>
                </ul>
            </div>
            <p className='font-semibold'>👇 Simply enter your details below to get an instant estimate! 👇</p>
        </section>
    )
}