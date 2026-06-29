import { defineStore } from 'pinia'

export const useVotesStore = defineStore('votes', {
  state: () => ({
    voteItems: JSON.parse(localStorage.getItem('plan-app-vote-items')) || [],
  }),

  actions: {
    saveVotes() {
      localStorage.setItem('plan-app-vote-items', JSON.stringify(this.voteItems))
    },

    addVoteItem(item) {
      this.voteItems.push({
        id: Date.now(),
        status: 'pending',
        votes: [],
        ...item,
      })

      this.saveVotes()
    },

    updateVoteItem(id, updatedItem) {
      const index = this.voteItems.findIndex((item) => item.id === id)
      if (index === -1) return

      this.voteItems[index] = {
        ...this.voteItems[index],
        ...updatedItem,
      }

      this.saveVotes()
    },

    vote(itemId, userName, decision) {
      const item = this.voteItems.find((item) => item.id === itemId)
      if (!item) return

      item.votes = item.votes.filter((vote) => vote.userName !== userName)

      item.votes.push({
        userName,
        decision,
      })

      this.saveVotes()
    },

    deleteVoteItem(id) {
      this.voteItems = this.voteItems.filter((item) => item.id !== id)
      this.saveVotes()
    },
  },
})