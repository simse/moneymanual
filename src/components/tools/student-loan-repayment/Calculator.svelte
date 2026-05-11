<script lang="ts">
import type { StudentLoanRepaymentState } from "../../../lib/calculator-state-schemas";
import { persistSessionState } from "../../../lib/session-state.svelte";
import {
	computeStudentLoanRepayment,
	STUDENT_LOAN_PLANS,
	type StudentLoanPlan,
	type StudentLoanYear,
} from "../../../lib/student-loan-repayment";

let { initial }: { initial: StudentLoanRepaymentState | null } = $props();

const poundsFormatter = new Intl.NumberFormat("en-GB", {
	currency: "GBP",
	currencyDisplay: "symbol",
	style: "currency",
	maximumFractionDigits: 0,
});

const formatPounds = (amount: number | null | undefined): string => {
	if (!amount || amount === 0) return "£-";
	return poundsFormatter.format(amount);
};

const formatPoundsExact = (amount: number): string => {
	return poundsFormatter.format(Math.round(amount));
};

const formatPercent = (rate: number): string => `${(rate * 100).toFixed(1)}%`;

const planOptions: StudentLoanPlan[] = [
	"plan1",
	"plan2",
	"plan4",
	"plan5",
	"postgrad",
];

const currentYear = new Date().getFullYear();

let currentBalance = $state<number | null>(initial?.currentBalance ?? null);
let yearGraduated = $state<number | null>(initial?.yearGraduated ?? null);
let plan = $state<StudentLoanPlan>(initial?.plan ?? "plan2");
let currentSalary = $state<number | null>(initial?.currentSalary ?? null);
let salaryGrowthPercent = $state<number | null>(
	initial?.salaryGrowthPercent ?? 5,
);
let inflationPercent = $state<number | null>(initial?.inflationPercent ?? 3);
let monthlyOverpayment = $state<number | null>(
	initial?.monthlyOverpayment ?? null,
);

persistSessionState("student-loan-repayment", () => ({
	currentBalance,
	yearGraduated,
	plan,
	currentSalary,
	salaryGrowthPercent,
	inflationPercent,
	monthlyOverpayment,
}));

const sharedInputs = $derived({
	currentBalance: currentBalance ?? 0,
	currentSalary: currentSalary ?? 0,
	yearGraduated: yearGraduated ?? currentYear,
	plan,
	salaryGrowthPercent: salaryGrowthPercent ?? 0,
	inflationPercent: inflationPercent ?? 0,
	currentYear,
});

const baselineResult = $derived(
	computeStudentLoanRepayment({ ...sharedInputs, monthlyOverpayment: 0 }),
);
const result = $derived(
	computeStudentLoanRepayment({
		...sharedInputs,
		monthlyOverpayment: monthlyOverpayment ?? 0,
	}),
);
const isOverpaying = $derived((monthlyOverpayment ?? 0) > 0);

const moneySaved = $derived(baselineResult.totalRepaid - result.totalRepaid);
const yearsBaseline = $derived(
	baselineResult.yearsUntilCleared ?? STUDENT_LOAN_PLANS[plan].writeOffYears,
);
const yearsWith = $derived(
	result.yearsUntilCleared ?? STUDENT_LOAN_PLANS[plan].writeOffYears,
);
const yearsSaved = $derived(yearsBaseline - yearsWith);
const overpayingCostsMore = $derived(isOverpaying && moneySaved < 0);

const hasResult = $derived(result.yearlyBreakdown.length > 0);
const repaymentShare = $derived(
	result.totalRepaid + result.totalInterest > 0
		? (result.totalRepaid / (result.totalRepaid + result.totalInterest)) * 100
		: 0,
);
const interestShare = $derived(100 - repaymentShare);

const statusLabel = (status: StudentLoanYear["status"]): string => {
	switch (status) {
		case "studying":
			return "Studying";
		case "paid_off":
			return "Paid off";
		default:
			return "Repaying";
	}
};
</script>

