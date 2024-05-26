<template>
  <div class="app-container">
    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane v-for="tag in tabList" :name="tag.id" :label="tag.name">
        <span slot="label">{{ tag.name }}
        </span>
      </el-tab-pane>

      <div v-if="newsList.length > 0">
      <!--   这里是新闻卡片   -->
      <el-card class="box-card" style="margin-bottom: 15px"  v-for="news in newsList" :shadow="'hover'" @click.native="jumpToDetail(news.newsId)">
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

      </div>
      <div class="text item" v-else>
        <el-empty description="空空如也"></el-empty>
      </div>

    </el-tabs>
  </div>
</template>


<script>

import { queryNewsTag } from '@/api/tag'
import { getList } from '@/api/news'

export default {
  data() {
    return {
      activeName: 'second',
      tagListQuery: {
        tagId: '',
        tagName: '',
        pageNum: '',
        pageSize: ''
      },
      tabList: [],
      newsListQuery: {
        newsTagId: '',
        pageNum: 1,
        pageSize: 1000
      },
      newsList: null
    };
  },
  created() {
    queryNewsTag(this.tagListQuery).then(res => {
      const tempList = res.data.list
      this.tabList.push({
        id: 0,
        name: '推荐'
      })
      tempList.forEach(item => {
        this.tabList.push({
          id: item.tagId,
          name: item.tagName
        })
      })

    })

    this.getNewsList()
  },
  methods: {
    handleClick(tab) {
      const tagId = tab.name
      this.getNewsList(tagId)
    },
    getNewsList(tagId) {
      this.newsListQuery.newsTagId = tagId
      getList(this.newsListQuery).then(res => {
        this.newsList = res.data.list
      })
    },
    jumpToDetail(newsId) {
      console.log(newsId)
      this.$router.push({name: 'Detail', params: {id: newsId}})
    }
  }
};
</script>


<style>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.el-col {
  border-radius: 4px;
}
</style>
