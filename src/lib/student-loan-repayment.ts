export type StudentLoanPlan =
  | "plan1"
  | "plan2"
  | "plan4"
  | "plan5"
  | "postgrad";

export interface StudentLoanPlanDetails {
  id: StudentLoanPlan;
  label: string;
  threshold: number;
  repaymentRate: number;
  interestRate: number;
  writeOffYears: number;
}

export const STUDENT_LOAN_PLANS: Record<
  StudentLoanPlan,
  StudentLoanPlanDetails
> = {
  plan1: {
    id: "plan1",
    label: "Plan 1",
    threshold: 26900,
    repaymentRate: 0.09,
    interestRate: 0.032,
    writeOffYears: 25,
  },
  plan2: {
    id: "plan2",
    label: "Plan 2",
    threshold: 29385,
    repaymentRate: 0.09,
    interestRate: 0.032,
    writeOffYears: 30,
  },
  plan4: {
    id: "plan4",
    label: "Plan 4",
    threshold: 33795,
    repaymentRate: 0.09,
    interestRate: 0.032,
    writeOffYears: 30,
  },
  plan5: {
    id: "plan5",
    label: "Plan 5",
    threshold: 25000,
    repaymentRate: 0.09,
    interestRate: 0.032,
    writeOffYears: 40,
  },
  postgrad: {
    id: "postgrad",
    label: "Postgraduate Loan",
    threshold: 21000,
    repaymentRate: 0.06,
    interestRate: 0.062,
    writeOffYears: 30,
  },
};

const PLAN_2_LOWER_INTEREST = 0.032;
const PLAN_2_UPPER_INTEREST = 0.062;
const PLAN_2_LOWER_THRESHOLD = 29385;
const PLAN_2_UPPER_THRESHOLD = 52485;

const MAX_PROJECTION_YEARS = 60;

export type StudentLoanYearStatus = "studying" | "repaying" | "paid_off";

export interface StudentLoanYear {
  calendarYear: number;
  startBalance: number;
  salary: number;
  threshold: number;
  interestRate: number;
  interest: number;
  repayment: number;
  endBalance: number;
  status: StudentLoanYearStatus;
}

export interface StudentLoanInput {
  currentBalance: number;
  currentSalary: number;
  yearGraduated: number;
  plan: StudentLoanPlan;
  salaryGrowthPercent: number;
  inflationPercent: number;
  currentYear: number;
  monthlyOverpayment: number;
}

export interface StudentLoanResult {
  finalBalance: number;
  totalRepaid: number;
  totalInterest: number;
  yearsUntilCleared: number | null;
  writtenOff: boolean;
  writtenOffAmount: number;
  writeOffCalendarYear: number;
  yearlyBreakdown: StudentLoanYear[];
}

const plan2InterestRate = (
  salary: number,
  lower: number,
  upper: number,
): number => {
  if (salary <= lower) {
    return PLAN_2_LOWER_INTEREST;
  }

  if (salary >= upper) {
    return PLAN_2_UPPER_INTEREST;
  }

  const fraction = (salary - lower) / (upper - lower);

  return (
    PLAN_2_LOWER_INTEREST +
    fraction * (PLAN_2_UPPER_INTEREST - PLAN_2_LOWER_INTEREST)
  );
};

export const computeStudentLoanRepayment = (
  input: StudentLoanInput,
): StudentLoanResult => {
  const plan = STUDENT_LOAN_PLANS[input.plan];
  const salaryGrowth = Math.max(0, input.salaryGrowthPercent) / 100;
  const inflation = Math.max(0, input.inflationPercent) / 100;
  const overpaymentAnnual = Math.max(0, input.monthlyOverpayment) * 12;
  const writeOffCalendarYear = input.yearGraduated + 1 + plan.writeOffYears;

  let balance = Math.max(0, input.currentBalance);
  let salary = Math.max(0, input.currentSalary);
  let threshold = plan.threshold;
  let plan2Lower = PLAN_2_LOWER_THRESHOLD;
  let plan2Upper = PLAN_2_UPPER_THRESHOLD;
  let calendarYear = input.currentYear;

  const breakdown: StudentLoanYear[] = [];
  let totalRepaid = 0;
  let totalInterest = 0;
  let yearsElapsed = 0;
  let yearsUntilCleared: number | null = null;

  while (
    balance > 0 &&
    calendarYear < writeOffCalendarYear &&
    yearsElapsed < MAX_PROJECTION_YEARS
  ) {
    const repaymentActive = calendarYear > input.yearGraduated;

    const interestRate =
      input.plan === "plan2"
        ? plan2InterestRate(salary, plan2Lower, plan2Upper)
        : plan.interestRate;

    const interest = balance * interestRate;

    const statutoryRepayment = repaymentActive
      ? Math.max(0, salary - threshold) * plan.repaymentRate
      : 0;

    const repayment = Math.min(
      statutoryRepayment + overpaymentAnnual,
      balance + interest,
    );

    const endBalance = Math.max(0, balance + interest - repayment);

    const status: StudentLoanYearStatus =
      endBalance === 0 ? "paid_off" : repaymentActive ? "repaying" : "studying";

    breakdown.push({
      calendarYear,
      startBalance: balance,
      salary,
      threshold,
      interestRate,
      interest,
      repayment,
      endBalance,
      status,
    });

    totalInterest += interest;
    totalRepaid += repayment;
    yearsElapsed += 1;

    if (endBalance === 0) {
      yearsUntilCleared = yearsElapsed;
      balance = 0;
      break;
    }

    balance = endBalance;
    salary = salary * (1 + salaryGrowth);
    threshold = threshold * (1 + inflation);
    plan2Lower = plan2Lower * (1 + inflation);
    plan2Upper = plan2Upper * (1 + inflation);
    calendarYear += 1;
  }

  const writtenOff = balance > 0;
  const writtenOffAmount = writtenOff ? balance : 0;

  return {
    finalBalance: 0,
    totalRepaid,
    totalInterest,
    yearsUntilCleared,
    writtenOff,
    writtenOffAmount,
    writeOffCalendarYear,
    yearlyBreakdown: breakdown,
  };
};
