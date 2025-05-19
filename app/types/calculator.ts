type Item = {
    title: string;
    description: string;
}

export type Table_Item = {
    item_title: string;
    item_desc: string;
}

export type summaryLink = {
    tag: string;
    url: string;
    text: string;
    afterText: string;
}

type summaryList = {
    tag: string;
    items: summaryLink[];
}

export interface FAQ {
    title: string;
    intro?: string | TrustedHTML;
    list?: {
        title?: string | TrustedHTML;
        items: string[] | TrustedHTML[]; 
    };
    outro?: string | TrustedHTML;
}

export type CalculatorVariableValue = null | string | number | string[] | number[];

export type CalculatorVariables = {
    [key: string]: CalculatorVariableValue;
};

export interface Calculator {
    id: number;
    subcategory_id: number;
    type: "NORMAL" | "SLIDERS" | "SELECTS_SLIDERS";
    name: string;
    title: string;
    listName: string;
    slug: string;
    items: Item[] | Table_Item[];
    summarycontent: summaryList[];
    faqs: FAQ[];
    notes: string;
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
    labels: string[];
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
    sliderslabels: string[];
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