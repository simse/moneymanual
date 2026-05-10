<script lang="ts">
import DownRightIcon from "virtual:icons/material-symbols/subdirectory-arrow-right";
import {
	type Country,
	computeTakeHome,
	DEFAULT_TAX_YEAR,
	type PensionInputType,
	type PensionMethod,
	type StudentLoanPlan,
	SUPPORTED_TAX_YEARS,
	type TaxYear,
} from "../../../lib/take-home-pay";
import AccordionSection from "../../common/AccordionSection.svelte";

const formatter = new Intl.NumberFormat("en-GB", {
	currency: "GBP",
	currencyDisplay: "symbol",
	style: "currency",
	maximumFractionDigits: 0,
});

const formatPounds = (amount: number | null): string => {
	if (!amount || amount === 0) {
		return "£-";
	}
	return formatter.format(amount);
};

const payFrequencies: {
	id: string;
	label: string;
	toAnnual: (input: number) => number;
}[] = [
	{ id: "weekly", label: "Weekly", toAnnual: (n) => n * 52 },
	{ id: "bi_weekly", label: "Fortnightly", toAnnual: (n) => n * 26 },
	{ id: "monthly", label: "Monthly", toAnnual: (n) => n * 12 },
	{ id: "annually", label: "Annually", toAnnual: (n) => n },
];

const countries: { id: Country; label: string }[] = [
	{ id: "England/NI/Wales", label: "England, Northern Ireland or Wales" },
	{ id: "Scotland", label: "Scotland" },
];

const studentLoanPlans: { id: StudentLoanPlan; label: string }[] = [
	{ id: 1, label: "Plan 1" },
	{ id: 2, label: "Plan 2" },
	{ id: 4, label: "Plan 4 (Scotland)" },
	{ id: 5, label: "Plan 5" },
];

let selectedTaxYear = $state<TaxYear>(DEFAULT_TAX_YEAR);
let selectedPayFrequency = $state("annually");
let selectedCountry = $state<Country>("England/NI/Wales");
let selectedStudentLoanPlans = $state<StudentLoanPlan[]>([]);
let grossIncome = $state<number | null>(null);
let pensionMethod = $state<PensionMethod>("net_pay");
let pensionInputType = $state<PensionInputType>("percent");
let pensionValue = $state<number | null>(null);
let annualBonus = $state<number | null>(null);

const result = $derived.by(() => {
	const freq =
		payFrequencies.find((f) => f.id === selectedPayFrequency) ??
		payFrequencies[3];
	const annualGrossSalary = freq.toAnnual(grossIncome ?? 0);

	const pensionRaw = pensionValue ?? 0;
	const pensionAnnualValue =
		pensionInputType === "amount" ? freq.toAnnual(pensionRaw) : pensionRaw;

	return computeTakeHome({
		taxYear: selectedTaxYear,
		country: selectedCountry,
		annualGrossSalary,
		annualBonus: annualBonus ?? 0,
		pension: {
			method: pensionMethod,
			inputType: pensionInputType,
			value: pensionAnnualValue,
		},
		studentLoanPlans: selectedStudentLoanPlans,
	});
});

const hasBonus = $derived((annualBonus ?? 0) > 0);
const hasPension = $derived(result.base.grossPensionContribution > 0);
const hasStudentLoans = $derived(result.base.totalStudentLoanRepayments > 0);

const pensionIndicator = $derived.by(() => {
	if ((pensionValue ?? 0) <= 0) return null;
	return pensionInputType === "percent"
		? `${pensionValue}%`
		: formatPounds(pensionValue);
});
const bonusIndicator = $derived(hasBonus ? formatPounds(annualBonus) : null);
const studentLoanIndicator = $derived(
	selectedStudentLoanPlans.length > 0
		? `${selectedStudentLoanPlans.length} plan${selectedStudentLoanPlans.length === 1 ? "" : "s"}`
		: null,
);

const regularMonthlyText = $derived(
	`${formatPounds(result.regularMonthlyTakeHome)} monthly`,
);
const bonusMonthlyText = $derived(
	`${formatPounds(result.bonusMonthTakeHome)} in bonus month`,
);

const showRasHigherRateNote = $derived(
	pensionMethod === "relief_at_source" &&
		hasPension &&
		result.base.incomeTax.incomeTaxType === "England/NI/Wales" &&
		result.base.incomeTax.breakdown.higherRateTax +
			result.base.incomeTax.breakdown.additionalRateTax >
			0,
);
</script>

