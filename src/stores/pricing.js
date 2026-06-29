import { defineStore } from 'pinia'

export const usePricingStore = defineStore('pricing', {
  state: () => ({
    costs: JSON.parse(localStorage.getItem('plan-app-costs')) || [],
  }),

  getters: {
    totalCost: (state) => {
      return state.costs.reduce((total, cost) => total + Number(cost.amount || 0), 0)
    },
  },

  actions: {
    saveCosts() {
      localStorage.setItem('plan-app-costs', JSON.stringify(this.costs))
    },

    addCost(cost) {
      this.costs.push({
        id: Date.now(),
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