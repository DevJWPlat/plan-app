<script setup>
import { computed, ref } from 'vue'
import AppLayout from '../layouts/AppLayout.vue'
import { useAuthStore } from '../stores/auth'
import { useRouteStore } from '../stores/route'
import { useActivitiesStore } from '../stores/activities'

const authStore = useAuthStore()
const routeStore = useRouteStore()
const activitiesStore = useActivitiesStore()

const activeTab = ref('decisions')
const activeFilter = ref('All')

const filters = ['All', 'Activity', 'Food', 'Tour', 'Beach', 'Walk', 'Transport', 'Other']

const getVote = (activity, voterName) => {
  if (!voterName) return null
  return activity.votes.find((vote) => vote.userName === voterName)
}

const approvedBy = (activity) => {
  return authStore.voters.filter((voter) => getVote(activity, voter.name)?.decision === 'approve')
}

const declinedBy = (activity) => {
  return authStore.voters.filter((voter) => getVote(activity, voter.name)?.decision === 'decline')
}

const pendingDecisions = computed(() => {
  if (!authStore.isLoggedIn) return activitiesStore.activeTripActivities

  return activitiesStore.activeTripActivities.filter((activity) => {
    return !getVote(activity, authStore.user?.name)
  })
})

const filteredResults = computed(() => {
  if (activeFilter.value === 'All') return activitiesStore.activeTripActivities
  return activitiesStore.activeTripActivities.filter((activity) => activity.category === activeFilter.value)
})

const stopName = (activity) => {
  const stop = routeStore.activeTripStops.find((stop) => String(stop.id) === String(activity.routeStopId))
  return stop ? `${stop.city}, ${stop.country}` : 'No stop linked'
}

const resultCardClass = (activity) => {
  const noVotes = declinedBy(activity).length

  if (noVotes >= 3) return 'border-red-200 bg-red-50 dark:border-red-400/20 dark:bg-red-400/10'
  if (noVotes <= 1) return 'border-green-200 bg-green-50 dark:border-green-400/20 dark:bg-green-400/10'

  return 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
}

const initials = (name) => name[0].toUpperCase()

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(Number(amount || 0))
}

const showFilterMenu = ref(false)

const selectFilter = (filter) => {
  activeFilter.value = filter
  showFilterMenu.value = false
}
</script>

