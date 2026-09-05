<script lang="ts">
    import ChevronDownIcon from "virtual:icons/bx/bxs-chevron-down";
    import SearchIcon from "virtual:icons/bx/search";
    import type { Locale } from "../lib/i18n/locales";
    import { t } from "../lib/i18n/strings";
    import { localePath } from "../lib/i18n/urls";

    const {
        locale,
        homeHref,
        topics,
    }: {
        locale: Locale;
        homeHref: string;
        topics: {
            title: string;
            description: string;
            href: string;
        }[];
    } = $props();
    let isMenuOpen = $state(false);

    const searchHref = $derived(localePath(locale, "search"));
</script>

<nav class="w-full bg-black text-white">
    <ul class="flex items-center gap-1 mx-auto w-full max-w-5xl pl-4">
        <li class="mr-auto">
            <a
                class="font-bold text-xl hover:border-b-2 active:bg-yellow-400 active:text-black"
                href={homeHref}
            >
                moneymanual<span class="opacity-70">.org.uk</span>
            </a>
        </li>

        <li>
            <button
                class={{
                    "font-bold border-b-2 border-transparent hover:border-white uppercase flex items-center gap-1 p-4 hover:cursor-pointer": true,
                    "bg-zinc-100 text-emerald-800": isMenuOpen,
                }}
                onclick={() => (isMenuOpen = !isMenuOpen)}
            >
                {t(locale, "topics")}
                <ChevronDownIcon />
            </button>
        </li>
        <li></li>
        <li class="border-l border-zinc-400 flex items-center">
            <a
                class="pl-3 h-full hover:cursor-pointer"
                href={searchHref}
                aria-label={t(locale, "search")}
            >
                <SearchIcon class="h-6 w-6" />
            </a>
        </li>
    </ul>
</nav>

<div
    class={{
        "w-full bg-zinc-100": true,
        block: isMenuOpen,
        hidden: !isMenuOpen,
    }}
>
    <div class="px-4 py-8 mx-auto max-w-5xl">
        <ul class="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {#each topics as topic}
                <li>
                    <a href={topic.href} class="group">
                        <span
                            class="text-teal-700 group-hover:text-teal-900 font-bold text-xl underline"
                            >{topic.title}</span
                        >
                        <p
                            class="text-zinc-700 group-hover:text-zinc-900 font-medium"
                        >
                            {topic.description}
                        </p>
                    </a>
                </li>
            {/each}
        </ul>
    </div>
</div>
