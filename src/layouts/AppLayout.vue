<script setup>
import { onMounted, ref } from 'vue'
import { Moon, Sun } from 'lucide-vue-next'
import BottomNav from '../components/BottomNav.vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const isDark = ref(false)

const applyTheme = () => {
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  applyTheme()
}

const logout = () => {
  const confirmed = window.confirm(
    'Are you sure you want to logout?'
  )

  if (!confirmed) return

  authStore.logout()
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')

  isDark.value = savedTheme
    ? savedTheme === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches

  applyTheme()
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
    <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur transition-colors dark:border-white/10 dark:bg-slate-950/80">
      <div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <RouterLink to="/">
          <p class="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-cyan-300">
            Plan App
          </p>
          <h1 class="text-lg font-bold">
            Balkans Road Trip
          </h1>
        </RouterLink>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors dark:bg-white/10 dark:text-yellow-300"
            @click="toggleTheme"
          >
            <Moon v-if="!isDark" class="h-5 w-5" />
            <Sun v-else class="h-5 w-5" />
          </button>

          <RouterLink
            v-if="!authStore.isLoggedIn"
            to="/login"
            class="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors dark:bg-white dark:text-slate-950"
          >
            Login
          </RouterLink>

          <RouterLink
            v-else
            to="/admin"
            class="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors dark:bg-white dark:text-slate-950"
          >
            Admin
          </RouterLink>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-3xl px-4 pb-36 pt-5">
      <slot />
    </main>

    <BottomNav />
  </div>
</template>
  
 