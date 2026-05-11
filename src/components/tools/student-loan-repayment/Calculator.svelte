<script lang="ts">
import type { StudentLoanRepaymentState } from "../../../lib/calculator-state-schemas";
import type { Locale } from "../../../lib/i18n/locales";
import { t } from "../../../lib/i18n/strings";
import { persistSessionState } from "../../../lib/session-state.svelte";
import {
	computeStudentLoanRepayment,
	STUDENT_LOAN_PLANS,
	type StudentLoanPlan,
	type StudentLoanYear,
} from "../../../lib/student-loan-repayment";

let {
	locale,
	initial,
}: { locale: Locale; initial: StudentLoanRepaymentState | null } = $props();

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

const planLabel = (planId: StudentLoanPlan): string => {
	switch (planId) {
		case "plan1":
			return t(locale, "slPlan1");
		case "plan2":
			return t(locale, "slPlan2");
		case "plan4":
			return t(locale, "slPlan4");
		case "plan5":
			return t(locale, "slPlan5");
		case "postgrad":
			return t(locale, "slPostgrad");
	}
};

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
			return t(locale, "slStatusStudying");
		case "paid_off":
			return t(locale, "slStatusPaidOff");
		default:
			return t(locale, "slStatusRepaying");
	}
};
</script>

<div class="grid grid-cols-1 md:grid-cols-5 gap-16">
  <div class="md:col-span-3">
    <form>
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2">{t(locale, "slBalanceTitle")}</h2>
        <p class="text-base text-zinc-700 mb-3">
          {t(locale, "slBalanceHelp")}
        </p>
        <input
          type="number"
          aria-label={t(locale, "slBalanceAria")}
          class="text-xl border-2 border-black outline-yellow-400 block w-full"
          placeholder={t(locale, "slBalancePlaceholder")}
          min="0"
          step="100"
          bind:value={currentBalance}
        >
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2">{t(locale, "slYearGraduatedTitle")}</h2>
        <p class="text-base text-zinc-700 mb-3">
          {t(locale, "slYearGraduatedHelp")}
        </p>
        <input
          type="number"
          aria-label={t(locale, "slYearGraduatedAria")}
          class="text-xl border-2 border-black outline-yellow-400 block w-full"
          placeholder={t(locale, "slYearGraduatedPlaceholder")(currentYear - 4)}
          min="1990"
          max={currentYear + 10}
          step="1"
          bind:value={yearGraduated}
        >
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2">{t(locale, "slPlanTitle")}</h2>
        <p class="text-base text-zinc-700 mb-3">
          {t(locale, "slPlanHelpBefore")}<a href="/student-finance/repaying-your-loan" class="underline">{t(locale, "slPlanHelpLink")}</a>{t(locale, "slPlanHelpAfter")}
        </p>
        <select
          aria-label={t(locale, "slPlanAria")}
          bind:value={plan}
          class="text-xl border-2 border-black outline-yellow-400"
        >
          {#each planOptions as planId}
            <option value={planId}>{planLabel(planId)}</option>
          {/each}
        </select>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2">{t(locale, "slSalaryTitle")}</h2>
        <p class="text-base text-zinc-700 mb-3">
          {t(locale, "slSalaryHelp")}
        </p>
        <input
          type="number"
          aria-label={t(locale, "slSalaryAria")}
          class="text-xl border-2 border-black outline-yellow-400 block w-full"
          placeholder={t(locale, "slSalaryPlaceholder")}
          min="0"
          step="500"
          bind:value={currentSalary}
        >
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2">{t(locale, "slSalaryGrowthTitle")}</h2>
        <p class="text-base text-zinc-700 mb-3">
          {t(locale, "slSalaryGrowthHelp")}
        </p>
        <div class="flex items-stretch gap-2">
          <input
            type="number"
            aria-label={t(locale, "slSalaryGrowthAria")}
            class="text-xl border-2 border-black outline-yellow-400 block w-full"
            placeholder={t(locale, "slSalaryGrowthPlaceholder")}
            min="0"
            step="0.1"
            bind:value={salaryGrowthPercent}
          >
          <span class="border-2 border-black px-3 text-xl bg-white inline-flex items-center">%</span>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2">{t(locale, "slInflationTitle")}</h2>
        <p class="text-base text-zinc-700 mb-3">
          {t(locale, "slInflationHelp")}
        </p>
        <div class="flex items-stretch gap-2">
          <input
            type="number"
            aria-label={t(locale, "slInflationAria")}
            class="text-xl border-2 border-black outline-yellow-400 block w-full"
            placeholder={t(locale, "slInflationPlaceholder")}
            min="0"
            step="0.1"
            bind:value={inflationPercent}
          >
          <span class="border-2 border-black px-3 text-xl bg-white inline-flex items-center">%</span>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2">{t(locale, "slOverpaymentTitle")} <span class="text-base font-normal text-zinc-600">({t(locale, "optional")})</span></h2>
        <p class="text-base text-zinc-700 mb-3">
          {t(locale, "slOverpaymentHelp")}
        </p>
        <div class="flex items-stretch gap-2">
          <span class="border-2 border-black px-3 text-xl bg-white inline-flex items-center">£</span>
          <input
            type="number"
            aria-label={t(locale, "slOverpaymentAria")}
            class="text-xl border-2 border-black outline-yellow-400 block w-full"
            placeholder={t(locale, "slOverpaymentPlaceholder")}
            min="0"
            step="10"
            bind:value={monthlyOverpayment}
          >
        </div>
      </div>

      <p class="text-sm text-zinc-600">
        {t(locale, "slAssumptionNote")}
      </p>
    </form>
  </div>

  <aside class="md:col-span-2 md:sticky md:top-4 md:self-start">
    {#if hasResult}
      {#if isOverpaying}
        <div class="bg-zinc-200 text-zinc-900 p-4" data-testid="baseline-card">
          <strong>{t(locale, "slWithoutOverpayment")}</strong>
          {#if baselineResult.writtenOff}
            <p class="text-2xl font-bold" data-testid="baseline-amount">{t(locale, "slPaidLabel")(formatPoundsExact(baselineResult.totalRepaid))}</p>
            <p>{t(locale, "slWrittenOffAfter")(STUDENT_LOAN_PLANS[plan].writeOffYears)}, {t(locale, "slForgivenIn")(formatPoundsExact(baselineResult.writtenOffAmount), baselineResult.writeOffCalendarYear ?? 0)}</p>
          {:else}
            <p class="text-2xl font-bold" data-testid="baseline-amount">{t(locale, "slPaidLabel")(formatPoundsExact(baselineResult.totalRepaid))}</p>
            <p>{t(locale, "slPaidOffIn")(baselineResult.yearsUntilCleared ?? 0)}</p>
          {/if}
        </div>
        <div class="bg-teal-900 text-white p-4 mt-2" data-testid="with-overpayment-card">
          <strong>{t(locale, "slWithOverpayment")}</strong>
          {#if result.writtenOff}
            <p class="text-2xl font-bold" data-testid="with-amount">{t(locale, "slPaidLabel")(formatPoundsExact(result.totalRepaid))}</p>
            <p>{t(locale, "slWrittenOffAfter")(STUDENT_LOAN_PLANS[plan].writeOffYears)}, {t(locale, "slForgivenIn")(formatPoundsExact(result.writtenOffAmount), result.writeOffCalendarYear ?? 0)}</p>
          {:else}
            <p class="text-2xl font-bold" data-testid="with-amount">{t(locale, "slPaidLabel")(formatPoundsExact(result.totalRepaid))}</p>
            <p>{t(locale, "slPaidOffIn")(result.yearsUntilCleared ?? 0)}</p>
          {/if}
        </div>
        {#if overpayingCostsMore}
          <div class="bg-amber-100 border-2 border-amber-400 p-3 mt-2 text-base" data-testid="overpay-warning">
            {t(locale, "slOverpayingCostsMore")(formatPounds(-moneySaved), baselineResult.writeOffCalendarYear ?? 0)}
          </div>
        {:else if moneySaved > 0}
          <p class="mt-2 text-lg" data-testid="savings-summary">
            {t(locale, "slSavingsTimeAndMoney")(yearsSaved, formatPounds(moneySaved))}
          </p>
        {:else if yearsSaved > 0}
          <p class="mt-2 text-lg" data-testid="savings-summary">
            {t(locale, "slSavingsTimeOnly")(yearsSaved)}
          </p>
        {/if}
      {:else}
        <div class="bg-teal-900 text-white p-4" data-testid="outcome-card">
          {#if result.writtenOff}
            <strong>{t(locale, "slWrittenOffAfter")(STUDENT_LOAN_PLANS[plan].writeOffYears)}</strong>
            <p class="text-3xl font-bold" data-testid="written-off-amount">{formatPounds(result.writtenOffAmount)}</p>
            <p>{t(locale, "slForgivenInYear")(result.writeOffCalendarYear ?? 0)}</p>
          {:else}
            <strong>{t(locale, "slPaidOffIn")(result.yearsUntilCleared ?? 0)}</strong>
            <p class="text-3xl font-bold" data-testid="total-repaid">{formatPounds(result.totalRepaid)}</p>
            <p>{t(locale, "slTotalPaidBack")}</p>
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
            <span>{t(locale, "slYouRepaid")}: <strong>{formatPounds(result.totalRepaid)}</strong></span>
          </li>
          <li class="flex items-center gap-2 mt-2">
            <span class="size-3 bg-amber-400 inline-block shrink-0" aria-hidden="true"></span>
            <span>{t(locale, "slInterestAccrued")}: <strong>{formatPounds(result.totalInterest)}</strong></span>
          </li>
          {#if result.writtenOff}
            <li class="flex items-center gap-2 mt-2 text-base text-zinc-700">
              <span>{t(locale, "slForgivenAtWriteOff")}: <strong>{formatPounds(result.writtenOffAmount)}</strong></span>
            </li>
          {/if}
        </ul>
      </div>

      <details class="mt-4 group [&_summary::-webkit-details-marker]:hidden">
        <summary class="cursor-pointer text-lg font-semibold underline">
          {t(locale, "slBreakdownToggle")}
        </summary>
        <div class="mt-3 overflow-x-auto">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="border-b-2 border-black text-left">
                <th class="py-2 pr-2 font-semibold">{t(locale, "slTableYear")}</th>
                <th class="py-2 pr-2 font-semibold text-right">{t(locale, "slTableSalary")}</th>
                <th class="py-2 pr-2 font-semibold text-right">{t(locale, "slTableRepayment")}</th>
                <th class="py-2 pr-2 font-semibold text-right">{t(locale, "slTableInterest")}</th>
                <th class="py-2 pr-2 font-semibold text-right">{t(locale, "slTableBalance")}</th>
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
        {t(locale, "slEmptyState")}
      </div>
    {/if}
  </aside>
</div>
