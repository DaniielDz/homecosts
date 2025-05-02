"use client"

import React, { useState, useEffect } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineDatum } from "../../utils/calculateMortgage"
import { formatNumber } from "../../utils/formatNumber"

export interface Series {
  key: string
  label: string
  color: string
}

export interface InteractiveLineChartProps {
  data: LineDatum[]
  xKey: string
  series: Series[]
  tickIntervalMonths?: number
}

export function LinealChart({
  data,
  xKey,
  series,
  tickIntervalMonths = 12,
}: InteractiveLineChartProps) {
  const [activeIdx, setActiveIdx] = useState(data.length - 1)

  // Reset active index when data changes
  useEffect(() => {
    setActiveIdx(data.length - 1)
  }, [data])

  // Clamp index in range
  const idx = Math.max(0, Math.min(activeIdx, data.length - 1))
  const active = data[idx] || { date: "", principalPaid: 0, interestPaid: 0, loanBalance: 0 }

  // Compute ticks
  const ticks = data
    .map((_, i) => i)
    .filter(i => i % tickIntervalMonths === 0)
    .map(i => data[i][xKey as keyof LineDatum])

  // Format active date
  const activeDate = active.date
    ? new Date(`${active.date}-01`).toLocaleString("en-US", { month: "long", year: "numeric" })
    : ""

  return (
    <div>
      <Card className="border-none p-0 shadow-none">
        <CardContent className="p-0">
          <ChartContainer className="w-full h-64" config={{}}>
            <LineChart
              data={data}
              margin={{ left: 12, right: 12 }}
              onMouseMove={e => {
                if (e && typeof e.activeTooltipIndex === 'number') {
                  setActiveIdx(e.activeTooltipIndex)
                }
              }}
              onMouseLeave={() => setActiveIdx(data.length - 1)}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={xKey}
                ticks={ticks}
                axisLine={false}
                tickLine={false}
                tickFormatter={val => (typeof val === 'string' ? val.split('-')[0] : String(val))}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tickFormatter={(value: number) => {
                  if (value >= 1000) {
                    const v = value / 1000
                    const formatted = Number.isInteger(v) ? v.toString() : v.toFixed(1)
                    return `$${formatted}k`
                  }
                  return `$${value}`
                }}
              />
              <ChartTooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null

                  return (
                    <div className="bg-white rounded-md shadow-md p-3 text-sm text-gray-900 space-y-2">
                      {payload.map((entry: any) => {
                        const serie = series.find(s => s.key === entry.dataKey)
                        return (
                          <div key={entry.dataKey} className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: serie?.color }} />
                              <span>{serie?.label}</span>
                            </div>
                            <span className="font-medium">${formatNumber(Number(entry.value), 2)}</span>
                          </div>
                        )
                      })}
                    </div>
                  )
                }} />
              
              {series.map(s => (
                <Line
                  key={s.key}
                  dataKey={s.key}
                  name={s.label}
                  stroke={s.color}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Interactive panel */}
      <div className="mt-4 w-full max-w-md mx-auto bg-white ">
        <div className="px-4 py-2 mt-6 mb-2 text-sm text-right text-gray-900 font-semibold">
          As of {activeDate}
        </div>
        <ul className="flex flex-col gap-4">
          {series.map(s => (
            <li key={s.key} className="flex justify-between px-4 py-2 items-center">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-sm text-gray-900">{s.label}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                ${formatNumber(Number(active[s.key as keyof LineDatum]), 2)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
