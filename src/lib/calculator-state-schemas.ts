import { z } from "astro/zod";

const nullableNumber = z.number().nullable();

export const takeHomePayStateSchema = z.object({
	selectedTaxYear: z.enum(["2024/25", "2025/26", "2026/27"]),
	selectedPayFrequency: z.enum(["weekly", "bi_weekly", "monthly", "annually"]),
	selectedCountry: z.enum(["England/NI/Wales", "Scotland"]),
	selectedStudentLoanPlans: z.array(
		z.union([z.literal(1), z.literal(2), z.literal(4), z.literal(5)]),
	),
	grossIncome: nullableNumber,
	pensionMethod: z.enum(["net_pay", "relief_at_source"]),
	pensionInputType: z.enum(["percent", "amount"]),
	pensionValue: nullableNumber,
	annualBonus: nullableNumber,
});

export const savingsCalculatorStateSchema = z.object({
	startingBalance: nullableNumber,
	monthlyDeposit: nullableNumber,
	annualInterestRate: nullableNumber,
	years: nullableNumber,
});

export const studentLoanRepaymentStateSchema = z.object({
	currentBalance: nullableNumber,
	yearGraduated: nullableNumber,
	plan: z.enum(["plan1", "plan2", "plan4", "plan5", "postgrad"]),
	currentSalary: nullableNumber,
	salaryGrowthPercent: nullableNumber,
	inflationPercent: nullableNumber,
});

export const calculatorStateSchemas = {
	"take-home-pay": takeHomePayStateSchema,
	"savings-calculator": savingsCalculatorStateSchema,
	"student-loan-repayment": studentLoanRepaymentStateSchema,
} as const;

export type CalculatorKey = keyof typeof calculatorStateSchemas;

export type TakeHomePayState = z.infer<typeof takeHomePayStateSchema>;
export type SavingsCalculatorState = z.infer<
	typeof savingsCalculatorStateSchema
>;
export type StudentLoanRepaymentState = z.infer<
	typeof studentLoanRepaymentStateSchema
>;
