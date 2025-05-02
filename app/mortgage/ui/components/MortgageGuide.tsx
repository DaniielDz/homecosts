"use client"

import { JSX } from "react"

interface Section {
    title: string
    content: JSX.Element
}

const steps = [
    [{
        title: "Enter the home price",
        text: "Start by entering the total price of the home you’re planning to buy. This is the foundation for calculating your loan amount.",
    },
    {
        title: "Input your down payment",
        text: "Add the amount you plan to put down upfront. You can enter this as a dollar amount or a percentage of the home price. A larger down payment reduces your loan size and monthly payments.",
    },
    {
        title: "Choose your loan term",
        text: "Select the length of your mortgage — typically 15, 20, or 30 years. Shorter terms result in higher monthly payments but lower overall interest paid.",
    },
    {
        title: "Enter your interest rate",
        text: "Input your estimated mortgage interest rate. This will determine how much interest you’ll pay each month and over the life of the loan.",
    }],
    [
        {
            title: "Principal",
            text: "This is the portion of your payment that goes toward reducing the original loan balance. Over time, more of your payment will go toward principal as your loan matures.",
        },
        {
            title: "Interest",
            text: "Interest is the cost of borrowing money from your lender. It’s calculated based on your loan balance and interest rate. Early in the loan, a larger share of your payment goes toward interest.",
        },
        {
            title: "Property Taxes",
            text: "Local governments charge property taxes based on your home’s assessed value. These are typically collected monthly by your lender and held in an escrow account, then paid on your behalf when due.",
        },
        {
            title: "Homeowners Insurance",
            text: "Most lenders require you to carry homeowners insurance. This protects your property from risks like fire, theft, or storm damage. Premiums are usually paid monthly into escrow.",
        },
        {
            title: "Private Mortgage Insurance (PMI)",
            text: "If your down payment is less than 20%, you may be required to pay PMI. This protects the lender in case of default and is added to your monthly payment until you reach sufficient equity.",
        },
        {
            title: "HOA Fees (if applicable)",
            text: "If your home is part of a homeowners association, you'll need to pay monthly or quarterly HOA dues. These cover community amenities, maintenance, and services, and may be included in your monthly payment depending on your lender setup.",
        },
    ],
    [
        {
            title: "Estimate your monthly payment with confidence",
            text: "Get a quick snapshot of what you can expect to pay each month based on current interest rates, your loan amount, and down payment. This helps you plan your budget before committing to a property or lender.",
        },
        {
            title: "Compare multiple loan scenarios",
            text: "Test different combinations of home prices, down payments, loan terms, and interest rates. See how a 15-year mortgage compares to a 30-year option or how a slightly higher down payment can lower your monthly costs.",
        },
        {
            title: "Understand the total cost of the loan",
            text: "Mortgage calculators break down your monthly payment into principal, interest, taxes, insurance, and other costs. This full-picture view ensures there are no surprises when it comes to affordability.",
        },
        {
            title: "Localize your estimate using ZIP code",
            text: "By entering your ZIP code, you can get more accurate estimates that reflect local property tax rates and insurance costs. This is especially helpful if you’re comparing homes in different cities or states.",
        },
        {
            title: "Plan ahead for long-term affordability",
            text: "Use the calculator to project how your payments will change over time. This is particularly useful for budgeting future expenses, savings goals, and long-term homeownership plans.",
        },
    ],
    [
        {
            title: "Start with your income",
            text: "Your gross monthly income (before taxes) is the foundation of your affordability estimate. Most lenders recommend that your total monthly housing expenses not exceed 28% to 31% of your gross income.",
        },
        {
            title: "Factor in your monthly debts",
            text: "Your debt-to-income (DTI) ratio plays a big role in how much you can borrow. This includes car loans, student loans, credit cards, and any other recurring obligations. Most lenders look for a DTI below 43%, including your future mortgage payment.",
        },
        {
            title: "Consider your down payment",
            text: "A larger down payment reduces your loan amount and monthly payments. It may also help you avoid private mortgage insurance (PMI), improving affordability.",
        },
        {
            title: "Include property taxes, insurance, and fees",
            text: "Beyond the loan itself, homeownership comes with recurring costs like property taxes, homeowners insurance, and HOA fees (if applicable). A true affordability estimate should include all of these.",
        },
        {
            title: "Don’t forget your lifestyle and savings goals",
            text: "Just because a lender approves you for a certain amount doesn't mean it's right for your situation. Consider your other financial goals, like retirement, travel, or emergency savings, to determine a comfortable monthly payment.",
        },
    ],
    [
        {
            title: "Increase your down payment",
            text: "The more you put down upfront, the less you need to borrow. A larger down payment reduces your loan amount, which directly lowers your monthly principal and interest payments. It may also help you avoid private mortgage insurance (PMI).",
        },
        {
            title: "Choose a longer loan term",
            text: "Opting for a 30-year mortgage instead of a 15- or 20-year term spreads your payments over a longer period, reducing the amount you owe each month. Just keep in mind you’ll pay more interest over time.",
        },
        {
            title: "Shop around for a lower interest rate",
            text: "Interest rates can vary widely between lenders. Even a small rate reduction—like going from 7% to 6.5%—can cut your monthly payment by hundreds of dollars. Compare offers or work with a mortgage broker to find the best deal.",
        },
        {
            title: "Improve your credit score",
            text: "A higher credit score qualifies you for better interest rates. Paying down debts, avoiding new credit inquiries, and keeping utilization low can all boost your score before applying for a loan.",
        },
        {
            title: "Consider buying mortgage points",
            text: "Mortgage points are upfront fees you pay to reduce your interest rate. If you plan to stay in your home for many years, this can be a cost-effective way to lower your monthly payments.",
        },
        {
            title: "Refinance your mortgage",
            text: "Already own a home? Refinancing to a lower interest rate or longer loan term can lower your monthly payments. Just be sure to factor in closing costs and how long it’ll take to break even.",
        },
        {
            title: "Eliminate PMI (Private Mortgage Insurance)",
            text: "If your loan includes PMI, you may be able to remove it once you reach 20% equity in your home. This can lower your payment by $100 or more per month, depending on your loan size.",
        },
        {
            title: "Lower your property taxes or insurance",
            text: "Check if your home has been over-assessed and file an appeal to reduce property taxes. You can also shop around for more affordable homeowners insurance to decrease escrow-related costs.",
        },
    ],
];


