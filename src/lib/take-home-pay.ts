import {
  calculateEmployeeNationalInsurance,
  calculateIncomeTax,
  calculatePersonalAllowance,
  calculateStudentLoanRepayments,
} from "@saving-tool/hmrc-income-tax";
import type {
  Country,
  EnglishIncomeTax,
  ScottishIncomeTax,
  StudentLoanPlan,
  TaxYear,
} from "@saving-tool/hmrc-income-tax/lib/types";

export type { Country, StudentLoanPlan, TaxYear };
export type IncomeTaxResult = EnglishIncomeTax | ScottishIncomeTax;
export type PensionMethod = "net_pay" | "relief_at_source";
export type PensionInputType = "percent" | "amount";

export const SUPPORTED_TAX_YEARS: TaxYear[] = ["2024/25", "2025/26", "2026/27"];
export const DEFAULT_TAX_YEAR: TaxYear = "2026/27";

export interface TakeHomeInput {
  taxYear: TaxYear;
  country: Country;
  annualGrossSalary: number;
  annualBonus: number;
  pension: {
    method: PensionMethod;
    inputType: PensionInputType;
    value: number;
  };
  studentLoanPlans: StudentLoanPlan[];
}

export interface ScenarioResult {
  annualGross: number;
  takeHome: number;
  personalAllowance: number;
  incomeTax: IncomeTaxResult;
  nationalInsurance: number;
  studentLoanRepayments: Record<StudentLoanPlan, number>;
  totalStudentLoanRepayments: number;
  grossPensionContribution: number;
  pensionCostFromTakeHome: number;
}

export interface TakeHomeResult {
  base: ScenarioResult;
  withBonus: ScenarioResult;
  bonusNet: number;
  regularMonthlyTakeHome: number;
  bonusMonthTakeHome: number;
}

const computeScenario = (
  input: TakeHomeInput,
  annualGross: number,
): ScenarioResult => {
  const grossPensionContribution =
    input.pension.inputType === "percent"
      ? annualGross * (input.pension.value / 100)
      : input.pension.value;

  const taxableIncomeForIncomeTax =
    input.pension.method === "net_pay"
      ? Math.max(0, annualGross - grossPensionContribution)
      : annualGross;

  const personalAllowance = calculatePersonalAllowance({
    taxYear: input.taxYear,
    country: input.country,
    taxableAnnualIncome: taxableIncomeForIncomeTax,
  });

  const incomeTax = calculateIncomeTax({
    taxYear: input.taxYear,
    country: input.country,
    taxableAnnualIncome: taxableIncomeForIncomeTax,
    personalAllowance,
  });

  const nationalInsurance = calculateEmployeeNationalInsurance({
    taxYear: input.taxYear,
    country: input.country,
    grossAnnualIncome: annualGross,
  });

  const studentLoanRepayments: Record<StudentLoanPlan, number> = {
    1: 0,
    2: 0,
    4: 0,
    5: 0,
    postgrad: 0,
  };

  for (const plan of input.studentLoanPlans) {
    studentLoanRepayments[plan] = calculateStudentLoanRepayments({
      taxYear: input.taxYear,
      country: input.country,
      grossAnnualIncome: annualGross,
      studentLoanPlanNo: plan,
    });
  }

  const totalStudentLoanRepayments = Object.values(
    studentLoanRepayments,
  ).reduce((a, b) => a + b, 0);

  const pensionCostFromTakeHome =
    input.pension.method === "net_pay"
      ? grossPensionContribution
      : grossPensionContribution * 0.8;

  const takeHome =
    annualGross -
    nationalInsurance -
    incomeTax.total -
    totalStudentLoanRepayments -
    pensionCostFromTakeHome;

  return {
    annualGross,
    takeHome,
    personalAllowance,
    incomeTax,
    nationalInsurance,
    studentLoanRepayments,
    totalStudentLoanRepayments,
    grossPensionContribution,
    pensionCostFromTakeHome,
  };
};

export const computeTakeHome = (input: TakeHomeInput): TakeHomeResult => {
  const base = computeScenario(input, input.annualGrossSalary);

  const withBonus =
    input.annualBonus > 0
      ? computeScenario(input, input.annualGrossSalary + input.annualBonus)
      : base;

  const bonusNet = withBonus.takeHome - base.takeHome;
  const regularMonthlyTakeHome = base.takeHome / 12;
  const bonusMonthTakeHome = regularMonthlyTakeHome + bonusNet;

  return {
    base,
    withBonus,
    bonusNet,
    regularMonthlyTakeHome,
    bonusMonthTakeHome,
  };
};
