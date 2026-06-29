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
const editingCostId = ref(null)

const routeErrors = ref({})
const isSearchingPlaces = ref(false)
const placeSearch = ref('')
const placeResults = ref([])

const selectedAvatar = ref(null)
const showLogoutModal = ref(false)

const routeForm = ref({
    city: '',
    country: '',
    dates: '',
    driveTime: '',
    accommodation: '',
    notes: '',
    lat: '',
    lng: '',
    imageUrl: '',
    accommodationLink: '',
    mapsLink: '',
})

const voteForm = ref({
    title: '',
    type: 'City',
    description: '',
    link: '',
    imageUrl: '',
    cost: '',
    routeStopId: '',
})

const costForm = ref({
  title: '',
  category: 'Accommodation',
  country: '',
  amount: '',
  notes: '',
  routeStopId: '',
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
    routeStopId: '',
  }
}

const resetCostForm = () => {
  costForm.value = {
    title: '',
    category: 'Accommodation',
    country: '',
    amount: '',
    notes: '',
    routeStopId: '',
  }
}

const validateRouteForm = () => {
  routeErrors.value = {}

  if (!routeForm.value.city) routeErrors.value.city = 'City is required'
  if (!routeForm.value.country) routeErrors.value.country = 'Country is required'
  if (!routeForm.value.lat) routeErrors.value.lat = 'Latitude is required'
  if (!routeForm.value.lng) routeErrors.value.lng = 'Longitude is required'

  return Object.keys(routeErrors.value).length === 0
}

