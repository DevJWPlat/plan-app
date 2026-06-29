<script setup>
import { computed, ref } from 'vue'
import AppLayout from '../layouts/AppLayout.vue'
import { useAuthStore } from '../stores/auth'
import { useVotesStore } from '../stores/votes'

const authStore = useAuthStore()
const votesStore = useVotesStore()

const activeTab = ref('votes')
const activeFilter = ref('All')

const filters = ['All', 'City', 'Accommodation', 'Trip', 'Car', 'Other']

const getVote = (item, voterName) => {
  if (!voterName) return null
  return item.votes.find((vote) => vote.userName === voterName)
}

const approvedBy = (item) => {
  return authStore.voters.filter((voter) => getVote(item, voter.name)?.decision === 'approve')
}

const declinedBy = (item) => {
  return authStore.voters.filter((voter) => getVote(item, voter.name)?.decision === 'decline')
}

const pendingVotes = computed(() => {
  if (!authStore.isLoggedIn) return votesStore.voteItems

  return votesStore.voteItems.filter((item) => {
    return !getVote(item, authStore.user?.name)
  })
})

const filteredResults = computed(() => {
  if (activeFilter.value === 'All') return votesStore.voteItems
  return votesStore.voteItems.filter((item) => item.type === activeFilter.value)
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
  return name[0].toUpperCase()
}

const resultStatus = (item) => {
  const noVotes = declinedBy(item).length
  const yesVotes = approvedBy(item).length
  const totalVotes = yesVotes + noVotes

  if (totalVotes < authStore.voters.length) {
    return {
      label: `Waiting for ${authStore.voters.length - totalVotes} vote${authStore.voters.length - totalVotes === 1 ? '' : 's'}`,
      class: 'bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300',
    }
  }

  if (noVotes >= 3) {
    return {
      label: 'Mostly declined',
      class: 'bg-red-100 text-red-700 dark:bg-red-400/10 dark:text-red-300',
    }
  }

  if (noVotes === 2) {
    return {
      label: 'Split decision',
      class: 'bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-200',
    }
  }

  return {
    label: 'Approved',
    class: 'bg-green-100 text-green-700 dark:bg-green-400/10 dark:text-green-300',
  }
}

const stopLink = (item) => {
  if (!item.routeStopId) return null
  return `/route/${item.routeStopId}`
}
</script>

<template>
  <AppLayout>
    <h2 class="text-3xl font-bold">Votes</h2>
    <p class="muted mt-3">
      Vote on ideas, then check the results with everyone's choices visible.
    </p>

    <section class="mt-6 grid grid-cols-2 gap-3">
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
    </section>

    <section v-if="activeTab === 'votes'" class="mt-6 space-y-4">
      <article
        v-for="item in pendingVotes"
        :key="item.id"
        class="card relative overflow-hidden"
      >
        <p class="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-cyan-300">
          {{ item.type }}
        </p>

        <div class="mt-1 flex items-start justify-between gap-3">
            <h3 class="text-xl font-bold">{{ item.title }}</h3>

            <span
                class="shrink-0 rounded-full px-3 py-1 text-xs font-bold"
                :class="resultStatus(item).class"
            >
                {{ resultStatus(item).label }}
            </span>
        </div>

        <p class="muted mt-2">{{ item.description }}</p>

        <img
            v-if="item.imageUrl"
            :src="item.imageUrl"
            :alt="item.title"
            class="mt-4 h-44 w-full rounded-2xl object-cover"
        />

        <div v-if="item.cost || item.link" class="mt-4 flex flex-wrap gap-2">
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

        <div class="mt-4 grid grid-cols-2 gap-3">
          <button
            class="rounded-xl bg-green-100 px-4 py-3 font-bold text-green-700 transition active:scale-95 dark:bg-green-400/10 dark:text-green-300"
            :disabled="!authStore.isAdmin"
            @click="votesStore.vote(item.id, authStore.user.name, 'approve')"
          >
            Yes
          </button>

          <button
            class="rounded-xl bg-red-100 px-4 py-3 font-bold text-red-700 transition active:scale-95 dark:bg-red-400/10 dark:text-red-300"
            :disabled="!authStore.isAdmin"
            @click="votesStore.vote(item.id, authStore.user.name, 'decline')"
          >
            No
          </button>
        </div>

        <div
          v-if="!authStore.isAdmin"
          class="absolute inset-0 flex flex-col items-center justify-center bg-white/80 px-6 py-10 text-center backdrop-blur-sm dark:bg-slate-900/80"
        >
          <p class="text-2xl">🔒</p>
          <h4 class="mt-0 text-lg font-bold">Login to vote</h4>
          <p class="muted mt-1 text-[10px]">
            There are votes waiting. Login with your account to complete them.
          </p>

          <RouterLink
            to="/login"
            class="w-full rounded-full bg-blue-600 px-5 py-1 mt-2 text-sm font-bold text-white dark:bg-cyan-400 dark:text-slate-950"
          >
            Login
          </RouterLink>
        </div>
      </article>

      <section v-if="pendingVotes.length === 0" class="card">
        <h3 class="text-xl font-bold">No votes to complete</h3>
        <p class="muted mt-2">You’re all caught up.</p>
      </section>
    </section>

    <section v-if="activeTab === 'results'" class="mt-6">
      <div class="flex gap-2 overflow-x-auto pb-2">
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
          v-for="item in filteredResults"
          :key="item.id"
          class="rounded-3xl border p-5 shadow-sm"
          :class="resultCardClass(item)"
        >
          <p class="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-cyan-300">
            {{ item.type }}
          </p>

          <h3 class="mt-1 text-xl font-bold">{{ item.title }}</h3>
          <p class="muted mt-2">{{ item.description }}</p>

          <RouterLink
            v-if="stopLink(item)"
            :to="stopLink(item)"
            class="mt-4 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            View stop details
          </RouterLink>

          <div class="mt-5">
            <p class="text-sm font-bold">Approved by</p>

            <div class="mt-2 flex gap-2">
              <div
                v-for="voter in approvedBy(item)"
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
                v-for="voter in declinedBy(item)"
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
  </AppLayout>
</template>