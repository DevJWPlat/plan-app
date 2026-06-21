<script setup>
import AppLayout from '../layouts/AppLayout.vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>

<template>
    <AppLayout>
        <section class="rounded-3xl bg-blue-600 p-6 text-white shadow-sm dark:bg-slate-900 dark:border dark:border-slate-800">
        <p class="text-sm font-medium opacity-90">Holiday planner</p>
        <h2 class="mt-2 text-3xl font-bold">Balkans Road Trip 2027</h2>
        <p class="mt-3 text-sm leading-6 opacity-90">
            Plan the route, vote on stops, compare costs and keep everything in one place.
        </p>
        </section>

        <section
        v-if="!authStore.isLoggedIn"
        class="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
        <h3 class="text-xl font-bold">Login to join the planning</h3>
        <p class="mt-2 text-slate-500 dark:text-slate-400">
            You can view the homepage without logging in, but votes and admin tools are locked.
        </p>

        <RouterLink
            to="/login"
            class="mt-4 inline-flex rounded-full bg-blue-600 px-5 py-3 font-bold text-white dark:bg-cyan-400 dark:text-slate-950"
        >
            Login
        </RouterLink>
        </section>

        <section
            v-else
            class="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
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
                Admin
                </RouterLink>
            </div>

            <div class="mt-5 grid grid-cols-3 gap-3">
                <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <p class="text-2xl font-bold">4</p>
                <p class="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Pending votes
                </p>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <p class="text-2xl font-bold">0</p>
                <p class="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Approved stops
                </p>
                </div>

                <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                <p class="text-2xl font-bold">£0</p>
                <p class="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Budget
                </p>
                </div>
            </div>

            <div class="mt-5 grid grid-cols-2 gap-3">
                <RouterLink
                to="/votes"
                class="rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-bold text-white dark:bg-white dark:text-slate-950"
                >
                View votes
                </RouterLink>

                <RouterLink
                to="/pricing"
                class="rounded-2xl bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white dark:bg-cyan-400 dark:text-slate-950"
                >
                View costs
                </RouterLink>
            </div>
        </section>

        <section class="mt-5 grid gap-4">
        <RouterLink to="/map" class="card">
            <h3 class="font-bold">Interactive map</h3>
            <p class="muted mt-1 text-sm">View the full route and click each stop.</p>
        </RouterLink>

        <RouterLink to="/votes" class="card">
            <h3 class="font-bold">Open votes</h3>
            <p class="muted mt-1 text-sm">Approve or decline cities, trips and accommodation.</p>
        </RouterLink>

        <RouterLink to="/pricing" class="card">
            <h3 class="font-bold">Trip costs</h3>
            <p class="muted mt-1 text-sm">Track accommodation, car hire, fuel and trips.</p>
        </RouterLink>
        </section>
    </AppLayout>
</template>