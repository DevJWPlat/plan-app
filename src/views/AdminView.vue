<script setup>
import { ref } from 'vue'
import AppLayout from '../layouts/AppLayout.vue'
import { useAuthStore } from '../stores/auth'
import { useRouteStore } from '../stores/route'
import { useVotesStore } from '../stores/votes'
import { usePricingStore } from '../stores/pricing'

const authStore = useAuthStore()
const routeStore = useRouteStore()
const votesStore = useVotesStore()
const pricingStore = usePricingStore()

const activeForm = ref('route')

const routeForm = ref({
  city: '',
  country: '',
  dates: '',
  driveTime: '',
  accommodation: '',
  notes: '',
})

const voteForm = ref({
  title: '',
  type: 'City',
  description: '',
})

const costForm = ref({
  title: '',
  category: 'Accommodation',
  country: '',
  amount: '',
  notes: '',
})

const resetRouteForm = () => {
  routeForm.value = {
    city: '',
    country: '',
    dates: '',
    driveTime: '',
    accommodation: '',
    notes: '',
  }
}

const resetVoteForm = () => {
  voteForm.value = {
    title: '',
    type: 'City',
    description: '',
  }
}

const resetCostForm = () => {
  costForm.value = {
    title: '',
    category: 'Accommodation',
    country: '',
    amount: '',
    notes: '',
  }
}

const addRouteStop = () => {
  if (!routeForm.value.city || !routeForm.value.country) return

  routeStore.addStop(routeForm.value)
  resetRouteForm()
}

const addVoteItem = () => {
  if (!voteForm.value.title || !voteForm.value.description) return

  votesStore.addVoteItem(voteForm.value)
  resetVoteForm()
}

const addCost = () => {
  if (!costForm.value.title || !costForm.value.amount) return

  pricingStore.addCost(costForm.value)
  resetCostForm()
}
</script>

<template>
  <AppLayout>
    <template v-if="!authStore.isLoggedIn">
      <section class="card">
        <h2 class="text-2xl font-bold">Login required</h2>
        <p class="muted mt-2">You need to login before you can access admin tools.</p>

        <RouterLink
          to="/login"
          class="mt-5 inline-flex rounded-full bg-blue-600 px-5 py-3 font-bold text-white dark:bg-cyan-400 dark:text-slate-950"
        >
          Login
        </RouterLink>
      </section>
    </template>

    <template v-else-if="!authStore.isAdmin">
      <section class="card">
        <h2 class="text-2xl font-bold">Admin only</h2>
        <p class="muted mt-2">This area is only for Jonny, Emily, Josh and Elise.</p>
      </section>
    </template>

    <template v-else>
      <h2 class="text-3xl font-bold">Admin</h2>
      <p class="muted mt-3">Add stops, votes and costs for the trip.</p>

      <section class="mt-6 grid grid-cols-3 gap-3">
        <button
          class="rounded-2xl border px-4 py-3 text-sm font-bold"
          :class="activeForm === 'route'
            ? 'border-blue-600 bg-blue-600 text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950'
            : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'"
          @click="activeForm = 'route'"
        >
          Route
        </button>

        <button
          class="rounded-2xl border px-4 py-3 text-sm font-bold"
          :class="activeForm === 'votes'
            ? 'border-blue-600 bg-blue-600 text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950'
            : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'"
          @click="activeForm = 'votes'"
        >
          Votes
        </button>

        <button
          class="rounded-2xl border px-4 py-3 text-sm font-bold"
          :class="activeForm === 'costs'
            ? 'border-blue-600 bg-blue-600 text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950'
            : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'"
          @click="activeForm = 'costs'"
        >
          Costs
        </button>
      </section>

      <section v-if="activeForm === 'route'" class="card mt-5">
        <h3 class="text-xl font-bold">Add route stop</h3>

        <form class="mt-5 space-y-4" @submit.prevent="addRouteStop">
          <input v-model="routeForm.city" class="input" placeholder="City, e.g. Kotor" />
          <input v-model="routeForm.country" class="input" placeholder="Country, e.g. Montenegro" />
          <input v-model="routeForm.dates" class="input" placeholder="Dates, e.g. 12-14 July" />
          <input v-model="routeForm.driveTime" class="input" placeholder="Drive time, e.g. 2h 30m" />
          <input v-model="routeForm.accommodation" class="input" placeholder="Accommodation name/link" />
          <textarea v-model="routeForm.notes" class="input min-h-28" placeholder="Notes"></textarea>

          <button class="w-full rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white dark:bg-cyan-400 dark:text-slate-950">
            Add route stop
          </button>
        </form>
      </section>

      <section v-if="activeForm === 'votes'" class="card mt-5">
        <h3 class="text-xl font-bold">Add vote item</h3>

        <form class="mt-5 space-y-4" @submit.prevent="addVoteItem">
          <input v-model="voteForm.title" class="input" placeholder="Title, e.g. Add Kotor" />

          <select v-model="voteForm.type" class="input">
            <option>City</option>
            <option>Accommodation</option>
            <option>Trip</option>
            <option>Car</option>
            <option>Other</option>
          </select>

          <textarea v-model="voteForm.description" class="input min-h-28" placeholder="Description"></textarea>

          <button class="w-full rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white dark:bg-cyan-400 dark:text-slate-950">
            Add vote item
          </button>
        </form>
      </section>

      <section v-if="activeForm === 'costs'" class="card mt-5">
        <h3 class="text-xl font-bold">Add cost</h3>

        <form class="mt-5 space-y-4" @submit.prevent="addCost">
          <input v-model="costForm.title" class="input" placeholder="Title, e.g. Kotor apartment" />

          <select v-model="costForm.category" class="input">
            <option>Accommodation</option>
            <option>Car</option>
            <option>Fuel</option>
            <option>Trips</option>
            <option>Food</option>
            <option>Other</option>
          </select>

          <input v-model="costForm.country" class="input" placeholder="Country, e.g. Montenegro" />
          <input v-model="costForm.amount" type="number" class="input" placeholder="Amount, e.g. 250" />
          <textarea v-model="costForm.notes" class="input min-h-28" placeholder="Notes"></textarea>

          <button class="w-full rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white dark:bg-cyan-400 dark:text-slate-950">
            Add cost
          </button>
        </form>
      </section>
    </template>
  </AppLayout>
</template>