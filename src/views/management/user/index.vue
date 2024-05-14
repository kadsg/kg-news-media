<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="userListQuery.id" placeholder="用户ID" style="width: 200px; margin-right: 20px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="userListQuery.username" placeholder="用户名" style="width: 200px; margin-right: 20px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="userListQuery.nickname" placeholder="昵称" style="width: 200px; margin-right: 20px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="userListQuery.roleId" clearable  placeholder="角色类型（默认全部）" style="width: 200px; margin-right: 20px;">
        <el-option
          v-for="item in roleOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <div class="table-container">
      <br>
    </div>

    <el-table :data="userList" border fit highlight-current-row style="width: 100%">
      <el-table-column
        v-loading="listLoading"
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

      <el-table-column min-width="100px" align="center" label="昵称">
        <template slot-scope="{row}">
          <span>{{ row.nickname }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column width="170px" align="center" label="邮箱">
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

      <el-table-column label="操作" align="center" width="90" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="userListQuery.pageNum" :limit.sync="userListQuery.pageSize" @pagination="query" />

    <!--  编辑信息表单  -->
    <el-dialog title="个人信息" :visible.sync="dialogFormVisible">
      <el-form label-position="left" label-width="80px" :model="userInfo">
        <el-form-item label="用户名">
          <el-input :disabled="true" v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input  v-model="userInfo.nickname"></el-input>
        </el-form-item>
        <el-form-item label="个人描述">
          <el-input  v-model="userInfo.description"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="userInfo.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userInfo.email"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="edit">提 交</el-button>
      <el-button type="danger" @click="dialogFormVisible = false">取消</el-button>
    </el-dialog>

  </div>
</template>

<script>

import { fetchList, updateInfo } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import { getList } from '@/api/roles' // secondary package based on el-pagination

export default {
  name: 'NewsQuery',
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
      userListQuery: {
        pageNum: 1,
        pageSize: 10,
        id: '',
        username: '',
        nickname: '',
        roleId: '',
      },
      userList: [],
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
    await this.getRoleList()
    this.listLoading = true
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const response = await getList()
      const roleList = response.data.list
      roleList.forEach(item => {
        this.roleOptions.push({ label: item.description, value: item.roleId })
      })

      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000)
    },
    // 筛选
    query() {
      fetchList(this.userListQuery).then(response => {
        this.userList = response.data.list
        this.total = response.data.total
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
