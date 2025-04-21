import { useEffect, useState } from "react";

interface SelectsTableProps {
    rowTitles: string[];
    columnTitles: string[];
    onSelectChange: (values: number[]) => void;
}

function SelectsTable({
    rowTitles,
    columnTitles,
    onSelectChange
}: SelectsTableProps) {
    const initialData = rowTitles.reduce<Record<string, Record<string, number>>>((acc, row) => {
        acc[row] = {};
        columnTitles.forEach((col) => {
            acc[row][col] = 0;
        });
        return acc;
    }, {});

    const [data, setData] = useState(initialData);
    const [editingCell, setEditingCell] = useState<{ row: string; col: string } | null>(null);

    const seatOptions = Array.from({ length: 10 }, (_, i) => i);

    const handleSelectChange = (row: string, col: string, newValue: string | number) => {
        setData((prevData) => ({
            ...prevData,
            [row]: {
                ...prevData[row],
                [col]: Number(newValue),
            },
        }));
    };

    useEffect(() => {
        const cleanedData = Object.fromEntries(
            Object.entries(data).map(([rowKey, rowValue]) => {
            const { "": _, ...rest } = rowValue;
            return [rowKey, rest];
            })
        );

        const valuesArray = Object.values(cleanedData)
            .flatMap(row => Object.values(row));

        onSelectChange(valuesArray);
    }
        , [data]);

    const handleCellClick = (row: string, col: string) => {
        setEditingCell({ row, col });
    };

    const handleBlur = () => {
        setEditingCell(null);
    };

    return (
        <div className="mt-4">
            <h4 className="font-bold text-gray-500">Quantity</h4>
            <table className="w-full text-center">
                <thead>
                    <tr>
                        <th className="p-2">{columnTitles[0]}</th>
                        {columnTitles.slice(1).map((col) => (
                            <th key={col} className="text-sm p-2 text-gray-700">
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rowTitles.map((row) => (
                        <tr key={row}>
                            <td className="text-sm p-2 font-bold text-gray-800 text-left whitespace-nowrap">
                                {row}
                            </td>
                            {columnTitles.slice(1).map((col) => {
                                const cellValue = data[row][col];
                                const isEditing =
                                    editingCell &&
                                    editingCell.row === row &&
                                    editingCell.col === col;

                                return (
                                    <td
                                        key={`${row}-${col}`}
                                        onClick={() => handleCellClick(row, col)}
                                        className="p-2 cursor-pointer border border-gray-300 hover:bg-gray-50 transition-colors"
                                    >
                                        {isEditing ? (
                                            <select
                                                value={cellValue}
                                                onChange={(e) =>
                                                    handleSelectChange(row, col, e.target.value)
                                                }
                                                onBlur={handleBlur}
                                                autoFocus
                                                className="border border-gray-300 rounded px-2 py-1 outline-none"
                                            >
                                                {seatOptions.map((num) => (
                                                    <option key={num} value={num}>
                                                        {num}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            cellValue
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SelectsTable;
