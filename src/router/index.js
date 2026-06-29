import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import MapView from '../views/MapView.vue'
import RouteView from '../views/RouteView.vue'
import VotesView from '../views/VotesView.vue'
import PricingView from '../views/PricingView.vue'
import LoginView from '../views/LoginView.vue'
import AdminView from '../views/AdminView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import StopDetailView from '../views/StopDetailView.vue'

const routes = [
  {
    path: '/',
    component: HomeView
  },
  {
    path: '/login',
    component: LoginView
  },
  {
    path: '/map',
    component: MapView
  },
  {
    path: '/route',
    component: RouteView
  },
  {
    path: '/votes',
    component: VotesView
  },
  {
    path: '/pricing',
    component: PricingView
  },
  {
    path: '/admin',
    component: AdminView
  },
  {
    path: '/route/:id',
    component: StopDetailView
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFoundView
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})