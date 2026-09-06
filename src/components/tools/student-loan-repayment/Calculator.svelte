<script lang="ts">
import { untrack } from "svelte";
import type { StudentLoanRepaymentState } from "../../../lib/calculator-state-schemas";
import { copy } from "../../../lib/copy";
import { persistSessionState } from "../../../lib/session-state.svelte";
import {
	computeStudentLoanRepayment,
	STUDENT_LOAN_PLANS,
	type StudentLoanPlan,
	type StudentLoanYear,
} from "../../../lib/student-loan-repayment";

let { initial }: { initial: StudentLoanRepaymentState | null } = $props();

// Restore saved values once; subsequent edits belong to this calculator.
const initialState = untrack(() => initial);

const poundsFormatter = new Intl.NumberFormat("en-GB", {
	currency: "GBP",
	currencyDisplay: "symbol",
	style: "currency",
	maximumFractionDigits: 0,
});

const formatPounds = (amount: number | null | undefined): string => {
	if (!amount || amount === 0) {return "£-";}
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

const planLabel = (planId: StudentLoanPlan): string => {
	switch (planId) {
		case "plan1":
			return copy.slPlan1;
		case "plan2":
			return copy.slPlan2;
		case "plan4":
			return copy.slPlan4;
		case "plan5":
			return copy.slPlan5;
		case "postgrad":
			return copy.slPostgrad;
	}
};

const currentYear = new Date().getFullYear();

let currentBalance = $state<number | null>(initialState?.currentBalance ?? null);
let yearGraduated = $state<number | null>(initialState?.yearGraduated ?? null);
let plan = $state<StudentLoanPlan>(initialState?.plan ?? "plan2");
let currentSalary = $state<number | null>(initialState?.currentSalary ?? null);

let salaryGrowthPercent = $state<number | null>(
	initialState?.salaryGrowthPercent ?? 5,
);

let inflationPercent = $state<number | null>(initialState?.inflationPercent ?? 3);

let monthlyOverpayment = $state<number | null>(
	initialState?.monthlyOverpayment ?? null,
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
			return copy.slStatusStudying;
		case "paid_off":
			return copy.slStatusPaidOff;
		default:
			return copy.slStatusRepaying;
	}
};
</script>

