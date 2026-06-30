<script setup>
defineProps({
  trips: Array,
  activeTripId: [String, Number],
  daysUntilTrip: Function,
})

const emit = defineEmits(['select', 'create'])
</script>

<template>
    <section class="card mt-5">
        <div class="flex items-center justify-between gap-4">
            <div>
                <h3 class="text-xl font-bold">My trips</h3>
                <p class="muted mt-1 text-sm">
                Switch between trips or create a new one.
                </p>
            </div>

            <button
                class="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white dark:bg-cyan-400 dark:text-slate-950"
                @click="emit('create')"
            >
                New
            </button>
        </div>
        <div class="mt-5 space-y-3">
            <button
                v-for="trip in trips"
                :key="trip.id"
                class="w-full rounded-2xl border p-4 text-left transition"
                :class="String(trip.id) === String(activeTripId)
                ? 'border-blue-600 bg-blue-50 dark:border-cyan-400 dark:bg-cyan-400/10'
                : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950'"
                @click="emit('select', trip.id)"
            >
                <div class="flex items-start justify-between gap-3">
                    <div>
                        <p class="font-bold">{{ trip.title }}</p>
                        <p class="muted mt-1 text-sm">{{ trip.subtitle || 'Planning' }}</p>
                    </div>

                    <span
                        v-if="String(trip.id) === String(activeTripId)"
                        class="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white dark:bg-cyan-400 dark:text-slate-950"
                    >
                        Active
                    </span>
                </div>

                <p v-if="trip.startDate" class="muted mt-3 text-sm">
                {{ daysUntilTrip(trip) }} days to go
                </p>
            </button>
        </div>
    </section>
</template>