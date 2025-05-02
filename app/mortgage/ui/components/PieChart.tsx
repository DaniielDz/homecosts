"use client"

import * as React from "react"
import { Cell, Label, Pie, PieChart, Tooltip as RechartsTooltip, TooltipProps } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { formatNumber } from "../../utils/formatNumber"

export interface PieChartTextProps {
  data: Array<{ browser: string; visitors: number; fill: string }>
  total: number
  label?: string
}

export function PieChartText({ data, total, label = "/mo" }: PieChartTextProps) {
  // Configuración de leyenda y colores
  const config = React.useMemo(() => {
    const map: Record<string, { label: string; color: string }> = {}
    data.forEach(d => {
      map[d.browser] = { label: d.browser, color: d.fill }
    })
    return map
  }, [data])

  return (
    <Card className="flex flex-col w-max h-max border-0 p-0 shadow-none">
      <CardContent className="p-0">
        <ChartContainer config={config} className="aspect-square w-64 h-64">
          <PieChart>
            <RechartsTooltip
              cursor={false}
              content={(props: TooltipProps<number, string>) => {
                const { payload } = props
                if (!payload || !payload.length) return null
                return (
                  <div className="bg-white p-2 rounded-md shadow-md">
                    {payload.map((entry, idx) => {
                      const name = entry.name as string
                      const value = entry.value as number
                      const { label: lbl } = config[name]
                      const fill = (entry.payload as { fill: string }).fill
                      return (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: fill }} />
                          <span className="text-sm text-gray-700">{lbl}:</span>
                          <span className="font-semibold text-gray-900">
                            ${formatNumber(value, 1)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )
              }}
            />
            <Pie
              data={data.map(d => ({ browser: d.browser, visitors: d.visitors, fill: d.fill }))}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              {data.map(d => (
                <Cell key={d.browser} fill={d.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-lg font-semibold text-gray-900">
                          ${formatNumber(total, 0)} <tspan className="text-sm font-normal">{label}</tspan>
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