<div class="grid grid-cols-1 md:grid-cols-5 gap-16">
  <div class="md:col-span-3">
    <form>
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2">{copy.slBalanceTitle}</h2>
        <p class="text-base text-zinc-700 mb-3">
          {copy.slBalanceHelp}
        </p>
        <input
          type="number"
          aria-label={copy.slBalanceAria}
          class="text-xl border-2 border-black outline-yellow-400 block w-full"
          placeholder={copy.slBalancePlaceholder}
          min="0"
          step="100"
          bind:value={currentBalance}
        >
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2">{copy.slYearGraduatedTitle}</h2>
        <p class="text-base text-zinc-700 mb-3">
          {copy.slYearGraduatedHelp}
        </p>
        <input
          type="number"
          aria-label={copy.slYearGraduatedAria}
          class="text-xl border-2 border-black outline-yellow-400 block w-full"
          placeholder={copy.slYearGraduatedPlaceholder(currentYear - 4)}
          min="1990"
          max={currentYear + 10}
          step="1"
          bind:value={yearGraduated}
        >
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2">{copy.slPlanTitle}</h2>
        <p class="text-base text-zinc-700 mb-3">
          {copy.slPlanHelpBefore}<a href="/student-finance/repaying-your-loan" class="underline">{copy.slPlanHelpLink}</a>{copy.slPlanHelpAfter}
        </p>
        <select
          aria-label={copy.slPlanAria}
          bind:value={plan}
          class="text-xl border-2 border-black outline-yellow-400"
        >
          {#each planOptions as planId}
            <option value={planId}>{planLabel(planId)}</option>
          {/each}
        </select>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2">{copy.slSalaryTitle}</h2>
        <p class="text-base text-zinc-700 mb-3">
          {copy.slSalaryHelp}
        </p>
        <input
          type="number"
          aria-label={copy.slSalaryAria}
          class="text-xl border-2 border-black outline-yellow-400 block w-full"
          placeholder={copy.slSalaryPlaceholder}
          min="0"
          step="500"
          bind:value={currentSalary}
        >
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2">{copy.slSalaryGrowthTitle}</h2>
        <p class="text-base text-zinc-700 mb-3">
          {copy.slSalaryGrowthHelp}
        </p>
        <div class="flex items-stretch gap-2">
          <input
            type="number"
            aria-label={copy.slSalaryGrowthAria}
            class="text-xl border-2 border-black outline-yellow-400 block w-full"
            placeholder={copy.slSalaryGrowthPlaceholder}
            min="0"
            step="0.1"
            bind:value={salaryGrowthPercent}
          >
          <span class="border-2 border-black px-3 text-xl bg-white inline-flex items-center">%</span>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2">{copy.slInflationTitle}</h2>
        <p class="text-base text-zinc-700 mb-3">
          {copy.slInflationHelp}
        </p>
        <div class="flex items-stretch gap-2">
          <input
            type="number"
            aria-label={copy.slInflationAria}
            class="text-xl border-2 border-black outline-yellow-400 block w-full"
            placeholder={copy.slInflationPlaceholder}
            min="0"
            step="0.1"
            bind:value={inflationPercent}
          >
          <span class="border-2 border-black px-3 text-xl bg-white inline-flex items-center">%</span>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2">{copy.slOverpaymentTitle} <span class="text-base font-normal text-zinc-600">({copy.optional})</span></h2>
        <p class="text-base text-zinc-700 mb-3">
          {copy.slOverpaymentHelp}
        </p>
        <div class="flex items-stretch gap-2">
          <span class="border-2 border-black px-3 text-xl bg-white inline-flex items-center">£</span>
          <input
            type="number"
            aria-label={copy.slOverpaymentAria}
            class="text-xl border-2 border-black outline-yellow-400 block w-full"
            placeholder={copy.slOverpaymentPlaceholder}
            min="0"
            step="10"
            bind:value={monthlyOverpayment}
          >
        </div>
      </div>

      <p class="text-sm text-zinc-600">
        {copy.slAssumptionNote}
      </p>
    </form>
  </div>

  <aside class="md:col-span-2 md:sticky md:top-4 md:self-start">
    {#if hasResult}
      {#if isOverpaying}
        <div class="bg-zinc-200 text-zinc-900 p-4" data-testid="baseline-card">
          <strong>{copy.slWithoutOverpayment}</strong>
          {#if baselineResult.writtenOff}
            <p class="text-2xl font-bold" data-testid="baseline-amount">{copy.slPaidLabel(formatPoundsExact(baselineResult.totalRepaid))}</p>
            <p>{copy.slWrittenOffAfter(STUDENT_LOAN_PLANS[plan].writeOffYears)}, {copy.slForgivenIn(formatPoundsExact(baselineResult.writtenOffAmount), baselineResult.writeOffCalendarYear ?? 0)}</p>
          {:else}
            <p class="text-2xl font-bold" data-testid="baseline-amount">{copy.slPaidLabel(formatPoundsExact(baselineResult.totalRepaid))}</p>
            <p>{copy.slPaidOffIn(baselineResult.yearsUntilCleared ?? 0)}</p>
          {/if}
        </div>
        <div class="bg-teal-900 text-white p-4 mt-2" data-testid="with-overpayment-card">
          <strong>{copy.slWithOverpayment}</strong>
          {#if result.writtenOff}
            <p class="text-2xl font-bold" data-testid="with-amount">{copy.slPaidLabel(formatPoundsExact(result.totalRepaid))}</p>
            <p>{copy.slWrittenOffAfter(STUDENT_LOAN_PLANS[plan].writeOffYears)}, {copy.slForgivenIn(formatPoundsExact(result.writtenOffAmount), result.writeOffCalendarYear ?? 0)}</p>
          {:else}
            <p class="text-2xl font-bold" data-testid="with-amount">{copy.slPaidLabel(formatPoundsExact(result.totalRepaid))}</p>
            <p>{copy.slPaidOffIn(result.yearsUntilCleared ?? 0)}</p>
          {/if}
        </div>
        {#if overpayingCostsMore}
          <div class="bg-amber-100 border-2 border-amber-400 p-3 mt-2 text-base" data-testid="overpay-warning">
            {copy.slOverpayingCostsMore(formatPounds(-moneySaved), baselineResult.writeOffCalendarYear ?? 0)}
          </div>
        {:else if moneySaved > 0}
          <p class="mt-2 text-lg" data-testid="savings-summary">
            {copy.slSavingsTimeAndMoney(yearsSaved, formatPounds(moneySaved))}
          </p>
        {:else if yearsSaved > 0}
          <p class="mt-2 text-lg" data-testid="savings-summary">
            {copy.slSavingsTimeOnly(yearsSaved)}
          </p>
        {/if}
      {:else}
        <div class="bg-teal-900 text-white p-4" data-testid="outcome-card">
          {#if result.writtenOff}
            <strong>{copy.slWrittenOffAfter(STUDENT_LOAN_PLANS[plan].writeOffYears)}</strong>
            <p class="text-3xl font-bold" data-testid="written-off-amount">{formatPounds(result.writtenOffAmount)}</p>
            <p>{copy.slForgivenInYear(result.writeOffCalendarYear ?? 0)}</p>
          {:else}
            <strong>{copy.slPaidOffIn(result.yearsUntilCleared ?? 0)}</strong>
            <p class="text-3xl font-bold" data-testid="total-repaid">{formatPounds(result.totalRepaid)}</p>
            <p>{copy.slTotalPaidBack}</p>
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
            <span>{copy.slYouRepaid}: <strong>{formatPounds(result.totalRepaid)}</strong></span>
          </li>
          <li class="flex items-center gap-2 mt-2">
            <span class="size-3 bg-amber-400 inline-block shrink-0" aria-hidden="true"></span>
            <span>{copy.slInterestAccrued}: <strong>{formatPounds(result.totalInterest)}</strong></span>
          </li>
          {#if result.writtenOff}
            <li class="flex items-center gap-2 mt-2 text-base text-zinc-700">
              <span>{copy.slForgivenAtWriteOff}: <strong>{formatPounds(result.writtenOffAmount)}</strong></span>
            </li>
          {/if}
        </ul>
      </div>

      <details class="mt-4 group [&_summary::-webkit-details-marker]:hidden">
        <summary class="cursor-pointer text-lg font-semibold underline">
          {copy.slBreakdownToggle}
        </summary>
        <div class="mt-3 overflow-x-auto">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="border-b-2 border-black text-left">
                <th class="py-2 pr-2 font-semibold">{copy.slTableYear}</th>
                <th class="py-2 pr-2 font-semibold text-right">{copy.slTableSalary}</th>
                <th class="py-2 pr-2 font-semibold text-right">{copy.slTableRepayment}</th>
                <th class="py-2 pr-2 font-semibold text-right">{copy.slTableInterest}</th>
                <th class="py-2 pr-2 font-semibold text-right">{copy.slTableBalance}</th>
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
        {copy.slEmptyState}
      </div>
    {/if}
  </aside>
</div>
