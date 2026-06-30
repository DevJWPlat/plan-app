<script setup>
import { ref } from 'vue'

defineProps({
  activeForm: String,
})

const emit = defineEmits(['select'])

const showAdminMenu = ref(false)

const adminMenuItems = [
  { label: 'Stops', value: 'route' },
  { label: 'Activities', value: 'activities' },
  { label: 'Decisions', value: 'votes' },
  { label: 'Budget', value: 'costs' },
  { label: 'Settings', value: 'settings' },
]

const selectItem = (value) => {
  emit('select', value)
  showAdminMenu.value = false
}
</script>

<template>
  <section class="mt-6 md:hidden">
    <button
      class="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
      @click="showAdminMenu = true"
    >
      <span>Manage trip</span>
      <span class="text-sm text-slate-500">{{ activeForm }}</span>
    </button>
  </section>

  <section class="mt-6 hidden grid-cols-5 gap-3 md:grid">
    <button
      v-for="item in adminMenuItems"
      :key="item.value"
      class="rounded-2xl border px-4 py-3 text-sm font-bold"
      :class="activeForm === item.value
        ? 'border-blue-600 bg-blue-600 text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950'
        : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'"
      @click="selectItem(item.value)"
    >
      {{ item.label }}
    </button>
  </section>

  <Teleport to="body">
    <div
      v-if="showAdminMenu"
      class="fixed inset-0 z-[10000] flex items-end bg-slate-950/60 backdrop-blur-sm"
      @click.self="showAdminMenu = false"
    >
      <div class="w-full rounded-t-3xl bg-white p-5 text-slate-900 shadow-2xl dark:bg-slate-900 dark:text-white">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-xl font-bold">Manage trip</h3>

          <button
            class="rounded-full bg-slate-100 px-3 py-2 text-sm font-bold dark:bg-slate-800"
            @click="showAdminMenu = false"
          >
            Close
          </button>
        </div>

        <div class="grid gap-3">
          <button
            v-for="item in adminMenuItems"
            :key="item.value"
            class="rounded-2xl border px-5 py-4 text-left font-bold"
            :class="activeForm === item.value
              ? 'border-blue-600 bg-blue-600 text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950'
              : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200'"
            @click="selectItem(item.value)"
          >
            {{ item.label }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>