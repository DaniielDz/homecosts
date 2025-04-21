type Item = {
    title: string;
    description: string;
}

export type Table_Item = {
    item_title: string;
    item_desc: string;
}
// type summaryItem = {
//     tag: string;
//     text: string;
// }

type summaryLink = {
    tag: string;
    url: string;
    text: string;
    afterText: string;
}

type summaryList = {
    tag: string;
    items: summaryLink[];
    // items: (summaryItem | summaryLink)[];
}

export type CalculatorVariableValue = null | string | number | string[] | number[];

export type CalculatorVariables = {
  [key: string]: CalculatorVariableValue;
};

export interface Calculator {
    id: number;
    subCategoryId: number;
    type: "NORMAL" | "SLIDERS" | "SELECTS_SLIDERS";
    name: string;
    title: string;
    slug: string;
    items: Item[] | Table_Item[];
    summarycontent: summaryList[];
    // summarycontent: (summaryItem | summaryList)[];
}

export interface NormalCalculator extends Calculator {
    type: "NORMAL";
    qtylabel: string;
    totalsLabel: string;
    avgLabel: string;
    variables: CalculatorVariables
    functions: string;
    sliders_values: {
        min: number;
        max: number;
        step: number;
        id: string;
    }[]
}

export interface SlidersCalculator extends Calculator {
    type: "SLIDERS";
    labels : string[];
    variables: CalculatorVariables
    functions: string;
    sliders_values: {
        min: number;
        max: number;
        step: number;
        id: string;
    }[];
}

export interface SelectsSlidersCalculator extends Calculator {
    type: "SELECTS_SLIDERS";
    sliderslabels : string[];
    columnlabels: string[];
    rowlabels: string[];
    variables: CalculatorVariables
    functions: string;
    sliders_values: {
        min: number;
        max: number;
        step: number;
        id: string;
    }[];
}

export type Calculators = (NormalCalculator | SlidersCalculator | SelectsSlidersCalculator)[];
export type AnyCalculator = (NormalCalculator | SlidersCalculator | SelectsSlidersCalculator);