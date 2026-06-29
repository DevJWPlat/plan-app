<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import { useRouteStore } from '../stores/route'
import { useVotesStore } from '../stores/votes'
import { usePricingStore } from '../stores/pricing'

const route = useRoute()
const router = useRouter()
const routeStore = useRouteStore()
const votesStore = useVotesStore()
const pricingStore = usePricingStore()

const stop = computed(() => {
  return routeStore.stops.find((item) => String(item.id) === String(route.params.id))
})

const relatedVotes = computed(() => {
  return votesStore.voteItems.filter((item) => String(item.routeStopId) === String(route.params.id))
})

const relatedCosts = computed(() => {
  return pricingStore.costs.filter((cost) => String(cost.routeStopId) === String(route.params.id))
})

const stopCostTotal = computed(() => {
  return relatedCosts.value.reduce((total, cost) => {
    return total + Number(cost.amount || 0)
  }, 0)
})

const thingsToDo = computed(() => {
  return relatedVotes.value.filter((item) => item.type === 'Trip')
})
</script>

<template>
    <AppLayout>
        <section v-if="!stop" class="card">
        <h2 class="text-2xl font-bold">Stop not found</h2>
        <p class="muted mt-2">This route stop could not be found.</p>

        <button
            class="mt-5 rounded-full bg-blue-600 px-5 py-3 font-bold text-white dark:bg-cyan-400 dark:text-slate-950"
            @click="router.push('/route')"
        >
            Back to route
        </button>
        </section>

        <template v-else>
        <button
            class="mb-5 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 dark:bg-slate-900 dark:text-slate-200"
            @click="router.back()"
        >
            ← Back
        </button>

        <section class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <img
            v-if="stop.imageUrl"
            :src="stop.imageUrl"
            :alt="stop.city"
            class="h-64 w-full object-cover"
            />

            <div
            v-else
            class="flex h-64 items-center justify-center bg-blue-600 text-6xl dark:bg-cyan-400"
            >
            🗺️
            </div>

            <div class="p-5">
            <p class="text-sm font-bold uppercase tracking-wide text-blue-600 dark:text-cyan-300">
                {{ stop.country }}
            </p>

            <h2 class="mt-1 text-4xl font-bold">
                {{ stop.city }}
            </h2>

            <p class="muted mt-3">
                {{ stop.dates || 'Dates not added yet' }}
            </p>

            <div class="mt-5 flex flex-wrap gap-2">
                <a
                v-if="stop.mapsLink"
                :href="stop.mapsLink"
                target="_blank"
                rel="noopener noreferrer"
                class="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white dark:bg-cyan-400 dark:text-slate-950"
                >
                Open in Maps
                </a>

                <a
                v-if="stop.accommodationLink"
                :href="stop.accommodationLink"
                target="_blank"
                rel="noopener noreferrer"
                class="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                Accommodation
                </a>
            </div>
            </div>
        </section>

        <section class="mt-5 grid gap-4 sm:grid-cols-2">
            <article class="card">
            <p class="muted text-sm">Drive time</p>
            <p class="mt-1 text-xl font-bold">{{ stop.driveTime || 'Not added yet' }}</p>
            </article>

            <article class="card">
            <p class="muted text-sm">Accommodation</p>
            <p class="mt-1 text-xl font-bold">{{ stop.accommodation || 'Not added yet' }}</p>
            </article>
        </section>

        <section class="card mt-5">
            <h3 class="text-xl font-bold">Notes</h3>
            <p class="muted mt-2">{{ stop.notes || 'No notes added yet.' }}</p>
        </section>

        <section class="card mt-5">
            <h3 class="text-xl font-bold">Things to do</h3>

            <div v-if="thingsToDo.length" class="mt-4 space-y-3">
                <article
                v-for="item in thingsToDo"
                :key="item.id"
                class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950"
                >
                <h4 class="font-bold">{{ item.title }}</h4>
                <p class="muted mt-1 text-sm">{{ item.description }}</p>

                <div v-if="item.cost || item.link" class="mt-3 flex flex-wrap gap-2">
                    <span
                    v-if="item.cost"
                    class="rounded-full bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                    £{{ item.cost }}
                    </span>

                    <a
                    v-if="item.link"
                    :href="item.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="rounded-full bg-blue-100 px-3 py-2 text-sm font-bold text-blue-700 dark:bg-cyan-400/10 dark:text-cyan-300"
                    >
                    View link
                    </a>
                </div>
                </article>
            </div>

            <p v-else class="muted mt-2">
                No trips linked to this stop yet.
            </p>
        </section>

        <section class="card mt-5">
            <h3 class="text-xl font-bold">Related votes</h3>

            <div v-if="relatedVotes.length" class="mt-4 space-y-3">
                <article
                v-for="item in relatedVotes"
                :key="item.id"
                class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950"
                >
                <p class="text-xs font-bold uppercase text-blue-600 dark:text-cyan-300">
                    {{ item.type }}
                </p>
                <h4 class="mt-1 font-bold">{{ item.title }}</h4>
                <p class="muted mt-1 text-sm">{{ item.description }}</p>
                </article>
            </div>

            <p v-else class="muted mt-2">
                No votes linked to this stop yet.
            </p>
        </section>

        <section class="card mt-5">
            <h3 class="text-xl font-bold">Related costs</h3>

            <p class="muted mt-2">
                Total for this stop:
                <span class="font-bold text-slate-900 dark:text-white">
                    £{{ stopCostTotal }}
                </span>
            </p>

            <div v-if="relatedCosts.length" class="mt-4 space-y-3">
                <article
                v-for="cost in relatedCosts"
                :key="cost.id"
                class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950"
                >
                <div class="flex items-start justify-between gap-3">
                    <div>
                    <p class="text-xs font-bold uppercase text-blue-600 dark:text-cyan-300">
                        {{ cost.category }}
                    </p>
                    <h4 class="mt-1 font-bold">{{ cost.title }}</h4>
                    </div>

                    <p class="font-bold">£{{ cost.amount }}</p>
                </div>
                </article>
            </div>

            <p v-else class="muted mt-2">
                No costs linked to this stop yet.
            </p>
            </section>

        <section class="card mt-5">
            <h3 class="text-xl font-bold">Location</h3>
            <p class="muted mt-2">
            Latitude: {{ stop.lat }}<br />
            Longitude: {{ stop.lng }}
            </p>
        </section>
        </template>
    </AppLayout>
</template>