<template>
	<AppLayout>
		<h2 class="text-3xl font-bold">Decisions</h2>
		<p class="muted mt-3">
		Decide which activities people want to do, then view the results.
		</p>

		<section class="mt-6 grid grid-cols-2 gap-3">
		<button
			class="rounded-2xl border px-4 py-3 font-bold"
			:class="activeTab === 'decisions'
			? 'border-blue-600 bg-blue-600 text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950'
			: 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'"
			@click="activeTab = 'decisions'"
		>
			Decisions
			<span class="ml-1 rounded-full bg-white/20 px-2 py-1 text-xs">
			{{ pendingDecisions.length }}
			</span>
		</button>

		<button
			class="rounded-2xl border px-4 py-3 font-bold"
			:class="activeTab === 'results'
			? 'border-blue-600 bg-blue-600 text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950'
			: 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'"
			@click="activeTab = 'results'"
		>
			Results
		</button>
		</section>

		<section v-if="activeTab === 'decisions'" class="mt-6 space-y-4">
			<article
				v-for="activity in pendingDecisions"
				:key="activity.id"
				class="card relative overflow-hidden"
			>
				<img
				v-if="activity.imageUrl"
				:src="activity.imageUrl"
				:alt="activity.title"
				class="mb-4 h-44 w-full rounded-2xl object-cover"
				/>

				<p class="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-cyan-300">
				{{ activity.category }}
				</p>

				<h3 class="mt-1 text-xl font-bold">{{ activity.title }}</h3>
				<p class="muted mt-1 text-sm">{{ stopName(activity) }}</p>
				<p class="muted mt-2">{{ activity.description }}</p>

				<div class="mt-3 flex flex-wrap gap-2">
				<span
					v-if="activity.cost"
					class="rounded-full bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
				>
					{{ formatCurrency(activity.cost) }}
				</span>

				<span
					v-if="activity.duration"
					class="rounded-full bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
				>
					{{ activity.duration }}
				</span>
				</div>

				<div class="mt-4 grid grid-cols-2 gap-3">
				<button
					class="rounded-xl bg-green-100 px-4 py-3 font-bold text-green-700 transition active:scale-95 dark:bg-green-400/10 dark:text-green-300"
					:disabled="!authStore.isAdmin"
					@click="activitiesStore.vote(activity.id, authStore.user.name, 'approve')"
				>
					Yes
				</button>

				<button
					class="rounded-xl bg-red-100 px-4 py-3 font-bold text-red-700 transition active:scale-95 dark:bg-red-400/10 dark:text-red-300"
					:disabled="!authStore.isAdmin"
					@click="activitiesStore.vote(activity.id, authStore.user.name, 'decline')"
				>
					No
				</button>
				</div>

				<div
				v-if="!authStore.isAdmin"
				class="absolute inset-0 flex flex-col items-center justify-center bg-white/80 p-6 text-center backdrop-blur-sm dark:bg-slate-900/80"
				>
				<p class="text-3xl">🔒</p>
				<h4 class="mt-2 text-xl font-bold">Login to decide</h4>
				<p class="muted mt-1 text-sm">
					There are activities waiting. Login to complete your decisions.
				</p>

				<RouterLink
					to="/login"
					class="mt-4 rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white dark:bg-cyan-400 dark:text-slate-950"
				>
					Login
				</RouterLink>
				</div>
			</article>

			<section v-if="pendingDecisions.length === 0" class="card">
				<h3 class="text-xl font-bold">No decisions to complete</h3>
				<p class="muted mt-2">You're all caught up.</p>
			</section>
			</section>

			<section v-if="activeTab === 'results'" class="mt-6">
				<div class="md:hidden">
					<button
						class="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
						@click="showFilterMenu = true"
					>
						<span>Filter results</span>
						<span class="text-sm text-slate-500">{{ activeFilter }}</span>
					</button>
				</div>

				<div class="hidden gap-2 overflow-x-auto pb-2 md:flex">
					<button
						v-for="filter in filters"
						:key="filter"
						class="shrink-0 rounded-full border px-4 py-2 text-sm font-bold"
						:class="activeFilter === filter
						? 'border-blue-600 bg-blue-600 text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950'
						: 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'"
						@click="activeFilter = filter"
					>
						{{ filter }}
					</button>
				</div>

			<div class="mt-4 space-y-4">
				<article
				v-for="activity in filteredResults"
				:key="activity.id"
				class="rounded-3xl border p-5 shadow-sm"
				:class="resultCardClass(activity)"
				>
				<img
					v-if="activity.imageUrl"
					:src="activity.imageUrl"
					:alt="activity.title"
					class="mb-4 h-44 w-full rounded-2xl object-cover"
				/>

				<p class="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-cyan-300">
					{{ activity.category }}
				</p>

				<h3 class="mt-1 text-xl font-bold">{{ activity.title }}</h3>
				<p class="muted mt-1 text-sm">{{ stopName(activity) }}</p>
				<p class="muted mt-2">{{ activity.description }}</p>

				<div class="mt-5">
					<p class="text-sm font-bold">Approved by</p>

					<div class="mt-2 flex gap-2">
					<div
						v-for="voter in approvedBy(activity)"
						:key="voter.name"
						class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-green-600 text-sm font-bold text-white"
						:title="voter.name"
					>
						<img
						v-if="voter.avatarUrl"
						:src="voter.avatarUrl"
						:alt="voter.name"
						class="h-full w-full object-cover"
						/>
						<span v-else>{{ initials(voter.name) }}</span>
					</div>
					</div>
				</div>

				<div class="mt-5">
					<p class="text-sm font-bold">Declined by</p>

					<div class="mt-2 flex gap-2">
					<div
						v-for="voter in declinedBy(activity)"
						:key="voter.name"
						class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-red-600 text-sm font-bold text-white"
						:title="voter.name"
					>
						<img
						v-if="voter.avatarUrl"
						:src="voter.avatarUrl"
						:alt="voter.name"
						class="h-full w-full object-cover"
						/>
						<span v-else>{{ initials(voter.name) }}</span>
					</div>
					</div>
				</div>
				</article>
			</div>
		</section>
		<Teleport to="body">
			<div
				v-if="showFilterMenu"
				class="fixed inset-0 z-[10000] flex items-end bg-slate-950/60 backdrop-blur-sm"
				@click.self="showFilterMenu = false"
			>
				<div class="w-full rounded-t-3xl bg-white p-5 text-slate-900 shadow-2xl dark:bg-slate-900 dark:text-white relative z-10 bottom-0 h-[80%] overflow-y-auto">
					<div class="mb-4 flex items-center justify-between">
						<h3 class="text-xl font-bold">Filter results</h3>

						<button
						class="rounded-full bg-slate-100 px-3 py-2 text-sm font-bold dark:bg-slate-800"
						@click="showFilterMenu = false"
						>
						Close
						</button>
					</div>

					<div class="grid gap-3">
						<button
						v-for="filter in filters"
						:key="filter"
						class="rounded-2xl border px-5 py-4 text-left font-bold"
						:class="activeFilter === filter
							? 'border-blue-600 bg-blue-600 text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950'
							: 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200'"
						@click="selectFilter(filter)"
						>
						{{ filter }}
						</button>
					</div>
				</div>
			</div>
		</Teleport>
	</AppLayout>
</template>