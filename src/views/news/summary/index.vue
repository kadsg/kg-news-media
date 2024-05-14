<template>
  <div class="app-container">
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
          <el-button type="danger" size="mini">
            删除文章
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import { getList } from '@/api/news'
import Pagination from '@/components/Pagination/index.vue'

export default {
  name: 'Summary',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      tagId: null, // 添加一个新的数据属性
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        newsTagId: '',
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  created() {
    // 在 created 钩子函数中获取 id 参数，并将其赋值给 tagId
    this.tagId = this.$route.params.id
    this.tagName = this.$route.params.name
    this.getList()
  },
  methods: {
    // 在 methods 中添加一个方法，用于处理返回事件
    getList() {
      this.listQuery.newsTagId = this.tagId
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    jumpToDetail(newsId) {
      console.log(newsId)
      this.$router.push({ name: 'Detail', params: { id: newsId }})
    }
  }
}
</script>
