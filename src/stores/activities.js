import { defineStore } from 'pinia'
import { useTripsStore } from './trips'

export const useActivitiesStore = defineStore('activities', {
  state: () => ({
    activities: JSON.parse(localStorage.getItem('plan-app-activities')) || [],
  }),

  getters: {
    activeTripActivities: (state) => {
      const tripsStore = useTripsStore()

      return state.activities.filter(
        (activity) =>
          String(activity.tripId || 1) === String(tripsStore.activeTripId)
      )
    },

    activitiesByStop: (state) => {
      const tripsStore = useTripsStore()

      return (stopId) => {
        return state.activities.filter(
          (activity) =>
            String(activity.tripId || 1) ===
              String(tripsStore.activeTripId) &&
            String(activity.routeStopId) === String(stopId)
        )
      }
    },
  },

  actions: {
    saveActivities() {
      localStorage.setItem(
        'plan-app-activities',
        JSON.stringify(this.activities)
      )
    },

    addActivity(activity) {
      const tripsStore = useTripsStore()

      this.activities.push({
        id: Date.now(),
        tripId: tripsStore.activeTripId,
        votes: [],
        bookingStatus: 'not-booked',
        ...activity,
      })

      this.saveActivities()
    },

    updateActivity(id, updatedActivity) {
      const index = this.activities.findIndex(
        (activity) => activity.id === id
      )

      if (index === -1) return

      this.activities[index] = {
        ...this.activities[index],
        ...updatedActivity,
      }

      this.saveActivities()
    },

    deleteActivity(id) {
      this.activities = this.activities.filter(
        (activity) => activity.id !== id
      )

      this.saveActivities()
    },

    vote(activityId, userName, decision) {
      const activity = this.activities.find(
        (activity) => activity.id === activityId
      )

      if (!activity) return

      activity.votes = activity.votes.filter(
        (vote) => vote.userName !== userName
      )

      activity.votes.push({
        userName,
        decision,
      })

      this.saveActivities()
    },
  },
})