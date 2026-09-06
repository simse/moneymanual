<script lang="ts">
import { untrack } from "svelte";
import DownRightIcon from "virtual:icons/material-symbols/subdirectory-arrow-right";
import type { TakeHomePayState } from "../../../lib/calculator-state-schemas";
import { copy } from "../../../lib/copy";
import { persistSessionState } from "../../../lib/session-state.svelte";
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

let { initial }: { initial: TakeHomePayState | null } = $props();

// Restore saved values once; subsequent edits belong to this calculator.
const initialState = untrack(() => initial);

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
}[] = $derived([
	{ id: "weekly", label: copy.thFreqWeekly, toAnnual: (n) => n * 52 },
	{
		id: "bi_weekly",
		label: copy.thFreqFortnightly,
		toAnnual: (n) => n * 26,
	},
	{ id: "monthly", label: copy.thFreqMonthly, toAnnual: (n) => n * 12 },
	{ id: "annually", label: copy.thFreqAnnually, toAnnual: (n) => n },
]);

const countries: { id: Country; label: string }[] = $derived([
	{ id: "England/NI/Wales", label: copy.thCountryEngNiWales },
	{ id: "Scotland", label: copy.thCountryScotland },
]);

const studentLoanPlans: { id: StudentLoanPlan; label: string }[] = $derived([
	{ id: 1, label: copy.thStudentLoanPlan1 },
	{ id: 2, label: copy.thStudentLoanPlan2 },
	{ id: 4, label: copy.thStudentLoanPlan4 },
	{ id: 5, label: copy.thStudentLoanPlan5 },
]);

let selectedTaxYear = $state<TaxYear>(
	initialState?.selectedTaxYear ?? DEFAULT_TAX_YEAR,
);

let selectedPayFrequency = $state(initialState?.selectedPayFrequency ?? "annually");

let selectedCountry = $state<Country>(
	initialState?.selectedCountry ?? "England/NI/Wales",
);

let selectedStudentLoanPlans = $state<StudentLoanPlan[]>(
	initialState?.selectedStudentLoanPlans ?? [],
);

let grossIncome = $state<number | null>(initialState?.grossIncome ?? null);
let pensionMethod = $state<PensionMethod>(initialState?.pensionMethod ?? "net_pay");

let pensionInputType = $state<PensionInputType>(
	initialState?.pensionInputType ?? "percent",
);

let pensionValue = $state<number | null>(initialState?.pensionValue ?? null);
let annualBonus = $state<number | null>(initialState?.annualBonus ?? null);

persistSessionState("take-home-pay", () => ({
	selectedTaxYear,
	selectedPayFrequency,
	selectedCountry,
	selectedStudentLoanPlans,
	grossIncome,
	pensionMethod,
	pensionInputType,
	pensionValue,
	annualBonus,
}));

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
	if ((pensionValue ?? 0) <= 0) {return null;}

	return pensionInputType === "percent"
		? `${pensionValue}%`
		: formatPounds(pensionValue);
});

const bonusIndicator = $derived(hasBonus ? formatPounds(annualBonus) : null);

const studentLoanIndicator = $derived(
	selectedStudentLoanPlans.length > 0
		? copy.pluralPlans(selectedStudentLoanPlans.length)
		: null,
);

const regularMonthlyText = $derived(
	copy.thResultMonthly(formatPounds(result.regularMonthlyTakeHome)),
);

