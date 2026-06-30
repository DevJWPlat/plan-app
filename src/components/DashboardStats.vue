<script setup>
defineProps({
  pendingDecisions: Number,
  budget: String,
  stops: Number,
  activities: Number,
})
</script>

<template>
  <section class="mt-5 grid grid-cols-2 gap-3">
    <RouterLink to="/votes" class="card">
      <p class="muted text-sm">Pending decisions</p>
      <p class="mt-2 text-3xl font-bold">{{ pendingDecisions }}</p>
    </RouterLink>

    <RouterLink to="/pricing" class="card">
      <p class="muted text-sm">Budget</p>
      <p class="mt-2 text-3xl font-bold">{{ budget }}</p>
    </RouterLink>

    <RouterLink to="/route" class="card">
      <p class="muted text-sm">Stops</p>
      <p class="mt-2 text-3xl font-bold">{{ stops }}</p>
    </RouterLink>

    <RouterLink to="/votes" class="card">
      <p class="muted text-sm">Activities</p>
      <p class="mt-2 text-3xl font-bold">{{ activities }}</p>
    </RouterLink>
  </section>
</template>