import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('plan-app-user')) || null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
  },

  actions: {
    login(username, password) {
      const users = [
        { username: 'jonny', password: 'admin', name: 'Jonny', role: 'admin' },
        { username: 'emily', password: 'admin', name: 'Emily', role: 'admin' },
        { username: 'josh', password: 'admin', name: 'Josh', role: 'admin' },
        { username: 'elise', password: 'admin', name: 'Elise', role: 'admin' },
        { username: 'guest', password: 'guest', name: 'Guest', role: 'viewer' },
      ]

      const matchedUser = users.find(
        (user) => user.username === username.toLowerCase() && user.password === password
      )

      if (!matchedUser) return false

      this.user = {
        name: matchedUser.name,
        role: matchedUser.role,
      }

      localStorage.setItem('plan-app-user', JSON.stringify(this.user))

      return true
    },

    logout() {
      this.user = null
      localStorage.removeItem('plan-app-user')
    },
  },
})