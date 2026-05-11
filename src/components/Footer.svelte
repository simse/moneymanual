<script lang="ts">
import SchoolIcon from "virtual:icons/bx/bxs-graduation";
import PoundIcon from "virtual:icons/bx/pound";
import SavingsIcon from "virtual:icons/material-symbols/savings";
import { LOCALES, type Locale, labelFor } from "../lib/i18n/locales";
import { t } from "../lib/i18n/strings";
import { alternateUrlFor, localePath } from "../lib/i18n/urls";

type Topic = { title: string; href: string };

const {
	locale,
	currentPath,
	topics,
}: {
	locale: Locale;
	currentPath: string;
	topics: Topic[];
} = $props();

const tools = $derived([
	{
		name: t(locale, "toolsTakeHomeShortName"),
		href: localePath(locale, "tools/take-home-pay"),
		bg: "bg-pink-200",
		fg: "text-pink-900",
		icon: PoundIcon,
	},
	{
		name: t(locale, "toolsSavingsShortName"),
		href: localePath(locale, "tools/savings-calculator"),
		bg: "bg-emerald-200",
		fg: "text-emerald-900",
		icon: SavingsIcon,
	},
	{
		name: t(locale, "toolsStudentLoanShortName"),
		href: localePath(locale, "tools/student-loan-repayment"),
		bg: "bg-blue-200",
		fg: "text-blue-900",
		icon: SchoolIcon,
	},
]);

const linkCls =
	"text-zinc-900 hover:text-teal-800 hover:underline font-medium block py-1";
const year = new Date().getFullYear();
const searchHref = $derived(localePath(locale, "search"));
const toolsHref = $derived(localePath(locale, "tools"));
</script>

<footer class="w-full bg-zinc-100 mt-16 border-t-4 border-teal-700">
    <div class="max-w-5xl mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div class="md:col-span-4">
                <p class="font-bold text-xl mb-2">
                    moneymanual<span class="opacity-60">.org.uk</span>
                </p>
                <p class="text-zinc-700 font-medium mb-4">
                    {t(locale, "footerTagline")}
                </p>
                <ul class="text-sm">
                    <li>
                        <a href={searchHref} class={linkCls}
                            >{t(locale, "searchTheSite")}</a
                        >
                    </li>
                    <li>
                        <a href="/sitemap-index.xml" class={linkCls}
                            >{t(locale, "sitemap")}</a
                        >
                    </li>
                </ul>
            </div>
            <div class="md:col-span-3">
                <h4 class="font-bold text-zinc-900 mb-3">
                    {t(locale, "topics")}
                </h4>
                <ul>
                    {#each topics as topic}
                        <li>
                            <a href={topic.href} class={linkCls}
                                >{topic.title}</a
                            >
                        </li>
                    {/each}
                </ul>
            </div>
            <div class="md:col-span-5">
                <div class="flex items-baseline justify-between mb-3">
                    <h4 class="font-bold text-zinc-900">
                        {t(locale, "tools")}
                    </h4>
                    <a
                        href={toolsHref}
                        class="text-teal-700 hover:text-teal-900 underline font-medium text-sm"
                    >
                        {t(locale, "seeAll")}
                    </a>
                </div>
                <ul class="flex flex-col gap-3">
                    {#each tools as tool}
                        <li>
                            <a
                                href={tool.href}
                                class="flex gap-3 group items-center"
                            >
                                <div
                                    class={`w-10 h-10 shrink-0 flex items-center justify-center ${tool.bg}`}
                                >
                                    <tool.icon class={`h-5 w-5 ${tool.fg}`} />
                                </div>
                                <span
                                    class="text-zinc-900 group-hover:text-teal-800 group-hover:underline font-bold"
                                >
                                    {tool.name}
                                </span>
                            </a>
                        </li>
                    {/each}
                </ul>
            </div>
        </div>
        <!--<nav aria-label={t(locale, "languageSwitcherLabel")} class="border-t border-zinc-300 mt-10 pt-5 flex flex-wrap items-center gap-2 text-sm">
			<span class="font-medium text-zinc-700 mr-2">{t(locale, "languageSwitcherLabel")}:</span>
			{#each LOCALES as code}
				{#if code === locale}
					<span class="px-3 py-1 bg-zinc-300 text-zinc-700 font-bold" aria-current="true">{labelFor(code)}</span>
				{:else}
					<a href={alternateUrlFor(currentPath, code)} class="px-3 py-1 bg-white border border-zinc-400 text-teal-800 hover:bg-teal-50 hover:underline font-medium">{labelFor(code)}</a>
				{/if}
			{/each}
			</nav>-->
        <div
            class="border-t border-zinc-300 mt-6 pt-5 flex flex-wrap gap-x-6 gap-y-1 text-sm text-zinc-700"
        >
            <p>{t(locale, "copyright")(year)}</p>
            <p>{t(locale, "notFinancialAdvice")}</p>
        </div>
    </div>
</footer>
