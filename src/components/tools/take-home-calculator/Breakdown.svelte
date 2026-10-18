<script lang="ts">
import { copy } from "../../../lib/copy";
import type { PensionMethod, TakeHomeResult } from "../../../lib/take-home-pay";

interface Props {
	result: TakeHomeResult;
	annualBonus: number;
	pensionMethod: PensionMethod;
}

const { result, annualBonus, pensionMethod }: Props = $props();

type Period = "year" | "month";

let period = $state<Period>("year");

const periods: { id: Period; label: string }[] = [
	{ id: "year", label: copy.thWorkingsYearly },
	{ id: "month", label: copy.thWorkingsMonthly },
];

const yearFormatter = new Intl.NumberFormat("en-GB", {
	currency: "GBP",
	style: "currency",
	maximumFractionDigits: 0,
});

const monthFormatter = new Intl.NumberFormat("en-GB", {
	currency: "GBP",
	style: "currency",
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

// The yearly view includes the bonus. The monthly view shows a typical month
// without it, matching the monthly figure at the top of the results.
const isMonthly = $derived(period === "month");
const scenario = $derived(isMonthly ? result.base : result.withBonus);
const bonus = $derived(isMonthly ? 0 : annualBonus);

const amount = (annual: number): string =>
	(isMonthly ? monthFormatter : yearFormatter).format(annual / (isMonthly ? 12 : 1));

const deduction = (annual: number): string =>
	annual > 0 ? `−${amount(annual)}` : amount(0);

const taxBands = $derived.by(() => {
	const { incomeTax } = scenario;

	const bands =
		incomeTax.incomeTaxType === "England/NI/Wales"
			? [
					{ label: copy.thBandBasicRate, value: incomeTax.breakdown.basicRateTax },
					{ label: copy.thBandHigherRate, value: incomeTax.breakdown.higherRateTax },
					{
						label: copy.thBandAdditionalRate,
						value: incomeTax.breakdown.additionalRateTax,
					},
				]
			: [
					{ label: copy.thBandStarterRate, value: incomeTax.breakdown.starterRateTax },
					{ label: copy.thBandBasicRateScot, value: incomeTax.breakdown.basicRateTax },
					{
						label: copy.thBandIntermediateRate,
						value: incomeTax.breakdown.intermediateRateTax,
					},
					{ label: copy.thBandHigherRateScot, value: incomeTax.breakdown.higherRateTax },
					{ label: copy.thBandAdvancedRate, value: incomeTax.breakdown.advancedRateTax },
					{ label: copy.thBandTopRate, value: incomeTax.breakdown.topRateTax },
				];

	return bands.filter((band) => band.value > 0);
});
</script>

<div class="flex flex-wrap items-center justify-between gap-2 mb-2">
  <p class="text-lg font-semibold">{copy.thWorkingsHeading}</p>
  <div class="flex" role="group" aria-label={copy.thWorkingsPeriodAria}>
    {#each periods as option}
      <button
        type="button"
        class={[
          "border-2 border-black px-3 py-0.5 text-sm font-semibold cursor-pointer outline-yellow-400 -ml-0.5 first:ml-0",
          period === option.id
            ? "bg-teal-900 text-white hover:bg-teal-700"
            : "bg-white hover:bg-zinc-200",
        ]}
        aria-pressed={period === option.id}
        onclick={() => (period = option.id)}
      >
        {option.label}
      </button>
    {/each}
  </div>
</div>

<p class="text-sm text-zinc-700 mb-3">{copy.thWorkingsIntro}</p>

<div class="text-lg tabular-nums" data-testid="workings">
  <div class="flex justify-between gap-4 py-1">
    <span>{copy.thWorkingsSalary}</span>
    <span>{amount(scenario.annualGross - bonus)}</span>
  </div>

  {#if bonus > 0}
    <div class="flex justify-between gap-4 py-1">
      <span>{copy.thWorkingsBonus}</span>
      <span>{amount(bonus)}</span>
    </div>
  {/if}

  {#if scenario.grossPensionContribution > 0}
    <div class="py-1">
      <div class="flex justify-between gap-4">
        <span>{copy.thWorkingsPension}</span>
        <span class="text-red-800">{deduction(scenario.pensionCostFromTakeHome)}</span>
      </div>
      <p class="text-sm text-zinc-600">
        {pensionMethod === "net_pay"
          ? copy.thWorkingsPensionNetPayNote
          : copy.thWorkingsPensionRasNote(amount(scenario.grossPensionContribution))}
      </p>
    </div>
  {/if}

  <div class="py-1">
    <div class="flex justify-between gap-4">
      <span>{copy.thWorkingsIncomeTax}</span>
      <span class="text-red-800">{deduction(scenario.incomeTax.total)}</span>
    </div>
    <div class="text-sm text-zinc-600 pl-4 border-l-2 border-zinc-300 mt-1 space-y-0.5">
      <div class="flex justify-between gap-4">
        <span>{copy.thWorkingsTaxFree}</span>
        <span>{amount(scenario.personalAllowance)}</span>
      </div>
      {#each taxBands as band}
        <div class="flex justify-between gap-4">
          <span>{band.label}</span>
          <span>{amount(band.value)}</span>
        </div>
      {/each}
    </div>
  </div>

  <div class="flex justify-between gap-4 py-1">
    <span>{copy.thWorkingsNi}</span>
    <span class="text-red-800">{deduction(scenario.nationalInsurance)}</span>
  </div>

  {#if scenario.totalStudentLoanRepayments > 0}
    <div class="flex justify-between gap-4 py-1">
      <span>{copy.thWorkingsStudentLoan}</span>
      <span class="text-red-800">{deduction(scenario.totalStudentLoanRepayments)}</span>
    </div>
  {/if}

  <div class="flex justify-between gap-4 font-bold border-t-2 border-black mt-2 pt-2">
    <span>{copy.thWorkingsTakeHome}</span>
    <span>{amount(scenario.takeHome)}</span>
  </div>
</div>

{#if isMonthly && annualBonus > 0}
  <p class="text-sm text-zinc-700 mt-2">{copy.thWorkingsMonthlyBonusNote}</p>
{/if}
