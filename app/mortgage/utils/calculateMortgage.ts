export interface MortgageInputs {
  price: number
  downPayment: number    // amount
  termYears: number      // in years
  annualRate: number     // as percent (e.g. 6.333)
  taxes: number          // monthly
  insurance: number      // monthly
  hoaFees: number        // monthly

  // Extras
  startDate: string      // YYYY-MM for schedule start
  extraMonthly?: number  // additional monthly payment
  extraYearly?: number   // additional yearly payment on anniversary
  oneTimeAmount?: number // one-time extra payment amount
  oneTimeDate?: string   // YYYY-MM when one-time payment occurs
}

export interface ScheduleEntry {
  date: string          // YYYY-MM
  principal: number     // total principal paid this month (scheduled + extras)
  interest: number      // interest paid this month
  balance: number       // remaining balance after payment
}

/** Datos para Pie Chart */
export interface PieDatum {
  name: string
  value: number
  fill: string
}

/** Datos para Line Chart */
export interface LineDatum {
  date: string
  principalPaid: number  // cumulative principal paid up to this date
  interestPaid: number   // cumulative interest paid up to this date
  loanBalance: number
}

export interface Summary {
  loanAmount: number
  totalInterest: number
  totalCost: number
  payoffDate: string
}

export interface MortgageResults {
  monthlyPaymentPI: number
  paymentBreakdown: {
    principalInterest: number
    propertyTax: number
    insurance: number
    hoaFees: number
    totalMonthly: number
  }
  pieChartData: PieDatum[]
  lineChartData: LineDatum[]
  amortizationSchedule: ScheduleEntry[]
  summary: Summary
}

export function calculateMortgageResults(
  inputs: MortgageInputs
): MortgageResults {
  const {
    price,
    downPayment,
    termYears,
    annualRate,
    taxes,
    insurance,
    hoaFees,
    startDate,
    extraMonthly = 0,
    extraYearly = 0,
    oneTimeAmount = 0,
    oneTimeDate,
  } = inputs

  // Base loan calculation
  const loanAmount = price - downPayment
  const monthlyRate = annualRate / 100 / 12
  const n = termYears * 12
  const monthlyPI = monthlyRate * loanAmount / (1 - Math.pow(1 + monthlyRate, -n))

  // Prepare schedule loop starting at startDate
  const [startYear, startMonth] = startDate.split('-').map((v) => parseInt(v, 10))
  let balance = loanAmount
  const schedule: ScheduleEntry[] = []

  for (let i = 0; i < n; i++) {
    const monthIndex = startMonth - 1 + i
    const year = startYear + Math.floor(monthIndex / 12)
    const month = (monthIndex % 12) + 1
    const ym = `${year}-${String(month).padStart(2, '0')}`

    const interest = balance * monthlyRate
    const principalScheduled = monthlyPI - interest

    // Extras
    const extraAnniversary = (month === startMonth) ? extraYearly : 0
    const extraOneTime = oneTimeDate === ym ? oneTimeAmount : 0
    const totalExtra = extraMonthly + extraAnniversary + extraOneTime

    const principalTotal = principalScheduled + totalExtra
    balance = Math.max(balance - principalTotal, 0)

    schedule.push({
      date: ym,
      principal: principalTotal,
      interest,
      balance,
    })
  }

  // Summary
  const totalInterest = schedule.reduce((sum, e) => sum + e.interest, 0)
  const payoffEntry = schedule[schedule.length - 1]
  const payoffDate = new Date(`${payoffEntry.date}-01`).toLocaleString('en-US', {
    month: 'short', year: 'numeric'
  })
  const summary: Summary = {
    loanAmount,
    totalInterest,
    totalCost: loanAmount + totalInterest,
    payoffDate,
  }

  // Pie chart data: monthly payment breakdown
  const pieChartData: PieDatum[] = [
    { name: 'Principal & interest', value: monthlyPI, fill: '#2B7FFF' },
    { name: 'Property tax',         value: taxes,      fill: '#8E51FF' },
    { name: 'Insurance',            value: insurance,  fill: '#00C950' },
    { name: 'HOA fees',             value: hoaFees,    fill: '#00b8db' },
  ]

  // Line chart data: cumulative principal, cumulative interest, balance
  let cumPrincipal = 0
  let cumInterest = 0
  const lineChartData: LineDatum[] = schedule.map((e) => {
    cumPrincipal += e.principal
    cumInterest += e.interest
    return {
      date: e.date,
      principalPaid: parseFloat(cumPrincipal.toFixed(2)),
      interestPaid: parseFloat(cumInterest.toFixed(2)),
      loanBalance: parseFloat(e.balance.toFixed(2)),
    }
  })

  return {
    monthlyPaymentPI: monthlyPI,
    paymentBreakdown: {
      principalInterest: monthlyPI,
      propertyTax: taxes,
      insurance,
      hoaFees,
      totalMonthly: monthlyPI + taxes + insurance + hoaFees,
    },
    pieChartData,
    lineChartData,
    amortizationSchedule: schedule,
    summary,
  }
}
