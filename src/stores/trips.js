import { defineStore } from 'pinia'

const defaultTrip = {
  id: 1,
  title: 'Balkans Road Trip',
  subtitle: 'Summer 2027',
  startDate: '2027-07-01',
  endDate: '2027-07-28',
  imageUrl: '',
  status: 'planning',
}

export const useTripsStore = defineStore('trips', {
  state: () => ({
    trips: JSON.parse(localStorage.getItem('plan-app-trips')) || [defaultTrip],
    activeTripId: JSON.parse(localStorage.getItem('plan-app-active-trip-id')) || 1,
  }),

  getters: {
    activeTrip: (state) => {
      return state.trips.find((trip) => String(trip.id) === String(state.activeTripId))
    },
  },

  actions: {
    saveTrips() {
      localStorage.setItem('plan-app-trips', JSON.stringify(this.trips))
      localStorage.setItem('plan-app-active-trip-id', JSON.stringify(this.activeTripId))
    },

    setActiveTrip(id) {
      this.activeTripId = id
      this.saveTrips()
    },

    addTrip(trip) {
      const newTrip = {
        id: Date.now(),
        status: 'planning',
        imageUrl: '',
        ...trip,
      }

      this.trips.push(newTrip)
      this.activeTripId = newTrip.id
      this.saveTrips()
    },

    updateTrip(id, updatedTrip) {
      const index = this.trips.findIndex((trip) => trip.id === id)
      if (index === -1) return

      this.trips[index] = {
        ...this.trips[index],
        ...updatedTrip,
      }

      this.saveTrips()
    },
  },
})