<script setup>
import AppLayout from '../layouts/AppLayout.vue'
import { useRouteStore } from '../stores/route'

const routeStore = useRouteStore()
</script>

<template>
  <AppLayout>
    <h2 class="text-3xl font-bold">Route</h2>

    <p class="muted mt-3">
      View the trip as a day-by-day route timeline. Click on each stop for more details.
    </p>

    <section v-if="routeStore.stops.length === 0" class="card mt-6">
      <h3 class="text-xl font-bold">No route stops yet</h3>
      <p class="muted mt-2">
        Add your first route stop from the admin page.
      </p>

      <RouterLink
        to="/admin"
        class="mt-5 inline-flex rounded-full bg-blue-600 px-5 py-3 font-bold text-white dark:bg-cyan-400 dark:text-slate-950"
      >
        Add route stop
      </RouterLink>
    </section>

    <section v-else class="mt-6">
        <div class="relative space-y-5">
            <div class="absolute left-5 top-4 h-full w-0.5 bg-slate-200 dark:bg-slate-800"></div>

            <article
            v-for="(stop, index) in routeStore.stops"
            :key="stop.id"
            class="relative pl-14"
            >
                <div
                    class="absolute left-0 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white dark:bg-cyan-400 dark:text-slate-950"
                >
                    {{ index + 1 }}
                </div>

                <RouterLink :to="`/route/${stop.id}`" class="card block">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                        <p class="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-cyan-300">
                            {{ stop.dates || `Stop ${index + 1}` }}
                        </p>

                        <h3 class="mt-1 text-2xl font-bold">
                            {{ stop.city }}, {{ stop.country }}
                        </h3>
                        </div>

                        <button
                        class="rounded-full bg-red-100 px-3 py-2 text-xs font-bold text-red-700 dark:bg-red-400/10 dark:text-red-300"
                        @click="routeStore.deleteStop(stop.id)"
                        >
                        Delete
                        </button>
                    </div>

                    <div class="mt-5 grid gap-3 sm:grid-cols-2">
                        <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                        <p class="muted text-sm">Drive time</p>
                        <p class="mt-1 font-bold">
                            {{ stop.driveTime || 'Not added yet' }}
                        </p>
                        </div>

                        <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                        <p class="muted text-sm">Accommodation</p>
                        <p class="mt-1 font-bold">
                            {{ stop.accommodation || 'Not added yet' }}
                        </p>
                        </div>
                    </div>

                    <p v-if="stop.notes" class="muted mt-4">
                        {{ stop.notes }}
                    </p>
                </RouterLink>
            </article>
        </div>
    </section>
  </AppLayout>
</template>