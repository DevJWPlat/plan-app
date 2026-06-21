<script setup>
import AppLayout from '../layouts/AppLayout.vue'

const filters = ['All', 'Accommodation', 'Car', 'Trips']
</script>

<template>
  <AppLayout>
    <h2 class="text-3xl font-bold">Pricing</h2>

    <p class="mt-3 text-lg text-slate-500 dark:text-slate-400">
      Track all costs for accommodation, trips, car hire, fuel and extras.
    </p>

    <div class="mt-6 flex gap-3 overflow-x-auto pb-2">
        <button
            v-for="filter in filters"
            :key="filter"
            class="shrink-0 rounded-full border px-5 py-3 font-bold shadow-sm transition active:scale-95"
            :class="
            filter === 'All'
                ? 'border-blue-600 bg-blue-600 text-white shadow-blue-500/20 dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
            "
        >
            {{ filter }}
        </button>
    </div>

    <section class="mt-6 grid gap-4 md:grid-cols-3">
      <article class="card">
        <p class="muted">Estimated total</p>
        <p class="mt-2 text-4xl font-bold">£0.00</p>
      </article>

      <article class="card">
        <p class="muted">Per person</p>
        <p class="mt-2 text-4xl font-bold">£0.00</p>
      </article>

      <article class="card">
        <p class="muted">Confirmed items</p>
        <p class="mt-2 text-4xl font-bold">0</p>
      </article>
    </section>

    <section class="mt-6 grid gap-4 md:grid-cols-2">
      <article class="card">
        <p class="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-cyan-300">
          Accommodation
        </p>
        <h3 class="mt-2 text-xl font-bold">No accommodation costs yet</h3>
        <p class="muted mt-2">
          Add hotels, villas or apartments from the admin page.
        </p>
      </article>

      <article class="card">
        <p class="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-cyan-300">
          Car hire
        </p>
        <h3 class="mt-2 text-xl font-bold">No car costs yet</h3>
        <p class="muted mt-2">
          Add car hire, fuel, tolls and border fees later.
        </p>
      </article>
    </section>
  </AppLayout>
</template>