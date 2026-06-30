<script setup>
import { computed, ref } from 'vue'
import AppLayout from '../layouts/AppLayout.vue'
import { useAuthStore } from '../stores/auth'
import { useTripsStore } from '../stores/trips'
import { useRouteStore } from '../stores/route'
import { useActivitiesStore } from '../stores/activities'
import { usePricingStore } from '../stores/pricing'
import DashboardCard from '../components/DashboardCard.vue'
import { Map, MapPinned, Wallet, CheckSquare } from 'lucide-vue-next'
import TripHero from '../components/TripHero.vue'
import TripSwitcher from '../components/TripSwitcher.vue'

const routeStore = useRouteStore()
const activitiesStore = useActivitiesStore()
const pricingStore = usePricingStore()

const authStore = useAuthStore()
const tripsStore = useTripsStore()

const showCreateTrip = ref(false)

const tripForm = ref({
  title: '',
  subtitle: '',
  startDate: '',
  endDate: '',
})

const activeTrip = computed(() => tripsStore.activeTrip)

const countdown = computed(() => {
  if (!activeTrip.value?.startDate) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
    }
  }

  const now = new Date()
  const start = new Date(activeTrip.value.startDate)
  const diff = start - now

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
    }
  }

  return {
    days: Math.floor(diff / 1000 / 60 / 60 / 24),
    hours: Math.floor((diff / 1000 / 60 / 60) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
  }
})

const createTrip = () => {
  if (!tripForm.value.title) return

  tripsStore.addTrip(tripForm.value)

  tripForm.value = {
    title: '',
    subtitle: '',
    startDate: '',
    endDate: '',
  }

  showCreateTrip.value = false
}

const daysUntilTrip = (trip) => {
  if (!trip?.startDate) return null

  const today = new Date()
  const start = new Date(trip.startDate)
  const diff = start - today

  return Math.max(Math.ceil(diff / 1000 / 60 / 60 / 24), 0)
}

