import SearchForm from "./ui/components/SearchForm";

export default async function Home() {

  return (
    <div className="h-[calc(100dvh-64px)] w-full bg-[url('/homeBgImage.webp')] bg-cover bg-center relative">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-30 px-2.5 md:px-5">
        <h1 className="max-w-4xl text-center text-6xl text-white font-bold">Get Accurate Home Project Estimates in Seconds</h1>
        <p className="text-center text-xl text-gray-200">800+ home improvement calculators for remodeling, repairs, and installations. <br /> Get localized costs for materials, time, and labor in your ZIP code.</p>
        <SearchForm />
      </div>
      <div className="absolute inset-0 bg-[#1F2937]/45" />
    </div>
  )
}
