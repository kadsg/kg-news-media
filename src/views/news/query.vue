<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="newsListQuery.newsId" placeholder="新闻编号" style="width: 200px; margin-right: 20px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="newsListQuery.title" placeholder="新闻标题" style="width: 200px; margin-right: 20px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="newsListQuery.newsTagId" clearable  placeholder="所属标签（默认全部）" style="width: 200px; margin-right: 20px;">
        <el-option
          v-for="item in tagOptions"
          v-if="item.deleteFlag === false"
          :key="item.tagId"
          :label="item.tagName"
          :value="item.tagId">
        </el-option>
      </el-select>
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
      :data="newsSummaryList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="newsId" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.newsId }}</span>
        </template>
      </el-table-column>

      <el-table-column label="标题" prop="title" align="center" width="150">
        <template slot-scope="{row}">
          <span> {{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column label="新闻封面" prop="cover" align="center" width="130">
        <template slot-scope="{row}">
          <el-image
            style="width: 100px; height: 100px"
            :src="row.cover"
            :fit="fit"></el-image>
        </template>
      </el-table-column>

      <el-table-column label="浏览量" prop="viewCount" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.viewCount }}</span>
        </template>
      </el-table-column>

      <el-table-column label="评论数" prop="commentCount" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.commentCount }}</span>
        </template>
      </el-table-column>

      <el-table-column label="点赞量" prop="likeCount" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.likeCount }}</span>
        </template>
      </el-table-column>

      <el-table-column label="点踩量" prop="unlikeCount" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.unlikeCount }}</span>
        </template>
      </el-table-column>

      <el-table-column label="发布时间" prop="postTime" align="center" width="170">
        <template slot-scope="{row}">
          <span>{{ row.postTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="发布媒体" prop="mediaName" align="center" width="170">
        <template slot-scope="{row}">
          <span>{{ row.mediaName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="210" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="jumpToDetail(row.newsId)">
            查看文章
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="newsListQuery.pageNum" :limit.sync="newsListQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>

import { queryNewsTag } from '@/api/tag'
import { getList } from '@/api/news'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

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
      tableKey: 0,
      tagOptions: [],
      total: 0,
      listLoading: true,
      value: '',
      tagListQuery: {
        newsId: '',
        mediaId: '',
        newsTagId: '',
        title: '',
      },
      newsListQuery: {
        pageNum: 1,
        pageSize: 10,
        newsId: '',
        title: '',
        newsTagId: ''
      },
      newsSummaryList: []
    }
  },
  async created() {
    await this.getList()
    this.listLoading = false
  },
  methods: {
    // 获取标签列表
    async getList() {
      this.listLoading = true
      const response = await queryNewsTag(this.tagListQuery)
      const tempList = response.data.list
      tempList.forEach(item => {
        this.tagOptions.push({
          tagId: item.tagId,
          tagName: item.tagName,
          deleteFlag: item.deleteFlag
        })
      })
      setTimeout(() => {
        this.listLoading = false
      }, 1.5 * 1000)
    },
    // 筛选
    query() {
      getList(this.newsListQuery).then(response => {
        this.newsSummaryList = response.data.list
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
    jumpToDetail(newsId) {
      console.log(newsId)
      this.$router.push({ name: 'Detail', params: { id: newsId }})
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
