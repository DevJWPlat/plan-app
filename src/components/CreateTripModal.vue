<script setup>
defineProps({
  show: Boolean,
  tripForm: Object,
})

const emit = defineEmits(['close', 'submit'])
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-[10000] flex items-end bg-slate-950/60 backdrop-blur-sm md:items-center md:justify-center"
      @click.self="emit('close')"
    >
      <div class="w-full rounded-t-3xl bg-white p-5 text-slate-900 shadow-2xl dark:bg-slate-900 dark:text-white md:max-w-md md:rounded-3xl">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold">Create trip</h3>

          <button
            class="rounded-full bg-slate-100 px-3 py-2 text-sm font-bold dark:bg-slate-800"
            @click="emit('close')"
          >
            Close
          </button>
        </div>

        <form class="mt-5 space-y-4" @submit.prevent="emit('submit')">
          <input v-model="tripForm.title" class="input" placeholder="Trip name, e.g. Japan 2028" />
          <input v-model="tripForm.subtitle" class="input" placeholder="Subtitle, e.g. Cherry blossom trip" />

          <div class="grid grid-cols-2 gap-3">
            <input v-model="tripForm.startDate" type="date" class="input" />
            <input v-model="tripForm.endDate" type="date" class="input" />
          </div>

          <button class="w-full rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white dark:bg-cyan-400 dark:text-slate-950">
            Create trip
          </button>
        </form>
      </div>
    </div>
  </Teleport>
</template>