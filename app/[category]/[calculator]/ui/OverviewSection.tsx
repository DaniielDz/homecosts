export function OverviewSection({calculatorName, city, state}: {calculatorName: string, city?: string, state?: string}) {
    return (
        <section className='flex flex-col gap-4'>
            <p>
                Wondering how much it costs to <strong>{calculatorName.replace(/calculator/i, '').trim()}{city ? ` in ${city}, ${state}` : ""}?</strong> Use our free <strong>{calculatorName}</strong> to get a fast, accurate estimate based on <strong>real-time material and labor costs</strong> in your area. Whether you&apos;re budgeting for a small <strong>DIY project</strong> or <strong>hiring a professional contractor</strong>, our tool helps you plan with confidence.
            </p>
            <div>
                <h3>Our estimates include:</h3>
                <ul className='pl-1'>
                    <li>✅ <span className='font-semibold'>Material costs</span> (low, mid, and high-end options)</li>
                    <li>✅ <span className='font-semibold'>Labor costs</span> (varies by region and complexity)</li>
                    <li>✅ <span className='font-semibold'>Total project cost range</span> for better budgeting</li>
                    <li>✅ <span className='font-semibold'>Additional factors</span> that may affect your final price</li>
                </ul>
            </div>
            <p className='font-semibold'>👇 Simply enter your details below to get an instant estimate! 👇</p>
        </section>
    )
}