const sections: Section[] = [
    {
        title: `How to calculate your payments using a mortgage calculator in ${new Date().getFullYear()}`,
        content: (
            <>
                <p className="text-sm text-gray-700 my-6">A mortgage calculator helps you estimate your monthly mortgage payments based on key financial inputs. Here&apos;s how to use it step by step:</p>
                <ol className="space-y-5">
                    {steps[0].map((step, index) => (
                        <ListItem key={index} title={`${index + 1}. ${step.title}`} text={step.text} />
                    ))}
                </ol>
                <h3 className="mt-5 text-gray-700 font-bold">Optional fields to include for even greater accuracy:</h3>
                <ul className="list-disc ml-6 font-normal">
                    <li>Property taxes – Varies by location; often based on a percentage of the home’s assessed value</li>
                    <li>Homeowners insurance – Required by lenders and varies by home type and region</li>
                    <li>HOA fees – Common in condo communities or planned developments</li>
                </ul>
                <p className="my-2">Including these optional items gives a more complete picture of your total monthly housing expense.</p>
                <h3 className="mt-5 text-gray-700 font-bold">Why use a mortgage calculator?</h3>
                <ul className="list-disc ml-6 font-normal">
                    <li>Quick results – Get immediate estimates of your monthly payments</li>
                    <li>Budget planning – Understand how much house you can afford</li>
                    <li>Scenario testing – See how different down payments, loan terms, or rates impact your budget</li>
                </ul>
                <p className="my-6">Simply enter your details above, and the calculator will instantly show your estimated monthly payment — helping you plan with confidence and make informed home-buying decisions.</p>
            </>
        ),
    },
    {
        title: "What's included in a typical mortgage payment?",
        content: (
            <>
                <p className="text-sm text-gray-700 my-6">Understanding what makes up your monthly mortgage payment is essential for accurate budgeting and financial planning. While your payment may seem like a single number, it often includes several components bundled together:</p>
                <ol className="space-y-5">
                    {steps[1].map((step, index) => (
                        <ListItem key={index} title={`${index + 1}. ${step.title}`} text={step.text} />
                    ))}
                </ol>
                <p className="my-6">By breaking down your mortgage payment into these components, you get a clearer view of where your money is going each month — and why your total payment may be higher than just the loan amount alone.</p>
            </>
        ),
    },
    {
        title: "Why use a mortgage calculator?",
        content: (
            <>
                <p className="text-sm text-gray-700 my-6">A mortgage calculator is an essential tool for anyone planning to buy a home, refinance, or simply understand their financial options. Whether you&apos;re a first-time buyer or comparing loan offers, using a calculator can help you make smarter decisions — fast.</p>
                <ol className="space-y-5">
                    {steps[2].map((step, index) => (
                        <ListItem key={index} title={`${index + 1}. ${step.title}`} text={step.text} />
                    ))}
                </ol>
                <p className="text-sm text-gray-700 my-6">A mortgage calculator gives you instant answers, saves time, and removes the guesswork from one of the biggest financial decisions you&apos;ll ever make. Simply enter your details above to get started — and take control of your home financing journey with clarity and confidence.</p>
            </>
        ),
    },
    {
        title: "How much house can I afford?",
        content: (
            <>
                <p className="text-sm text-gray-700 my-6">Knowing how much house you can afford is one of the most important steps in the homebuying process. It ensures you shop within your budget, avoid surprises, and make confident financial decisions based on your income, debt, and long-term goals.</p>
                <ol className="space-y-5">
                    {steps[3].map((step, index) => (
                        <ListItem key={index} title={`${index + 1}. ${step.title}`} text={step.text} />
                    ))}
                </ol>
                <p className="text-sm text-gray-700 my-6">Using a mortgage affordability calculator can quickly crunch these numbers and help you understand your realistic price range. It’s the easiest way to set a smart homebuying budget — before you start touring properties or applying for pre-approval.</p>
            </>
        ),
    },
    {
        title: "How can I lower my monthly mortgage payment?",
        content: (
            <>
                <p className="text-sm text-gray-700 my-6">If your mortgage payments feel too high—or you’re planning ahead and want to reduce costs—there are several smart strategies that can help lower your monthly mortgage bill. Even small adjustments can lead to significant savings over time.</p>
                <ol className="space-y-5">
                    {steps[4].map((step, index) => (
                        <ListItem key={index} title={`${index + 1}. ${step.title}`} text={step.text} />
                    ))}
                </ol>
                <p className="text-sm text-gray-700 my-6">By combining several of these strategies, you can significantly reduce your monthly mortgage payment and free up more room in your budget. Use our mortgage calculator above to test different scenarios and instantly see how each change could impact your payment.</p>
            </>
        ),
    },
]

export default function MortgageGuide() {
    return (
        <div className="w-full max-w-[800px]">
            {sections.map((section, index) => (
                <div key={index}>
                    <h2 className="text-xl font-bold text-gray-900 mt-6">{section.title}</h2>
                    <div className="text-gray-700 text-sm leading-6">{section.content}</div>
                </div>
            ))}
        </div>
    )
}

function ListItem({ title, text }: { title: string, text: string }) {
    return (
        <li className="text-gray-700 text-sm">
            <h3 className="font-bold">{title}</h3>
            <p>{text}</p>
        </li>
    )
}