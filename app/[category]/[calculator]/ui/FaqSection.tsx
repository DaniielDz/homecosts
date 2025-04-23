export function FaqSection({calculatorName}: { calculatorName: string }) {

    return (
        <section>
            <h2 className='text-[#111827] text-2xl font-bold mb-4 '>Frequently Asked Questions About {calculatorName}</h2>
            <ol>
                <li>
                    <h3 className='pl-3 text-[20px] font-semibold mb-4'>1. What is the first question someone would ask?</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non nulla sit amet felis laoreet feugiat. Sed sit amet tincidunt metus, ac lobortis mi. Nunc auctor, ligula sit amet vestibulum facilisis. Ut vehicula lectus id leo lobortis, non placerat nulla egestas. Fusce feugiat, eros non ullamcorper sollicitudin.</p>
                </li>
            </ol>
        </section>
    )
}