import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '../views/DashboardView.vue'

import StudentManagement from '../views/StudentManagement.vue'

const routes = [

{

path: '/',

name: 'dashboard',

component: DashboardView

},

{

path: '/students',

name: 'students',

component: StudentManagement

},

{

path: '/classes',

name: 'classes',

component: () => import('../views/ClassesView.vue') // 暂时创建一个空组件

},

{

path: '/grades',

name: 'grades',

component: () => import('../views/GradesView.vue') // 暂时创建一个空组件

}

]

const router = createRouter({

history: createWebHistory(import.meta.env.BASE_URL),

routes

})

export default router