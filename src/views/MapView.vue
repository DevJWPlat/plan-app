<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import AppLayout from '../layouts/AppLayout.vue'
import { useRouteStore } from '../stores/route'

const routeStore = useRouteStore()

const mapElement = ref(null)
const fullscreenMapElement = ref(null)
const selectedStop = ref(null)
const isFullscreen = ref(false)

let map = null
let fullscreenMap = null
let markersLayer = null
let fullscreenMarkersLayer = null
let routeLine = null
let fullscreenRouteLine = null

const validStops = computed(() => {
  return routeStore.activeTripStops.filter((stop) => stop.lat && stop.lng)
})

const addTiles = (mapInstance) => {
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
  }).addTo(mapInstance)
}

const renderMapData = (mapInstance, layer, lineRef) => {
  if (!mapInstance || !layer) return null

  layer.clearLayers()

  if (lineRef) {
    mapInstance.removeLayer(lineRef)
    lineRef = null
  }

  const points = validStops.value.map((stop) => [stop.lat, stop.lng])

  validStops.value.forEach((stop, index) => {
    const marker = L.marker([stop.lat, stop.lng]).addTo(layer)

    marker.bindPopup(`
      <strong>Stop ${index + 1}: ${stop.city}</strong><br>
      ${stop.country}<br>
      ${stop.driveTime || ''}
    `)

    marker.on('click', () => {
      selectedStop.value = stop
    })
  })

  if (points.length > 1) {
    lineRef = L.polyline(points, { weight: 4 }).addTo(mapInstance)

    mapInstance.fitBounds(lineRef.getBounds(), {
      padding: [30, 30],
    })
  }

  if (points.length === 1) {
    mapInstance.setView(points[0], 10)
  }

  return lineRef
}

const buildMap = async () => {
  await nextTick()

  if (!mapElement.value || map) return

  map = L.map(mapElement.value).setView([42.5, 19.2], 6)
  addTiles(map)

  markersLayer = L.layerGroup().addTo(map)
  routeLine = renderMapData(map, markersLayer, routeLine)

  setTimeout(() => {
    map.invalidateSize()
  }, 100)
}

const openFullscreen = async () => {
  isFullscreen.value = true
  await nextTick()

  if (!fullscreenMapElement.value) return

  if (!fullscreenMap) {
    fullscreenMap = L.map(fullscreenMapElement.value).setView([42.5, 19.2], 6)
    addTiles(fullscreenMap)
    fullscreenMarkersLayer = L.layerGroup().addTo(fullscreenMap)
  }

  fullscreenRouteLine = renderMapData(
    fullscreenMap,
    fullscreenMarkersLayer,
    fullscreenRouteLine
  )

  setTimeout(() => {
    fullscreenMap.invalidateSize()
  }, 150)
}

const closeFullscreen = () => {
  isFullscreen.value = false
}

onMounted(() => {
  buildMap()
})

watch(
  () => routeStore.activeTripStops,
  () => {
    routeLine = renderMapData(map, markersLayer, routeLine)
    fullscreenRouteLine = renderMapData(
      fullscreenMap,
      fullscreenMarkersLayer,
      fullscreenRouteLine
    )
  },
  { deep: true }
)
</script>

<template>
  <AppLayout>
    <h2 class="text-3xl font-bold">Map</h2>

    <p class="muted mt-3">
      See the full route and tap each marker to view the stop details.
    </p>

    <section v-if="validStops.length === 0" class="card mt-6">
      <h3 class="text-xl font-bold">No map stops yet</h3>
      <p class="muted mt-2">
        Add route stops with latitude and longitude from the admin page.
      </p>

      <RouterLink
        to="/admin"
        class="mt-5 inline-flex rounded-full bg-blue-600 px-5 py-3 font-bold text-white dark:bg-cyan-400 dark:text-slate-950"
      >
        Add route stop
      </RouterLink>
    </section>

    <div class="mt-6 flex justify-end">
      <button
        class="rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 dark:bg-cyan-400 dark:text-slate-950"
        @click="openFullscreen"
      >
        Open Full Screen Map
      </button>
    </div>

    <section
      class="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div ref="mapElement" class="h-[150px] md:h-[500px] w-full"></div>
    </section>

    <Teleport to="body">
      <div
        v-if="isFullscreen"
        class="fixed inset-0 z-[9999] bg-white dark:bg-slate-950"
      >
        <button
          class="absolute right-4 top-4 z-[10000] rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-lg dark:bg-slate-900 dark:text-white"
          @click="closeFullscreen"
        >
          ✕ Close
        </button>

        <div ref="fullscreenMapElement" class="h-screen w-screen"></div>
      </div>
    </Teleport>

    <section v-if="selectedStop" class="card mt-5">
      <p class="text-sm font-bold uppercase text-blue-600 dark:text-cyan-300">
        Selected stop
      </p>

      <h3 class="mt-1 text-2xl font-bold">
        {{ selectedStop.city }}, {{ selectedStop.country }}
      </h3>

      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
          <p class="muted text-sm">Dates</p>
          <p class="font-bold">{{ selectedStop.dates || 'Not added yet' }}</p>
        </div>

        <div class="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
          <p class="muted text-sm">Drive time</p>
          <p class="font-bold">{{ selectedStop.driveTime || 'Not added yet' }}</p>
        </div>
      </div>

      <div class="mt-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
        <p class="muted text-sm">Accommodation</p>
        <p class="font-bold">{{ selectedStop.accommodation || 'Not added yet' }}</p>
      </div>

      <p v-if="selectedStop.notes" class="muted mt-4">
        {{ selectedStop.notes }}
      </p>
    </section>
  </AppLayout>
</template>