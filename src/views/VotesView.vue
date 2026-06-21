<script setup>
import AppLayout from '../layouts/AppLayout.vue'
import { useAuthStore } from '../stores/auth'
import { useVotesStore } from '../stores/votes'

const authStore = useAuthStore()
const votesStore = useVotesStore()

const hasUserVoted = (item) => {
  return item.votes.some((vote) => vote.userName === authStore.user.name)
}

const userVote = (item) => {
  return item.votes.find((vote) => vote.userName === authStore.user.name)?.decision
}
</script>

<template>
  <AppLayout>
    <template v-if="!authStore.isLoggedIn">
      <section class="card">
        <h2 class="text-2xl font-bold">Login required</h2>
        <p class="muted mt-2">
          You need to login before you can view or vote on trip decisions.
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
      <div class="flex items-start justify-between gap-4">
        <div>
          <h2 class="text-3xl font-bold">Votes</h2>
          <p class="muted mt-2">
            Vote on cities, accommodation, trips and route changes.
          </p>
        </div>

        <RouterLink
          v-if="authStore.isAdmin"
          to="/admin"
          class="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white dark:bg-cyan-400 dark:text-slate-950"
        >
          Add
        </RouterLink>
      </div>

      <div class="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-400/10 dark:text-amber-200">
        Votes are anonymous. If one person votes no, the item will be declined.
      </div>

      <section v-if="votesStore.voteItems.length === 0" class="card mt-6">
        <h3 class="text-xl font-bold">No votes yet</h3>
        <p class="muted mt-2">
          Add your first vote item from the admin page.
        </p>
      </section>

      <section v-else class="mt-6 space-y-4">
        <article
          v-for="item in votesStore.voteItems"
          :key="item.id"
          class="card"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-bold uppercase text-blue-600 dark:text-cyan-300">
                {{ item.type }}
              </p>

              <h3 class="mt-1 text-xl font-bold">
                {{ item.title }}
              </h3>
            </div>

            <span
              class="rounded-full px-3 py-1 text-xs font-bold"
              :class="
                item.status === 'declined'
                  ? 'bg-red-100 text-red-700 dark:bg-red-400/10 dark:text-red-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300'
              "
            >
              {{ item.status }}
            </span>
          </div>

          <p class="muted mt-3">
            {{ item.description }}
          </p>

          <p v-if="hasUserVoted(item)" class="mt-4 text-sm font-bold text-blue-600 dark:text-cyan-300">
            You voted: {{ userVote(item) }}
          </p>

          <div class="mt-4 grid grid-cols-2 gap-3">
            <button
              class="rounded-xl bg-green-100 px-4 py-3 font-bold text-green-700 transition active:scale-95 dark:bg-green-400/10 dark:text-green-300"
              @click="votesStore.vote(item.id, authStore.user.name, 'approve')"
            >
              Approve
            </button>

            <button
              class="rounded-xl bg-red-100 px-4 py-3 font-bold text-red-700 transition active:scale-95 dark:bg-red-400/10 dark:text-red-300"
              @click="votesStore.vote(item.id, authStore.user.name, 'decline')"
            >
              Decline
            </button>
          </div>

          <button
            v-if="authStore.isAdmin"
            class="mt-4 rounded-full bg-red-100 px-3 py-2 text-xs font-bold text-red-700 dark:bg-red-400/10 dark:text-red-300"
            @click="votesStore.deleteVoteItem(item.id)"
          >
            Delete vote item
          </button>
        </article>
      </section>
    </template>
  </AppLayout>
</template>