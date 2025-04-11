<script lang="ts">
  import {
    calculatePersonalAllowance,
    calculateIncomeTax,
    calculateEmployeeNationalInsurance,
  } from "@saving-tool/hmrc-income-tax";

  let income = $state();
</script>

<div class="grid grid-cols-5 gap-4">
  <div class="col-span-3">
    <h2 class="text-lg font-bold">Your Income</h2>
  </div>

  <aside class="col-span-2 bg-zinc-200 p-4">
    <p class="text-3xl font-bold">£3,432/m</p>
  </aside>
</div>
