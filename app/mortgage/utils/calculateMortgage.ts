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

export interface YearlySummary {
  year: number
  principal: number   // suma de principal pagado en ese año
  interest: number    // suma de interés pagado en ese año
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
  amortizationSchedule: ScheduleEntry[]    // pagos mes a mes
  annualSummary: YearlySummary[]          // resumen por año
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

  // Preparar el bucle de amortización
  const [startYear, startMonth] = startDate.split('-').map((v) => parseInt(v, 10))
  let balance = loanAmount

  const schedule: ScheduleEntry[] = []

  for (let i = 0; i < n; i++) {
    const monthIndex = startMonth - 1 + i
    const year = startYear + Math.floor(monthIndex / 12)
    const month = (monthIndex % 12) + 1
    const ym = `${year}-${String(month).padStart(2, '0')}`

    // intereses y principal programado este mes
    const interestThisMonth = balance * monthlyRate
    const principalScheduled = monthlyPI - interestThisMonth

    // extras
    const extraAnniversary = month === startMonth ? extraYearly : 0
    const extraOneTime = oneTimeDate === ym ? oneTimeAmount : 0
    const totalExtra = extraMonthly + extraAnniversary + extraOneTime

    // principal total este mes
    const principalThisMonth = principalScheduled + totalExtra

    // actualizar balance
    balance = Math.max(balance - principalThisMonth, 0)

    // guardo solo lo pagado este mes
    schedule.push({
      date: year + '-' + String(month).padStart(2, '0'),
      principal: parseFloat(principalThisMonth.toFixed(2)),
      interest: parseFloat(interestThisMonth.toFixed(2)),
      balance: parseFloat(balance.toFixed(2)),
    })
  }

  // Construir resumen anual (suma mes a mes)
  const yearlyMap = new Map<number, { principal: number; interest: number }>()
  schedule.forEach(({ date, principal, interest }) => {
    const y = parseInt(date.slice(0, 4), 10)
    if (!yearlyMap.has(y)) {
      yearlyMap.set(y, { principal: 0, interest: 0 })
    }
    const entry = yearlyMap.get(y)!
    entry.principal += principal
    entry.interest += interest
  })
  const annualSummary: YearlySummary[] = Array.from(yearlyMap.entries())
    .map(([year, { principal, interest }]) => ({
      year,
      principal: parseFloat(principal.toFixed(2)),
      interest: parseFloat(interest.toFixed(2)),
    }))
    .sort((a, b) => a.year - b.year)

  // Summary general
  const totalInterest = annualSummary.reduce((sum, y) => sum + y.interest, 0)
  const payoffDate = new Date(`${schedule[schedule.length - 1].date}-01`)
    .toLocaleString('en-US', { month: 'short', year: 'numeric' })

  const summary: Summary = {
    loanAmount,
    totalInterest,
    totalCost: loanAmount + totalInterest,
    payoffDate,
  }

  let cumPrincipal = 0
  let cumInterest = 0
  const lineChartData: LineDatum[] = schedule.map(e => {
    cumPrincipal += e.principal
    cumInterest += e.interest
    return {
      date: e.date,
      principalPaid: parseFloat(cumPrincipal.toFixed(2)),  // acumulado
      interestPaid: parseFloat(cumInterest.toFixed(2)),   // acumulado
      loanBalance: e.balance,                            // saldo restante
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
    pieChartData: [
      { name: 'Principal & interest', value: monthlyPI, fill: '#2B7FFF' },
      { name: 'Property tax', value: taxes, fill: '#8E51FF' },
      { name: 'Insurance', value: insurance, fill: '#00C950' },
      { name: 'HOA fees', value: hoaFees, fill: '#00b8db' },
    ],
    lineChartData,
    amortizationSchedule: schedule,
    annualSummary,
    summary,
  }
}
