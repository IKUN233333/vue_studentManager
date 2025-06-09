<template>
  <div>
    <h1 style="margin-bottom: 1.5rem;">班级管理</h1>
    
    <div class="actions">
      <div class="search-bar">
        <input 
          type="text" 
          class="form-control" 
          style="width: 300px;"
          placeholder="搜索班级名称或班主任..." 
          v-model="searchQuery"
        >
        <button class="btn btn-primary" @click="openAddModal">
          <i class="el-icon-plus"></i> 添加班级
        </button>
      </div>
    </div>
    
    <div class="tabs">
      <div class="tab" :class="{ active: activeTab === 'list' }" @click="activeTab = 'list'">班级列表</div>
      <div class="tab" :class="{ active: activeTab === 'stats' }" @click="activeTab = 'stats'">班级统计</div>
    </div>
    
    <div class="tab-content" v-if="activeTab === 'list'">
      <div class="table-container">
        <table class="class-table">
          <thead>
            <tr>
              <th>班级名称</th>
              <th>班主任</th>
              <th>学生人数</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="studentStore.loading">
              <td colspan="4" style="text-align: center; padding: 2rem;">
                加载中...
              </td>
            </tr>
            <tr v-else-if="filteredClasses.length === 0">
              <td colspan="4" style="text-align: center; padding: 2rem;">
                <div class="empty-state">
                  <i class="el-icon-s-empty"></i>
                  <div>没有找到班级记录</div>
                </div>
              </td>
            </tr>
            <tr v-for="cls in filteredClasses" :key="cls.id">
              <td>{{ cls.name }}</td>
              <td>{{ cls.teacher }}</td>
              <td>{{ cls.studentCount }}</td>
              <td class="action-cell">
                <button class="btn btn-success" @click="openEditModal(cls)">
                  <i class="el-icon-edit"></i> 编辑
                </button>
                <button class="btn btn-warning" @click="viewClassDetail(cls.id)">
                  <i class="el-icon-info"></i> 详情
                </button>
                <button class="btn btn-danger" @click="confirmDelete(cls.id)">
                  <i class="el-icon-delete"></i> 删除
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="tab-content" v-if="activeTab === 'stats'">
      <div class="charts-container">
        <div class="chart-card">
          <h2>班级学生分布</h2>
          <div class="chart-wrapper">
            <canvas ref="classChart"></canvas>
          </div>
        </div>
        
        <div class="chart-card">
          <h2>班级平均分对比</h2>
          <div class="chart-wrapper">
            <canvas ref="scoreChart"></canvas>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 模态框 -->
    <teleport to="body">
      <transition name="fade">
        <div class="modal" v-if="showModal">
          <div class="modal-content">
            <div class="modal-header">
              <h2>{{ editingClass ? '编辑班级信息' : '添加新班级' }}</h2>
              <button @click="showModal = false" class="btn btn-danger">
                <i class="el-icon-close"></i>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>班级名称</label>
                <input type="text" class="form-control" v-model="newClass.name">
              </div>
              
              <div class="form-group">
                <label>班主任</label>
                <input type="text" class="form-control" v-model="newClass.teacher">
              </div>
              
              <div class="form-group">
                <label>班级描述</label>
                <textarea class="form-control" v-model="newClass.description" rows="3"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn" @click="showModal = false">取消</button>
              <button class="btn btn-primary" @click="saveClass">
                <i class="el-icon-save"></i> 保存
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useStudentStore } from '../store/studnet';

const studentStore = useStudentStore();
const router = useRouter();

// 状态定义
const showModal = ref(false);
const editingClass = ref(null);
const searchQuery = ref('');
const newClass = ref({
  name: '',
  teacher: '',
  description: ''
});
const activeTab = ref('list');

// 计算属性
const filteredClasses = computed(() => {
  if (!searchQuery.value) return studentStore.classes;
  const query = searchQuery.value.toLowerCase();
  return studentStore.classes.filter(cls => 
    cls.name.toLowerCase().includes(query) ||
    cls.teacher.toLowerCase().includes(query)
  );
});

// 生命周期钩子
onMounted(() => {
  studentStore.fetchStudents();
  renderCharts();
});

// 图表相关
let classChart = null;
let scoreChart = null;

const renderCharts = () => {
  // 销毁旧图表
  if (classChart) classChart.destroy();
  if (scoreChart) scoreChart.destroy();

  // 班级学生分布图表
  const classCtx = document.getElementById('classChart')?.getContext('2d');
  if (classCtx) {
    classChart = new Chart(classCtx, {
      type: 'pie',
      data: {
        labels: studentStore.classes.map(c => c.name),
        datasets: [{
          data: studentStore.classes.map(c => c.studentCount),
          backgroundColor: ['#4361ee', '#4cc9f0', '#f8961e', '#f72585', '#3f37c9'],
          borderColor: ['#4361ee', '#4cc9f0', '#f8961e', '#f72585', '#3f37c9'],
          borderWidth: 1
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  // 班级平均分图表
  const scoreCtx = document.getElementById('scoreChart')?.getContext('2d');
  if (scoreCtx) {
    scoreChart = new Chart(scoreCtx, {
      type: 'bar',
      data: {
        labels: studentStore.classes.map(c => c.name),
        datasets: [{
          label: '班级平均分',
          data: studentStore.classes.map(c => studentStore.getClassAverage(c.id)),
          backgroundColor: '#4cc9f0',
          borderColor: '#4cc9f0',
          borderWidth: 1
        }]
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, max: 100 } }
      }
    });
  }
};

// 监听数据变化更新图表
watch([() => studentStore.classes, () => studentStore.students], () => {
  renderCharts();
}, { deep: true });

// 组件卸载时销毁图表
onUnmounted(() => {
  if (classChart) classChart.destroy();
  if (scoreChart) scoreChart.destroy();
});

// 方法定义
const openAddModal = () => {
  editingClass.value = null;
  newClass.value = { name: '', teacher: '', description: '' };
  showModal.value = true;
};

const openEditModal = (cls) => {
  editingClass.value = cls.id;
  newClass.value = { ...cls };
  showModal.value = true;
};

const saveClass = () => {
  if (editingClass.value) {
    studentStore.updateClass({ ...newClass.value });
  } else {
    studentStore.addClass({ ...newClass.value });
  }
  showModal.value = false;
};

const confirmDelete = (id) => {
  if (confirm('确定要删除该班级吗？此操作不可撤销。')) {
    studentStore.deleteClass(id);
  }
};

const viewClassDetail = (id) => {
  router.push(`/class/${id}`);
};
</script>

<style scoped>

</style>