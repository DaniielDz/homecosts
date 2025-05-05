// app/api/zip/route.ts
import { supabase } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const zip = searchParams.get("zip");

    if (!zip) {
        return NextResponse.json(
            { error: "Missing zip parameter" },
            { status: 400 }
        );
    }

    // Ajusta el nombre de la tabla si es distinto
    const { data, error } = await supabase
        .from("zipcodes_data")
        .select("slug")
        .eq("zip_code", zip)
        .maybeSingle();

    if (error) {
        console.error("Supabase error:", error);
        return NextResponse.json(
            { error: "Database error" },
            { status: 500 }
        );
    }

    if (!data) {
        return NextResponse.json(
            { error: "ZIP code not found" },
            { status: 404 }
        );
    }

    return NextResponse.json({ slug: data.slug });
}
