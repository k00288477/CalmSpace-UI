import {createRouter, createWebHistory} from 'vue-router'

import Dashboard from "@/pages/Dashboard.vue";
import ChartLibrary from './pages/ChartLibrary.vue'


const routes = [
    {path: '/', component: Dashboard},
    {path: '/chartLibrary', component: ChartLibrary},
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})