const pendingDecisions = computed(() => {
  if (!authStore.isLoggedIn) return activitiesStore.activeTripActivities.length

  return activitiesStore.activeTripActivities.filter((activity) => {
    return !activity.votes.some((vote) => vote.userName === authStore.user.name)
  }).length
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(Number(amount || 0))
}


</script>

<template>
    <AppLayout>
        <TripHero
        :trip="activeTrip"
        :days-to-go="daysUntilTrip(activeTrip)"
        />

        <section class="mt-5 grid grid-cols-2 gap-3">
            <RouterLink to="/votes" class="card">
                <p class="muted text-sm">Pending decisions</p>
                <p class="mt-2 text-3xl font-bold">{{ pendingDecisions }}</p>
            </RouterLink>

            <RouterLink to="/pricing" class="card">
                <p class="muted text-sm">Budget</p>
                <p class="mt-2 text-3xl font-bold">{{ formatCurrency(pricingStore.totalCost) }}</p>
            </RouterLink>

            <RouterLink to="/route" class="card">
                <p class="muted text-sm">Stops</p>
                <p class="mt-2 text-3xl font-bold">{{ routeStore.activeTripStops.length }}</p>
            </RouterLink>

            <RouterLink to="/votes" class="card">
                <p class="muted text-sm">Activities</p>
                <p class="mt-2 text-3xl font-bold">{{ activitiesStore.activeTripActivities.length }}</p>
            </RouterLink>
        </section>

        <section class="card mt-5">
            <div class="flex items-center justify-between">
                <div>
                <h3 class="text-xl font-bold">Quick actions</h3>
                <p class="muted mt-1 text-sm">
                    Jump straight into planning.
                </p>
                </div>

                <Plus class="h-5 w-5 text-slate-400" />
            </div>

            <div class="mt-5 grid grid-cols-2 gap-3">
                <DashboardCard title="Map" subtitle="View route" to="/map" :icon="Map" />
                <DashboardCard title="Stops" :subtitle="`${routeStore.activeTripStops.length} planned`" to="/route" :icon="MapPinned" />
                <DashboardCard title="Decisions" :subtitle="`${pendingDecisions} pending`" to="/votes" :icon="CheckSquare" />
                <DashboardCard title="Budget" :subtitle="formatCurrency(pricingStore.totalCost)" to="/pricing" :icon="Wallet" />
            </div>
        </section>

        <TripSwitcher
        :trips="tripsStore.trips"
        :active-trip-id="tripsStore.activeTripId"
        :days-until-trip="daysUntilTrip"
        @select="tripsStore.setActiveTrip"
        @create="showCreateTrip = true"
        />

        <section
        v-if="!authStore.isLoggedIn"
        class="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
        <h3 class="text-xl font-bold">Login to join the planning</h3>
        <p class="mt-2 text-slate-500 dark:text-slate-400">
            You can view the homepage without logging in, but votes and admin tools are locked.
        </p>

        <RouterLink
            to="/login"
            class="mt-4 inline-flex rounded-full bg-blue-600 px-5 py-3 font-bold text-white dark:bg-cyan-400 dark:text-slate-950"
        >
            Login
        </RouterLink>
        </section>

        <section
            v-else
            class="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
            <div class="flex items-start justify-between gap-4">
                <div>
                <p class="text-sm font-bold uppercase tracking-wide text-blue-600 dark:text-cyan-300">
                    {{ authStore.isAdmin ? 'Administrator Account' : 'Viewer Account' }}
                </p>

                <h3 class="mt-1 text-2xl font-bold">
                    Welcome back, {{ authStore.user.name }}
                </h3>

                <p class="mt-2 text-slate-500 dark:text-slate-400">
                    You're logged in as {{ authStore.user.role }}.
                </p>
                </div>

                <RouterLink
                v-if="authStore.isAdmin"
                to="/admin"
                class="shrink-0 rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
                >
                Admin
                </RouterLink>
            </div>

            <div class="mt-5 grid grid-cols-3 gap-3">
                <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <p class="text-2xl font-bold">4</p>
                <p class="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Pending votes
                </p>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <p class="text-2xl font-bold">0</p>
                <p class="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Approved stops
                </p>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <p class="text-2xl font-bold">£0</p>
                <p class="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Budget
                </p>
                </div>
            </div>

            <div class="mt-5 grid grid-cols-2 gap-3">
                <RouterLink
                to="/votes"
                class="rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-bold text-white dark:bg-white dark:text-slate-950"
                >
                View decisions
                </RouterLink>

                <RouterLink
                to="/pricing"
                class="rounded-2xl bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white dark:bg-cyan-400 dark:text-slate-950"
                >
                View budget
                </RouterLink>
            </div>
        </section>

        <Teleport to="body">
        <div
            v-if="showCreateTrip"
            class="fixed inset-0 z-[10000] flex items-end bg-slate-950/60 backdrop-blur-sm md:items-center md:justify-center"
            @click.self="showCreateTrip = false"
        >
            <div class="w-full rounded-t-3xl bg-white p-5 text-slate-900 shadow-2xl dark:bg-slate-900 dark:text-white md:max-w-md md:rounded-3xl">
            <div class="flex items-center justify-between">
                <h3 class="text-xl font-bold">Create trip</h3>

                <button
                class="rounded-full bg-slate-100 px-3 py-2 text-sm font-bold dark:bg-slate-800"
                @click="showCreateTrip = false"
                >
                Close
                </button>
            </div>

            <form class="mt-5 space-y-4" @submit.prevent="createTrip">
                <input v-model="tripForm.title" class="input" placeholder="Trip name, e.g. Japan 2028" />
                <input v-model="tripForm.subtitle" class="input" placeholder="Subtitle, e.g. Cherry blossom trip" />

                <div class="grid grid-cols-2 gap-3">
                <input v-model="tripForm.startDate" type="date" class="input" />
                <input v-model="tripForm.endDate" type="date" class="input" />
                </div>

                <button class="w-full rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white dark:bg-cyan-400 dark:text-slate-950">
                Create trip
                </button>
            </form>
            </div>
        </div>
        </Teleport>
    </AppLayout>
</template>