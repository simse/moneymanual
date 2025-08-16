<script lang="ts">
  let { topics }: {
    topics: {
      title: string;
      description: string;
      href: string;
    }[];
  } = $props();
  let isMenuOpen = $state(false);
</script>

<nav class="w-full bg-black text-white">
  <ul class="flex items-center gap-1 mx-auto w-full max-w-5xl pl-4">
    <li class="mr-auto">
      <a class="font-bold text-xl hover:border-b-2 active:bg-yellow-400 active:text-black" href="/">
        moneymanual<span class="opacity-70">.org.uk</span>
      </a>
    </li>

    <li>
      <button
        class={{
          "font-bold border-b-2 border-transparent hover:border-white uppercase flex items-center gap-1 p-4 hover:cursor-pointer": true,
          "bg-white text-emerald-800": isMenuOpen,
        }}
        onclick={() => isMenuOpen = !isMenuOpen}
      >
        Topics ▾
      </button>

    <li>
    <li class="border-b-2 border-transparent hover:border-white hidden">
      <a class=" active:text-black active:bg-yellow-400 font-bold uppercase p-4 block" href="/tools">Tools</a>
    </li>
    <!--li class="border-l border-zinc-400 flex items-center">
      <button class="pl-3 h-full hover:cursor-pointer">
        <SearchIcon class="h-6 w-6" />
      </button>
    </li-->
  </ul>
</nav>

<div class={{
     "w-full bg-white": true,
     "block": isMenuOpen,
     "hidden": !isMenuOpen,
}}>
  <div class="px-4 py-8 mx-auto max-w-5xl">
    <ul class="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
       {#each topics as topic}
      <li>
        <a
          href={topic.href}
        >
          <span class="text-emerald-800 font-bold text-lg underline">{topic.title}</span>
          <p class="text-zinc-700 font-medium">{topic.description}</p>
        </a>
      </li>
       {/each}
    </ul>
  </div>
</div>