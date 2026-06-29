import { defineStore } from 'pinia'
import { useTripsStore } from './trips'

export const useRouteStore = defineStore('route', {
  state: () => ({
    stops: JSON.parse(localStorage.getItem('plan-app-route-stops')) || [],
  }),

  getters: {
    activeTripStops: (state) => {
      const tripsStore = useTripsStore()

      return state.stops.filter((stop) => {
        return String(stop.tripId || 1) === String(tripsStore.activeTripId)
      })
    },
  },

  actions: {
    saveStops() {
      localStorage.setItem('plan-app-route-stops', JSON.stringify(this.stops))
    },

    addStop(stop) {
      const tripsStore = useTripsStore()

      this.stops.push({
        id: Date.now(),
        tripId: tripsStore.activeTripId,
        ...stop,
        lat: Number(stop.lat),
        lng: Number(stop.lng),
      })

      this.saveStops()
    },

    updateStop(id, updatedStop) {
      const index = this.stops.findIndex((stop) => stop.id === id)
      if (index === -1) return

      this.stops[index] = {
        ...this.stops[index],
        ...updatedStop,
        lat: Number(updatedStop.lat),
        lng: Number(updatedStop.lng),
      }

      this.saveStops()
    },

    deleteStop(id) {
      this.stops = this.stops.filter((stop) => stop.id !== id)
      this.saveStops()
    },
  },
})