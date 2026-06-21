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
    addCost(cost) {
      this.costs.push({
        id: Date.now(),
        ...cost,
      })

      localStorage.setItem('plan-app-costs', JSON.stringify(this.costs))
    },

    deleteCost(id) {
      this.costs = this.costs.filter((cost) => cost.id !== id)
      localStorage.setItem('plan-app-costs', JSON.stringify(this.costs))
    },
  },
})