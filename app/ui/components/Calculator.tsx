'use client';

import { AnyCalculator } from "@/app/types/calculator";
import { Button } from "./Button";
import { Input } from "./Input";
import Table from "./Table";
import Slider from "./Slider";
import SelectsTable from "./SelectsTable";
import { useEffect, useState } from "react";
import { createFunctionFromString } from "@/app/utils/createFnFromString";
import { computeQ, uc1 } from "@/app/utils/functions";
import { convertUCtoTS } from "@/app/utils/convertUC";


export default function Calculator({ calculator }: { calculator: AnyCalculator }) {
  const [zipCodeValue, setZipCodeValue] = useState<number>(10001);
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

  const fetchZipCodeValue = async () => {
    if (!zipCodeValue) {
      setError("ZIP code is required");
      return
    };
    if (zipCodeValue < 501 || zipCodeValue > 99999) {
      setError("ZIP code is not a valid number");
      return
    };

    try {
      const response = await fetch(`/api/fetchZipCode?zip=${zipCodeValue}`);
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
    const {
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
      w3,
      w4,
      hm } = calculator.variables

    const response = uc1({
      bq: qtyValue,
      fq,
      ib,
      ilp,
      num_items,
      qx,
      vmax,
      vmin,
      vq,
      w1: zipData,
      w2,
      w3,
      w4,
      hm,
      guv
    })
    const duv = guv(qtyValue)

    const finalResults = response?.filter(item => item.hi_val !== 0 && item.low_val !== 0);
    return { finalResults, duv }
  }

  const getSelectsResults = (q = calculator.variables.q, qVal = 1) => {
    try {
      const {
        lv,
        mv,
        jv,
        qu
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
            // este siempre corre, pues no depende de un array
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

      let w2 = lv[0] || calculator.variables.w2,
        p2 = mv[0] || calculator.variables.p2,
        w4 = jv[0] || calculator.variables.w4,
        qVal = calculator.variables.qVal;
      Object.entries(sliderValues).forEach(([sliderId, value]) => {
        const index = Math.min(
          Math.round(Number(value)),
          Math.max(...[lv, mv, jv].map(arr => arr.length - 1))
        );

        switch (sliderId) {
          case 'slider-1':
            w2 = lv[index];
            break;
          case 'slider-2':
            p2 = mv[index];
            break;
          case 'slider-3':
            qVal = Math.max(Number(value), 1);
            break;
          case 'slider-4':
            w4 = jv[index];
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
  }, [zipCodeValue]);

  useEffect(() => {
    if (zipData === null) return;

    if (calculator.type === "NORMAL") {
      const { finalResults, duv } = getNormalResults(calculator.functions);
      setResults(finalResults);
      setDuv(duv);
    } else if (calculator.type === "SLIDERS") {
      const results = getSlidersResults();
      setResults(results);
    } else if (calculator.type === "SELECTS_SLIDERS") {
      const { qt, rv, cv, qVal } = calculator.variables
      const { qRes, qValRes } = computeQ({
        qt, rv, cv, selectValues, qVal
      });

      const results = getSelectsResults(qRes, qValRes);
      setResults(results);
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
      if (!zipCodeValue) {
        setError("ZIP code is required");
        return;
      }
      if (zipCodeValue < 501 || zipCodeValue > 99999) {
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
    <section className='w-full md:w-max flex flex-col gap-5 py-11 px-7 bg-[#F9FAFB]'>
      <h1 className='text-[20px] font-semibold text-[#2563EB]'>Project Type: <span className='text-[#374151]'>{calculator.title}</span></h1>
      <form className='mb-[18px] flex gap-9 items-end' onSubmit={handleSumbit}>
        <Input name='zipcode' label='ZIP code' onChange={(value) => setZipCodeValue(Number(value))} initialValue={zipCodeValue} />
        {calculator.type === "NORMAL" && (
          <Input name='qty' label={calculator.qtylabel} onChange={(value) => setQtyValue(Number(value))} initialValue={qtyValue} />
        )}
        <Button />
      </form>
      {error && <p className="text-red-500 font-bold">{error}</p>}
      <Table
        items={calculator.items}
        name={calculator.title}
        type={calculator.type}
        results={results}
        inputLabel={calculator.type === "NORMAL" ? calculator.qtylabel : ""}
        qtyValue={qtyValue}
        duv={duv}
      />
      {calculator.type === "SLIDERS" && (
        <div className="flex flex-col mx-auto gap-4 w-100">
          {calculator.labels.map((label, idx) => {
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
      )}
      {calculator.type === "SELECTS_SLIDERS" && (
        <div className="flex flex-col mx-auto gap-4 w-100">
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
          <SelectsTable
            rowTitles={calculator.rowlabels}
            columnTitles={calculator.columnlabels}
            onSelectChange={handleSelectChange}
          />
        </div>
      )}

    </section>
  );
}