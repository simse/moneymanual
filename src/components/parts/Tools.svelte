<script lang="ts">
import SchoolIcon from "virtual:icons/bx/bxs-graduation";
import LineChartIcon from "virtual:icons/bx/line-chart";
import PoundIcon from "virtual:icons/bx/pound";

const tools = [
	{
		name: "Take Home Pay Calculator",
		description:
			"Calculate how much you should earn after taxes and other contributions",
		href: "/tools/take-home-pay",
		bgColour: "bg-pink-200",
		iconColour: "text-pink-900",
		icon: PoundIcon,
	},
	//{
	//  name: 'Student Loan Repayment',
	//  description: 'Find out how long it will take to repay your student loan',
	//  href: '/tools/student-loan-repayment',
	//  bgColour: 'bg-blue-200',
	//  iconColour: 'text-blue-900',
	//  icon: SchoolIcon,
	//},
	//{
	//  name: 'Investment Calculator',
	//  description: 'Calculate how much your investments will grow over time',
	//  href: '/tools/investment-calculator',
	//  bgColour: 'bg-emerald-200',
	//  iconColour: 'text-emerald-900',
	//  icon: LineChartIcon,
	//},
];
</script>
<ul class="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {#each tools as tool}
    <li>
    <a class="flex gap-4 group" href={tool.href}>
      <div class={`w-16 h-16 shrink-0 mt-1 flex items-center justify-center ${tool.bgColour}`}>
        <tool.icon class={`h-10 w-10 ${tool.iconColour}`} />
      </div>
      <div>
        <h3 class="underline text-teal-900 group-hover:decoration-2 font-bold text-lg">{tool.name}</h3>
        <p class="font-medium">{tool.description}</p>
      </div>
    </a>
    </li>
    {/each}
</ul>
