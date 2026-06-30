<script setup>
import { Map, MapPinned, Wallet, CheckSquare, Plus } from 'lucide-vue-next'
import DashboardCard from './DashboardCard.vue'

defineProps({
  stops: Number,
  pendingDecisions: Number,
  budget: String,
})
</script>

<template>
  <section class="card mt-5">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-xl font-bold">Quick actions</h3>
        <p class="muted mt-1 text-sm">Jump straight into planning.</p>
      </div>

      <Plus class="h-5 w-5 text-slate-400" />
    </div>

    <div class="mt-5 grid grid-cols-2 gap-3">
      <DashboardCard title="Map" subtitle="View route" to="/map" :icon="Map" />
      <DashboardCard title="Stops" :subtitle="`${stops} planned`" to="/route" :icon="MapPinned" />
      <DashboardCard title="Decisions" :subtitle="`${pendingDecisions} pending`" to="/votes" :icon="CheckSquare" />
      <DashboardCard title="Budget" :subtitle="budget" to="/pricing" :icon="Wallet" />
    </div>
  </section>
</template>