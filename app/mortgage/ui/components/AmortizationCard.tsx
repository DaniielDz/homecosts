export function AmortizationCard({ title, value }: { title: string, value: string }) {
    return (
        <div className="rounded-lg bg-white shadow-md p-6 w-max h-28 flex flex-col items-center justify-center gap-2">
            <p className="text-gray-500 text-sm md:text-base">{title}</p>
            <p className="text-gray-900 font-semibold text-2xl">{value}</p>
        </div>
    );
}