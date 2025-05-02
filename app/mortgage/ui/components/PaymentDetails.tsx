"use client"

import React, { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import clsx from "clsx"
import { formatNumber } from "../../utils/formatNumber"

interface PaymentDetailsProps {
  principal: number
  taxes: number
  setTaxes: (value: number) => void
  insurance: number
  setInsurance: (value: number) => void
  hoaFees: number
  setHoaFees: (value: number) => void
}

export function PaymentDetails({
  principal,
  taxes, setTaxes,
  insurance, setInsurance,
  hoaFees, setHoaFees,
}: PaymentDetailsProps) {
  const [expanded, setExpanded] = useState(false)

  const handleNumericInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (n: number) => void
  ) => {
    const numeric = e.target.value.replace(/\D/g, "")
    callback(numeric ? parseInt(numeric, 10) : 0)
  }

  return (
    <div className="w-full max-w-lg flex flex-col gap-3 bg-white rounded-lg divide-y divide-gray-100">
      {/* Principal & Interest */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-blue-500"></span>
          <span className="text-sm text-gray-900">Principal & interest</span>
        </div>
        <span className="text-sm font-medium text-gray-900">
          ${formatNumber(principal, 1)}
        </span>
      </div>

      {/* Property Tax */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-green-500"></span>
          <span className="text-sm text-gray-900">Property tax</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">+</span>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-500 pointer-events-none">
              $
            </span>
            <input
              type="text"
              value={formatNumber(taxes,2)}
              onChange={(e) => handleNumericInput(e, setTaxes)}
              className="w-20 pl-6 pr-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Homeowner's Insurance */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-purple-500"></span>
          <span className="text-sm text-gray-900">Homeowner’s insurance</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">+</span>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-500 pointer-events-none">
              $
            </span>
            <input
              type="text"
              value={formatNumber(insurance,2)}
              onChange={(e) => handleNumericInput(e, setInsurance)}
              className="w-20 pl-6 pr-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Additional Filters Toggle */}
      <div
        onClick={() => setExpanded((v) => !v)}
        className={clsx(
          "flex items-center justify-center gap-2 mt-3 px-4 py-3 text-sm font-medium cursor-pointer transition",
          expanded ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
        )}
      >
        Additional Filters
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </div>

      {expanded && (
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-cyan-500"></span>
            <span className="text-sm text-gray-900"> HOA fees</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">+</span>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-500 pointer-events-none">
                $
              </span>
              <input
                type="text"
                value={formatNumber(hoaFees,2)}
                onChange={(e) => handleNumericInput(e, setHoaFees)}
                className="w-20 pl-6 pr-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
