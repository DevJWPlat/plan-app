<script setup>
import { ref } from 'vue'
import AppLayout from '../layouts/AppLayout.vue'
import { useAuthStore } from '../stores/auth'
import { useRouteStore } from '../stores/route'
import { useVotesStore } from '../stores/votes'
import { usePricingStore } from '../stores/pricing'
import { Upload } from 'lucide-vue-next'

const authStore = useAuthStore()
const routeStore = useRouteStore()
const votesStore = useVotesStore()
const pricingStore = usePricingStore()

const activeForm = ref('route')
const editingRouteId = ref(null)
const editingVoteId = ref(null)

const routeForm = ref({
  city: '',
  country: '',
  dates: '',
  driveTime: '',
  accommodation: '',
  notes: '',
  lat: '',
  lng: '',
})

const voteForm = ref({
  title: '',
  type: 'City',
  description: '',
  link: '',
  imageUrl: '',
  cost: '',
})

const costForm = ref({
  title: '',
  category: 'Accommodation',
  country: '',
  amount: '',
  notes: '',
})

const resetRouteForm = () => {
  routeForm.value = {
    city: '',
    country: '',
    dates: '',
    driveTime: '',
    accommodation: '',
    notes: '',
    lat: '',
    lng: '',
  }
}

const resetVoteForm = () => {
  voteForm.value = {
    title: '',
    type: 'City',
    description: '',
    link: '',
    imageUrl: '',
    cost: '',
  }
}

const resetCostForm = () => {
  costForm.value = {
    title: '',
    category: 'Accommodation',
    country: '',
    amount: '',
    notes: '',
  }
}

const startEditingRoute = (stop) => {
  activeForm.value = 'route'
  editingRouteId.value = stop.id

  routeForm.value = {
    city: stop.city || '',
    country: stop.country || '',
    dates: stop.dates || '',
    driveTime: stop.driveTime || '',
    accommodation: stop.accommodation || '',
    notes: stop.notes || '',
    lat: stop.lat || '',
    lng: stop.lng || '',
  }
}

const cancelEditingRoute = () => {
  editingRouteId.value = null
  resetRouteForm()
}

const saveRouteStop = () => {
  if (!routeForm.value.city || !routeForm.value.country) return

  if (editingRouteId.value) {
    routeStore.updateStop(editingRouteId.value, routeForm.value)
    editingRouteId.value = null
  } else {
    routeStore.addStop(routeForm.value)
  }

  resetRouteForm()
}

const startEditingVote = (item) => {
  activeForm.value = 'votes'
  editingVoteId.value = item.id

  voteForm.value = {
    title: item.title || '',
    type: item.type || 'City',
    description: item.description || '',
    link: item.link || '',
    imageUrl: item.imageUrl || '',
    cost: item.cost || '',
  }
}

const cancelEditingVote = () => {
  editingVoteId.value = null
  resetVoteForm()
}

const saveVoteItem = () => {
  if (!voteForm.value.title || !voteForm.value.description) return

  if (editingVoteId.value) {
    votesStore.updateVoteItem(editingVoteId.value, voteForm.value)
    editingVoteId.value = null
  } else {
    votesStore.addVoteItem(voteForm.value)
  }

  resetVoteForm()
}

const addCost = () => {
  if (!costForm.value.title || !costForm.value.amount) return

  pricingStore.addCost(costForm.value)
  resetCostForm()
}

const selectedAvatar = ref(null)

const handleAvatarUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  const reader = new FileReader()

  reader.onload = () => {
    selectedAvatar.value = reader.result
  }

  reader.readAsDataURL(file)
}

const saveAvatar = () => {
  if (!selectedAvatar.value) return

  authStore.updateAvatar(selectedAvatar.value)
  selectedAvatar.value = null
}

const showLogoutModal = ref(false)

const logout = () => {
  authStore.logout()
  showLogoutModal.value = false
}
</script>

