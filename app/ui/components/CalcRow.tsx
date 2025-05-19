import React from "react";
import { Checkbox } from "./Checkbox";
import { roundNumber, roundToOneDecimal } from "@/app/utils/functions";

interface CalcRowProps {
    item: {
        item_title: string;
        item_desc: string;
    };
    type: string;
    result: Record<string, any>;
    index: number;
    isChecked: boolean;
    onCheck: () => void;
}

export function CalcRow({
    item,
    type,
    result,
    isChecked,
    onCheck,
}: CalcRowProps) {

    if (!result) return null;

    const mode = type.toUpperCase();
    switch (mode) {
        case "NORMAL": {
            const roundedValue = result.lq != null
                ? roundToOneDecimal(result.lq)
                : undefined;

            return (
                <NormalCalcRow
                    isChecked={isChecked}
                    onCheck={onCheck}
                    item_title={item.item_title}
                    item_desc={item.item_desc}
                    result={result}
                    roundedValue={roundedValue}
                />
            );
        }
        case "SLIDERS":
            return (
                <SlidersCalcRow
                    item_title={item.item_title}
                    item_desc={item.item_desc}
                    result={result}
                />
            );
        case "SELECTS_SLIDERS":
            return (
                <SlidersCalcRow
                    item_title={item.item_title}
                    item_desc={item.item_desc}
                    result={result}
                />
            );
        default:
            return null;
    }
}

function NormalCalcRow({
    isChecked,
    onCheck,
    item_title,
    item_desc,
    result,
    roundedValue,
}: any) {
    return (
        <tr>
            <td className="flex gap-3 items-start">
                <Checkbox checked={isChecked} onChange={onCheck} />
                <ItemDesc title={item_title} desc={item_desc} />
            </td>
            <td className="pt-1 text-gray-900 text-sm md:text-base font-normal align-text-top">
                {`${result.mq ?? roundedValue} ${result.unit}`}
            </td>
            <td className="pt-1 text-gray-900 text-sm md:text-base font-normal align-text-top">
                ${roundNumber(result.low_val)}
            </td>
            <td className="pt-1 text-gray-900 text-sm md:text-base font-normal align-text-top">
                ${roundNumber(result.hi_val)}
            </td>
        </tr>
    );
}

function SlidersCalcRow({ item_title, item_desc, result }: any) {
    return (
        <tr>
            <td className="flex gap-3 items-start">
                <ItemDesc title={item_title} desc={item_desc} />
            </td>
            <td className="pt-1 text-gray-900 text-sm md:text-base font-normal align-text-top">
                {result.v11 ?? result.u11}
            </td>
            <td className="pt-1 text-gray-900 text-sm md:text-base font-normal align-text-top">
                {result.v12 ?? result.u12 ?? result.v22 ?? result.z12}
            </td>
            <td className="pt-1 text-gray-900 text-sm md:text-base font-normal align-text-top">
                {result.v13 ?? result.u13 ?? result.v23 ?? result.z13}
            </td>
        </tr>
    );
}


function ItemDesc({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="flex flex-col gap-1">
            <h4 className="text-gray-900">{title}</h4>
            <p className="text-[#6B7280] text-sm text-wrap w-54 md:w-full md:pr-11">{desc}</p>
        </div>
    )
}