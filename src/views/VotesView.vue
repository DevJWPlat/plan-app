<script setup>
import { computed, ref } from 'vue'
import AppLayout from '../layouts/AppLayout.vue'
import { useAuthStore } from '../stores/auth'
import { useVotesStore } from '../stores/votes'

const authStore = useAuthStore()
const votesStore = useVotesStore()

const activeTab = ref('votes')
const resultFilter = ref('All')

const filters = ['All', 'City', 'Accommodation', 'Trip', 'Car', 'Other']

const getVote = (item, voterName) => {
  return item.votes.find((vote) => vote.userName === voterName)
}

const approvedBy = (item) => {
  return authStore.voters.filter((voter) => getVote(item, voter.name)?.decision === 'approve')
}

const declinedBy = (item) => {
  return authStore.voters.filter((voter) => getVote(item, voter.name)?.decision === 'decline')
}

const pendingVotes = computed(() => {
  return votesStore.voteItems.filter((item) => {
    return !getVote(item, authStore.user?.name)
  })
})

const filteredResults = computed(() => {
  if (resultFilter.value === 'All') return votesStore.voteItems
  return votesStore.voteItems.filter((item) => item.type === resultFilter.value)
})

const resultCardClass = (item) => {
  const noVotes = declinedBy(item).length

  if (noVotes >= 3) {
    return 'border-red-200 bg-red-50 dark:border-red-400/20 dark:bg-red-400/10'
  }

  if (noVotes <= 1) {
    return 'border-green-200 bg-green-50 dark:border-green-400/20 dark:bg-green-400/10'
  }

  return 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
}

const initials = (name) => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}
</script>

<template>
    <AppLayout>
        <template v-if="!authStore.isLoggedIn">
        <section class="card">
            <h2 class="text-2xl font-bold">Login required</h2>
            <p class="muted mt-2">
            You need to login before you can view votes.
            </p>

            <RouterLink
            to="/login"
            class="mt-5 inline-flex rounded-full bg-blue-600 px-5 py-3 font-bold text-white dark:bg-cyan-400 dark:text-slate-950"
            >
            Login
            </RouterLink>
        </section>
        </template>

        <template v-else>
        <h2 class="text-3xl font-bold">Votes</h2>

        <div class="mt-5 grid grid-cols-2 gap-3">
            <button
            class="rounded-2xl border px-4 py-3 font-bold"
            :class="activeTab === 'votes'
                ? 'border-blue-600 bg-blue-600 text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950'
                : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'"
            @click="activeTab = 'votes'"
            >
            Votes
            <span class="ml-1 rounded-full bg-white/20 px-2 py-1 text-xs">
                {{ pendingVotes.length }}
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
        </div>

        <section v-if="activeTab === 'votes'" class="mt-6 space-y-4">
            <article
            v-for="item in votesStore.voteItems"
            :key="item.id"
            class="card"
            >
            <p class="text-xs font-bold uppercase text-blue-600 dark:text-cyan-300">
                {{ item.type }}
            </p>

            <h3 class="mt-1 text-xl font-bold">
                {{ item.title }}
            </h3>

            <p class="muted mt-2">
                {{ item.description }}
            </p>

            <div v-if="authStore.isAdmin" class="mt-4 grid grid-cols-2 gap-3">
                <button
                class="rounded-xl bg-green-100 px-4 py-3 font-bold text-green-700 dark:bg-green-400/10 dark:text-green-300"
                @click="votesStore.vote(item.id, authStore.user.name, 'approve')"
                >
                Yes
                </button>

                <button
                class="rounded-xl bg-red-100 px-4 py-3 font-bold text-red-700 dark:bg-red-400/10 dark:text-red-300"
                @click="votesStore.vote(item.id, authStore.user.name, 'decline')"
                >
                No
                </button>
            </div>
            </article>
        </section>

        <section v-if="activeTab === 'results'" class="mt-6">
            <div class="flex gap-2 overflow-x-auto pb-2">
            <button
                v-for="filter in filters"
                :key="filter"
                class="shrink-0 rounded-full border px-4 py-2 text-sm font-bold"
                :class="resultFilter === filter
                ? 'border-blue-600 bg-blue-600 text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950'
                : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'"
                @click="resultFilter = filter"
            >
                {{ filter }}
            </button>
            </div>

            <div class="mt-4 space-y-4">
            <article
                v-for="item in filteredResults"
                :key="item.id"
                class="rounded-3xl border p-5 shadow-sm"
                :class="resultCardClass(item)"
            >
                <p class="text-xs font-bold uppercase text-blue-600 dark:text-cyan-300">
                {{ item.type }}
                </p>

                <h3 class="mt-1 text-xl font-bold">
                {{ item.title }}
                </h3>

                <p class="muted mt-2">
                {{ item.description }}
                </p>

                <div class="mt-5">
                <p class="text-sm font-bold">Approved by</p>

                <div class="mt-2 flex gap-2">
                    <div
                    v-for="voter in approvedBy(item)"
                    :key="voter.name"
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white"
                    :title="voter.name"
                    >
                    <img
                        v-if="voter.avatarUrl"
                        :src="voter.avatarUrl"
                        :alt="voter.name"
                        class="h-full w-full rounded-full object-cover"
                    />
                    <span v-else>{{ initials(voter.name) }}</span>
                    </div>
                </div>
                </div>

                <div class="mt-5">
                <p class="text-sm font-bold">Declined by</p>

                <div class="mt-2 flex gap-2">
                    <div
                    v-for="voter in declinedBy(item)"
                    :key="voter.name"
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white"
                    :title="voter.name"
                    >
                    <img
                        v-if="voter.avatarUrl"
                        :src="voter.avatarUrl"
                        :alt="voter.name"
                        class="h-full w-full rounded-full object-cover"
                    />
                    <span v-else>{{ initials(voter.name) }}</span>
                    </div>
                </div>
                </div>
            </article>
            </div>
        </section>
        </template>
    </AppLayout>
</template>