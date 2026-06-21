<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')

const handleLogin = () => {
  error.value = ''

  const success = authStore.login(username.value, password.value)

  if (!success) {
    error.value = 'Username or password is wrong.'
    return
  }

  router.push('/')
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-900 dark:bg-slate-950 dark:text-white">
    <div class="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p class="text-sm font-bold uppercase text-blue-600 dark:text-cyan-300">Plan App</p>
      <h1 class="mt-2 text-3xl font-bold">Login</h1>

      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Login to vote or manage the road trip plan.
      </p>

      <form class="mt-6 space-y-4" @submit.prevent="handleLogin">
        <div>
          <label class="text-sm font-bold">Username</label>
          <input
            v-model="username"
            class="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <div>
          <label class="text-sm font-bold">Password</label>
          <input
            v-model="password"
            type="password"
            class="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>

        <p v-if="error" class="rounded-xl bg-red-100 p-3 text-sm font-bold text-red-700">
          {{ error }}
        </p>

        <button class="w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white dark:bg-cyan-400 dark:text-slate-950">
          Login
        </button>
      </form>

      <RouterLink to="/" class="mt-5 inline-block text-sm font-bold text-blue-600 dark:text-cyan-300">
        Back home
      </RouterLink>
    </div>
  </div>
</template>