<script lang="ts">
import DownRightIcon from "virtual:icons/material-symbols/subdirectory-arrow-right";
import type { TakeHomePayState } from "../../../lib/calculator-state-schemas";
import type { Locale } from "../../../lib/i18n/locales";
import { t } from "../../../lib/i18n/strings";
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

let { locale, initial }: { locale: Locale; initial: TakeHomePayState | null } =
	$props();

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
	{ id: "weekly", label: t(locale, "thFreqWeekly"), toAnnual: (n) => n * 52 },
	{
		id: "bi_weekly",
		label: t(locale, "thFreqFortnightly"),
		toAnnual: (n) => n * 26,
	},
	{ id: "monthly", label: t(locale, "thFreqMonthly"), toAnnual: (n) => n * 12 },
	{ id: "annually", label: t(locale, "thFreqAnnually"), toAnnual: (n) => n },
]);

const countries: { id: Country; label: string }[] = $derived([
	{ id: "England/NI/Wales", label: t(locale, "thCountryEngNiWales") },
	{ id: "Scotland", label: t(locale, "thCountryScotland") },
]);

const studentLoanPlans: { id: StudentLoanPlan; label: string }[] = $derived([
	{ id: 1, label: t(locale, "thStudentLoanPlan1") },
	{ id: 2, label: t(locale, "thStudentLoanPlan2") },
	{ id: 4, label: t(locale, "thStudentLoanPlan4") },
	{ id: 5, label: t(locale, "thStudentLoanPlan5") },
]);

let selectedTaxYear = $state<TaxYear>(
	initial?.selectedTaxYear ?? DEFAULT_TAX_YEAR,
);
let selectedPayFrequency = $state(initial?.selectedPayFrequency ?? "annually");
let selectedCountry = $state<Country>(
	initial?.selectedCountry ?? "England/NI/Wales",
);
let selectedStudentLoanPlans = $state<StudentLoanPlan[]>(
	initial?.selectedStudentLoanPlans ?? [],
);
let grossIncome = $state<number | null>(initial?.grossIncome ?? null);
let pensionMethod = $state<PensionMethod>(initial?.pensionMethod ?? "net_pay");
let pensionInputType = $state<PensionInputType>(
	initial?.pensionInputType ?? "percent",
);
let pensionValue = $state<number | null>(initial?.pensionValue ?? null);
let annualBonus = $state<number | null>(initial?.annualBonus ?? null);

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
	if ((pensionValue ?? 0) <= 0) return null;
	return pensionInputType === "percent"
		? `${pensionValue}%`
		: formatPounds(pensionValue);
});
const bonusIndicator = $derived(hasBonus ? formatPounds(annualBonus) : null);
const studentLoanIndicator = $derived(
	selectedStudentLoanPlans.length > 0
		? t(locale, "pluralPlans")(selectedStudentLoanPlans.length)
		: null,
);

