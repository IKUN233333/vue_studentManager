<template>

<div id="app">

<header class="header">

<div class="logo">

<i>📚</i>

<span>学生成绩管理系统</span>

</div>

<nav class="nav">

<router-link to="/">仪表盘</router-link>

<router-link to="/students">学生管理</router-link>

<router-link to="/classes">班级管理</router-link>

<router-link to="/grades">成绩管理</router-link>

</nav>

<div class="theme-switch" @click="toggleTheme">

<span class="theme-icon">{{ darkMode ? '☀️' : '🌙' }}</span>

</div>

</header>

<main class="main-content">

<router-view></router-view>

</main>

</div>

</template>

<script>

import { ref, onMounted } from 'vue'

export default {

name: 'App',

setup() {

const darkMode = ref(false)

const toggleTheme = () => {

darkMode.value = !darkMode.value

document.body.classList.toggle('dark-mode', darkMode.value)

localStorage.setItem('darkMode', darkMode.value)

}

onMounted(() => {

const savedDarkMode = localStorage.getItem('darkMode') === 'true'

darkMode.value = savedDarkMode

document.body.classList.toggle('dark-mode', savedDarkMode)

})

return {

darkMode,

toggleTheme

}

}

}

</script>

<style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    :root {
      --primary: #4361ee;
      --secondary: #3f37c9;
      --success: #4cc9f0;
      --danger: #f72585;
      --warning: #f8961e;
      --info: #4895ef;
      --light: #f8f9fa;
      --dark: #212529;
      --bg: #f5f7fa;
      --card-bg: #ffffff;
      --text: #333333;
      --border: #e0e0e0;
    }
    
    .dark-mode {
      --bg: #1a1a2e;
      --card-bg: #16213e;
      --text: #ffffff;
      --border: #2d4059;
    }
    
    body {
      background-color: var(--bg);
      color: var(--text);
      transition: background-color 0.3s, color 0.3s;
    }
    
    #app {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .header {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      padding: 1.2rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.5rem;
      font-weight: bold;
    }
    
    .logo i {
      font-size: 2rem;
    }
    
    .nav {
      display: flex;
      gap: 1.5rem;
    }
    
    .nav a {
      color: rgba(255, 255, 255, 0.85);
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      transition: all 0.3s;
    }
    
    .nav a:hover, .nav a.router-link-active {
      background: rgba(255, 255, 255, 0.15);
      color: white;
    }
    
    .main-content {
      flex: 1;
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
    }
    
    .dashboard {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .stat-card {
      background: var(--card-bg);
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      border-left: 4px solid var(--primary);
      transition: transform 0.3s;
    }
    
    .stat-card:hover {
      transform: translateY(-5px);
    }
    
    .stat-card h3 {
      color: var(--text);
      margin-bottom: 0.5rem;
      font-size: 1rem;
      opacity: 0.8;
    }
    
    .stat-card .value {
      font-size: 2.2rem;
      font-weight: bold;
      color: var(--primary);
      margin: 0.5rem 0;
    }
    
    .stat-card .change {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }
    
    .charts-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .chart-card {
      background: var(--card-bg);
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    
    .chart-card h2 {
      margin-bottom: 1.5rem;
      color: var(--text);
      font-size: 1.3rem;
    }
    
    .chart-wrapper {
      height: 300px;
      position: relative;
    }
    
    .actions {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .search-bar {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .table-container {
      background: var(--card-bg);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    
    .student-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .student-table th {
      background-color: rgba(67, 97, 238, 0.1);
      color: var(--primary);
      text-align: left;
      padding: 1rem 1.5rem;
      font-weight: 600;
    }
    
    .student-table td {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border);
    }
    
    .student-table tr:hover {
      background-color: rgba(67, 97, 238, 0.03);
    }
    
    .action-cell {
      display: flex;
      gap: 0.8rem;
    }
    
    .btn {
      padding: 0.6rem 1.2rem;
      border-radius: 6px;
      border: none;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .btn-primary {
      background: var(--primary);
      color: white;
    }
    
    .btn-success {
      background: var(--success);
      color: white;
    }
    
    .btn-danger {
      background: var(--danger);
      color: white;
    }
    
    .btn-warning {
      background: var(--warning);
      color: white;
    }
    
    .btn:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }
    
    .btn i {
      font-size: 1.1rem;
    }
    
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .modal-content {
      background: var(--card-bg);
      border-radius: 12px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
    
    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .modal-body {
      padding: 1.5rem;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--text);
    }
    
    .form-control {
      width: 100%;
      padding: 0.8rem 1rem;
      border: 1px solid var(--border);
      border-radius: 6px;
      background: var(--card-bg);
      color: var(--text);
      font-size: 1rem;
    }
    
    .form-control:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
    }
    
    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .form-row .form-group {
      flex: 1;
      margin-bottom: 0;
    }
    
    .modal-footer {
      padding: 1.5rem;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
    
    .theme-switch {
      background: rgba(255, 255, 255, 0.15);
      border-radius: 50px;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: background 0.3s;
    }
    
    .theme-switch:hover {
      background: rgba(255, 255, 255, 0.25);
    }
    
    .theme-icon {
      font-size: 1.5rem;
    }
    
    @media (max-width: 768px) {
      .dashboard, .charts-container {
        grid-template-columns: 1fr;
      }
      
      .nav {
        display: none;
      }
      
      .actions {
        flex-direction: column;
      }
      
      .search-bar {
        width: 100%;
      }
      
      .chart-card {
        padding: 1rem;
      }
      
      .chart-wrapper {
        height: 250px;
      }
    }
    
    .fade-enter-active, .fade-leave-active {
      transition: opacity 0.3s;
    }
    
    .fade-enter-from, .fade-leave-to {
      opacity: 0;
    }
    
    .slide-fade-enter-active {
      transition: all 0.3s ease;
    }
    
    .slide-fade-leave-active {
      transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
    }
    
    .slide-fade-enter-from,
    .slide-fade-leave-to {
      transform: translateY(20px);
      opacity: 0;
    }
  </style>
