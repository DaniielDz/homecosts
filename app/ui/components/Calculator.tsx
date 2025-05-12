'use client';

import { AnyCalculator, Table_Item } from "@/app/types/calculator";
import { Button } from "./Button";
import { Input } from "./Input";
import Table from "./Table";
import Slider from "./Slider";
import SelectsTable from "./SelectsTable";
import { useEffect, useState } from "react";
import { createFunctionFromString } from "@/app/utils/createFnFromString";
import { computeQ, uc1 } from "@/app/utils/functions";
import { CalculationResult, convertUCtoTS } from "@/app/utils/convertUC";


export default function Calculator({
  calculator,
  cityZipCode,
  onChangeQty,
  onChangeLowCost,
  onChangeHighCost,
  onChangeZipCode
}: {
  calculator: AnyCalculator,
  cityZipCode?: number
  onChangeQty: (value: number) => void,
  onChangeLowCost: (value: number | string) => void,
  onChangeHighCost: (value: number | string) => void,
  onChangeZipCode: (value: number | string) => void
}) {
  const [qtyValue, setQtyValue] = useState<number>(1);
  const [sliderValues, setSliderValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    calculator.sliders_values?.forEach((s) => { init[s.id] = s.min; });
    return init;
  });
  const [selectValues, setSelectValues] = useState<number[]>([])
  const [error, setError] = useState<string>("");
  const [zipData, setZipData] = useState<number | null>(null);
  const [results, setResults] = useState<Array<Record<string, any>>>([]);
  const [duv, setDuv] = useState<string>("");
  const [render, setRender] = useState<number>(0)

  const fetchZipCodeValue = async () => {
    if (!cityZipCode) {
      setError("ZIP code is required");
      return
    };
    if (cityZipCode < 501 || cityZipCode > 99999) {
      setError("ZIP code is not a valid number");
      return
    };

    try {
      const response = await fetch(`/api/fetchZipCode?zip=${cityZipCode}`);
      if (!response.ok) {
        const errText = await response.json();
        throw new Error(errText.error);
      }
      const data = await response.json();
      setZipData(data.value);
      setError("");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  const getNormalResults = (calculatorFN: string) => {
    const guv = createFunctionFromString(calculatorFN)
    onChangeQty(qtyValue);
    const response = uc1({
      bq: qtyValue,
      fq: Array.isArray(calculator.variables.fq) ? calculator.variables.fq.filter((item): item is number => typeof item === 'number') : [],
      ib: Array.isArray(calculator.variables.ib) ? calculator.variables.ib.filter((item): item is string => typeof item === 'string') : [],
      ilp: Array.isArray(calculator.variables.ilp) ? calculator.variables.ilp.filter((item): item is number => typeof item === 'number') : [],
      num_items: typeof calculator.variables.num_items === 'number' ? calculator.variables.num_items : 0,
      qx: typeof calculator.variables.qx === 'number' ? calculator.variables.qx : 0,
      vmax: Array.isArray(calculator.variables.vmax) ? calculator.variables.vmax.filter((item): item is number => typeof item === 'number') : [],
      vmin: Array.isArray(calculator.variables.vmin) ? calculator.variables.vmin.filter((item): item is number => typeof item === 'number') : [],
      vq: Array.isArray(calculator.variables.vq) ? calculator.variables.vq.filter((item): item is number => typeof item === 'number') : [],
      w1: zipData ?? 0,
      w2: typeof calculator.variables.w2 === 'number' ? calculator.variables.w2 : 0,
      w3: typeof calculator.variables.w3 === 'number' ? calculator.variables.w3 : 0,
      w4: typeof calculator.variables.w4 === 'number' ? calculator.variables.w4 : 0,
      hm: typeof calculator.variables.hm === 'number' ? calculator.variables.hm : 0,
      guv
    })
    const duv = guv(qtyValue)

    const finalResults = response?.filter(item => item.hi_val !== 0 && item.low_val !== 0);
    return { finalResults, duv }
  }

  const getSelectsResults = (q = calculator.variables.q, qVal = 1) => {
    onChangeQty(qVal);
    try {
      const {
        lv,
        mv,
        jv
      } = calculator.variables;

      let w2 = Array.isArray(lv) && lv.length > 0 ? lv[0] : calculator.variables.w2,
        p2 = Array.isArray(mv) && mv.length > 0 ? mv[0] : calculator.variables.p2,
        w4 = Array.isArray(jv) && jv.length > 0 ? jv[0] : calculator.variables.w4;

      Object.entries(sliderValues).forEach(([sliderId, value]) => {
        const val = Math.round(Number(value));

        switch (sliderId) {
          case 'slider-1':
            // sólo si lv es array y tiene al menos un elemento
            if (Array.isArray(lv) && lv.length > 0) {
              const idx = Math.min(val, lv.length - 1);
              w2 = lv[idx];
            }
            break;

          case 'slider-2':
            if (Array.isArray(mv) && mv.length > 0) {
              const idx = Math.min(val, mv.length - 1);
              p2 = mv[idx];
            }
            break;

          case 'slider-3':
            qVal = Math.max(Number(value), 1);
            break;

          case 'slider-4':
            if (Array.isArray(jv) && jv.length > 0) {
              const idx = Math.min(val, jv.length - 1);
              w4 = jv[idx];
            }
            break;
        }
      });


      const safeParams = {
        w1: Number(zipData) || 10001,
        w2: Number(w2),
        w4: Number(w4),
        q: Number(qVal),
        qVal: Number(qVal),
        p2: Number(p2),
      };

      const uc = convertUCtoTS(calculator.functions, calculator.variables);
      const results = uc(safeParams);
      return results;
    } catch (error) {
      console.error("Error:", {
        error,
        sliderValues,
        calculatorVars: calculator.variables,
        zipData
      });
      throw error;
    }
  }

  const getSlidersResults = () => {
    try {
      const {
        lv = [],
        mv = [],
        jv = [],
      } = calculator.variables;

      let w2 = Array.isArray(lv) && lv.length > 0 ? lv[0] : calculator.variables.w2,
        p2 = Array.isArray(mv) && mv.length > 0 ? mv[0] : calculator.variables.p2,
        w4 = Array.isArray(jv) && jv.length > 0 ? jv[0] : calculator.variables.w4,
        qVal = calculator.variables.qVal;
      Object.entries(sliderValues).forEach(([sliderId, value]) => {
        const index = Math.min(
          Math.round(Number(value)),
          Math.max(...[lv, mv, jv].map(arr => (Array.isArray(arr) ? arr.length - 1 : 0)))
        );

        switch (sliderId) {
          case 'slider-1':
            if (Array.isArray(lv)) {
              w2 = lv[index];
            }
            break;
          case 'slider-2':
            if (Array.isArray(mv)) {
              p2 = mv[index];
            }
            break;
          case 'slider-3':
            qVal = Math.max(Number(value), 1);
            onChangeQty(qVal);
            break;
          case 'slider-4':
            if (Array.isArray(jv)) {
              w4 = jv[index];
            }
            break;
        }
      });

      const safeParams = {
        w1: Number(zipData) || 10001,
        w2: Number(w2),
        w4: Number(w4),
        q: Number(qVal),
        qVal: Number(qVal),
        p2: Number(p2),
      };

      const uc = convertUCtoTS(calculator.functions, calculator.variables);
      const results = uc(safeParams);

      return results;
    } catch (error) {
      console.error("Error:", {
        error,
        sliderValues,
        calculatorVars: calculator.variables,
        zipData
      });
      throw error;
    }
  }

  useEffect(() => {
    fetchZipCodeValue();
  }, [cityZipCode]);

  useEffect(() => {
    if (zipData === null) return;

    if (calculator.type === "NORMAL") {
      const { finalResults, duv } = getNormalResults(calculator.functions);
      setResults(finalResults || []);
      const calculateTotals = (
        finalResults: Array<{
          index: number;
          mq?: number;
          lq: number;
          unit: string;
          low_val: number;
          hi_val: number;
          type: string;
        }> | undefined
      ) => {
        if (!finalResults || finalResults.length === 0) {
          return { totalLow: 0, totalHigh: 0 };
        }

        const totals = finalResults.reduce(
          (acc, item) => {
            acc.totalLow += item.low_val;
            acc.totalHigh += item.hi_val;
            return acc;
          },
          { totalLow: 0, totalHigh: 0 }
        );

        return totals;
      };

      if (render === 0) {
        const { totalLow, totalHigh } = calculateTotals(finalResults);
        onChangeLowCost((Math.round(totalLow)));
        onChangeHighCost((Math.round(totalHigh)));
        setRender(1)
      }

      setDuv(duv);
    } else if (calculator.type === "SLIDERS") {
      const res: CalculationResult = getSlidersResults();
      setResults(Array.isArray(res) ? res : [res]);

      if (render === 0) {
        onChangeLowCost(res[3].z12);
        onChangeHighCost(res[3].z13);
        setRender(1)
      }

    } else if (calculator.type === "SELECTS_SLIDERS") {
      const { qt, rv, cv, qVal } = calculator.variables
      const computeQResult = computeQ({
        qt: typeof qt === 'number' ? qt : 0, // Ensure qt is a number
        rv: Array.isArray(rv) && rv.every(item => typeof item === 'number') ? rv : [], // Ensure rv is an array of numbers
        cv: Array.isArray(cv) && cv.every(item => typeof item === 'number') ? cv : [], // Ensure cv is an array of numbers
        selectValues: selectValues ?? [], // Ensure selectValues is an array of numbers
        initialQVal: typeof qVal === 'number' ? qVal : 0, // Ensure qVal is a number
      });

      let res;

      if (computeQResult) {
        const { qRes, qValRes } = computeQResult;
        res = getSelectsResults(qRes, qValRes);
        setResults(Array.isArray(res) ? res : [res]);
      }

      if (render === 0 && res) {
        onChangeLowCost(res[3].z12);
        onChangeHighCost(res[3].z13);
        setRender(1)
      }
    }
  }, [zipData, qtyValue, selectValues, sliderValues]);


  const handleSliderChange = (id: string, value: number) => {
    setSliderValues((prev) => ({ ...prev, [id]: value }));
  };
  const handleSelectChange = (values: number[]) => {
    setSelectValues(values);
  };

  const handleSumbit = (e: React.FormEvent) => {
    e.preventDefault();

    if (calculator.type === "NORMAL") {
      if (!cityZipCode) {
        setError("ZIP code is required");
        return;
      }
      if (cityZipCode < 501 || cityZipCode > 99999) {
        setError("ZIP code is not a valid number");
        return;
      }
      if (!qtyValue) {
        setError("Quantity is required");
        return;
      }
      setQtyValue(qtyValue);
    }
  }

  return (
    <section className='w-full lg:w-max flex flex-col gap-5 py-11 px-3 md:px-7 bg-gray-50 rounded-lg shadow'>
      <h1 className='text-[20px] font-semibold text-[#2563EB]'>Project Type: <span className='text-[#374151]'>{calculator.title}</span></h1>
      <form className='w-full mb-[18px] flex gap-9 items-end flex-wrap' onSubmit={handleSumbit}>
        <Input
          name='zipcode'
          label='ZIP code'
          onChange={onChangeZipCode}
          initialValue={cityZipCode}
        />
        {calculator.type === "NORMAL" && (
          <Input name='qty' label={calculator.qtylabel} onChange={(value) => setQtyValue(Number(value))} initialValue={qtyValue} />
        )}
        <Button />
      </form>
      {error && <p className="text-red-500 font-bold">{error}</p>}
      {calculator.type === "SLIDERS" && (
        <div className="w-full flex flex-col justify-start gap-4 md:w-100">
          {calculator.sliders_values?.map((cfg, idx) => {
            const label = calculator.labels[idx] ?? "";
            return (
              <Slider
                key={cfg.id}
                label={label}
                sliderValues={cfg}
                variables={calculator.variables}
                value={sliderValues[cfg.id] ?? cfg.min}
                onChange={handleSliderChange}
              />
            );
          })}
        </div>
      )}
      {calculator.type === "SELECTS_SLIDERS" && (
        <div className="flex flex-col w-max mx-auto md:flex-row pb-8 md:gap-20 md:w-full ">
          <div>
            {calculator.sliderslabels.map((label, idx) => {
              const cfg = calculator.sliders_values[idx];

              return (
                <Slider
                  key={cfg.id}
                  label={label}
                  sliderValues={cfg}
                  variables={calculator.variables}
                  value={sliderValues[cfg.id]}
                  onChange={handleSliderChange}
                />
              );
            })}
          </div>
          <SelectsTable
            rowTitles={calculator.rowlabels}
            columnTitles={calculator.columnlabels}
            onSelectChange={handleSelectChange}
          />
        </div>
      )}
      <Table
        items={calculator.items.filter((item): item is Table_Item => 'item_title' in item && 'item_desc' in item)}
        name={calculator.title}
        type={calculator.type}
        results={results}
        inputLabel={calculator.type === "NORMAL" ? calculator.qtylabel : ""}
        qtyValue={qtyValue}
        duv={duv}
      />

    </section>
  );
}