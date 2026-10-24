<script lang="ts">
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
	{ id: "year", label: "Yearly" },
	{ id: "month", label: "Monthly" },
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

let includeBonus = $state(true);

// With the bonus included, the monthly view spreads it evenly over the year.
const hasBonus = $derived(annualBonus > 0);
const isMonthly = $derived(period === "month");
const showBonus = $derived(hasBonus && includeBonus);
const scenario = $derived(showBonus ? result.withBonus : result.base);
const bonus = $derived(showBonus ? annualBonus : 0);

const amount = (annual: number): string =>
	(isMonthly ? monthFormatter : yearFormatter).format(annual / (isMonthly ? 12 : 1));

const deduction = (annual: number): string =>
	annual > 0 ? `−${amount(annual)}` : amount(0);

const taxBands = $derived.by(() => {
	const { incomeTax } = scenario;

	const bands =
		incomeTax.incomeTaxType === "England/NI/Wales"
			? [
					{ label: "Basic rate (20%)", value: incomeTax.breakdown.basicRateTax },
					{ label: "Higher rate (40%)", value: incomeTax.breakdown.higherRateTax },
					{
						label: "Additional rate (45%)",
						value: incomeTax.breakdown.additionalRateTax,
					},
				]
			: [
					{ label: "Starter rate", value: incomeTax.breakdown.starterRateTax },
					{ label: "Basic rate", value: incomeTax.breakdown.basicRateTax },
					{
						label: "Intermediate rate",
						value: incomeTax.breakdown.intermediateRateTax,
					},
					{ label: "Higher rate", value: incomeTax.breakdown.higherRateTax },
					{ label: "Advanced rate", value: incomeTax.breakdown.advancedRateTax },
					{ label: "Top rate", value: incomeTax.breakdown.topRateTax },
				];

	return bands.filter((band) => band.value > 0);
});
</script>

<div class="flex flex-wrap items-center justify-between gap-2 mb-2">
  <p class="text-lg font-semibold">How this was worked out</p>
  <div class="flex" role="group" aria-label="Show amounts for">
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

<p class="text-sm text-zinc-700 mb-3">Amounts with a minus sign are taken off your pay.</p>

{#if hasBonus}
  <label class="flex items-center gap-2 mb-3 cursor-pointer">
    <input class="p-3" type="checkbox" bind:checked={includeBonus} />
    Include my bonus
  </label>
{/if}

<div class="text-lg tabular-nums" data-testid="workings">
  <div class="flex justify-between gap-4 py-1">
    <span>Your salary</span>
    <span>{amount(scenario.annualGross - bonus)}</span>
  </div>

  {#if bonus > 0}
    <div class="flex justify-between gap-4 py-1">
      <span>Bonus</span>
      <span>{amount(bonus)}</span>
    </div>
  {/if}

  {#if scenario.grossPensionContribution > 0}
    <div class="py-1">
      <div class="flex justify-between gap-4">
        <span>Pension</span>
        <span class="text-red-800">{deduction(scenario.pensionCostFromTakeHome)}</span>
      </div>
      <p class="text-sm text-zinc-600">
        {pensionMethod === "net_pay"
          ? "Paid before income tax, so you pay less tax."
          : `${amount(scenario.grossPensionContribution)} goes into your pension once tax relief is added.`}
      </p>
    </div>
  {/if}

  <div class="py-1">
    <div class="flex justify-between gap-4">
      <span>Income tax</span>
      <span class="text-red-800">{deduction(scenario.incomeTax.total)}</span>
    </div>
    <div class="text-sm text-zinc-600 pl-4 border-l-2 border-zinc-300 mt-1 space-y-0.5">
      <div class="flex justify-between gap-4">
        <span>Tax-free amount (no tax on this)</span>
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
    <span>National Insurance (NI)</span>
    <span class="text-red-800">{deduction(scenario.nationalInsurance)}</span>
  </div>

  {#if scenario.totalStudentLoanRepayments > 0}
    <div class="flex justify-between gap-4 py-1">
      <span>Student loan</span>
      <span class="text-red-800">{deduction(scenario.totalStudentLoanRepayments)}</span>
    </div>
  {/if}

  <div class="flex justify-between gap-4 font-bold border-t-2 border-black mt-2 pt-2">
    <span>Your take-home pay</span>
    <span>{amount(scenario.takeHome)}</span>
  </div>
</div>

{#if isMonthly && hasBonus}
  <p class="text-sm text-zinc-700 mt-2">
    {includeBonus ? "Your bonus is spread evenly over 12 months. In practice you get it in one month." : "A typical month without your bonus. Your bonus month is shown above."}
  </p>
{/if}
