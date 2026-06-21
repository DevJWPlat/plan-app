import { defineStore } from 'pinia'

export const useRouteStore = defineStore('route', {
  state: () => ({
    stops: JSON.parse(localStorage.getItem('plan-app-route-stops')) || [],
  }),

  actions: {
    addStop(stop) {
      this.stops.push({
        id: Date.now(),
        ...stop,
      })

      localStorage.setItem('plan-app-route-stops', JSON.stringify(this.stops))
    },

    deleteStop(id) {
      this.stops = this.stops.filter((stop) => stop.id !== id)
      localStorage.setItem('plan-app-route-stops', JSON.stringify(this.stops))
    },
  },
})