<template>
    <AppLayout>
        <template v-if="!authStore.isLoggedIn">
        <section class="card">
            <h2 class="text-2xl font-bold">Login required</h2>
            <p class="muted mt-2">You need to login before you can access admin tools.</p>

            <RouterLink
            to="/login"
            class="mt-5 inline-flex rounded-full bg-blue-600 px-5 py-3 font-bold text-white dark:bg-cyan-400 dark:text-slate-950"
            >
            Login
            </RouterLink>
        </section>
        </template>

        <template v-else-if="!authStore.isAdmin">
        <section class="card">
            <h2 class="text-2xl font-bold">Admin only</h2>
            <p class="muted mt-2">This area is only for Jonny, Emily, Josh and Elise.</p>
        </section>
        </template>

        <template v-else>
        <h2 class="text-3xl font-bold">Admin</h2>
        <p class="muted mt-3">Add stops, votes and costs for the trip.</p>

        <section class="mt-6 grid grid-cols-4 gap-3">
            <button
            class="rounded-2xl border px-2 py-3 text-xs font-bold"
            :class="activeForm === 'route'
                ? 'border-blue-600 bg-blue-600 text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950'
                : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'"
            @click="activeForm = 'route'"
            >
            Route
            </button>

            <button
            class="rounded-2xl border px-2 py-3 text-xs font-bold"
            :class="activeForm === 'votes'
                ? 'border-blue-600 bg-blue-600 text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950'
                : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'"
            @click="activeForm = 'votes'"
            >
            Votes
            </button>

            <button
            class="rounded-2xl border px-2 py-3 text-xs font-bold"
            :class="activeForm === 'costs'
                ? 'border-blue-600 bg-blue-600 text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950'
                : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'"
            @click="activeForm = 'costs'"
            >
            Costs
            </button>
            
            <button
            class="rounded-2xl border px-2 py-3 text-xs font-bold"
            :class="activeForm === 'settings'
                ? 'border-blue-600 bg-blue-600 text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950'
                : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'"
            @click="activeForm = 'settings'"
            >
            Settings
            </button>
        </section>

        <section v-if="activeForm === 'route'" class="card mt-5">
            <h3 class="text-xl font-bold">
            {{ editingRouteId ? 'Edit route stop' : 'Add route stop' }}
            </h3>

            <form class="mt-5 space-y-4" @submit.prevent="saveRouteStop">
            <input v-model="routeForm.city" class="input" placeholder="City, e.g. Kotor" />
            <input v-model="routeForm.country" class="input" placeholder="Country, e.g. Montenegro" />
            <input v-model="routeForm.dates" class="input" placeholder="Dates, e.g. 12-14 July" />
            <input v-model="routeForm.driveTime" class="input" placeholder="Drive time, e.g. 2h 30m" />
            <input v-model="routeForm.accommodation" class="input" placeholder="Accommodation name/link" />
            <input v-model="routeForm.lat" type="number" step="any" class="input" placeholder="Latitude, e.g. 42.4247" />
            <input v-model="routeForm.lng" type="number" step="any" class="input" placeholder="Longitude, e.g. 18.7712" />
            <textarea v-model="routeForm.notes" class="input min-h-28" placeholder="Notes"></textarea>

            <button class="w-full rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white dark:bg-cyan-400 dark:text-slate-950">
                {{ editingRouteId ? 'Save route stop' : 'Add route stop' }}
            </button>

            <button
                v-if="editingRouteId"
                type="button"
                class="w-full rounded-2xl bg-slate-100 px-5 py-3 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                @click="cancelEditingRoute"
            >
                Cancel edit
            </button>
            </form>

            <div v-if="routeStore.stops.length" class="mt-6 space-y-3">
            <h4 class="font-bold">Current route stops</h4>

            <article
                v-for="stop in routeStore.stops"
                :key="stop.id"
                class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950"
            >
                <div class="flex items-start justify-between gap-3">
                <div>
                    <p class="font-bold">{{ stop.city }}, {{ stop.country }}</p>
                    <p class="muted text-sm">{{ stop.dates || 'No dates added' }}</p>
                </div>

                <button
                    class="rounded-full bg-blue-100 px-3 py-2 text-xs font-bold text-blue-700 dark:bg-cyan-400/10 dark:text-cyan-300"
                    @click="startEditingRoute(stop)"
                >
                    Edit
                </button>
                </div>
            </article>
            </div>
        </section>

        <section v-if="activeForm === 'votes'" class="card mt-5">
          <h3 class="text-xl font-bold">
            {{ editingVoteId ? 'Edit vote item' : 'Add vote item' }}
          </h3>

          <form class="mt-5 space-y-4" @submit.prevent="saveVoteItem">
            <input v-model="voteForm.title" class="input" placeholder="Title, e.g. Add Kotor" />

            <select v-model="voteForm.type" class="input">
              <option>City</option>
              <option>Accommodation</option>
              <option>Trip</option>
              <option>Car</option>
              <option>Other</option>
            </select>

            <textarea v-model="voteForm.description" class="input min-h-28" placeholder="Description"></textarea>

            <input
              v-model="voteForm.link"
              class="input"
              placeholder="Link, e.g. Airbnb or trip website"
            />

            <input
              v-model="voteForm.imageUrl"
              class="input"
              placeholder="Image URL"
            />

            <div class="relative">
              <input
                v-model="voteForm.cost"
                type="number"
                step="0.01"
                class="input pl-8"
                placeholder="Estimated cost (£ added later)"
              />
            </div>

            <button class="w-full rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white dark:bg-cyan-400 dark:text-slate-950">
              {{ editingVoteId ? 'Save vote item' : 'Add vote item' }}
            </button>

            <button
              v-if="editingVoteId"
              type="button"
              class="w-full rounded-2xl bg-slate-100 px-5 py-3 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              @click="cancelEditingVote"
            >
              Cancel edit
            </button>
          </form>

          <div v-if="votesStore.voteItems.length" class="mt-6 space-y-3">
            <h4 class="font-bold">Current vote items</h4>

            <article
              v-for="item in votesStore.voteItems"
              :key="item.id"
              class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-bold">{{ item.title }}</p>
                  <p class="muted text-sm">{{ item.type }}</p>
                </div>

                <div class="flex gap-2">
                  <button
                    class="rounded-full bg-blue-100 px-3 py-2 text-xs font-bold text-blue-700 dark:bg-cyan-400/10 dark:text-cyan-300"
                    @click="startEditingVote(item)"
                  >
                    Edit
                  </button>

                  <button
                    class="rounded-full bg-red-100 px-3 py-2 text-xs font-bold text-red-700 dark:bg-red-400/10 dark:text-red-300"
                    @click="votesStore.deleteVoteItem(item.id)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section v-if="activeForm === 'costs'" class="card mt-5">
            <h3 class="text-xl font-bold">Add cost</h3>

            <form class="mt-5 space-y-4" @submit.prevent="addCost">
            <input v-model="costForm.title" class="input" placeholder="Title, e.g. Kotor apartment" />

            <select v-model="costForm.category" class="input">
                <option>Accommodation</option>
                <option>Car</option>
                <option>Fuel</option>
                <option>Trips</option>
                <option>Food</option>
                <option>Other</option>
            </select>

            <input v-model="costForm.country" class="input" placeholder="Country, e.g. Montenegro" />
            <input v-model="costForm.amount" type="number" class="input" placeholder="Amount, e.g. 250" />
            <textarea v-model="costForm.notes" class="input min-h-28" placeholder="Notes"></textarea>

            <button class="w-full rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white dark:bg-cyan-400 dark:text-slate-950">
                Add cost
            </button>
            </form>
        </section>
        <section v-if="activeForm === 'settings'" class="card mt-5">
            <h3 class="text-xl font-bold">Admin settings</h3>

            <div class="mt-5 flex items-center gap-4">
                <div class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-2xl font-bold text-white dark:bg-cyan-400 dark:text-slate-950">
                <img
                    v-if="authStore.user.avatarUrl"
                    :src="authStore.user.avatarUrl"
                    :alt="authStore.user.name"
                    class="h-full w-full object-cover"
                />

                <span v-else>
                    {{ authStore.user.name[0] }}
                </span>
                </div>

                <div>
                <p class="font-bold">{{ authStore.user.name }}</p>
                <p class="muted text-sm">{{ authStore.user.role }}</p>
                </div>
            </div>

            <div class="mt-6">
                <label
                    class="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 p-8 text-center transition hover:border-blue-500 dark:border-slate-700 dark:hover:border-cyan-400"
                >
                    <Upload class="mb-3 h-10 w-10 text-slate-400" />

                    <p class="font-bold">
                    Upload profile picture
                    </p>

                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    JPG, PNG or WebP
                    </p>

                    <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleAvatarUpload"
                    />
                </label>

                <div
                    v-if="selectedAvatar"
                    class="mt-5 rounded-3xl border border-green-200 bg-green-50 p-4 dark:border-green-400/20 dark:bg-green-400/10"
                >
                    <p class="font-bold text-green-700 dark:text-green-300">
                    New image selected
                    </p>

                    <img
                    :src="selectedAvatar"
                    alt="Preview"
                    class="mt-3 h-24 w-24 rounded-full object-cover"
                    />

                    <button
                    class="mt-4 rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white dark:bg-cyan-400 dark:text-slate-950"
                    @click="saveAvatar"
                    >
                    Save Profile Picture
                    </button>
                </div>
                <button
                  type="button"
                  class="mt-4 w-full rounded-2xl bg-red-100 px-5 py-3 font-bold text-red-700 dark:bg-red-400/10 dark:text-red-300"
                  @click="showLogoutModal = true"
                >
                  Logout
                </button>
            </div>
        </section>
        </template>
        <Teleport to="body">
          <div
            v-if="showLogoutModal"
            class="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          >
            <div class="w-full max-w-sm rounded-3xl bg-white p-6 text-slate-900 shadow-2xl dark:bg-slate-900 dark:text-white">
              <h3 class="text-2xl font-bold">Logout?</h3>

              <p class="mt-3 text-slate-500 dark:text-slate-400">
                Are you sure you want to logout? You won’t be able to vote while logged out.
              </p>

              <div class="mt-6 grid grid-cols-2 gap-3">
                <button
                  class="rounded-2xl bg-slate-100 px-4 py-3 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  @click="showLogoutModal = false"
                >
                  Cancel
                </button>

                <button
                  class="rounded-2xl bg-red-600 px-4 py-3 font-bold text-white"
                  @click="logout"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </Teleport>
    </AppLayout>
</template>