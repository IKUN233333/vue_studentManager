import { defineStore } from 'pinia'

export const useStudentStore = defineStore('student', {

state: () => ({

students: [],

classes: ['计算机科学', '软件工程', '人工智能', '大数据科学', '网络安全'],

grades: ['大一', '大二', '大三', '大四'],

nextId: 4,

loading: false

}),

actions: {

fetchStudents() {

this.loading = true

setTimeout(() => {

this.students = [

{ id: 1, name: '张三', studentId: '20230001', gender: '男', age: 20, class: '计算机科学', grade: '大二', email: 'zhangsan@example.com', phone: '13800138000' },

{ id: 2, name: '李四', studentId: '20230002', gender: '女', age: 19, class: '软件工程', grade: '大一', email: 'lisi@example.com', phone: '13800138001' },

{ id: 3, name: '王五', studentId: '20230003', gender: '男', age: 21, class: '人工智能', grade: '大三', email: 'wangwu@example.com', phone: '13800138002' }

]

this.loading = false

}, 800)

},

addStudent(student) {

student.id = this.nextId++

this.students.push(student)

},

updateStudent(updatedStudent) {

const index = this.students.findIndex(s => s.id === updatedStudent.id)

if (index !== -1) {

this.students[index] = updatedStudent

}

},

deleteStudent(id) {

this.students = this.students.filter(student => student.id !== id)

}

},

getters: {

studentCount: (state) => state.students.length,

classDistribution: (state) => {

const distribution = {}

state.classes.forEach(cls => {

distribution[cls] = state.students.filter(s => s.class === cls).length

})

return distribution

},

gradeDistribution: (state) => {

const distribution = {}

state.grades.forEach(grade => {

distribution[grade] = state.students.filter(s => s.grade === grade).length

})

return distribution

},

genderDistribution: (state) => {

const male = state.students.filter(s => s.gender === '男').length

const female = state.students.filter(s => s.gender === '女').length

return { male, female }

}

}

})