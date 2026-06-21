<script setup>
import { useRoute } from 'vue-router'
import { Home, Map, Route, Vote, PoundSterling } from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Map', path: '/map', icon: Map },
  { label: 'Route', path: '/route', icon: Route },
  { label: 'Votes', path: '/votes', icon: Vote },
  { label: 'Costs', path: '/pricing', icon: PoundSterling },
]
</script>

<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
  >
    <div class="mx-auto grid max-w-3xl grid-cols-5">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center gap-1 px-2 py-3 transition-all duration-200"
      >
        <component
          :is="item.icon"
          class="h-6 w-6"
          :class="
            route.path === item.path
              ? 'text-blue-600 dark:text-cyan-300'
              : 'text-slate-500 dark:text-slate-400'
          "
        />

        <span
          class="text-xs font-semibold"
          :class="
            route.path === item.path
              ? 'text-blue-600 dark:text-cyan-300'
              : 'text-slate-500 dark:text-slate-400'
          "
        >
          {{ item.label }}
        </span>

        <div
          class="mt-1 h-1 w-8 rounded-full transition-all"
          :class="
            route.path === item.path
              ? 'bg-blue-600 dark:bg-cyan-300'
              : 'bg-transparent'
          "
        />
      </RouterLink>
    </div>
  </nav>
</template>