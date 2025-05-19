type CalculatorParams = {
    bq: number;
    fq: number[];
    ib: string[];
    ilp: number[];
    num_items: number;
    qx: number;
    vmax: number[];
    vmin: number[];
    vq: number[];
    w1: number;
    w2: number;
    w3: number;
    w4: number;
    hm: number;
    guv: (x: number) => string;
};

export function uc1({
    bq,
    fq,
    ib,
    ilp,
    num_items,
    qx,
    vmax,
    vmin,
    vq,
    w1,
    w2,
    w4,
    hm,
    guv
}: CalculatorParams) {
    if (isNaN(bq)) return null;

    const results = [];
    let th = 0;
    let shi = 0;
    let slo = 0;
    let mb = false;

    const calculatedW3 = 1 + 0.15 * (w1 - 1);
    const duv = guv(bq);

    for (let i = 0; i < num_items; i++) {
        let lq = 0;
        let mq = 0;
        let vl = 0;
        let vh = 0;
        const currentIb = ib[i];

        if (ilp[i] === 0) {
            mq = Math.round(bq * vq[i] + fq[i] + qx);
            const uv = currentIb === '' ? duv : currentIb;

            vl = mq * vmin[i] * calculatedW3 * w4;
            vh = mq * vmax[i] * calculatedW3 * w4;

            results.push({
                index: i,
                mq,
                lq: 0,
                unit: uv,
                low_val: vl,
                hi_val: vh,
                type: "mq",
            });
        } else {
            if (i < num_items - 1) {
                lq = bq * vq[i] * ilp[i] + fq[i];
            } else {
                if (th <= 0 || hm <= th) {
                    lq = 0;
                } else {
                    lq = hm - th;
                    mb = true;
                }
            }

            vl = lq * vmin[i] * w1 * w2;
            vh = lq * vmax[i] * w1 * w2;

            results.push({
                index: i,
                lq,
                unit: "h",
                low_val: vl,
                hi_val: vh,
                type: "lq",
            });
        }

        const shouldAccumulate = (
            (currentIb?.includes('%') === false && results[i]?.type === "lq") ||
            mb
        );

        if (shouldAccumulate) {
            th += lq;
        }
    }


    return results

}

export function addCommas(e: string): string {
    let [x1, x2] = e.split(".");
    x2 = x2 ? "." + x2 : "";
    const regex = /(\d+)(\d{3})/;
    while (regex.test(x1)) {
        x1 = x1.replace(regex, "$1,$2");
    }
    return x1 + x2;
}

export function fornum(e: number, t: number = 2): string {
    return "$" + addCommas(e.toFixed(t));
}

export function f0(e: number): string {
    return fornum(e, 0);
}

export function f1(e: number, t: number = 1): string {
    return plainnum(e, t);
}

export function f2(e: number): string {
    return plainnum(e, 2);
}

export function plainnum(e: number, t: number = 2): string {
    return e.toFixed(t);
}

export function roundNumber(num: number): string {
    return addCommas(Math.round(num).toString());
}

export function roundToOneDecimal(num: number): number {
    return Math.round(num * 10) / 10;
}

export function roundToTwoDecimals(num: number): number {
    return Math.round(num * 100) / 100;
}


type ComputeQParams = {
    qt: number;
    rv: number[];
    cv: number[];
    selectValues: number[];
    initialQVal: number;
};

type ComputeQResult = {
    qRes: number;
    qValRes: number;
};

export function computeQ(
    params: ComputeQParams
): ComputeQResult | undefined {
    const { qt, rv, cv, selectValues, initialQVal } = params;
    
    if (qt === undefined) return undefined;

    if (qt === 1) {
        return { qRes: initialQVal, qValRes: initialQVal };
    }

    let accQ = 0;
    let accQV = 0;

    selectValues.forEach((value, idx) => {
        const pesoRv = rv[Math.floor(idx / cv.length)];
        const pesoCv = cv[idx % cv.length];
        accQ += value * pesoRv * pesoCv;
        accQV += value;
    });

    return {
        qRes: parseFloat(accQ.toFixed(2)),
        qValRes: accQV
    };
}
