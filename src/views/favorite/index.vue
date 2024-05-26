<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="newsListQuery.newsId" placeholder="新闻编号" style="width: 200px; margin-right: 20px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="newsListQuery.title" placeholder="新闻标题" style="width: 200px; margin-right: 20px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="newsListQuery.tagId" clearable  placeholder="所属标签（默认全部）" style="width: 200px; margin-right: 20px;">
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

    <!--   这里是新闻卡片   -->
    <el-card class="box-card" style="margin-bottom: 15px" v-for="news in newsSummaryList" :shadow="'hover'" @click.native="jumpToDetail(news.newsId)">
      <el-row>
        <el-col :span="12">
          <div class="text item">
            <h2>{{ news.title }}</h2>
          </div>
          <div style="position: absolute; bottom: 0;">
            <i style="margin-right: 32px" class="el-icon-user-solid">来自 {{ news.mediaName }}</i>
            <i style="margin-right: 32px" class="el-icon-time">发布于 {{ news.postTime }}</i>
            <i style="margin-right: 32px" class="el-icon-star-off">收藏 {{ news.likeCount }}</i>
            <i style="margin-right: 32px" class="el-icon-arrow-down">踩 {{ news.unlikeCount }}</i>
            <i style="margin-right: 32px" class="el-icon-search">浏览 {{ news.viewCount }}</i>
            <i style="margin-right: 32px" class="el-icon-chat-dot-round">评论 {{ news.commentCount }}</i>
          </div>
        </el-col>
        <el-col :span="12"></el-col>
        <el-col :span="12">
          <!-- 这里放图片 -->
          <img :src="news.cover" class="image" style="width: 180px; height: 180px; float: right">
        </el-col>
      </el-row>
    </el-card>



    <pagination v-show="total>0" :total="total" :page.sync="newsListQuery.pageNum" :limit.sync="newsListQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>

import { getFavoriteNewsTags } from '@/api/tag'
import { getFavoriteList, getList } from '@/api/news'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'FavoriteNewsQuery',
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
        tagId: '',
        title: '',
      },
      newsListQuery: {
        pageNum: 1,
        pageSize: 10,
        newsId: '',
        title: '',
        tagId: '',
        userId: this.$store.getters.id
      },
      newsSummaryList: []
    }
  },
  async created() {
    await this.getOwnList()
    this.query()
    this.listLoading = false
  },
  methods: {
    // 获取标签列表
    async getOwnList() {
      this.listLoading = true
      const response = await getFavoriteNewsTags(this.$store.getters.id)
      const tempList = response.data
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
      getFavoriteList(this.newsListQuery).then(response => {
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