<div class="grid grid-cols-1 md:grid-cols-5 gap-16">
  <div class="md:col-span-3">
    <form>
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2">Current loan balance</h2>
        <p class="text-base text-zinc-700 mb-3">
          The amount you currently owe. You can find this on your Student Loans Company online account.
        </p>
        <input
          type="number"
          aria-label="Current loan balance in pounds"
          class="text-xl border-2 border-black outline-yellow-400 block w-full"
          placeholder="For example: 35000"
          min="0"
          step="100"
          bind:value={currentBalance}
        >
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2">Year you graduated</h2>
        <p class="text-base text-zinc-700 mb-3">
          You start repaying the April after you finish your course. If you have not graduated yet, enter the year you expect to.
        </p>
        <input
          type="number"
          aria-label="Year you graduated"
          class="text-xl border-2 border-black outline-yellow-400 block w-full"
          placeholder={`For example: ${currentYear - 4}`}
          min="1990"
          max={currentYear + 10}
          step="1"
          bind:value={yearGraduated}
        >
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2">Repayment plan</h2>
        <p class="text-base text-zinc-700 mb-3">
          Your plan depends on when and where you studied. Check your <a href="/student-finance/repaying-your-loan" class="underline">repayment plan details</a> if you are not sure.
        </p>
        <select
          aria-label="Repayment plan"
          bind:value={plan}
          class="text-xl border-2 border-black outline-yellow-400"
        >
          {#each planOptions as planId}
            <option value={planId}>{STUDENT_LOAN_PLANS[planId].label}</option>
          {/each}
        </select>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2">Current annual salary</h2>
        <p class="text-base text-zinc-700 mb-3">
          Your gross income before tax and other deductions, including bonuses.
        </p>
        <input
          type="number"
          aria-label="Current annual salary in pounds"
          class="text-xl border-2 border-black outline-yellow-400 block w-full"
          placeholder="For example: 35000"
          min="0"
          step="500"
          bind:value={currentSalary}
        >
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2">Expected annual salary growth</h2>
        <p class="text-base text-zinc-700 mb-3">
          How much you expect your pay to rise each year, on average.
        </p>
        <div class="flex items-stretch gap-2">
          <input
            type="number"
            aria-label="Annual salary growth as a percentage"
            class="text-xl border-2 border-black outline-yellow-400 block w-full"
            placeholder="For example: 5"
            min="0"
            step="0.1"
            bind:value={salaryGrowthPercent}
          >
          <span class="border-2 border-black px-3 text-xl bg-white inline-flex items-center">%</span>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2">Expected annual inflation</h2>
        <p class="text-base text-zinc-700 mb-3">
          The repayment threshold is reviewed each April. We assume it grows in line with inflation, so a higher figure means more of your pay stays below the threshold.
        </p>
        <div class="flex items-stretch gap-2">
          <input
            type="number"
            aria-label="Annual inflation as a percentage"
            class="text-xl border-2 border-black outline-yellow-400 block w-full"
            placeholder="For example: 3"
            min="0"
            step="0.1"
            bind:value={inflationPercent}
          >
          <span class="border-2 border-black px-3 text-xl bg-white inline-flex items-center">%</span>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2">Monthly overpayment <span class="text-base font-normal text-zinc-600">(optional)</span></h2>
        <p class="text-base text-zinc-700 mb-3">
          Voluntary extra payment you'll make each month on top of the statutory deduction. You can make voluntary repayments directly to the Student Loans Company at any time.
        </p>
        <div class="flex items-stretch gap-2">
          <span class="border-2 border-black px-3 text-xl bg-white inline-flex items-center">£</span>
          <input
            type="number"
            aria-label="Monthly overpayment in pounds"
            class="text-xl border-2 border-black outline-yellow-400 block w-full"
            placeholder="For example: 100"
            min="0"
            step="10"
            bind:value={monthlyOverpayment}
          >
        </div>
      </div>

      <p class="text-sm text-zinc-600">
        Estimates based on current plan thresholds and rates. Plan 2 interest scales with income between £29,385 and £52,485. Real-world thresholds and rates can change each April.
      </p>
    </form>
  </div>

  <aside class="md:col-span-2 md:sticky md:top-4 md:self-start">
    {#if hasResult}
      {#if isOverpaying}
        <div class="bg-zinc-200 text-zinc-900 p-4" data-testid="baseline-card">
          <strong>Without overpayment</strong>
          {#if baselineResult.writtenOff}
            <p class="text-2xl font-bold" data-testid="baseline-amount">{formatPoundsExact(baselineResult.totalRepaid)} paid</p>
            <p>Written off after {STUDENT_LOAN_PLANS[plan].writeOffYears} years, {formatPoundsExact(baselineResult.writtenOffAmount)} forgiven in {baselineResult.writeOffCalendarYear}</p>
          {:else}
            <p class="text-2xl font-bold" data-testid="baseline-amount">{formatPoundsExact(baselineResult.totalRepaid)} paid</p>
            <p>Paid off in {baselineResult.yearsUntilCleared} year{baselineResult.yearsUntilCleared === 1 ? "" : "s"}</p>
          {/if}
        </div>
        <div class="bg-teal-900 text-white p-4 mt-2" data-testid="with-overpayment-card">
          <strong>With overpayment</strong>
          {#if result.writtenOff}
            <p class="text-2xl font-bold" data-testid="with-amount">{formatPoundsExact(result.totalRepaid)} paid</p>
            <p>Written off after {STUDENT_LOAN_PLANS[plan].writeOffYears} years, {formatPoundsExact(result.writtenOffAmount)} forgiven in {result.writeOffCalendarYear}</p>
          {:else}
            <p class="text-2xl font-bold" data-testid="with-amount">{formatPoundsExact(result.totalRepaid)} paid</p>
            <p>Paid off in {result.yearsUntilCleared} year{result.yearsUntilCleared === 1 ? "" : "s"}</p>
          {/if}
        </div>
        {#if overpayingCostsMore}
          <div class="bg-amber-100 border-2 border-amber-400 p-3 mt-2 text-base" data-testid="overpay-warning">
            Overpaying costs you <strong>{formatPounds(-moneySaved)}</strong> more — without it, your loan would have been written off in {baselineResult.writeOffCalendarYear}.
          </div>
        {:else if moneySaved > 0}
          <p class="mt-2 text-lg" data-testid="savings-summary">
            You save <strong>{yearsSaved} year{yearsSaved === 1 ? "" : "s"}</strong> and <strong>{formatPounds(moneySaved)}</strong>.
          </p>
        {:else if yearsSaved > 0}
          <p class="mt-2 text-lg" data-testid="savings-summary">
            You save <strong>{yearsSaved} year{yearsSaved === 1 ? "" : "s"}</strong>.
          </p>
        {/if}
      {:else}
        <div class="bg-teal-900 text-white p-4" data-testid="outcome-card">
          {#if result.writtenOff}
            <strong>Written off after {STUDENT_LOAN_PLANS[plan].writeOffYears} years</strong>
            <p class="text-3xl font-bold" data-testid="written-off-amount">{formatPounds(result.writtenOffAmount)}</p>
            <p>forgiven in {result.writeOffCalendarYear}</p>
          {:else}
            <strong>Paid off in {result.yearsUntilCleared} year{result.yearsUntilCleared === 1 ? "" : "s"}</strong>
            <p class="text-3xl font-bold" data-testid="total-repaid">{formatPounds(result.totalRepaid)}</p>
            <p>total paid back</p>
          {/if}
        </div>
      {/if}

      <div class="mt-4 border-2 border-black">
        <div class="flex h-3 w-full" aria-hidden="true">
          <div class="bg-teal-700" style:width={`${repaymentShare}%`}></div>
          <div class="bg-amber-400" style:width={`${interestShare}%`}></div>
        </div>
        <ul class="text-lg p-4 space-y-1">
          <li class="flex items-center gap-2">
            <span class="size-3 bg-teal-700 inline-block shrink-0" aria-hidden="true"></span>
            <span>You repaid: <strong>{formatPounds(result.totalRepaid)}</strong></span>
          </li>
          <li class="flex items-center gap-2 mt-2">
            <span class="size-3 bg-amber-400 inline-block shrink-0" aria-hidden="true"></span>
            <span>Interest accrued: <strong>{formatPounds(result.totalInterest)}</strong></span>
          </li>
          {#if result.writtenOff}
            <li class="flex items-center gap-2 mt-2 text-base text-zinc-700">
              <span>Forgiven at write-off: <strong>{formatPounds(result.writtenOffAmount)}</strong></span>
            </li>
          {/if}
        </ul>
      </div>

      <details class="mt-4 group [&_summary::-webkit-details-marker]:hidden">
        <summary class="cursor-pointer text-lg font-semibold underline">
          Show year-by-year breakdown
        </summary>
        <div class="mt-3 overflow-x-auto">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="border-b-2 border-black text-left">
                <th class="py-2 pr-2 font-semibold">Year</th>
                <th class="py-2 pr-2 font-semibold text-right">Salary</th>
                <th class="py-2 pr-2 font-semibold text-right">Repayment</th>
                <th class="py-2 pr-2 font-semibold text-right">Interest</th>
                <th class="py-2 pr-2 font-semibold text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {#each result.yearlyBreakdown as row}
                <tr class="border-b border-zinc-300">
                  <td class="py-2 pr-2">
                    {row.calendarYear}
                    {#if row.status !== "repaying"}
                      <span class="block text-xs text-zinc-600">{statusLabel(row.status)}</span>
                    {/if}
                  </td>
                  <td class="py-2 pr-2 text-right">{formatPoundsExact(row.salary)}</td>
                  <td class="py-2 pr-2 text-right">{formatPoundsExact(row.repayment)}</td>
                  <td class="py-2 pr-2 text-right" title={`Rate ${formatPercent(row.interestRate)}`}>{formatPoundsExact(row.interest)}</td>
                  <td class="py-2 pr-2 text-right font-semibold">{formatPoundsExact(row.endBalance)}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </details>
    {:else}
      <div class="bg-zinc-100 border-2 border-zinc-300 p-4 text-zinc-600">
        Enter your details on the left to see your repayment forecast.
      </div>
    {/if}
  </aside>
</div>
