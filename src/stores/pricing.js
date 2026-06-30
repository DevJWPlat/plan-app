import { defineStore } from 'pinia'
import { useTripsStore } from './trips'

export const usePricingStore = defineStore('pricing', {
  state: () => ({
    costs: JSON.parse(localStorage.getItem('plan-app-costs')) || [],
  }),

  getters: {
    activeTripCosts: (state) => {
      const tripsStore = useTripsStore()

      return state.costs.filter((cost) => {
        return String(cost.tripId || 1) === String(tripsStore.activeTripId)
      })
    },

    totalCost() {
      return this.activeTripCosts.reduce((total, cost) => total + Number(cost.amount || 0), 0)
    },
  },

  actions: {
    saveCosts() {
      localStorage.setItem('plan-app-costs', JSON.stringify(this.costs))
    },

    addCost(cost) {
      const tripsStore = useTripsStore()

      this.costs.push({
        id: Date.now(),
        tripId: tripsStore.activeTripId,
        ...cost,
      })

      this.saveCosts()
    },

    updateCost(id, updatedCost) {
      const index = this.costs.findIndex((cost) => cost.id === id)
      if (index === -1) return

      this.costs[index] = {
        ...this.costs[index],
        ...updatedCost,
      }

      this.saveCosts()
    },

    deleteCost(id) {
      this.costs = this.costs.filter((cost) => cost.id !== id)
      this.saveCosts()
    },
  },
})