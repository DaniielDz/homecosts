"use client";

import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/ui/components/select"
import { Category } from "@/app/types/category";
import { SubCategory } from "@/app/types/subCategory";
import { Calculator } from "@/app/types/calculator";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface SearchFormProps {
    categories: Category[];
    subcategories: SubCategory[];
}

export default function SearchForm({ categories, subcategories }: SearchFormProps) {
    const [zip, setZip] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>();
    const [selectedCalc, setSelectedCalc] = useState<string | undefined>();
    const [filteredCalcs, setFilteredCalcs] = useState<Calculator[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setSelectedCalc(undefined)
        const fetchCalculators = async () => {
            if (!selectedSubcategory) return;
            setFilteredCalcs([])

            const subcat = subcategories.find(sc => sc.name === selectedSubcategory);
            if (!subcat) return;

            const response = await fetch(`/api/calculators?subcategoryId=${subcat.id}`);
            const data = await response.json();
            if (response.ok) {
                setFilteredCalcs(data);
            } else {
                console.error("Error fetching calculators:", data.error);
            }
        };

        fetchCalculators();
    }, [selectedSubcategory])

    const router = useRouter();

    const handleSearch = async () => {
        if (!zip) return;
        if (!selectedCalc || !selectedSubcategory) {
            setErrorMsg("Please select a project type and category");
            return;
        }
        setErrorMsg(null)
        setLoading(true);

        try {
            const res = await fetch(`/api/zip?zip=${encodeURIComponent(zip)}`);
            if (!res.ok) {
                const err = await res.json();
                setErrorMsg(err.error);
                return;
            }

            const { slug } = await res.json();
            const selectedCalculator = filteredCalcs.find(calc => calc.listName === selectedCalc);
            const categorySug = categories.find(cat => cat.id === subcategories.find(subcat => subcat.id === selectedCalculator?.subcategory_id)?.category_id)?.slug;

            router.push(`/${categorySug}/${selectedCalculator?.slug}/${slug}`);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-24 flex flex-col items-center gap-2">
            <div
                className="w-full h-max md:h-11 flex flex-col md:flex-row items-center gap-2 max-w-2xl mx-auto mt-4 md:bg-white rounded-lg shadow-md md:max-w-200"
            >
                <CategorySelect
                    categories={categories}
                    subcategories={subcategories}
                    onSelect={(subcategory) => {
                        setSelectedSubcategory(subcategory);
                    }}
                />

                <Select
                    key={selectedSubcategory}
                    disabled={filteredCalcs.length === 0}
                    onValueChange={setSelectedCalc}
                    value={selectedCalc}
                >
                    <SelectTrigger
                        className={[
                            "w-full min-w-25 max-w-80 md:min-w-70 !h-11 md:h-full rounded md:rounded-r-none md:border-r md:border-gray-300",
                            "!bg-white",
                            "text-gray-900 cursor-pointer",
                            "disabled:!bg-white",
                            "disabled:text-gray-400",
                            "disabled:cursor-not-allowed",
                            "disabled:opacity-100",
                            "disabled:pointer-events-none",
                        ].join(" ")}
                    >
                        <SelectValue placeholder="Choose Project Type" />
                    </SelectTrigger>

                    <SelectContent side="bottom" className="cursor-pointer bg-white h-45 lg:h-70">
                        {filteredCalcs.map(calculator => (
                            <SelectItem className="cursor-pointer" key={calculator.id} value={calculator.listName}>
                                {calculator.listName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>


                <input
                    type="text"
                    placeholder="ZIP Code"
                    value={zip}
                    maxLength={5}
                    onChange={(e) => setZip(e.target.value)}
                    className="text-gray-900 text-sm px-4 md:px-1 py-2 w-full max-w-80 h-11 lg:h-full rounded bg-white md:max-w-36 focus:outline-none"
                />

                <button
                    onClick={handleSearch}
                    className="h-11 w-full lg:h-full flex items-center justify-center max-w-80 md:max-w-18 py-2.5 px-2 text-center bg-blue-500 hover:bg-blue-600 text-white text-base rounded md:text-sm font-semibold md:rounded-l-none md:rounded-r-lg cursor-pointer transition-all duration-400"
                >
                    Search
                </button>
            </div>
            {
                errorMsg && (
                    <p className="text-red-500 text-sm font-bold py-1 px-2 bg-white rounded-sm">{errorMsg}</p>
                )
            }
        </div>
    );
}


interface Props {
    categories: Category[];
    subcategories: SubCategory[];
    onSelect: (subcategoryName: string) => void;
}

function CategorySelect({
    categories,
    subcategories,
    onSelect,
}: Props) {
    const [open, setOpen] = useState(false);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>();
    const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null);

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);

        if (isOpen) {
            const subcat = subcategories.find(sc => sc.name === selectedSubcategory);
            if (subcat) {
                setExpandedCategoryId(subcat.category_id);
            }
        } else {
            setExpandedCategoryId(null);
        }
    };

    const handleSelectSubcategory = (subcatName: string) => {
        setSelectedSubcategory(subcatName);
        onSelect(subcatName);
        setOpen(false);
        setExpandedCategoryId(null);
    };

    const desiredOrder = ["Project Costs", "Services", "Maintenance Costs"];
    const catLabels = ["Remodeling", "Installation", "Maintenance"];

    const orderedCategories = desiredOrder
        .map(name => categories.find(c => c.name === name))
        .filter(Boolean);

    return (
        <Select
            open={open}
            onOpenChange={handleOpenChange}
            value={selectedSubcategory}
            onValueChange={handleSelectSubcategory}
        >
            <SelectTrigger className="cursor-pointer w-full min-w-25 max-w-80 md:min-w-70 !h-11 md:h-full md:border-r md:border-r-gray-300 rounded md:rounded-r-none bg-white">
                <SelectValue placeholder="Select Project Category">
                    {selectedSubcategory}
                </SelectValue>
            </SelectTrigger>


            <SelectContent className={`bg-white ${expandedCategoryId !== null ? 'h-max max-h-45 lg:max-h-70' : ''}`}>
                {expandedCategoryId === null ? (
                    orderedCategories.map((category, i) => {
                        if (!category) return null;
                        return (
                            <div
                                key={category.id}
                                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const hasSubcats = subcategories.some(sc => sc.category_id === category.id);
                                    if (hasSubcats) {
                                        setExpandedCategoryId(category.id);
                                    }
                                }}
                            >
                                {catLabels[i]}
                            </div>
                        );
                    })
                ) : (
                    <>
                        <div
                            className="cursor-pointer px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 flex gap-1 items-center"
                            onClick={() => setExpandedCategoryId(null)}
                        >
                            <ArrowLeft className="h-5" /> Back
                        </div>
                        {subcategories
                            .filter((sc) => sc.category_id === expandedCategoryId)
                            .map((subcat) => (
                                <SelectItem
                                    key={subcat.id}
                                    value={subcat.name}
                                    className="cursor-pointer pl-6"
                                >
                                    {subcat.name}
                                </SelectItem>
                            ))}
                    </>
                )}
            </SelectContent>
        </Select>
    );
}