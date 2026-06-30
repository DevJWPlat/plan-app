<script setup>
defineProps({
  trip: Object,
  daysToGo: Number,
})
</script>

<template>
    <section class="rounded-3xl bg-blue-600 p-6 text-white shadow-sm dark:border dark:border-slate-800 dark:bg-slate-900">
        <p class="text-sm font-medium opacity-90">Active trip</p>

        <h2 class="mt-2 text-3xl font-bold">
        {{ trip?.title }}
        </h2>

        <p class="mt-3 text-sm leading-6 opacity-90">
        {{ trip?.subtitle || 'Plan stops, activities, budget and decisions.' }}
        </p>

        <div v-if="trip?.startDate" class="mt-5 rounded-2xl bg-white/15 p-4">
            <p class="text-3xl font-bold">{{ daysToGo }}</p>
            <p class="text-sm opacity-90">days to go</p>
        </div>
    </section>
</template>