const searchPlaces = async () => {
  if (!placeSearch.value.trim()) return

  isSearchingPlaces.value = true

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeSearch.value)}&limit=5`
    )

    placeResults.value = await response.json()
  } catch (error) {
    console.error('Place search failed:', error)
    placeResults.value = []
  } finally {
    isSearchingPlaces.value = false
  }
}

const selectPlace = (place) => {
  const parts = place.display_name.split(',')

  routeForm.value.city = routeForm.value.city || parts[0]?.trim()
  routeForm.value.country = routeForm.value.country || parts[parts.length - 1]?.trim()
  routeForm.value.lat = place.lat
  routeForm.value.lng = place.lon

  placeSearch.value = place.display_name
  placeResults.value = []
  routeErrors.value = {}
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
    imageUrl: stop.imageUrl || '',
    accommodationLink: stop.accommodationLink || '',
    mapsLink: stop.mapsLink || '',
  }

  placeSearch.value = ''
  placeResults.value = []
  routeErrors.value = {}
}

const cancelEditingRoute = () => {
  editingRouteId.value = null
  resetRouteForm()
  routeErrors.value = {}
  placeSearch.value = ''
  placeResults.value = []
}

const saveRouteStop = () => {
  if (!validateRouteForm()) return

  if (editingRouteId.value) {
    routeStore.updateStop(editingRouteId.value, routeForm.value)
    editingRouteId.value = null
  } else {
    routeStore.addStop(routeForm.value)
  }

  resetRouteForm()
  routeErrors.value = {}
  placeSearch.value = ''
  placeResults.value = []
}

const handleRouteImageUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  const reader = new FileReader()

  reader.onload = () => {
    routeForm.value.imageUrl = reader.result
  }

  reader.readAsDataURL(file)
}

const showDeleteRouteImageModal = ref(false)

const deleteRouteImage = () => {
  routeForm.value.imageUrl = ''
  showDeleteRouteImageModal.value = false
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
    routeStopId: item.routeStopId || '',
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

const startEditingCost = (cost) => {
  activeForm.value = 'costs'
  editingCostId.value = cost.id

  costForm.value = {
    title: cost.title || '',
    category: cost.category || 'Accommodation',
    country: cost.country || '',
    amount: cost.amount || '',
    notes: cost.notes || '',
    routeStopId: cost.routeStopId || '',
  }
}

const cancelEditingCost = () => {
  editingCostId.value = null
  resetCostForm()
}

const saveCost = () => {
  if (!costForm.value.title || !costForm.value.amount) return

  if (editingCostId.value) {
    pricingStore.updateCost(editingCostId.value, costForm.value)
    editingCostId.value = null
  } else {
    pricingStore.addCost(costForm.value)
  }

  resetCostForm()
}

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

const logout = () => {
  authStore.logout()
  showLogoutModal.value = false
}

const showDeleteVoteImageModal = ref(false)

const handleVoteImageUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  const reader = new FileReader()

  reader.onload = () => {
    voteForm.value.imageUrl = reader.result
  }

  reader.readAsDataURL(file)
}

const deleteVoteImage = () => {
  voteForm.value.imageUrl = ''
  showDeleteVoteImageModal.value = false
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
              <input
                v-model="routeForm.city"
                class="input"
                :class="routeErrors.city ? 'border-red-500 focus:border-red-500' : ''"
                placeholder="City, e.g. Kotor"
              />

              <input
                v-model="routeForm.country"
                class="input"
                :class="routeErrors.country ? 'border-red-500 focus:border-red-500' : ''"
                placeholder="Country, e.g. Montenegro"
              />
              <input v-model="routeForm.dates" class="input" placeholder="Dates, e.g. 12-14 July" />
              <input v-model="routeForm.driveTime" class="input" placeholder="Drive time, e.g. 2h 30m" />
              <input v-model="routeForm.accommodation" class="input" placeholder="Accommodation name/link" />
              <label
                class="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 p-6 text-center transition hover:border-blue-500 dark:border-slate-700 dark:hover:border-cyan-400"
                >
                <Upload class="mb-3 h-9 w-9 text-slate-400" />

                <p class="font-bold">Upload stop image</p>

                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Choose from your phone or computer
                </p>

                <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleRouteImageUpload"
                />
                </label>

                <div v-if="routeForm.imageUrl" class="relative">
                    <img
                        :src="routeForm.imageUrl"
                        alt="Route stop preview"
                        class="h-44 w-full rounded-3xl object-cover"
                    />

                    <button
                        type="button"
                        class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg font-bold text-slate-900 shadow-lg cursor-pointer"
                        @click="showDeleteRouteImageModal = true"
                    >
                        ×
                    </button>
                </div>

                <input
                v-model="routeForm.accommodationLink"
                class="input"
                placeholder="Accommodation link"
                />

                <input
                v-model="routeForm.mapsLink"
                class="input"
                placeholder="Google Maps link"
                />
              <div class="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <label class="text-sm font-bold">Search location</label>

                <div class="mt-2 flex flex-col gap-2">
                  <input
                    v-model="placeSearch"
                    class="input"
                    placeholder="Search city, hotel or place"
                  />

                  <button
                    type="button"
                    class="rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white dark:bg-cyan-400 dark:text-slate-950"
                    @click="searchPlaces"
                  >
                    Search
                  </button>
                </div>

                <div v-if="placeResults.length" class="mt-3 space-y-2">
                  <button
                    v-for="place in placeResults"
                    :key="place.place_id"
                    type="button"
                    class="w-full rounded-2xl bg-slate-50 p-3 text-left text-sm dark:bg-slate-950"
                    @click="selectPlace(place)"
                  >
                    {{ place.display_name }}
                  </button>
                </div>
              </div>

            <div class="grid gap-3 sm:grid-cols-2">
              <input
                v-model="routeForm.lat"
                type="number"
                step="any"
                class="input"
                :class="routeErrors.lat ? 'border-red-500 focus:border-red-500' : ''"
                placeholder="Latitude"
              />

              <input
                v-model="routeForm.lng"
                type="number"
                step="any"
                class="input"
                :class="routeErrors.lng ? 'border-red-500 focus:border-red-500' : ''"
                placeholder="Longitude"
              />
            </div>
            <textarea v-model="routeForm.notes" class="input min-h-28" placeholder="Notes"></textarea>

            <p
              v-if="Object.keys(routeErrors).length"
              class="rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700 dark:bg-red-400/10 dark:text-red-300"
            >
              Please fill in the required fields: city, country, latitude and longitude.
            </p>

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

            <label
                class="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 p-6 text-center transition hover:border-blue-500 dark:border-slate-700 dark:hover:border-cyan-400"
                >
                <Upload class="mb-3 h-9 w-9 text-slate-400" />

                <p class="font-bold">Upload vote image</p>

                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Choose from your phone or computer
                </p>

                <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleVoteImageUpload"
                />
                </label>

                <div v-if="voteForm.imageUrl" class="relative">
                <img
                    :src="voteForm.imageUrl"
                    alt="Vote item preview"
                    class="h-44 w-full rounded-3xl object-cover"
                />

                <button
                    type="button"
                    class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg font-bold text-slate-900 shadow-lg"
                    @click="showDeleteVoteImageModal = true"
                >
                    ×
                </button>
            </div>

            <div class="relative">
              <input
                v-model="voteForm.cost"
                type="number"
                step="0.01"
                class="input pl-8"
                placeholder="Estimated cost (£ added later)"
              />
            </div>
            <select v-model="voteForm.routeStopId" class="input">
                <option value="">Link to route stop optional</option>
                <option
                    v-for="stop in routeStore.stops"
                    :key="stop.id"
                    :value="stop.id"
                >
                    {{ stop.city }}, {{ stop.country }}
                </option>
            </select>

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
          <h3 class="text-xl font-bold">
            {{ editingCostId ? 'Edit cost' : 'Add cost' }}
          </h3>

          <form class="mt-5 space-y-4" @submit.prevent="saveCost">
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

            <div class="relative">

              <input
                v-model="costForm.amount"
                type="number"
                step="0.01"
                class="input pl-8"
                placeholder="Amount, e.g. 250"
              />
            </div>

            <textarea v-model="costForm.notes" class="input min-h-28" placeholder="Notes"></textarea>

            <select v-model="costForm.routeStopId" class="input">
                <option value="">Link to route stop optional</option>
                <option
                    v-for="stop in routeStore.stops"
                    :key="stop.id"
                    :value="stop.id"
                >
                    {{ stop.city }}, {{ stop.country }}
                </option>
            </select>

            <button class="w-full rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white dark:bg-cyan-400 dark:text-slate-950">
              {{ editingCostId ? 'Save cost' : 'Add cost' }}
            </button>

            <button
              v-if="editingCostId"
              type="button"
              class="w-full rounded-2xl bg-slate-100 px-5 py-3 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              @click="cancelEditingCost"
            >
              Cancel edit
            </button>
          </form>

          <div v-if="pricingStore.costs.length" class="mt-6 space-y-3">
            <h4 class="font-bold">Current costs</h4>

            <article
              v-for="cost in pricingStore.costs"
              :key="cost.id"
              class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-bold">{{ cost.title }}</p>
                  <p class="muted text-sm">
                    {{ cost.category }} · £{{ cost.amount }}
                  </p>
                </div>

                <div class="flex gap-2">
                  <button
                    class="rounded-full bg-blue-100 px-3 py-2 text-xs font-bold text-blue-700 dark:bg-cyan-400/10 dark:text-cyan-300"
                    @click="startEditingCost(cost)"
                  >
                    Edit
                  </button>

                  <button
                    class="rounded-full bg-red-100 px-3 py-2 text-xs font-bold text-red-700 dark:bg-red-400/10 dark:text-red-300"
                    @click="pricingStore.deleteCost(cost.id)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          </div>
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
        <Teleport to="body">
            <div
                v-if="showDeleteRouteImageModal"
                class="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
            >
                <div class="w-full max-w-sm rounded-3xl bg-white p-6 text-slate-900 shadow-2xl dark:bg-slate-900 dark:text-white">
                <h3 class="text-2xl font-bold">Delete image?</h3>

                <p class="mt-3 text-slate-500 dark:text-slate-400">
                    Are you sure you want to remove this stop image?
                </p>

                <div class="mt-6 grid grid-cols-2 gap-3">
                    <button
                    type="button"
                    class="rounded-2xl bg-slate-100 px-4 py-3 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    @click="showDeleteRouteImageModal = false"
                    >
                    Cancel
                    </button>

                    <button
                    type="button"
                    class="rounded-2xl bg-red-600 px-4 py-3 font-bold text-white"
                    @click="deleteRouteImage"
                    >
                    Delete
                    </button>
                </div>
                </div>
            </div>
        </Teleport>
        <Teleport to="body">
            <div
                v-if="showDeleteVoteImageModal"
                class="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
            >
                <div class="w-full max-w-sm rounded-3xl bg-white p-6 text-slate-900 shadow-2xl dark:bg-slate-900 dark:text-white">
                <h3 class="text-2xl font-bold">Delete image?</h3>

                <p class="mt-3 text-slate-500 dark:text-slate-400">
                    Are you sure you want to remove this vote image?
                </p>

                <div class="mt-6 grid grid-cols-2 gap-3">
                    <button
                    type="button"
                    class="rounded-2xl bg-slate-100 px-4 py-3 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    @click="showDeleteVoteImageModal = false"
                    >
                    Cancel
                    </button>

                    <button
                    type="button"
                    class="rounded-2xl bg-red-600 px-4 py-3 font-bold text-white"
                    @click="deleteVoteImage"
                    >
                    Delete
                    </button>
                </div>
                </div>
            </div>
        </Teleport>
    </AppLayout>
</template>