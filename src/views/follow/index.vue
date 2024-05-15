<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="followListQuery.followId" placeholder="用户ID" style="width: 200px; margin-right: 20px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="followListQuery.nickname" placeholder="昵称" style="width: 200px; margin-right: 20px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <div class="table-container">
      <br>
    </div>

    <el-table :data="followList" border fit highlight-current-row style="width: 100%">
      <el-table-column
        v-loading="listLoading"
        align="center"
        label="ID"
        width="65"
        element-loading-text="请给我点时间！"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="120px" align="center" label="昵称">
        <template slot-scope="{row}">
          <span>{{ row.nickname }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center"  label="手机号" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center"  label="个人描述" width="170">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="followListQuery.pageNum" :limit.sync="followListQuery.pageSize" @pagination="query" />

  </div>
</template>

<script>

import { updateInfo } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { getFollowList } from '@/api/follow'

export default {
  name: 'FollowQuery',
  components: { Pagination },
  directives: { waves },
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
  data() {
    return {
      dialogFormVisible: false,
      tableKey: 0,
      tagOptions: [],
      total: 0,
      listLoading: true,
      value: '',
      roleOptions: [],
      followListQuery: {
        pageNum: 1,
        pageSize: 10,
        userId: '',
        followId: '',
        nickname: '',
      },
      followList: [],
      userInfo: {
        id: '',
        nickname: '',
        roleId: '',
        roleName: '',
        email: '',
        phone: '',
        description: '',
        createUser: '',
        createTime: '',
        updateTime: ''
      },
    }
  },
  async created() {
    this.listLoading = true
  },
  methods: {
    // 获取粉丝列表
    query() {
      this.followListQuery.userId = this.$store.getters.id
      console.log(this.followListQuery)
      getFollowList(this.followListQuery).then(response => {
        this.followList = response.data.list
        this.total = response.data.total
        console.log(this.followList)
        // 消息提示
        this.$message({
          message: '查询成功',
          type: 'success'
        })
      })
    },
    // 筛选
    handleFilter() {
      this.listLoading = true
      this.query()
      this.listLoading = false
    },
    handleUpdate(row) {
      this.userInfo = Object.assign({}, row)
      this.userInfo.id = row.userId
      this.dialogFormVisible = true
    },
    edit() {
      updateInfo(this.userInfo).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          // 关闭对话框
          this.dialogFormVisible = false
          // 刷新当前页面
          this.query()
        } else {
          this.$message({
            message: '修改失败',
            type: 'error'
          });
        }
      });
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    }
  }
}
</script>
