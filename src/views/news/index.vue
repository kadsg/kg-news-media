<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.tagName" placeholder="标签名" style="width: 200px; margin-right: 20px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.tagId" placeholder="标签ID" style="width: 200px;  margin-right: 20px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <div class="table-container">
      <br>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="tagId" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.tagId }}</span>
        </template>
      </el-table-column>

      <el-table-column label="标签名" prop="tagName" align="center" width="130">
        <template slot-scope="{row}">
          <el-tag>{{ row.tagName }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="描述" prop="description" align="center" width="130">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column label="新闻数量" prop="description" align="center" width="130">
        <template slot-scope="{row}">
          <span>{{ row.count }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="210" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="jumpToSummary(row.tagId, row.tagName)">
            查看文章
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="标签名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="temp.description" :autosize="{ minRows: 1, maxRows: 2}" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { queryNewsTag } from '@/api/tag'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
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
      userInfoMap: {},
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        tagId: '',
        tagName: '',
        pageNum: 1,
        pageSize: 10
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        description: '',
        name: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        name: [{ required: true, message: '此项为必填项', trigger: 'blur' }]
      }
    }
  },
  async created() {
    await this.getList()
  },
  methods: {
    // 获取标签列表
    async getList() {
      this.listLoading = true
      const response = await queryNewsTag(this.listQuery)
      this.list = response.data.list
      this.total = response.data.total

      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000)
    },
    jumpToSummary(tagId, tagName) {
      // 使用 this.$router.push() 方法跳转到 detail/index 页面，并将 tagId 作为参数传递过去
      this.$router.push({ name: 'Summary', params: { id: tagId, tagName: tagName }})
    },
    // 筛选
    handleFilter() {
      this.getList()
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