const regularMonthlyText = $derived(
	t(locale, "thResultMonthly")(formatPounds(result.regularMonthlyTakeHome)),
);
const bonusMonthlyText = $derived(
	t(locale, "thBonusMonthMonthly")(formatPounds(result.bonusMonthTakeHome)),
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
        <h2 class="text-2xl font-bold mb-4">{t(locale, "thTaxYearHeading")}</h2>
        <select
          aria-label={t(locale, "thTaxYearAria")}
          bind:value={selectedTaxYear}
          class="text-xl border-2 border-black outline-yellow-400"
        >
          {#each SUPPORTED_TAX_YEARS as year}
            <option value={year}>{year}</option>
          {/each}
        </select>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4">{t(locale, "thCountryHeading")}</h2>
        <select
          aria-label={t(locale, "thCountryAria")}
          bind:value={selectedCountry}
          class="text-xl border-2 border-black outline-yellow-400"
        >
          {#each countries as country}
            <option value={country.id}>{country.label}</option>
          {/each}
        </select>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4">{t(locale, "thSalaryHeading")}</h2>
        <input
          type="number"
          aria-label={t(locale, "thSalaryAria")}
          class="text-xl border-2 border-black outline-yellow-400 block mb-8 w-full"
          placeholder={t(locale, "thSalaryPlaceholder")}
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

      <AccordionSection title={t(locale, "thPensionTitle")} indicator={pensionIndicator}>
        <p class="text-base text-zinc-700 mb-3">
          {t(locale, "thPensionIntro")}
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
            {t(locale, "thPensionNetPay")}
            <span class="block text-sm text-zinc-600 ml-7">{t(locale, "thPensionNetPayHelp")}</span>
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
            {t(locale, "thPensionRas")}
            <span class="block text-sm text-zinc-600 ml-7">{t(locale, "thPensionRasHelp")}</span>
          </label>
        </div>

        <div class="flex items-stretch gap-2 mb-2">
          <input
            type="number"
            aria-label={t(locale, "thPensionAria")}
            class="text-xl border-2 border-black outline-yellow-400 block w-full"
            placeholder={pensionInputType === "percent" ? t(locale, "thPensionPercentPlaceholder") : t(locale, "thPensionAmountPlaceholder")}
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
            {t(locale, "thPensionPercentHelp")}
          {:else}
            {t(locale, "thPensionAmountHelp")}
          {/if}
        </p>
      </AccordionSection>

      <AccordionSection title={t(locale, "thBonusTitle")} indicator={bonusIndicator}>
        <p class="text-base text-zinc-700 mb-3">
          {t(locale, "thBonusIntro")}
        </p>
        <input
          type="number"
          aria-label={t(locale, "thBonusAria")}
          class="text-xl border-2 border-black outline-yellow-400 block w-full"
          placeholder={t(locale, "thBonusPlaceholder")}
          bind:value={annualBonus}
        >
      </AccordionSection>

      <AccordionSection title={t(locale, "thStudentLoanTitle")} indicator={studentLoanIndicator}>
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
      <strong>{t(locale, "thResultHeading")}</strong>
      <p class="text-3xl font-bold" data-testid="regular-month-figure">{regularMonthlyText}</p>
      <p data-testid="regular-annual-figure">{t(locale, "thResultAnnual")(formatPounds(result.base.takeHome))}</p>
    </div>

    {#if hasBonus}
      <div class="bg-amber-100 border-2 border-amber-700 text-amber-950 p-4 mt-4" data-testid="bonus-month-card">
        <strong>{t(locale, "thBonusMonthHeading")}</strong>
        <p class="text-2xl font-bold" data-testid="bonus-month-figure">{bonusMonthlyText}</p>
        <p class="text-sm">
          {t(locale, "thBonusMonthNetOnTop")(formatPounds(result.bonusNet), formatPounds(result.regularMonthlyTakeHome))}
        </p>
        <p class="text-sm mt-1" data-testid="annual-with-bonus">
          {t(locale, "thBonusMonthAnnual")(formatPounds(result.withBonus.takeHome))}
        </p>
      </div>
    {/if}

    <div class="mt-4">
      <p class="text-lg font-semibold mb-2">{t(locale, "thWorkingsHeading")}</p>

      <ul class="space-y-1 text-lg">
        <li>{t(locale, "thWorkingsSalary")}: {formatPounds(result.withBonus.annualGross - (annualBonus ?? 0))}</li>
        {#if hasBonus}
          <li>{t(locale, "thWorkingsBonus")}: {formatPounds(annualBonus ?? 0)}</li>
        {/if}
        <li>{t(locale, "thWorkingsTaxFree")}: {formatPounds(result.withBonus.personalAllowance)}</li>
        {#if hasPension}
          <li>
            {t(locale, "thWorkingsPension")}: {formatPounds(result.withBonus.grossPensionContribution)}
            <span class="block text-sm text-zinc-600 ml-1">
              {t(locale, "thWorkingsPensionCost")(pensionMethod === "net_pay" ? t(locale, "thPensionNetPay") : t(locale, "thPensionRas"), formatPounds(result.withBonus.pensionCostFromTakeHome))}
            </span>
          </li>
        {/if}
        <li>{t(locale, "thWorkingsNi")}: {formatPounds(result.withBonus.nationalInsurance)}</li>
        <li class="font-semibold border-t border-zinc-500 mt-2 pt-2">
          {t(locale, "thWorkingsIncomeTax")}: {formatPounds(result.withBonus.incomeTax.total)}
        </li>
        <li>
          <ul>
            {#if result.withBonus.incomeTax.incomeTaxType === "England/NI/Wales"}
              <li class="flex gap-2">
                <DownRightIcon />
                {t(locale, "thBandBasicRate")}: {formatPounds(result.withBonus.incomeTax.breakdown.basicRateTax)}
              </li>
              <li class="flex gap-2">
                <DownRightIcon />
                {t(locale, "thBandHigherRate")}: {formatPounds(result.withBonus.incomeTax.breakdown.higherRateTax)}
              </li>
              <li class="flex gap-2">
                <DownRightIcon />
                {t(locale, "thBandAdditionalRate")}: {formatPounds(result.withBonus.incomeTax.breakdown.additionalRateTax)}
              </li>
            {:else}
              <li class="flex gap-2">
                <DownRightIcon />
                {t(locale, "thBandStarterRate")}: {formatPounds(result.withBonus.incomeTax.breakdown.starterRateTax)}
              </li>
              <li class="flex gap-2">
                <DownRightIcon />
                {t(locale, "thBandBasicRateScot")}: {formatPounds(result.withBonus.incomeTax.breakdown.basicRateTax)}
              </li>
              <li class="flex gap-2">
                <DownRightIcon />
                {t(locale, "thBandIntermediateRate")}: {formatPounds(result.withBonus.incomeTax.breakdown.intermediateRateTax)}
              </li>
              <li class="flex gap-2">
                <DownRightIcon />
                {t(locale, "thBandHigherRateScot")}: {formatPounds(result.withBonus.incomeTax.breakdown.higherRateTax)}
              </li>
              <li class="flex gap-2">
                <DownRightIcon />
                {t(locale, "thBandAdvancedRate")}: {formatPounds(result.withBonus.incomeTax.breakdown.advancedRateTax)}
              </li>
              <li class="flex gap-2">
                <DownRightIcon />
                {t(locale, "thBandTopRate")}: {formatPounds(result.withBonus.incomeTax.breakdown.topRateTax)}
              </li>
            {/if}
          </ul>
        </li>
        {#if hasStudentLoans}
          <li>{t(locale, "thWorkingsStudentLoan")}: {formatPounds(result.withBonus.totalStudentLoanRepayments)}</li>
        {/if}
      </ul>

      {#if showRasHigherRateNote}
        <p class="text-sm text-zinc-700 mt-4">
          {t(locale, "thRasNote")}
        </p>
      {/if}
    </div>
  </aside>
</div>
