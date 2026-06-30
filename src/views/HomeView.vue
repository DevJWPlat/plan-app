<script setup>
import { computed, ref } from 'vue'
import AppLayout from '../layouts/AppLayout.vue'
import { useAuthStore } from '../stores/auth'
import { useTripsStore } from '../stores/trips'
import { useRouteStore } from '../stores/route'
import { useActivitiesStore } from '../stores/activities'
import { usePricingStore } from '../stores/pricing'
import TripHero from '../components/TripHero.vue'
import TripSwitcher from '../components/TripSwitcher.vue'
import DashboardStats from '../components/DashboardStats.vue'
import QuickActions from '../components/QuickActions.vue'
import AccountCard from '../components/AccountCard.vue'
import CreateTripModal from '../components/CreateTripModal.vue'

const routeStore = useRouteStore()
const activitiesStore = useActivitiesStore()
const pricingStore = usePricingStore()

const authStore = useAuthStore()
const tripsStore = useTripsStore()

const showCreateTrip = ref(false)

const tripForm = ref({
  title: '',
  subtitle: '',
  startDate: '',
  endDate: '',
})

const activeTrip = computed(() => tripsStore.activeTrip)

const createTrip = () => {
  if (!tripForm.value.title) return

  tripsStore.addTrip(tripForm.value)

  tripForm.value = {
    title: '',
    subtitle: '',
    startDate: '',
    endDate: '',
  }

  showCreateTrip.value = false
}

const daysUntilTrip = (trip) => {
  if (!trip?.startDate) return null

  const today = new Date()
  const start = new Date(trip.startDate)
  const diff = start - today

  return Math.max(Math.ceil(diff / 1000 / 60 / 60 / 24), 0)
}

const pendingDecisions = computed(() => {
  if (!authStore.isLoggedIn) return activitiesStore.activeTripActivities.length

  return activitiesStore.activeTripActivities.filter((activity) => {
    return !activity.votes.some((vote) => vote.userName === authStore.user.name)
  }).length
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(Number(amount || 0))
}


</script>

<template>
    <AppLayout>
      <TripHero
        :trip="activeTrip"
        :days-to-go="daysUntilTrip(activeTrip)"
      />
  
      <DashboardStats
        :pending-decisions="pendingDecisions"
        :budget="formatCurrency(pricingStore.totalCost)"
        :stops="routeStore.activeTripStops.length"
        :activities="activitiesStore.activeTripActivities.length"
      />
  
      <QuickActions
        :stops="routeStore.activeTripStops.length"
        :pending-decisions="pendingDecisions"
        :budget="formatCurrency(pricingStore.totalCost)"
      />
  
      <TripSwitcher
        :trips="tripsStore.trips"
        :active-trip-id="tripsStore.activeTripId"
        :days-until-trip="daysUntilTrip"
        @select="tripsStore.setActiveTrip"
        @create="showCreateTrip = true"
      />
  
      <AccountCard :auth-store="authStore" />
  
      <CreateTripModal
        :show="showCreateTrip"
        :trip-form="tripForm"
        @close="showCreateTrip = false"
        @submit="createTrip"
      />
    </AppLayout>
  </template>