"use client";

import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/ui/components/select"


export default function SearchForm() {
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [zip, setZip] = useState("");

    const handleSearch = () => {
        ({ category, type, zip });
        // Aquí podrías hacer un fetch o navegación
    };

    return (
        <div className="bg-white rounded-lg shadow-md flex items-center gap-2 max-w-2xl md:max-w-fit mx-auto w-full h-11 mt-4">
            <Select>
                <SelectTrigger className="cursor-pointer w-full min-w-25 max-w-80 md:min-w-70 h-full border-r border-r-gray-300 rounded-r-none">
                    <SelectValue className="" placeholder="Select Project Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem className="cursor-pointer" value="remodel">Remodel</SelectItem>
                    <SelectItem className="cursor-pointer" value="installation">Installation</SelectItem>
                </SelectContent>
            </Select>

            <Select>
                <SelectTrigger className="cursor-pointer w-full min-w-25 max-w-80 md:min-w-70 h-full border-r border-r-gray-300 rounded-r-none">
                    <SelectValue placeholder="Choose Project Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem className="cursor-pointer" value="remodel">Remodel</SelectItem>
                    <SelectItem className="cursor-pointer" value="installation">Installation</SelectItem>
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
                className="h-full w-full max-w-15 md:max-w-18 px-2 md:px-4 text-center bg-blue-500 hover:bg-blue-600 text-white text-xs md:text-sm font-semibold rounded-r-lg cursor-pointer transition-all duration-400"
            >
                Search
            </button>
        </div>
    );
}
