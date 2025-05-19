import { supabase } from "@/app/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const subCatId = parseInt(searchParams.get("subcategoryId") || "");

    if (!subCatId) {
        return NextResponse.json(
            { error: "Missing categoryId parameter" },
            { status: 400 }
        );
    }
    const { data: calculators, error } = await supabase
        .from("calculators")
        .select("*")
        .eq("subcategory_id", subCatId)
        .order("listName");

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json(calculators);
}
