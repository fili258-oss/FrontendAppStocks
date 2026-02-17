import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import StockList from '@/views/StockList.vue'
import StockDetail from '@/views/StockDetail.vue'
import Recommendations from '@/views/Recommendations.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/stocks',
      name: 'stocks',
      component: StockList,
    },
    {
      path: '/stocks/:symbol',
      name: 'stock-detail',
      component: StockDetail,
      props: true,
    },
    {
      path: '/recommendations',
      name: 'recommendations',
      component: Recommendations,
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
