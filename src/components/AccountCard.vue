<script setup>
defineProps({
  authStore: Object,
})
</script>

<template>
  <section
    v-if="!authStore.isLoggedIn"
    class="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
  >
    <h3 class="text-xl font-bold">Login to join the planning</h3>
    <p class="mt-2 text-slate-500 dark:text-slate-400">
      You can view the homepage without logging in, but decisions and manage tools are locked.
    </p>

    <RouterLink
      to="/login"
      class="mt-4 inline-flex rounded-full bg-blue-600 px-5 py-3 font-bold text-white dark:bg-cyan-400 dark:text-slate-950"
    >
      Login
    </RouterLink>
  </section>

  <section v-else class="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
        Manage
      </RouterLink>
    </div>
  </section>
</template>