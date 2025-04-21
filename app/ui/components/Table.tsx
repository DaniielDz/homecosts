import React from 'react';
import { CalcRow } from './CalcRow';
import { useState, useEffect } from 'react';
import { roundNumber, roundToTwoDecimals } from '@/app/utils/functions';

type Item = {
    item_title: string;
    item_desc: string;
}

interface TableProps {
    items: Item[],
    name: string,
    type: string,
    inputLabel?: string,
    results: Array<Record<string, string | number | string[] | number[]>>
    qtyValue?: number,
    duv?: string
}

const Table = ({ items, name, type, inputLabel, results, qtyValue, duv }: TableProps) => {
    const [checkedIndices, setCheckedIndices] = useState<Set<number>>(new Set());  
    
    useEffect(() => {
        const newIndices = new Set(items?.map((_, i) => i) || []);
        setCheckedIndices(newIndices);
    }, [items]);

    const toggleCheck = (index: number) => {
        setCheckedIndices(prev => {
            const next = new Set(prev);
            if (next.has(index)) {
                next.delete(index);
            } else {
                next.add(index);
            }
            return next;
        });
    };

    const totalLow = Array.from(checkedIndices).reduce((acc, index) => {
        return acc + (parseFloat(results[index]?.low_val as string) || 0);
    }, 0);

    const totalHigh = Array.from(checkedIndices).reduce((acc, index) => {
        return acc + (parseFloat(results[index]?.hi_val as string) || 0);
    }, 0);

    const avgLow = totalLow / qtyValue;
    const avgHigh = totalHigh / qtyValue;
    
    

    return (
        <table className="w-full md:w-[823px]  border-separate border-spacing-y-4 text-left">
            <thead>
                <tr>
                    <th className='text-[#111827] text-sm font-semibold w-[418px]'>Labor & Material Options</th>
                    <th className='text-[#374151] text-sm font-semibold w-[110px]'>Qty</th>
                    <th className='text-[#374151] text-sm font-semibold w-[110px]'>Low</th>
                    <th className='text-[#374151] text-sm font-semibold w-[110px]'>High</th>
                </tr>
            </thead>
            <tbody>
                {
                    items?.map((item, index) => (
                        <CalcRow
                            key={index}
                            index={index}
                            item={item}
                            type={type}
                            result={results[index]}
                            isChecked={checkedIndices.has(index)}
                            onCheck={() => toggleCheck(index)}
                        />
                    ))
                }
            </tbody>
            {
                type === "NORMAL" && (
                    <tbody>
                        <tr>
                            <th className='text-[#111827] text-sm font-semibold'>Total Cost to {name}</th>
                            <td className='text-[#374151] text-sm font-semibold'>{qtyValue} {duv}</td>
                            <td className='text-[#22C55E] text-sm font-semibold'>
                                ${roundNumber(totalLow)}
                            </td>
                            <td className='text-[#EF4444] text-sm font-semibold'>
                                ${roundNumber(totalHigh)}
                            </td>
                        </tr>
                        <tr>
                            <td className='text-[#6B7280] text-sm font-normal'>Average Cost Per {inputLabel}</td>
                            <td></td>
                            <td className='text-[#6B7280] text-sm font-normal'>
                                ${roundToTwoDecimals(avgLow)}
                            </td>
                            <td className='text-[#6B7280] text-sm font-normal'>
                                ${roundToTwoDecimals(avgHigh)}
                            </td>
                        </tr>
                    </tbody>
                )
            }
        </table>
    );
};

export default Table;