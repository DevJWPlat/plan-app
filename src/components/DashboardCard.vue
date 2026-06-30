<script setup>
defineProps({
  title: String,
  subtitle: String,
  to: String,
  icon: Object,
})
</script>

<template>
    <RouterLink
        :to="to"
        class="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-500 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-950"
    >
        <component :is="icon" class="h-8 w-8 text-blue-600 dark:text-cyan-400" />

        <h4 class="mt-4 font-bold">
        {{ title }}
        </h4>

        <div class="mt-2 flex items-center justify-between">
            <p class="muted text-sm">{{ subtitle }}</p>
            <span class="transition group-hover:translate-x-1">→</span>
        </div>
    </RouterLink>
</template>