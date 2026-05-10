// These tests pin numerical results from `@saving-tool/hmrc-income-tax`.
// If you intentionally upgrade that dependency (or HMRC bands shift),
// regenerate the expected numbers below.

import {
	type Country,
	computeTakeHome,
	DEFAULT_TAX_YEAR,
	type ScenarioResult,
	type StudentLoanPlan,
	SUPPORTED_TAX_YEARS,
	type TakeHomeInput,
	type TaxYear,
} from "./take-home-pay";

const noPension = {
	method: "net_pay",
	inputType: "percent",
	value: 0,
} as const;

function makeInput(overrides: Partial<TakeHomeInput>): TakeHomeInput {
	return {
		taxYear: "2026/27",
		country: "England/NI/Wales",
		annualGrossSalary: 0,
		annualBonus: 0,
		pension: noPension,
		studentLoanPlans: [],
		...overrides,
	};
}

describe("computeTakeHome", () => {
	it("default tax year is in the supported list", () => {
		expect(SUPPORTED_TAX_YEARS).toContain(DEFAULT_TAX_YEAR);
	});

	describe("England, 2026/27, no bonus/pension/loans", () => {
		it.each<{
			gross: number;
			expectedTakeHome: number;
			expectedIncomeTax: number;
			expectedNi: number;
			expectedPersonalAllowance: number;
		}>([
			{
				gross: 10_000,
				expectedTakeHome: 10_000,
				expectedIncomeTax: 0,
				expectedNi: 0,
				expectedPersonalAllowance: 12_570,
			},
			{
				gross: 30_000,
				expectedTakeHome: 25_120.72,
				expectedIncomeTax: 3_486,
				expectedNi: 1_393.28,
				expectedPersonalAllowance: 12_570,
			},
			{
				gross: 60_000,
				expectedTakeHome: 45_357.68,
				expectedIncomeTax: 11_432,
				expectedNi: 3_210.32,
				expectedPersonalAllowance: 12_570,
			},
			{
				gross: 150_000,
				expectedTakeHome: 91_286.68,
				expectedIncomeTax: 53_703,
				expectedNi: 5_010.32,
				expectedPersonalAllowance: 0, // fully tapered above £125,140
			},
		])("£$gross gross → take-home £$expectedTakeHome", ({
			gross,
			expectedTakeHome,
			expectedIncomeTax,
			expectedNi,
			expectedPersonalAllowance,
		}) => {
			const result = computeTakeHome(makeInput({ annualGrossSalary: gross }));

			expect(result.base.annualGross).toBe(gross);
			expect(result.base.takeHome).toBeCloseTo(expectedTakeHome, 2);
			expect(result.base.incomeTax.total).toBeCloseTo(expectedIncomeTax, 2);
			expect(result.base.nationalInsurance).toBeCloseTo(expectedNi, 2);
			expect(result.base.personalAllowance).toBe(expectedPersonalAllowance);
			// no bonus → withBonus is the same scenario reference
			expect(result.withBonus).toBe(result.base);
			expect(result.bonusNet).toBe(0);
			expect(result.regularMonthlyTakeHome).toBeCloseTo(
				result.bonusMonthTakeHome,
				6,
			);
			expect(result.regularMonthlyTakeHome).toBeCloseTo(
				expectedTakeHome / 12,
				2,
			);
		});
	});

	it("uses Scottish income-tax bands when country is Scotland", () => {
		const result = computeTakeHome(
			makeInput({ annualGrossSalary: 60_000, country: "Scotland" }),
		);

		expect(result.base.incomeTax.incomeTaxType).toBe("Scotland");
		expect(result.base.incomeTax.total).toBeCloseTo(13_198.77, 2);
		expect(result.base.nationalInsurance).toBeCloseTo(3_210.32, 2);
		expect(result.base.takeHome).toBeCloseTo(43_590.91, 2);
	});

	it("threads the tax year through to the underlying calculator", () => {
		// England bands for £60k are currently frozen across 2024/25–2026/27.
		// This test pins that fact: if HMRC changes a band, one of these will move.
		const years: TaxYear[] = ["2024/25", "2025/26", "2026/27"];
		for (const taxYear of years) {
			const result = computeTakeHome(
				makeInput({ taxYear, annualGrossSalary: 60_000 }),
			);
			expect(result.base.takeHome).toBeCloseTo(45_357.68, 2);
			expect(result.base.personalAllowance).toBe(12_570);
		}
	});

	describe("pension", () => {
		it("net_pay percent reduces income tax base and costs full gross from take-home", () => {
			const result = computeTakeHome(
				makeInput({
					annualGrossSalary: 60_000,
					pension: { method: "net_pay", inputType: "percent", value: 5 },
				}),
			);

			expect(result.base.grossPensionContribution).toBe(3_000);
			expect(result.base.pensionCostFromTakeHome).toBe(3_000);
			expect(result.base.incomeTax.total).toBeCloseTo(10_232, 2); // £1,200 less than £11,432 = 20% × £6k
			expect(result.base.nationalInsurance).toBeCloseTo(3_210.32, 2); // NI on full gross
			expect(result.base.takeHome).toBeCloseTo(43_557.68, 2);
		});

		it("net_pay amount works the same with an absolute value", () => {
			const result = computeTakeHome(
				makeInput({
					annualGrossSalary: 60_000,
					pension: { method: "net_pay", inputType: "amount", value: 4_000 },
				}),
			);

			expect(result.base.grossPensionContribution).toBe(4_000);
			expect(result.base.pensionCostFromTakeHome).toBe(4_000);
			expect(result.base.takeHome).toBeCloseTo(42_957.68, 2);
		});

		it("relief_at_source percent leaves income tax untouched and applies 0.8× cost", () => {
			const result = computeTakeHome(
				makeInput({
					annualGrossSalary: 60_000,
					pension: {
						method: "relief_at_source",
						inputType: "percent",
						value: 5,
					},
				}),
			);

			expect(result.base.grossPensionContribution).toBe(3_000);
			expect(result.base.pensionCostFromTakeHome).toBeCloseTo(2_400, 6); // 3000 × 0.8
			expect(result.base.incomeTax.total).toBeCloseTo(11_432, 2); // unchanged from no-pension £60k
			expect(result.base.takeHome).toBeCloseTo(42_957.68, 2);
		});

		it("relief_at_source amount applies 0.8× to a fixed contribution", () => {
			const result = computeTakeHome(
				makeInput({
					annualGrossSalary: 60_000,
					pension: {
						method: "relief_at_source",
						inputType: "amount",
						value: 4_000,
					},
				}),
			);

			expect(result.base.grossPensionContribution).toBe(4_000);
			expect(result.base.pensionCostFromTakeHome).toBeCloseTo(3_200, 6);
			expect(result.base.takeHome).toBeCloseTo(42_157.68, 2);
		});

		it("clamps the income-tax base when the net_pay contribution exceeds gross", () => {
			// £25k pension on a £20k salary should not throw or produce negative tax.
			const result = computeTakeHome(
				makeInput({
					annualGrossSalary: 20_000,
					pension: { method: "net_pay", inputType: "amount", value: 25_000 },
				}),
			);

			expect(result.base.incomeTax.total).toBe(0);
			expect(result.base.grossPensionContribution).toBe(25_000);
			expect(Number.isFinite(result.base.takeHome)).toBe(true);
		});
	});

	describe("student loans", () => {
		it("computes a single plan above its threshold", () => {
			const result = computeTakeHome(
				makeInput({ annualGrossSalary: 35_000, studentLoanPlans: [2] }),
			);

			expect(result.base.studentLoanRepayments[2]).toBeCloseTo(547.92, 2);
			expect(result.base.studentLoanRepayments[1]).toBe(0);
			expect(result.base.studentLoanRepayments.postgrad).toBe(0);
			expect(result.base.totalStudentLoanRepayments).toBeCloseTo(547.92, 2);
		});

		it("sums multiple plans (plan 1 + postgrad)", () => {
			const result = computeTakeHome(
				makeInput({
					annualGrossSalary: 40_000,
					studentLoanPlans: [1, "postgrad"],
				}),
			);

			expect(result.base.studentLoanRepayments[1]).toBeCloseTo(1_147.68, 2);
			expect(result.base.studentLoanRepayments.postgrad).toBeCloseTo(
				1_142.64,
				2,
			);
			expect(result.base.studentLoanRepayments[2]).toBe(0);
			expect(result.base.totalStudentLoanRepayments).toBeCloseTo(2_290.32, 2);
		});

		it("returns zero for every plan when the salary is below all thresholds", () => {
			const allPlans: StudentLoanPlan[] = [1, 2, 4, 5, "postgrad"];
			const result = computeTakeHome(
				makeInput({ annualGrossSalary: 15_000, studentLoanPlans: allPlans }),
			);

			for (const plan of allPlans) {
				expect(result.base.studentLoanRepayments[plan]).toBe(0);
			}
			expect(result.base.totalStudentLoanRepayments).toBe(0);
		});
	});

	describe("bonus", () => {
		it("computes a separate scenario for bonus and reconciles the monthly figures", () => {
			const result = computeTakeHome(
				makeInput({ annualGrossSalary: 60_000, annualBonus: 10_000 }),
			);

			expect(result.base.annualGross).toBe(60_000);
			expect(result.withBonus.annualGross).toBe(70_000);
			expect(result.withBonus.takeHome).toBeCloseTo(51_157.68, 2);
			expect(result.bonusNet).toBeCloseTo(
				result.withBonus.takeHome - result.base.takeHome,
				6,
			);
			expect(result.bonusNet).toBeCloseTo(5_800, 2);
			expect(result.regularMonthlyTakeHome).toBeCloseTo(
				result.base.takeHome / 12,
				6,
			);
			expect(result.bonusMonthTakeHome).toBeCloseTo(
				result.regularMonthlyTakeHome + result.bonusNet,
				6,
			);
		});

		it("re-runs the personal-allowance taper when a bonus crosses £100k", () => {
			// £95k salary → PA fully intact; £115k including bonus → taper kicks in.
			const result = computeTakeHome(
				makeInput({ annualGrossSalary: 95_000, annualBonus: 20_000 }),
			);

			expect(result.base.personalAllowance).toBe(12_570);
			expect(result.withBonus.personalAllowance).toBeLessThan(12_570);
			expect(result.withBonus.takeHome).toBeCloseTo(74_257.68, 2);
			expect(result.bonusNet).toBeCloseTo(8_600, 2);
		});
	});

	it("returns finite values for every numeric field of a populated scenario", () => {
		const result = computeTakeHome(
			makeInput({
				annualGrossSalary: 60_000,
				annualBonus: 5_000,
				pension: { method: "net_pay", inputType: "percent", value: 5 },
				studentLoanPlans: [2],
			}),
		);

		const numericFields: (keyof ScenarioResult)[] = [
			"annualGross",
			"takeHome",
			"personalAllowance",
			"nationalInsurance",
			"totalStudentLoanRepayments",
			"grossPensionContribution",
			"pensionCostFromTakeHome",
		];
		for (const scenario of [result.base, result.withBonus]) {
			for (const field of numericFields) {
				expect(Number.isFinite(scenario[field] as number)).toBe(true);
			}
			expect(Number.isFinite(scenario.incomeTax.total)).toBe(true);
		}
		expect(Number.isFinite(result.bonusNet)).toBe(true);
		expect(Number.isFinite(result.regularMonthlyTakeHome)).toBe(true);
		expect(Number.isFinite(result.bonusMonthTakeHome)).toBe(true);

		// Country narrowing: this scenario uses England/NI/Wales.
		const country: Country = "England/NI/Wales";
		expect(country).toBe("England/NI/Wales");
	});
});