const bonusMonthlyText = $derived(
	copy.thBonusMonthMonthly(formatPounds(result.bonusMonthTakeHome)),
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
        <h2 class="text-2xl font-bold mb-4">{copy.thTaxYearHeading}</h2>
        <select
          aria-label={copy.thTaxYearAria}
          bind:value={selectedTaxYear}
          class="text-xl border-2 border-black outline-yellow-400"
        >
          {#each SUPPORTED_TAX_YEARS as year}
            <option value={year}>{year}</option>
          {/each}
        </select>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4">{copy.thCountryHeading}</h2>
        <select
          aria-label={copy.thCountryAria}
          bind:value={selectedCountry}
          class="text-xl border-2 border-black outline-yellow-400"
        >
          {#each countries as country}
            <option value={country.id}>{country.label}</option>
          {/each}
        </select>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4">{copy.thSalaryHeading}</h2>
        <input
          type="number"
          aria-label={copy.thSalaryAria}
          class="text-xl border-2 border-black outline-yellow-400 block mb-8 w-full"
          placeholder={copy.thSalaryPlaceholder}
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

      <AccordionSection title={copy.thPensionTitle} indicator={pensionIndicator}>
        <p class="text-base text-zinc-700 mb-3">
          {copy.thPensionIntro}
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
            {copy.thPensionNetPay}
            <span class="block text-sm text-zinc-600 ml-7">{copy.thPensionNetPayHelp}</span>
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
            {copy.thPensionRas}
            <span class="block text-sm text-zinc-600 ml-7">{copy.thPensionRasHelp}</span>
          </label>
        </div>

        <div class="flex items-stretch gap-2 mb-2">
          <input
            type="number"
            aria-label={copy.thPensionAria}
            class="text-xl border-2 border-black outline-yellow-400 block w-full"
            placeholder={pensionInputType === "percent" ? copy.thPensionPercentPlaceholder : copy.thPensionAmountPlaceholder}
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
            {copy.thPensionPercentHelp}
          {:else}
            {copy.thPensionAmountHelp}
          {/if}
        </p>
      </AccordionSection>

      <AccordionSection title={copy.thBonusTitle} indicator={bonusIndicator}>
        <p class="text-base text-zinc-700 mb-3">
          {copy.thBonusIntro}
        </p>
        <input
          type="number"
          aria-label={copy.thBonusAria}
          class="text-xl border-2 border-black outline-yellow-400 block w-full"
          placeholder={copy.thBonusPlaceholder}
          bind:value={annualBonus}
        >
      </AccordionSection>

      <AccordionSection title={copy.thStudentLoanTitle} indicator={studentLoanIndicator}>
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
      <strong>{copy.thResultHeading}</strong>
      <p class="text-3xl font-bold" data-testid="regular-month-figure">{regularMonthlyText}</p>
      <p data-testid="regular-annual-figure">{copy.thResultAnnual(formatPounds(result.base.takeHome))}</p>
    </div>

    {#if hasBonus}
      <div class="bg-amber-100 border-2 border-amber-700 text-amber-950 p-4 mt-4" data-testid="bonus-month-card">
        <strong>{copy.thBonusMonthHeading}</strong>
        <p class="text-2xl font-bold" data-testid="bonus-month-figure">{bonusMonthlyText}</p>
        <p class="text-sm">
          {copy.thBonusMonthNetOnTop(formatPounds(result.bonusNet), formatPounds(result.regularMonthlyTakeHome))}
        </p>
        <p class="text-sm mt-1" data-testid="annual-with-bonus">
          {copy.thBonusMonthAnnual(formatPounds(result.withBonus.takeHome))}
        </p>
      </div>
    {/if}

    <div class="mt-4">
      <p class="text-lg font-semibold mb-2">{copy.thWorkingsHeading}</p>

      <ul class="space-y-1 text-lg">
        <li>{copy.thWorkingsSalary}: {formatPounds(result.withBonus.annualGross - (annualBonus ?? 0))}</li>
        {#if hasBonus}
          <li>{copy.thWorkingsBonus}: {formatPounds(annualBonus ?? 0)}</li>
        {/if}
        <li>{copy.thWorkingsTaxFree}: {formatPounds(result.withBonus.personalAllowance)}</li>
        {#if hasPension}
          <li>
            {copy.thWorkingsPension}: {formatPounds(result.withBonus.grossPensionContribution)}
            <span class="block text-sm text-zinc-600 ml-1">
              {copy.thWorkingsPensionCost(pensionMethod === "net_pay" ? copy.thPensionNetPay : copy.thPensionRas, formatPounds(result.withBonus.pensionCostFromTakeHome))}
            </span>
          </li>
        {/if}
        <li>{copy.thWorkingsNi}: {formatPounds(result.withBonus.nationalInsurance)}</li>
        <li class="font-semibold border-t border-zinc-500 mt-2 pt-2">
          {copy.thWorkingsIncomeTax}: {formatPounds(result.withBonus.incomeTax.total)}
        </li>
        <li>
          <ul>
            {#if result.withBonus.incomeTax.incomeTaxType === "England/NI/Wales"}
              <li class="flex gap-2">
                <DownRightIcon />
                {copy.thBandBasicRate}: {formatPounds(result.withBonus.incomeTax.breakdown.basicRateTax)}
              </li>
              <li class="flex gap-2">
                <DownRightIcon />
                {copy.thBandHigherRate}: {formatPounds(result.withBonus.incomeTax.breakdown.higherRateTax)}
              </li>
              <li class="flex gap-2">
                <DownRightIcon />
                {copy.thBandAdditionalRate}: {formatPounds(result.withBonus.incomeTax.breakdown.additionalRateTax)}
              </li>
            {:else}
              <li class="flex gap-2">
                <DownRightIcon />
                {copy.thBandStarterRate}: {formatPounds(result.withBonus.incomeTax.breakdown.starterRateTax)}
              </li>
              <li class="flex gap-2">
                <DownRightIcon />
                {copy.thBandBasicRateScot}: {formatPounds(result.withBonus.incomeTax.breakdown.basicRateTax)}
              </li>
              <li class="flex gap-2">
                <DownRightIcon />
                {copy.thBandIntermediateRate}: {formatPounds(result.withBonus.incomeTax.breakdown.intermediateRateTax)}
              </li>
              <li class="flex gap-2">
                <DownRightIcon />
                {copy.thBandHigherRateScot}: {formatPounds(result.withBonus.incomeTax.breakdown.higherRateTax)}
              </li>
              <li class="flex gap-2">
                <DownRightIcon />
                {copy.thBandAdvancedRate}: {formatPounds(result.withBonus.incomeTax.breakdown.advancedRateTax)}
              </li>
              <li class="flex gap-2">
                <DownRightIcon />
                {copy.thBandTopRate}: {formatPounds(result.withBonus.incomeTax.breakdown.topRateTax)}
              </li>
            {/if}
          </ul>
        </li>
        {#if hasStudentLoans}
          <li>{copy.thWorkingsStudentLoan}: {formatPounds(result.withBonus.totalStudentLoanRepayments)}</li>
        {/if}
      </ul>

      {#if showRasHigherRateNote}
        <p class="text-sm text-zinc-700 mt-4">
          {copy.thRasNote}
        </p>
      {/if}
    </div>
  </aside>
</div>
