"use client";

import { use, useEffect, useState } from "react";
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
        <>
            <div className="bg-white rounded-lg shadow-md flex items-center gap-2 max-w-2xl md:max-w-fit mx-auto w-full h-11 mt-4">
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
                    <SelectTrigger className="cursor-pointer w-full min-w-25 max-w-80 md:min-w-70 h-full border-r border-r-gray-300 rounded-r-none">
                        <SelectValue placeholder="Choose Project Type" />
                    </SelectTrigger>
                    <SelectContent side="bottom" className="bg-white h-45 lg:h-70">
                        {filteredCalcs.map(calculator => (
                            <SelectItem key={calculator.id} value={calculator.listName}>
                                {calculator.listName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <input
                    type="text"
                    placeholder="ZIP Code"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="text-gray-900 text-sm px-1 py-2 w-full max-w-16 md:max-w-36 focus:outline-none"
                />

                <button
                    onClick={handleSearch}
                    className="h-full w-full max-w-15 md:max-w-18 px-2 text-center bg-blue-500 hover:bg-blue-600 text-white text-xs md:text-sm font-semibold rounded-r-lg cursor-pointer transition-all duration-400"
                >
                    Search
                </button>
            </div>
            {
                errorMsg && (
                    <p className="text-red-500 text-sm font-bold py-1 px-2 bg-white rounded-sm">{errorMsg}</p>
                )
            }
        </>
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
            <SelectTrigger className="cursor-pointer w-full min-w-25 max-w-80 md:min-w-70 h-full border-r border-r-gray-300 rounded-r-none">
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