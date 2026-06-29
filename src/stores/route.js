import { defineStore } from 'pinia'

export const useRouteStore = defineStore('route', {
  state: () => ({
    stops: JSON.parse(localStorage.getItem('plan-app-route-stops')) || [],
  }),

  actions: {
    saveStops() {
      localStorage.setItem('plan-app-route-stops', JSON.stringify(this.stops))
    },

    addStop(stop) {
      this.stops.push({
        id: Date.now(),
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