<div class="grid grid-cols-1 md:grid-cols-5 gap-16">
  <div class="md:col-span-3">
    <form>
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Tax year</h2>
        <select
          aria-label="Tax year"
          bind:value={selectedTaxYear}
          class="text-xl border-2 border-black outline-yellow-400"
        >
          {#each SUPPORTED_TAX_YEARS as year}
            <option value={year}>{year}</option>
          {/each}
        </select>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Which country do you work in?</h2>
        <select
          aria-label="Country"
          bind:value={selectedCountry}
          class="text-xl border-2 border-black outline-yellow-400"
        >
          {#each countries as country}
            <option value={country.id}>{country.label}</option>
          {/each}
        </select>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Your salary</h2>
        <input
          type="number"
          aria-label="Gross salary"
          class="text-xl border-2 border-black outline-yellow-400 block mb-8 w-full"
          placeholder="For example: 45000"
          bind:value={grossIncome}
        >
        {#each payFrequencies as payFrequency}
          <label for={payFrequency.id} class="text-xl mr-8 mb-4 inline-block">
            <input
              class="p-3 -mt-1 mr-1"
              type="radio"
              id={payFrequency.id}
              name="pay_frequency"
              value={payFrequency.id}
              bind:group={selectedPayFrequency}
            />
            {payFrequency.label}
          </label>
        {/each}
      </div>

      <AccordionSection title="Pension contribution" indicator={pensionIndicator}>
        <p class="text-base text-zinc-700 mb-3">
          Auto-enrolment pensions reduce your take-home pay differently depending
          on the relief method your employer uses.
        </p>

        <div class="mb-4">
          <label for="pension-net-pay" class="text-xl mr-8 mb-2 block">
            <input
              class="p-3 -mt-1 mr-1"
              type="radio"
              id="pension-net-pay"
              name="pension_method"
              value="net_pay"
              bind:group={pensionMethod}
            />
            Net pay arrangement
            <span class="block text-sm text-zinc-600 ml-7">Deducted before income tax — tax relief is automatic at your marginal rate.</span>
          </label>
          <label for="pension-ras" class="text-xl mr-8 mb-2 block">
            <input
              class="p-3 -mt-1 mr-1"
              type="radio"
              id="pension-ras"
              name="pension_method"
              value="relief_at_source"
              bind:group={pensionMethod}
            />
            Relief at source
            <span class="block text-sm text-zinc-600 ml-7">Deducted from net pay; provider claims back basic-rate (20%) relief.</span>
          </label>
        </div>

        <div class="flex items-stretch gap-2 mb-2">
          <input
            type="number"
            aria-label="Pension contribution"
            class="text-xl border-2 border-black outline-yellow-400 block w-full"
            placeholder={pensionInputType === "percent" ? "For example: 5" : "For example: 200"}
            bind:value={pensionValue}
          >
          <div class="inline-flex border-2 border-black">
            <button
              type="button"
              class="px-3 text-xl {pensionInputType === 'percent' ? 'bg-black text-white' : 'bg-white'}"
              onclick={() => { pensionInputType = "percent"; }}
            >%</button>
            <button
              type="button"
              class="px-3 text-xl {pensionInputType === 'amount' ? 'bg-black text-white' : 'bg-white'}"
              onclick={() => { pensionInputType = "amount"; }}
            >£</button>
          </div>
        </div>
        <p class="text-sm text-zinc-600">
          {#if pensionInputType === "percent"}
            Percentage of your gross salary (and bonus) paid into your pension.
          {:else}
            Amount paid into your pension at the same frequency as your salary above.
          {/if}
        </p>
      </AccordionSection>

      <AccordionSection title="Annual bonus" indicator={bonusIndicator}>
        <p class="text-base text-zinc-700 mb-3">
          A one-off annual bonus, paid in a single month.
        </p>
        <input
          type="number"
          aria-label="Annual bonus"
          class="text-xl border-2 border-black outline-yellow-400 block w-full"
          placeholder="For example: 5000"
          bind:value={annualBonus}
        >
      </AccordionSection>

      <AccordionSection title="Student loan" indicator={studentLoanIndicator}>
        {#each studentLoanPlans as studentLoanPlan}
          <label for={`student-loan-${studentLoanPlan.id}`} class="text-xl mr-8 mb-4 block">
            <input
              class="p-3 -mt-1 mr-1"
              type="checkbox"
              id={`student-loan-${studentLoanPlan.id}`}
              name="student_loan"
              value={studentLoanPlan.id}
              bind:group={selectedStudentLoanPlans}
            />
            {studentLoanPlan.label}
          </label>
        {/each}
      </AccordionSection>
    </form>
  </div>

  <aside class="md:col-span-2 md:sticky md:top-4 md:self-start">
    <div class="bg-teal-900 text-white p-4" data-testid="regular-month-card">
      <strong>Your Take-Home Pay</strong>
      <p class="text-3xl font-bold" data-testid="regular-month-figure">{regularMonthlyText}</p>
      <p data-testid="regular-annual-figure">{formatPounds(result.base.takeHome)} annually</p>
    </div>

    {#if hasBonus}
      <div class="bg-amber-100 border-2 border-amber-700 text-amber-950 p-4 mt-4" data-testid="bonus-month-card">
        <strong>Bonus month take-home</strong>
        <p class="text-2xl font-bold" data-testid="bonus-month-figure">{bonusMonthlyText}</p>
        <p class="text-sm">
          {formatPounds(result.bonusNet)} net bonus on top of your regular {formatPounds(result.regularMonthlyTakeHome)}.
        </p>
        <p class="text-sm mt-1" data-testid="annual-with-bonus">
          {formatPounds(result.withBonus.takeHome)} annually including bonus.
        </p>
      </div>
    {/if}

    <div class="mt-4">
      <p class="text-lg font-semibold mb-2">How this was worked out</p>

      <ul class="space-y-1 text-lg">
        <li>Your salary: {formatPounds(result.withBonus.annualGross - (annualBonus ?? 0))}</li>
        {#if hasBonus}
          <li>Annual bonus: {formatPounds(annualBonus ?? 0)}</li>
        {/if}
        <li>Tax-free amount: {formatPounds(result.withBonus.personalAllowance)}</li>
        {#if hasPension}
          <li>
            Pension contribution: {formatPounds(result.withBonus.grossPensionContribution)}
            <span class="block text-sm text-zinc-600 ml-1">
              {pensionMethod === "net_pay" ? "Net pay arrangement" : "Relief at source"} — costs you {formatPounds(result.withBonus.pensionCostFromTakeHome)} from take-home.
            </span>
          </li>
        {/if}
        <li>National Insurance (NI): {formatPounds(result.withBonus.nationalInsurance)}</li>
        <li class="font-semibold border-t border-zinc-500 mt-2 pt-2">
          Income tax: {formatPounds(result.withBonus.incomeTax.total)}
        </li>
        <li>
          <ul>
            {#if result.withBonus.incomeTax.incomeTaxType === "England/NI/Wales"}
              <li class="flex gap-2">
                <DownRightIcon />
                Basic rate (20%): {formatPounds(result.withBonus.incomeTax.breakdown.basicRateTax)}
              </li>
              <li class="flex gap-2">
                <DownRightIcon />
                Higher rate (40%): {formatPounds(result.withBonus.incomeTax.breakdown.higherRateTax)}
              </li>
              <li class="flex gap-2">
                <DownRightIcon />
                Additional rate (45%): {formatPounds(result.withBonus.incomeTax.breakdown.additionalRateTax)}
              </li>
            {:else}
              <li class="flex gap-2">
                <DownRightIcon />
                Starter rate: {formatPounds(result.withBonus.incomeTax.breakdown.starterRateTax)}
              </li>
              <li class="flex gap-2">
                <DownRightIcon />
                Basic rate: {formatPounds(result.withBonus.incomeTax.breakdown.basicRateTax)}
              </li>
              <li class="flex gap-2">
                <DownRightIcon />
                Intermediate rate: {formatPounds(result.withBonus.incomeTax.breakdown.intermediateRateTax)}
              </li>
              <li class="flex gap-2">
                <DownRightIcon />
                Higher rate: {formatPounds(result.withBonus.incomeTax.breakdown.higherRateTax)}
              </li>
              <li class="flex gap-2">
                <DownRightIcon />
                Advanced rate: {formatPounds(result.withBonus.incomeTax.breakdown.advancedRateTax)}
              </li>
              <li class="flex gap-2">
                <DownRightIcon />
                Top rate: {formatPounds(result.withBonus.incomeTax.breakdown.topRateTax)}
              </li>
            {/if}
          </ul>
        </li>
        {#if hasStudentLoans}
          <li>Student loan: {formatPounds(result.withBonus.totalStudentLoanRepayments)}</li>
        {/if}
      </ul>

      {#if showRasHigherRateNote}
        <p class="text-sm text-zinc-700 mt-4">
          Note: with relief at source you'd typically claim back the extra higher-rate tax relief via Self Assessment.
        </p>
      {/if}
    </div>
  </aside>
</div>
