<template>
  <el-table :data="list" border fit highlight-current-row style="width: 100%">
    <el-table-column
      v-loading="loading"
      align="center"
      label="ID"
      width="65"
      element-loading-text="请给我点时间！"
    >
      <template slot-scope="scope">
        <span>{{ scope.row.userId }}</span>
      </template>
    </el-table-column>

    <el-table-column width="180px" align="center" label="账号">
      <template slot-scope="scope">
        <span>{{ scope.row.username }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="90px" align="center" label="昵称">
      <template slot-scope="{row}">
        <span>{{ row.nickname }}</span>
      </template>
    </el-table-column>

    <el-table-column width="180px" align="center" label="创建时间">
      <template slot-scope="scope">
        <span>{{ scope.row.createTime }}</span>
      </template>
    </el-table-column>

    <el-table-column width="120px" align="center" label="邮箱">
      <template slot-scope="scope">
        <span>{{ scope.row.email }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center"  label="手机号" width="95">
      <template slot-scope="scope">
        <span>{{ scope.row.phone }}</span>
      </template>
    </el-table-column>

    <el-table-column class-name="status-col" align="center" label="状态" width="110">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column width="180px" align="center" label="最后更新">
      <template slot-scope="scope">
        <span>{{ scope.row.updateTime }}</span>
      </template>
    </el-table-column>

    <el-table-column width="180px" align="center" label="创建者ID">
      <template slot-scope="scope">
        <span>{{ scope.row.createUser }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { fetchList } from '@/api/user'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    roleId: String,
    username: String,
    pageNum: Number,
    pageSize: Number
  },
  data() {
    return {
      total: 0,
      list: null,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        roleId: '',
        roleName: ''
      },
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.$emit('create') // for test
      // 赋值prop给listQuery
      this.listQuery.roleId = this.roleId
      this.listQuery.username = this.username
      fetchList(this.listQuery).then(response => {
        this.list = response.data.list
        this.loading = false
        this.total = response.data.total
        console.log(this.total)
      })
      // 触发自定义事件，并将 pageNum 和 pageSize 作为事件的载荷发送出去
      this.$emit('updatePageInfo', this.total, this.listQuery.pageNum, this.listQuery.pageSize)
    }
  }
}
</script>

