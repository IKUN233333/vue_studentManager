<template>

<div>

<h1 style="margin-bottom: 1.5rem;">系统概览</h1>

<div class="dashboard">

<!-- 统计卡片 -->

</div>

<div class="charts-container">

<!-- 图表卡片 -->

</div>

<div class="actions">

<h2>最近添加的学生</h2>

<router-link to="/students" class="btn btn-primary">

<i>➕</i> 添加新学生

</router-link>

</div>

<div class="table-container">

<!-- 学生表格 -->

</div>

</div>

</template>

<script>

import { useStudentStore } from '../store/studnet'

import { onMounted, ref } from 'vue'

import { Chart } from 'chart.js'

export default {

setup() {

const studentStore = useStudentStore()

let classChart = null

let gradeChart = null

onMounted(() => {

studentStore.fetchStudents()

})

const renderCharts = () => {

// 渲染图表的逻辑（与之前相同）

}

return {

studentStore

}

}

}

</script>