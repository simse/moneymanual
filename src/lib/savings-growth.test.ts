import {
	computeSavingsGrowth,
	type SavingsGrowthInput,
} from "./savings-growth";

describe("computeSavingsGrowth", () => {
	it("returns starting balance unchanged for 0 years", () => {
		const result = computeSavingsGrowth({
			startingBalance: 1000,
			monthlyDeposit: 100,
			annualInterestRate: 5,
			years: 0,
		});

		expect(result.finalBalance).toBe(1000);
		expect(result.startingBalance).toBe(1000);
		expect(result.totalDeposits).toBe(0);
		expect(result.totalInterest).toBe(0);
		expect(result.yearlyBreakdown).toEqual([]);
	});

	it("does nothing when rate and deposits are both zero", () => {
		const result = computeSavingsGrowth({
			startingBalance: 1000,
			monthlyDeposit: 0,
			annualInterestRate: 0,
			years: 5,
		});

		expect(result.finalBalance).toBe(1000);
		expect(result.totalDeposits).toBe(0);
		expect(result.totalInterest).toBe(0);
		expect(result.yearlyBreakdown).toHaveLength(5);
		for (const row of result.yearlyBreakdown) {
			expect(row.interest).toBe(0);
			expect(row.deposits).toBe(0);
		}
	});

	it("accumulates deposits without interest at zero rate", () => {
		const result = computeSavingsGrowth({
			startingBalance: 1000,
			monthlyDeposit: 100,
			annualInterestRate: 0,
			years: 2,
		});

		expect(result.finalBalance).toBe(3400);
		expect(result.totalDeposits).toBe(2400);
		expect(result.totalInterest).toBe(0);
		expect(result.yearlyBreakdown).toHaveLength(2);
	});

	it("matches the closed-form (1 + r)^years for a lump sum with no deposits", () => {
		const startingBalance = 10000;
		const annualRate = 0.05;
		const years = 10;

		const result = computeSavingsGrowth({
			startingBalance,
			monthlyDeposit: 0,
			annualInterestRate: annualRate * 100,
			years,
		});

		const expected = startingBalance * (1 + annualRate) ** years;
		expect(result.finalBalance).toBeCloseTo(expected, 6);
		expect(result.totalDeposits).toBe(0);
		expect(result.totalInterest).toBeCloseTo(expected - startingBalance, 6);
	});

	it("compounds a lump sum + monthly deposits across two years", () => {
		const result = computeSavingsGrowth({
			startingBalance: 1000,
			monthlyDeposit: 100,
			annualInterestRate: 5,
			years: 2,
		});

		expect(result.finalBalance).toBeCloseTo(3628.63, 2);
		expect(result.totalDeposits).toBe(2400);
		expect(result.totalInterest).toBeCloseTo(228.63, 2);
		expect(result.yearlyBreakdown).toHaveLength(2);
		expect(result.yearlyBreakdown[0].endBalance).toBeCloseTo(2282.26, 2);
		expect(result.yearlyBreakdown[1].endBalance).toBeCloseTo(3628.63, 2);
	});

	it("applies the deposit before the interest each month", () => {
		// 1 month, 100% APR, no starting balance, £100 deposit.
		// monthlyRate = 2^(1/12) - 1 ≈ 0.05946.
		// deposit-first: (0 + 100) * (1 + 0.05946) = 105.946.
		// interest-first would yield (0 + 100) = 100 with zero interest.
		const result = computeSavingsGrowth({
			startingBalance: 0,
			monthlyDeposit: 100,
			annualInterestRate: 100,
			years: 1 / 12,
		});

		expect(result.finalBalance).toBeCloseTo(105.95, 2);
		expect(result.totalInterest).toBeCloseTo(5.95, 2);
	});

	it("rolls the trailing partial year into a final breakdown row", () => {
		const result = computeSavingsGrowth({
			startingBalance: 500,
			monthlyDeposit: 50,
			annualInterestRate: 6,
			years: 2.5,
		});

		expect(result.yearlyBreakdown).toHaveLength(3);
		const finalRow = result.yearlyBreakdown[2];
		expect(finalRow.year).toBe(2.5);
		expect(finalRow.deposits).toBe(300); // 6 months × £50
		expect(finalRow.endBalance).toBeCloseTo(result.finalBalance, 6);
		expect(result.totalDeposits).toBe(1500); // 30 months × £50
	});

	it("clamps negative inputs to zero", () => {
		const result = computeSavingsGrowth({
			startingBalance: -100,
			monthlyDeposit: -50,
			annualInterestRate: -3,
			years: -1,
		});

		expect(result.startingBalance).toBe(0);
		expect(result.finalBalance).toBe(0);
		expect(result.totalDeposits).toBe(0);
		expect(result.totalInterest).toBe(0);
		expect(result.yearlyBreakdown).toEqual([]);
	});

	it("rounds the months count from years", () => {
		// 1.04 * 12 = 12.48 → rounds to 12 months → exactly one full-year row.
		const justUnder = computeSavingsGrowth({
			startingBalance: 0,
			monthlyDeposit: 100,
			annualInterestRate: 0,
			years: 1.04,
		});
		expect(justUnder.yearlyBreakdown).toHaveLength(1);
		expect(justUnder.totalDeposits).toBe(1200);

		// 1.05 * 12 = 12.6 → rounds to 13 months → year-end row + final-month row.
		const justOver = computeSavingsGrowth({
			startingBalance: 0,
			monthlyDeposit: 100,
			annualInterestRate: 0,
			years: 1.05,
		});
		expect(justOver.yearlyBreakdown).toHaveLength(2);
		expect(justOver.totalDeposits).toBe(1300);
	});

	it.each<SavingsGrowthInput>([
		{
			startingBalance: 1000,
			monthlyDeposit: 100,
			annualInterestRate: 5,
			years: 2,
		},
		{
			startingBalance: 500,
			monthlyDeposit: 50,
			annualInterestRate: 6,
			years: 2.5,
		},
		{
			startingBalance: 0,
			monthlyDeposit: 200,
			annualInterestRate: 4,
			years: 5,
		},
	])("yearly breakdown invariants hold for %o", (input) => {
		const result = computeSavingsGrowth(input);

		expect(result.yearlyBreakdown[0].startBalance).toBe(result.startingBalance);

		for (let i = 0; i < result.yearlyBreakdown.length - 1; i++) {
			const row = result.yearlyBreakdown[i];
			const next = result.yearlyBreakdown[i + 1];
			expect(next.startBalance).toBeCloseTo(row.endBalance, 8);
		}

		for (const row of result.yearlyBreakdown) {
			expect(row.endBalance).toBeCloseTo(
				row.startBalance + row.deposits + row.interest,
				6,
			);
		}

		const lastRow = result.yearlyBreakdown[result.yearlyBreakdown.length - 1];
		expect(lastRow.endBalance).toBeCloseTo(result.finalBalance, 8);

		const summedDeposits = result.yearlyBreakdown.reduce(
			(a, r) => a + r.deposits,
			0,
		);
		const summedInterest = result.yearlyBreakdown.reduce(
			(a, r) => a + r.interest,
			0,
		);
		expect(summedDeposits).toBeCloseTo(result.totalDeposits, 6);
		expect(summedInterest).toBeCloseTo(result.totalInterest, 6);
	});
});
