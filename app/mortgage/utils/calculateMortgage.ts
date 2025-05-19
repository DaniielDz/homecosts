export interface MortgageInputs {
  price: number
  downPayment: number    
  termYears: number     
  annualRate: number    
  taxes: number         
  insurance: number     
  hoaFees: number       

  startDate: string      
  extraMonthly?: number  
  extraYearly?: number   
  oneTimeAmount?: number
  oneTimeDate?: string   
}

export interface ScheduleEntry {
  date: string          
  principal: number     
  interest: number      
  balance: number       
}

export interface PieDatum {
  name: string
  value: number
  fill: string
}

export interface LineDatum {
  date: string
  principalPaid: number 
  interestPaid: number  
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
  principal: number 
  interest: number  
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
  annualSummary: YearlySummary[]        
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
  } = inputs;

  if (price <= 0 || downPayment < 0 || termYears <= 0 || annualRate < 0) {
    throw new Error("Parámetros inválidos");
  }

  const loanAmount = price - downPayment;
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = termYears * 12;

  const monthlyPI = loanAmount *
    (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  const [startYear, startMonth] = startDate.split('-').map(Number);
  const firstPaymentDate = new Date(startYear, startMonth, 1);
  firstPaymentDate.setMonth(firstPaymentDate.getMonth());

  let balance = loanAmount;
  const monthlySchedule: ScheduleEntry[] = [];
  const originalStartMonth = new Date(startYear, startMonth, 1).getMonth();

  for (let monthOffset = 0; monthOffset < totalMonths && balance > 0; monthOffset++) {
    const currentDate = new Date(firstPaymentDate);
    currentDate.setMonth(firstPaymentDate.getMonth() + monthOffset);

    const year = currentDate.getFullYear();
    const monthNumber = currentDate.getMonth() + 1;
    const ym = `${year}-${String(monthNumber).padStart(2, '0')}`;

    const interest = balance * monthlyRate;
    let scheduledPrincipal = monthlyPI - interest;
    scheduledPrincipal = Math.min(scheduledPrincipal, balance);

    const isAnniversary = currentDate.getMonth() === originalStartMonth;
    const extraAnniversary = isAnniversary ? extraYearly : 0;
    const extraOneTime = oneTimeDate === ym ? oneTimeAmount : 0;
    const totalExtra = Math.min(
      extraMonthly + extraAnniversary + extraOneTime,
      balance - scheduledPrincipal
    );

    const totalPrincipal = scheduledPrincipal + totalExtra;
    const newBalance = balance - totalPrincipal;

    monthlySchedule.push({
      date: ym,
      principal: +totalPrincipal.toFixed(2),
      interest: +interest.toFixed(2),
      balance: +newBalance.toFixed(2),
    });

    balance = newBalance;
  }

  const lastScheduleEntry = monthlySchedule[monthlySchedule.length - 1];
  const rawPayoffDate = lastScheduleEntry?.date ?? '';


  const yearMap = new Map<number, YearlySummary>();
  const lineChartData: LineDatum[] = [];

  let cumulativePrincipal = 0;
  let cumulativeInterest = 0;

  for (const entry of monthlySchedule) {
    const [yStr] = entry.date.split('-');
    const year = parseInt(yStr);

    if (!yearMap.has(year)) {
      yearMap.set(year, {
        year,
        principal: 0,
        interest: 0,
      });
    }

    const summary = yearMap.get(year)!;
    summary.principal += entry.principal;
    summary.interest += entry.interest;

    cumulativePrincipal += entry.principal;
    cumulativeInterest += entry.interest;

    lineChartData.push({
      date: entry.date,
      principalPaid: +cumulativePrincipal.toFixed(2),
      interestPaid: +cumulativeInterest.toFixed(2),
      loanBalance: entry.balance,
    });
  }

  const annualSummary: YearlySummary[] = [];
  let runningPrincipal = 0;
  let runningInterest = 0;

  for (const year of [...yearMap.keys()].sort()) {
    const summary = yearMap.get(year)!;
    runningPrincipal += summary.principal;
    runningInterest += summary.interest;

    annualSummary.push({
      year,
      principal: +runningPrincipal.toFixed(2),
      interest: +runningInterest.toFixed(2),
    });
  }

  const totalInterest = cumulativeInterest;
  const totalCost = loanAmount + totalInterest;

  const paymentBreakdown = {
    principalInterest: +monthlyPI.toFixed(2),
    propertyTax: +taxes,
    insurance: +insurance,
    hoaFees: +hoaFees,
    totalMonthly: +(monthlyPI + taxes + insurance + hoaFees).toFixed(2),
  };

  const pieChartData: PieDatum[] = [
    { name: 'Principal', value: +loanAmount.toFixed(2), fill: '#4CAF50' },
    { name: 'Interest', value: +totalInterest.toFixed(2), fill: '#F44336' },
  ];

  return {
    monthlyPaymentPI: +monthlyPI.toFixed(2),
    paymentBreakdown,
    pieChartData,
    lineChartData,
    amortizationSchedule: monthlySchedule,
    annualSummary,
    summary: {
      loanAmount: +loanAmount.toFixed(2),
      totalInterest: +totalInterest.toFixed(2),
      totalCost: +totalCost.toFixed(2),
      payoffDate: formatDateToLabel(rawPayoffDate)
    },
  };
}

function formatDateToLabel(dateStr: string): string {
  const [year, month] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}