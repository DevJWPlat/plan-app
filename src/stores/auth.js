import { defineStore } from 'pinia'

const defaultUsers = [
  { username: 'jonny', password: 'admin', name: 'Jonny', role: 'admin', avatarUrl: '' },
  { username: 'emily', password: 'admin', name: 'Emily', role: 'admin', avatarUrl: '' },
  { username: 'josh', password: 'admin', name: 'Josh', role: 'admin', avatarUrl: '' },
  { username: 'elise', password: 'admin', name: 'Elise', role: 'admin', avatarUrl: '' },
  { username: 'guest', password: 'guest', name: 'Guest', role: 'viewer', avatarUrl: '' },
]

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('plan-app-user')) || null,
    users: JSON.parse(localStorage.getItem('plan-app-users')) || defaultUsers,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
    voters: (state) => state.users.filter((user) => user.role === 'admin'),
  },

  actions: {
    saveUsers() {
      localStorage.setItem('plan-app-users', JSON.stringify(this.users))
    },

    saveUser() {
      localStorage.setItem('plan-app-user', JSON.stringify(this.user))
    },

    login(username, password) {
      const matchedUser = this.users.find(
        (user) => user.username === username.toLowerCase() && user.password === password
      )

      if (!matchedUser) return false

      this.user = {
        name: matchedUser.name,
        username: matchedUser.username,
        role: matchedUser.role,
        avatarUrl: matchedUser.avatarUrl,
      }

      this.saveUser()
      this.saveUsers()

      return true
    },

    updateAvatar(avatarUrl) {
      if (!this.user) return

      const index = this.users.findIndex((user) => user.username === this.user.username)
      if (index === -1) return

      this.users[index].avatarUrl = avatarUrl
      this.user.avatarUrl = avatarUrl

      this.saveUsers()
      this.saveUser()
    },

    logout() {
      this.user = null
      localStorage.removeItem('plan-app-user')
    },
  },
})