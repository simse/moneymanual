<script lang="ts">
import {
	computeSavingsGrowth,
	type SavingsGrowthYear,
} from "../../../lib/savings-growth";

const poundsFormatter = new Intl.NumberFormat("en-GB", {
	currency: "GBP",
	currencyDisplay: "symbol",
	style: "currency",
	maximumFractionDigits: 0,
});

const poundsPenceFormatter = new Intl.NumberFormat("en-GB", {
	currency: "GBP",
	currencyDisplay: "symbol",
	style: "currency",
	maximumFractionDigits: 2,
});

const formatPounds = (amount: number | null | undefined): string => {
	if (!amount || amount === 0) return "£-";
	return poundsFormatter.format(amount);
};

const formatPoundsExact = (amount: number): string => {
	return poundsPenceFormatter.format(amount);
};

let startingBalance = $state<number | null>(null);
let monthlyDeposit = $state<number | null>(null);
let annualInterestRate = $state<number | null>(null);
let years = $state<number | null>(null);

const result = $derived(
	computeSavingsGrowth({
		startingBalance: startingBalance ?? 0,
		monthlyDeposit: monthlyDeposit ?? 0,
		annualInterestRate: annualInterestRate ?? 0,
		years: years ?? 0,
	}),
);

const principal = $derived(result.startingBalance + result.totalDeposits);
const interestShare = $derived(
	result.finalBalance > 0
		? (result.totalInterest / result.finalBalance) * 100
		: 0,
);
const principalShare = $derived(100 - interestShare);

const yearLabel = (entry: SavingsGrowthYear): string => {
	const value = entry.year;
	if (Number.isInteger(value)) {
		return `Year ${value}`;
	}
	return `Year ${value.toFixed(2).replace(/\.?0+$/, "")}`;
};
</script>

<div class="grid grid-cols-1 md:grid-cols-5 gap-16">
  <div class="md:col-span-3">
    <form>
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2">Starting balance</h2>
        <p class="text-base text-zinc-700 mb-3">
          How much you have saved already.
        </p>
        <input
          type="number"
          aria-label="Starting balance in pounds"
          class="text-xl border-2 border-black outline-yellow-400 block w-full"
          placeholder="For example: 1000"
          min="0"
          step="100"
          bind:value={startingBalance}
        >
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2">Monthly deposit</h2>
        <p class="text-base text-zinc-700 mb-3">
          How much you plan to add each month. Leave blank if you don't plan to add anything.
        </p>
        <input
          type="number"
          aria-label="Monthly deposit in pounds"
          class="text-xl border-2 border-black outline-yellow-400 block w-full"
          placeholder="For example: 100"
          min="0"
          step="10"
          bind:value={monthlyDeposit}
        >
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2">Annual interest rate</h2>
        <p class="text-base text-zinc-700 mb-3">
          The yearly rate (AER) your savings earn. UK savings accounts typically advertise this figure.
        </p>
        <div class="flex items-stretch gap-2">
          <input
            type="number"
            aria-label="Annual interest rate as a percentage"
            class="text-xl border-2 border-black outline-yellow-400 block w-full"
            placeholder="For example: 5"
            min="0"
            step="0.1"
            bind:value={annualInterestRate}
          >
          <span class="border-2 border-black px-3 text-xl bg-white inline-flex items-center">%</span>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-2">Time period</h2>
        <p class="text-base text-zinc-700 mb-3">
          How many years you plan to save for.
        </p>
        <div class="flex items-stretch gap-2">
          <input
            type="number"
            aria-label="Time period in years"
            class="text-xl border-2 border-black outline-yellow-400 block w-full"
            placeholder="For example: 10"
            min="0"
            max="80"
            step="1"
            bind:value={years}
          >
          <span class="border-2 border-black px-3 text-xl bg-white inline-flex items-center">years</span>
        </div>
      </div>

      <p class="text-sm text-zinc-600">
        Assumes interest compounds monthly and that you make each deposit at the start of the month. Tax on interest is not included.
      </p>
    </form>
  </div>

  <aside class="md:col-span-2 md:sticky md:top-4 md:self-start">
    <div class="bg-teal-900 text-white p-4" data-testid="final-balance-card">
      <strong>Final balance</strong>
      <p class="text-3xl font-bold" data-testid="final-balance">{formatPounds(result.finalBalance)}</p>
      <p>after {years ?? 0} year{(years ?? 0) === 1 ? "" : "s"}</p>
    </div>

    {#if result.finalBalance > 0}
      <div class="mt-4 border-2 border-black">
        <div class="flex h-3 w-full" aria-hidden="true">
          <div class="bg-teal-700" style:width={`${principalShare}%`}></div>
          <div class="bg-amber-400" style:width={`${interestShare}%`}></div>
        </div>
        <ul class="text-lg p-4 space-y-1">
          <li class="flex items-center gap-2">
            <span class="size-3 bg-teal-700 inline-block shrink-0" aria-hidden="true"></span>
            <span>Your money: <strong>{formatPounds(principal)}</strong></span>
          </li>
          <li class="flex items-center gap-2 ml-5 text-base text-zinc-700">
            <span>Starting balance: {formatPounds(result.startingBalance)}</span>
          </li>
          <li class="flex items-center gap-2 ml-5 text-base text-zinc-700">
            <span>Total deposits: {formatPounds(result.totalDeposits)}</span>
          </li>
          <li class="flex items-center gap-2 mt-2">
            <span class="size-3 bg-amber-400 inline-block shrink-0" aria-hidden="true"></span>
            <span>Interest earned: <strong>{formatPounds(result.totalInterest)}</strong></span>
          </li>
        </ul>
      </div>
    {/if}

    {#if result.yearlyBreakdown.length > 0}
      <details class="mt-4 group [&_summary::-webkit-details-marker]:hidden">
        <summary class="cursor-pointer text-lg font-semibold underline">
          Show year-by-year breakdown
        </summary>
        <div class="mt-3 overflow-x-auto">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="border-b-2 border-black text-left">
                <th class="py-2 pr-2 font-semibold">Year</th>
                <th class="py-2 pr-2 font-semibold text-right">Deposits</th>
                <th class="py-2 pr-2 font-semibold text-right">Interest</th>
                <th class="py-2 pr-2 font-semibold text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {#each result.yearlyBreakdown as entry}
                <tr class="border-b border-zinc-300">
                  <td class="py-2 pr-2">{yearLabel(entry)}</td>
                  <td class="py-2 pr-2 text-right">{formatPoundsExact(entry.deposits)}</td>
                  <td class="py-2 pr-2 text-right">{formatPoundsExact(entry.interest)}</td>
                  <td class="py-2 pr-2 text-right font-semibold">{formatPoundsExact(entry.endBalance)}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </details>
    {/if}
  </aside>
</div>
