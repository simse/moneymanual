<script lang="ts">
import DownRightIcon from "virtual:icons/material-symbols/subdirectory-arrow-right";
import {
	calculateEmployeeNationalInsurance,
	calculateIncomeTax,
	calculatePersonalAllowance,
	calculateStudentLoanRepayments,
} from "@saving-tool/hmrc-income-tax";
import type {
	Country,
	StudentLoanPlan,
	TaxYear,
} from "@saving-tool/hmrc-income-tax/lib/types";

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
	formatResult: (input: number) => string;
}[] = [
	{
		id: "weekly",
		label: "Weekly",
		toAnnual: (input: number) => input * 52,
		formatResult: (input: number) => `${formatPounds(input / 52)} weekly`,
	},
	{
		id: "bi_weekly",
		label: "Fortnightly",
		toAnnual: (input: number) => input * 26,
		formatResult: (input: number) => `${formatPounds(input / 26)} fortnightly`,
	},
	{
		id: "monthly",
		label: "Monthly",
		toAnnual: (input: number) => input * 12,
		formatResult: (input: number) => `${formatPounds(input / 12)} monthly`,
	},
	{
		id: "annually",
		label: "Annually",
		toAnnual: (input: number) => input,
		formatResult: (input: number) => `${formatPounds(input)} annually`,
	},
];

const countries: { id: Country; label: string }[] = [
	{
		id: "England/NI/Wales",
		label: "England, Northern Ireland or Wales",
	},
	{
		id: "Scotland",
		label: "Scotland",
	},
];

const studentLoanPlans: { id: StudentLoanPlan; label: string }[] = [
	{
		id: 1,
		label: "Plan 1",
	},
	{
		id: 2,
		label: "Plan 2",
	},
	{
		id: 4,
		label: "Plan 4 (Scotland)",
	},
	{
		id: 5,
		label: "Plan 5",
	},
];

const taxYear: TaxYear = "2025/26";

let selectedPayFrequency = $state("annually");
let selectedCountry = $state<Country>("England/NI/Wales");
let selectedStudentLoanPlans = $state<StudentLoanPlan[]>([]);
let grossIncome = $state<number | null>(null);

const result = $derived.by(() => {
	const taxableAnnualIncome =
		payFrequencies
			.find((freq) => freq.id === selectedPayFrequency)
			?.toAnnual(grossIncome ?? 0) ?? 0;
	const country = selectedCountry;

	const personalAllowance = calculatePersonalAllowance({
		taxYear,
		country,
		taxableAnnualIncome,
	});

	const nationalInsurance = calculateEmployeeNationalInsurance({
		taxYear,
		country,
		taxableAnnualIncome,
	});

	const incomeTax = calculateIncomeTax({
		taxYear,
		country,
		taxableAnnualIncome,
		personalAllowance,
	});

	const studentLoanRepayments: Record<StudentLoanPlan, number> = {
		1: 0,
		2: 0,
		4: 0,
		5: 0,
		postgrad: 0,
	};

	for (const repaymentPlan of selectedStudentLoanPlans) {
		studentLoanRepayments[repaymentPlan] = calculateStudentLoanRepayments({
			taxYear,
			country,
			taxableAnnualIncome,
			studentLoanPlanNo: repaymentPlan,
		});
	}

	const totalStudentLoanRepayments = studentLoanPlans.reduce(
		(acc: number, repaymentPlan) => {
			return acc + studentLoanRepayments[repaymentPlan.id];
		},
		0,
	);

	const takeHomePay =
		taxableAnnualIncome -
		nationalInsurance -
		incomeTax.total -
		totalStudentLoanRepayments;

	return {
		takeHomePay,
		personalAllowance,
		nationalInsurance,
		incomeTax,
		taxableAnnualIncome,
		studentLoanRepayments,
	};
});

const formattedResult = $derived.by(() => {
	return `${formatPounds(result.takeHomePay / 12)} monthly`;
});
</script>

<div class="grid grid-cols-5 gap-16">
  <div class="col-span-3">
    <form>
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Which country do you work in?</h2>

        <select
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

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Do you have a student loan?</h2>

        {#each studentLoanPlans as studentLoanPlan}
          <label for={studentLoanPlan.id.toString()} class="text-xl mr-8 mb-4 block">
            <input
              class="p-3 -mt-1 mr-1"
              type="checkbox"
              id={studentLoanPlan.id.toString()}
              name="pay_frequency"
              value={studentLoanPlan.id}
              bind:group={selectedStudentLoanPlans}
            />
            {studentLoanPlan.label}
          </label>
        {/each}
      </div>
    </form>
  </div>

  <aside class="col-span-2 ">
    <div class="bg-teal-900 text-white p-4">
      <strong>Your Take-Home Pay</strong>
      <p class="text-3xl font-bold">{formattedResult}</p>
      <p>{formatPounds(result.takeHomePay)} annually</p>
    </div>

    <div class="mt-4">
      <p class="text-lg font-semibold mb-2">How this was worked out</p>

      <ul class="space-y-1 text-lg">
        <li>Your salary: {formatPounds(result.taxableAnnualIncome)}</li>
        <li>Tax-free amount: {formatPounds(result.personalAllowance)}</li>
        <li>National Insurance (NI): {formatPounds(result.nationalInsurance)}</li>
        <li class="font-semibold border-t border-zinc-500 mt-2 pt-2">
          Income tax: {formatPounds(result.incomeTax.total)}
        </li>
        <li>
          <ul class="">
            {#if result.incomeTax.incomeTaxType === "England/NI/Wales"}
              <li class="flex gap-2">
                <DownRightIcon />
                Basic rate (20%): {formatPounds(result.incomeTax.breakdown.basicRateTax)}
              </li>
              <li class="flex gap-2">
                <DownRightIcon />
                Higher rate (40%): {formatPounds(result.incomeTax.breakdown.higherRateTax)}
              </li>
              <li class="flex gap-2">
                <DownRightIcon />
                Additional rate (45%): {formatPounds(result.incomeTax.breakdown.additionalRateTax)}
              </li>
            {/if}
          </ul>
        </li>
      </ul>
    </div>
  </aside>
</div>
