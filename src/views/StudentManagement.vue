<template>
 <div>
          <h1 style="margin-bottom: 1.5rem;">学生管理</h1>
          
          <div class="actions">
            <div class="search-bar">
              <input 
                type="text" 
                class="form-control" 
                style="width: 300px;"
                placeholder="搜索学生姓名、学号或班级..." 
                v-model="searchQuery"
              >
              <button class="btn btn-primary" @click="openAddModal">
                <i>➕</i> 添加学生
              </button>
            </div>
          </div>
          
          <div class="table-container">
            <table class="student-table">
              <thead>
                <tr>
                  <th>学号</th>
                  <th>姓名</th>
                  <th>性别</th>
                  <th>年龄</th>
                  <th>班级</th>
                  <th>年级</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="studentStore.loading">
                  <td colspan="7" style="text-align: center; padding: 2rem;">
                    加载中...
                  </td>
                </tr>
                <tr v-else-if="filteredStudents.length === 0">
                  <td colspan="7" style="text-align: center; padding: 2rem;">
                    没有找到学生记录
                  </td>
                </tr>
                <tr v-for="student in filteredStudents" :key="student.id">
                  <td>{{ student.studentId }}</td>
                  <td>{{ student.name }}</td>
                  <td>{{ student.gender }}</td>
                  <td>{{ student.age }}</td>
                  <td>{{ student.class }}</td>
                  <td>{{ student.grade }}</td>
                  <td class="action-cell">
                    <button class="btn btn-success" @click="openEditModal(student)">编辑</button>
                    <button class="btn btn-danger" @click="confirmDelete(student.id)">删除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <teleport to="body">
            <transition name="fade">
              <div class="modal" v-if="showModal">
                <div class="modal-content">
                  <div class="modal-header">
                    <h2>{{ editingStudent ? '编辑学生信息' : '添加新学生' }}</h2>
                    <button @click="showModal = false" class="btn btn-danger">✕</button>
                  </div>
                  <div class="modal-body">
                    <div class="form-row">
                      <div class="form-group">
                        <label>姓名</label>
                        <input type="text" class="form-control" v-model="newStudent.name">
                      </div>
                      <div class="form-group">
                        <label>学号</label>
                        <input type="text" class="form-control" v-model="newStudent.studentId">
                      </div>
                    </div>
                    
                    <div class="form-row">
                      <div class="form-group">
                        <label>性别</label>
                        <select class="form-control" v-model="newStudent.gender">
                          <option value="男">男</option>
                          <option value="女">女</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label>年龄</label>
                        <input type="number" class="form-control" v-model="newStudent.age" min="16" max="30">
                      </div>
                    </div>
                    
                    <div class="form-row">
                      <div class="form-group">
                        <label>班级</label>
                        <select class="form-control" v-model="newStudent.class">
                          <option value="" disabled>请选择班级</option>
                          <option v-for="cls in studentStore.classes" :key="cls" :value="cls">{{ cls }}</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label>年级</label>
                        <select class="form-control" v-model="newStudent.grade">
                          <option value="" disabled>请选择年级</option>
                          <option v-for="grade in studentStore.grades" :key="grade" :value="grade">{{ grade }}</option>
                        </select>
                      </div>
                    </div>
                    
                    <div class="form-row">
                      <div class="form-group">
                        <label>电子邮箱</label>
                        <input type="email" class="form-control" v-model="newStudent.email">
                      </div>
                      <div class="form-group">
                        <label>手机号码</label>
                        <input type="tel" class="form-control" v-model="newStudent.phone">
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button class="btn" @click="showModal = false">取消</button>
                    <button class="btn btn-primary" @click="saveStudent">保存</button>
                  </div>
                </div>
              </div>
            </transition>
          </teleport>
 </div>
</template>


<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { useStudentStore } from '../store/studnet'; // 请根据实际路径调整

export default {
  name: 'StudentManagement',
  setup() {
    const studentStore = useStudentStore();
    const showModal = ref(false);
    const editingStudent = ref(null);
    const searchQuery = ref('');
    const newStudent = reactive({
      name: '',
      studentId: '',
      gender: '男',
      age: 18,
      class: '',
      grade: '',
      email: '',
      phone: ''
    });
    
    onMounted(() => {
      studentStore.fetchStudents();
    });
    
    const filteredStudents = computed(() => {
      if (!searchQuery.value) return studentStore.students;
      const query = searchQuery.value.toLowerCase();
      return studentStore.students.filter(student => 
        student.name.toLowerCase().includes(query) ||
        student.studentId.toLowerCase().includes(query) ||
        student.class.toLowerCase().includes(query)
      );
    });
    
    const openAddModal = () => {
      editingStudent.value = null;
      Object.assign(newStudent, {
        name: '',
        studentId: '',
        gender: '男',
        age: 18,
        class: '',
        grade: '',
        email: '',
        phone: ''
      });
      showModal.value = true;
    };
    
    const openEditModal = (student) => {
      editingStudent.value = student.id;
      Object.assign(newStudent, { ...student });
      showModal.value = true;
    };
    
    const saveStudent = () => {
      if (editingStudent.value) {
        studentStore.updateStudent({ ...newStudent });
      } else {
        studentStore.addStudent({ ...newStudent });
      }
      showModal.value = false;
    };
    
    const confirmDelete = (id) => {
      if (confirm('确定要删除该学生吗？此操作不可撤销。')) {
        studentStore.deleteStudent(id);
      }
    };
    
    return {
      studentStore,
      showModal,
      editingStudent,
      newStudent,
      searchQuery,
      filteredStudents,
      openAddModal,
      openEditModal,
      saveStudent,
      confirmDelete
    };
  }
}
</script>