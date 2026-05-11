import {
	computeStudentLoanRepayment,
	STUDENT_LOAN_PLANS,
	type StudentLoanInput,
	type StudentLoanResult,
} from "./student-loan-repayment";

const baseInput: StudentLoanInput = {
	currentBalance: 30000,
	currentSalary: 35000,
	yearGraduated: 2020,
	plan: "plan2",
	salaryGrowthPercent: 5,
	inflationPercent: 3,
	currentYear: 2026,
	monthlyOverpayment: 0,
};

describe("computeStudentLoanRepayment", () => {
	it("returns no breakdown rows for a zero balance", () => {
		const result = computeStudentLoanRepayment({
			...baseInput,
			currentBalance: 0,
		});

		expect(result.finalBalance).toBe(0);
		expect(result.totalRepaid).toBe(0);
		expect(result.totalInterest).toBe(0);
		expect(result.yearlyBreakdown).toEqual([]);
		expect(result.writtenOff).toBe(false);
		expect(result.yearsUntilCleared).toBeNull();
	});

	it("clamps negative inputs to zero", () => {
		const result = computeStudentLoanRepayment({
			...baseInput,
			currentBalance: -5000,
			currentSalary: -100,
			salaryGrowthPercent: -1,
			inflationPercent: -2,
		});

		expect(result.yearlyBreakdown).toEqual([]);
		expect(result.totalRepaid).toBe(0);
		expect(result.totalInterest).toBe(0);
	});

	it("hits the write-off ceiling when salary is below the threshold", () => {
		const result = computeStudentLoanRepayment({
			...baseInput,
			currentBalance: 50000,
			currentSalary: 20000,
			salaryGrowthPercent: 0,
			inflationPercent: 0,
		});

		expect(result.writtenOff).toBe(true);
		expect(result.totalRepaid).toBe(0);
		expect(result.yearsUntilCleared).toBeNull();
		expect(result.writtenOffAmount).toBeGreaterThan(0);
		expect(result.writeOffCalendarYear).toBe(
			baseInput.yearGraduated + 1 + STUDENT_LOAN_PLANS.plan2.writeOffYears,
		);
	});

	it("clears the loan when the salary is comfortably above the threshold", () => {
		const result = computeStudentLoanRepayment({
			...baseInput,
			plan: "plan1",
			currentBalance: 15000,
			currentSalary: 50000,
			salaryGrowthPercent: 0,
			inflationPercent: 0,
		});

		expect(result.writtenOff).toBe(false);
		const years = result.yearsUntilCleared;
		expect(years).not.toBeNull();
		expect(years).toBeGreaterThan(0);
		expect(years).toBeLessThan(STUDENT_LOAN_PLANS.plan1.writeOffYears);
		expect(result.totalRepaid).toBeGreaterThan(15000);
		expect(result.writtenOffAmount).toBe(0);

		const lastRow = result.yearlyBreakdown[result.yearlyBreakdown.length - 1];
		expect(lastRow.status).toBe("paid_off");
		expect(lastRow.endBalance).toBe(0);
	});

	it("uses the postgrad rate of 6%, not 9%", () => {
		const postgrad = computeStudentLoanRepayment({
			...baseInput,
			plan: "postgrad",
			currentBalance: 25000,
			currentSalary: 40000,
			salaryGrowthPercent: 0,
			inflationPercent: 0,
		});

		const firstRow = postgrad.yearlyBreakdown[0];
		expect(firstRow.repayment).toBeCloseTo((40000 - 21000) * 0.06, 2);
	});

	it("scales plan 2 interest with salary", () => {
		const lowSalary = computeStudentLoanRepayment({
			...baseInput,
			plan: "plan2",
			currentBalance: 10000,
			currentSalary: 25000,
			salaryGrowthPercent: 0,
			inflationPercent: 0,
		});
		expect(lowSalary.yearlyBreakdown[0].interestRate).toBeCloseTo(0.032, 6);

		const highSalary = computeStudentLoanRepayment({
			...baseInput,
			plan: "plan2",
			currentBalance: 10000,
			currentSalary: 60000,
			salaryGrowthPercent: 0,
			inflationPercent: 0,
		});
		expect(highSalary.yearlyBreakdown[0].interestRate).toBeCloseTo(0.062, 6);

		const midSalary = computeStudentLoanRepayment({
			...baseInput,
			plan: "plan2",
			currentBalance: 10000,
			currentSalary: 40000,
			salaryGrowthPercent: 0,
			inflationPercent: 0,
		});
		const expectedMid = 0.032 + ((40000 - 29385) / (52485 - 29385)) * 0.03;
		expect(midSalary.yearlyBreakdown[0].interestRate).toBeCloseTo(
			expectedMid,
			6,
		);
	});

	it("uses a fixed rate for non-plan-2 plans regardless of salary", () => {
		const result = computeStudentLoanRepayment({
			...baseInput,
			plan: "plan1",
			currentBalance: 10000,
			currentSalary: 80000,
			salaryGrowthPercent: 0,
			inflationPercent: 0,
		});

		for (const row of result.yearlyBreakdown) {
			expect(row.interestRate).toBeCloseTo(0.032, 6);
		}
	});

	it("grows the threshold with inflation each year", () => {
		const result = computeStudentLoanRepayment({
			...baseInput,
			plan: "plan2",
			currentBalance: 50000,
			currentSalary: 30000,
			salaryGrowthPercent: 0,
			inflationPercent: 3,
		});

		const baseThreshold = STUDENT_LOAN_PLANS.plan2.threshold;
		expect(result.yearlyBreakdown[0].threshold).toBeCloseTo(baseThreshold, 2);
		expect(result.yearlyBreakdown[1].threshold).toBeCloseTo(
			baseThreshold * 1.03,
			2,
		);
		expect(result.yearlyBreakdown[5].threshold).toBeCloseTo(
			baseThreshold * 1.03 ** 5,
			2,
		);
	});

	it("grows the salary with salaryGrowthPercent each year", () => {
		const result = computeStudentLoanRepayment({
			...baseInput,
			plan: "plan2",
			currentBalance: 50000,
			currentSalary: 30000,
			salaryGrowthPercent: 5,
			inflationPercent: 0,
		});

		expect(result.yearlyBreakdown[0].salary).toBeCloseTo(30000, 2);
		expect(result.yearlyBreakdown[1].salary).toBeCloseTo(30000 * 1.05, 2);
		expect(result.yearlyBreakdown[3].salary).toBeCloseTo(30000 * 1.05 ** 3, 2);
	});

	it("does not repay when graduation year is in the future", () => {
		const result = computeStudentLoanRepayment({
			...baseInput,
			yearGraduated: 2030,
			currentYear: 2026,
			currentBalance: 20000,
			currentSalary: 40000,
			salaryGrowthPercent: 0,
			inflationPercent: 0,
		});

		const preGradRows = result.yearlyBreakdown.filter(
			(r) => r.calendarYear <= 2030,
		);
		for (const row of preGradRows) {
			expect(row.repayment).toBe(0);
			expect(row.status).toBe("studying");
		}

		const firstRepayingRow = result.yearlyBreakdown.find(
			(r) => r.status === "repaying",
		);
		expect(firstRepayingRow?.calendarYear).toBe(2031);
	});

	it("does not repay in the graduation year itself", () => {
		const result = computeStudentLoanRepayment({
			...baseInput,
			yearGraduated: 2026,
			currentYear: 2026,
			currentBalance: 20000,
			currentSalary: 40000,
		});

		expect(result.yearlyBreakdown[0].calendarYear).toBe(2026);
		expect(result.yearlyBreakdown[0].repayment).toBe(0);
		expect(result.yearlyBreakdown[0].status).toBe("studying");
		expect(result.yearlyBreakdown[1].repayment).toBeGreaterThan(0);
	});

	it("yearly breakdown invariants hold", () => {
		const result = computeStudentLoanRepayment({
			...baseInput,
			currentBalance: 40000,
			currentSalary: 35000,
		});

		for (let i = 0; i < result.yearlyBreakdown.length - 1; i++) {
			const row = result.yearlyBreakdown[i];
			const next = result.yearlyBreakdown[i + 1];
			expect(next.startBalance).toBeCloseTo(row.endBalance, 6);
			expect(row.endBalance).toBeCloseTo(
				row.startBalance + row.interest - row.repayment,
				6,
			);
		}

		const summedRepaid = result.yearlyBreakdown.reduce(
			(a, r) => a + r.repayment,
			0,
		);
		const summedInterest = result.yearlyBreakdown.reduce(
			(a, r) => a + r.interest,
			0,
		);
		expect(summedRepaid).toBeCloseTo(result.totalRepaid, 6);
		expect(summedInterest).toBeCloseTo(result.totalInterest, 6);
	});

	it("never repays more than the outstanding balance plus interest", () => {
		const result = computeStudentLoanRepayment({
			...baseInput,
			plan: "plan1",
			currentBalance: 1000,
			currentSalary: 80000,
			salaryGrowthPercent: 0,
			inflationPercent: 0,
		});

		const lastRow = result.yearlyBreakdown[result.yearlyBreakdown.length - 1];
		expect(lastRow.endBalance).toBe(0);
		expect(lastRow.repayment).toBeLessThanOrEqual(
			lastRow.startBalance + lastRow.interest + 1e-6,
		);
		expect(result.totalRepaid).toBeLessThanOrEqual(
			result.totalInterest + 1000 + 1e-6,
		);
	});

	it("respects the write-off ceiling counted from April after graduation", () => {
		const yearGraduated = 2020;
		const writeOffYear =
			yearGraduated + 1 + STUDENT_LOAN_PLANS.plan2.writeOffYears;

		const result = computeStudentLoanRepayment({
			...baseInput,
			yearGraduated,
			currentYear: 2026,
			currentBalance: 80000,
			currentSalary: 25000,
			salaryGrowthPercent: 0,
			inflationPercent: 0,
		});

		expect(result.writeOffCalendarYear).toBe(writeOffYear);
		const lastRow = result.yearlyBreakdown[result.yearlyBreakdown.length - 1];
		expect(lastRow.calendarYear).toBe(writeOffYear - 1);
	});

	describe("overpayment", () => {
		it("produces the same result with monthlyOverpayment 0 as without (regression guard)", () => {
			const withZero = computeStudentLoanRepayment({
				...baseInput,
				monthlyOverpayment: 0,
			});
			const explicit = computeStudentLoanRepayment(baseInput);

			expect(withZero).toEqual(explicit);
		});

		it("shortens yearsUntilCleared", () => {
			const without = computeStudentLoanRepayment({
				...baseInput,
				plan: "plan1",
				currentBalance: 20000,
				currentSalary: 45000,
				salaryGrowthPercent: 0,
				inflationPercent: 0,
			});
			const withOverpayment = computeStudentLoanRepayment({
				...baseInput,
				plan: "plan1",
				currentBalance: 20000,
				currentSalary: 45000,
				salaryGrowthPercent: 0,
				inflationPercent: 0,
				monthlyOverpayment: 200,
			});

			const withoutYears = without.yearsUntilCleared;
			const withYears = withOverpayment.yearsUntilCleared;
			expect(withoutYears).not.toBeNull();
			expect(withYears).not.toBeNull();
			expect(withYears as number).toBeLessThan(withoutYears as number);
		});

		it("reduces total interest accrued", () => {
			const without = computeStudentLoanRepayment({
				...baseInput,
				plan: "plan2",
				currentBalance: 30000,
				currentSalary: 45000,
			});
			const withOverpayment = computeStudentLoanRepayment({
				...baseInput,
				plan: "plan2",
				currentBalance: 30000,
				currentSalary: 45000,
				monthlyOverpayment: 150,
			});

			expect(withOverpayment.totalInterest).toBeLessThan(without.totalInterest);
		});

		it("never repays more than the outstanding balance plus interest, even with a large overpayment", () => {
			const result = computeStudentLoanRepayment({
				...baseInput,
				plan: "plan1",
				currentBalance: 5000,
				currentSalary: 40000,
				salaryGrowthPercent: 0,
				inflationPercent: 0,
				monthlyOverpayment: 5000,
			});

			const lastRow = result.yearlyBreakdown[result.yearlyBreakdown.length - 1];
			expect(lastRow.endBalance).toBe(0);
			expect(lastRow.repayment).toBeLessThanOrEqual(
				lastRow.startBalance + lastRow.interest + 1e-6,
			);
			expect(result.totalRepaid).toBeLessThanOrEqual(
				result.totalInterest + 5000 + 1e-6,
			);
		});

		it("clamps a negative monthlyOverpayment to zero", () => {
			const negative = computeStudentLoanRepayment({
				...baseInput,
				monthlyOverpayment: -200,
			});
			const zero = computeStudentLoanRepayment({
				...baseInput,
				monthlyOverpayment: 0,
			});

			expect(negative).toEqual(zero);
		});

		it("can clear a loan that would otherwise be written off", () => {
			const inputs = {
				...baseInput,
				plan: "plan5" as const,
				currentBalance: 50000,
				currentSalary: 26000,
				yearGraduated: 2024,
				currentYear: 2026,
				salaryGrowthPercent: 2,
				inflationPercent: 3,
			};

			const withoutOverpayment = computeStudentLoanRepayment(inputs);
			expect(withoutOverpayment.writtenOff).toBe(true);

			const withOverpayment = computeStudentLoanRepayment({
				...inputs,
				monthlyOverpayment: 400,
			});
			expect(withOverpayment.writtenOff).toBe(false);
			const clearedYears = withOverpayment.yearsUntilCleared;
			expect(clearedYears).not.toBeNull();
			expect(clearedYears as number).toBeGreaterThan(0);
		});
	});

	describe("snapshots", () => {
		const round = (n: number) => Math.round(n * 100) / 100;
		const snapshot = (r: StudentLoanResult) => ({
			...r,
			totalRepaid: round(r.totalRepaid),
			totalInterest: round(r.totalInterest),
			writtenOffAmount: round(r.writtenOffAmount),
			yearlyBreakdown: r.yearlyBreakdown.map((row) => ({
				...row,
				startBalance: round(row.startBalance),
				salary: round(row.salary),
				threshold: round(row.threshold),
				interestRate: Math.round(row.interestRate * 10000) / 10000,
				interest: round(row.interest),
				repayment: round(row.repayment),
				endBalance: round(row.endBalance),
			})),
		});

		it("Plan 2 mid-career graduate clearing the loan", () => {
			const result = computeStudentLoanRepayment({
				plan: "plan2",
				currentBalance: 30000,
				currentSalary: 45000,
				yearGraduated: 2020,
				currentYear: 2026,
				salaryGrowthPercent: 5,
				inflationPercent: 3,
				monthlyOverpayment: 0,
			});

			expect(snapshot(result)).toMatchSnapshot();
		});

		it("Plan 5 low earner getting written off", () => {
			const result = computeStudentLoanRepayment({
				plan: "plan5",
				currentBalance: 50000,
				currentSalary: 26000,
				yearGraduated: 2024,
				currentYear: 2026,
				salaryGrowthPercent: 2,
				inflationPercent: 3,
				monthlyOverpayment: 0,
			});

			expect(snapshot(result)).toMatchSnapshot();
		});

		it("Plan 1 fast payoff with overpayment", () => {
			const result = computeStudentLoanRepayment({
				plan: "plan1",
				currentBalance: 15000,
				currentSalary: 50000,
				yearGraduated: 2020,
				currentYear: 2026,
				salaryGrowthPercent: 0,
				inflationPercent: 0,
				monthlyOverpayment: 150,
			});

			expect(snapshot(result)).toMatchSnapshot();
		});

		it("Postgrad with overpayment that prevents write-off", () => {
			const result = computeStudentLoanRepayment({
				plan: "postgrad",
				currentBalance: 25000,
				currentSalary: 30000,
				yearGraduated: 2020,
				currentYear: 2026,
				salaryGrowthPercent: 0,
				inflationPercent: 0,
				monthlyOverpayment: 200,
			});

			expect(result.writtenOff).toBe(false);
			expect(snapshot(result)).toMatchSnapshot();
		});
	});
});
