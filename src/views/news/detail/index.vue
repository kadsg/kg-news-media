<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="margin-right: 15px;  font-weight: bold">{{ detail.title }}</span>
        <span style="margin-right: 15px"><el-link type="primary">{{ detail.mediaName }}</el-link></span>
        <span style="margin-right: 15px"><el-tag type="danger">浏览量 {{ detail.viewCount }}</el-tag></span>
        <span style="margin-right: 15px"><el-tag type="success">评论数{{ detail.commentCount }}</el-tag></span>
        <span style="margin-right: 15px"><el-tag type="primary">点赞数{{ detail.likeCount }}</el-tag></span>
        <el-button @click="drawer = true; getCommentList()" type="primary" style="margin-left: 16px;">
            查看评论
        </el-button>
      </div>
      <div class="text item">
        {{ detail.content }}
      </div>
      <div style="margin-top: 30px">
        <el-divider content-position="right">本文发布于{{ detail.createTime }}</el-divider>
      </div>
    </el-card>

    <!--  评论区整体  -->
    <el-drawer
      v-if="commentLoading === false"
      title="评论区"
      :visible.sync="drawer"
      :with-header="false"
      size="50%">
      <div class="text item">
        <el-card>
          <el-input
            type="textarea"
            :rows="2"
            placeholder="快来发表意见吧！"
            v-model="textarea">
          </el-input>
          <div style="display: flex; justify-content: flex-end;">
            <el-button style="margin-top: 30px " type="success" icon="el-icon-check" circle @click="sendComment(null, null, textarea)">发送</el-button>
          </div>
        </el-card>
        </div>

      <!--   二级评论   -->
      <div>
        <el-drawer
          :title="`回复 ${authorName}`"
          :append-to-body="true"
          :before-close="handleClose"
          :visible.sync="innerDrawer">

          <el-card>
            <el-input
              type="textarea"
              :rows="2"
              placeholder="发布一条友善的评论~"
              v-model="textarea">
            </el-input>
            <div style="display: flex; justify-content: flex-end;">
              <el-button style="margin-top: 30px " type="success" icon="el-icon-check" circle @click="sendComment(currentComment.fatherId, null, textarea)">发送</el-button>
            </div>
          </el-card>

          <!--    子级评论     -->
          <div class="block" style="margin-top: 30px">
              <el-timeline v-for="comment in subCommentList">
                <el-timeline-item  :timestamp="comment.createTime" placement="top">
                  <el-card>
                    <h4>{{ comment.authorName }}</h4>
                    <p>{{ comment.content }}</p>
                    <span>
                    <el-button v-if="comment.likeStatus===false" class="el-icon-arrow-up" type="text" size="mini" @click="handleLike(comment.commentId)">点赞 {{ comment.likeCount }}</el-button>
                    <el-button v-if="comment.likeStatus===true" class="el-icon-arrow-up" type="text" size="mini" @click="handleLike(comment.commentId)">已点赞 {{ comment.likeCount }}</el-button>
                    <el-button v-if="comment.dislikeStatus===false"  class="el-icon-arrow-down" type="text" size="mini" @click="handleDislike(comment.commentId)">踩 {{ comment.unlikeCount }}</el-button>
                    <el-button v-if="comment.dislikeStatus===true"  class="el-icon-arrow-down" type="text" size="mini" @click="handleDislike(comment.commentId)">已踩 {{ comment.unlikeCount }}</el-button>
                     <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteComment(comment.commentId)">删除</el-button>
                  </span>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
          </div>
        </el-drawer>
      </div>

      <!--   顶级评论   -->
      <div class="block">
        <el-timeline v-for="comment in commentList">
          <el-timeline-item v-if="comment.fatherId === null" :timestamp="comment.createTime" placement="top">
            <el-card>
              <h4>{{ comment.authorName }}</h4>
              <p>{{ comment.content }}</p>
              <span>
                <el-button v-if="comment.likeStatus===false" class="el-icon-arrow-up" type="text" size="mini" @click="handleLike(comment.commentId)">点赞 {{ comment.likeCount }}</el-button>
                    <el-button v-if="comment.likeStatus===true" class="el-icon-arrow-up" type="text" size="mini" @click="handleLike(comment.commentId)">已点赞 {{ comment.likeCount }}</el-button>
                    <el-button v-if="comment.dislikeStatus===false"  class="el-icon-arrow-down" type="text" size="mini" @click="handleDislike(comment.commentId)">踩 {{ comment.unlikeCount }}</el-button>
                    <el-button v-if="comment.dislikeStatus===true"  class="el-icon-arrow-down" type="text" size="mini" @click="handleDislike(comment.commentId)">已踩 {{ comment.unlikeCount }}</el-button>
                     <el-button class="el-icon-s-comment" type="text" size="mini"
                           @click="currentComment.fatherId=comment.commentId;
                            currentComment.authorName=comment.authorName;
                            currentComment.children=comment.children;
                            currentComment.commentId=comment.commentId;
                           openSubComment(currentComment.authorName, currentComment.children)">回复 {{ comment.children.length }}</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteComment(comment.commentId)">删除</el-button>
              </span>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-drawer>

  </div>
</template>

<script>
import { getDetail } from '@/api/news'
import { getNewsCommentList, saveComment, deleteComment, getCommentLikeStatus, likeComment, dislikeComment } from '@/api/comment'

export default {
  name: 'Detail',
  data() {
    return {
      commentLoading: true,
      id: this.$route.params.id,
      detail: {},
      commentQuery: {
        newsId: this.$route.params.id,
        commentId: '',
        parentId: '',
        pageNum: 1,
        pageSize: 10
      },
      commentList: [],
      subCommentList: [],
      authorName: '',
      drawer: false,
      innerDrawer: false,
      direction: 'rtl',
      textarea: '',
      sendCommentInfo: {
        newsId: this.$route.params.id,
        parentId: '',
        replyId: '',
        content: ''
      },
      currentComment: {
        commentId: '',
        fatherId: '',
        authorName: '',
        children: []
      }
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      getDetail(this.id).then(response => {
        this.detail = response.data
      })
    },
    getCommentList() {
      this.commentLoading = true
      return new Promise((resolve, reject) => {
        this.commentQuery.newsId = this.id
        getNewsCommentList(this.commentQuery).then(async response => {
          this.commentList = response.data.list
          // 获取评论点赞状态（对每一条顶级评论）
          // 等待所有的 getCommentLikeStatus 调用完成
          await this.updateCommentStatuses(this.commentList)
          this.commentLoading = false
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 新的方法，等待所有的 getCommentLikeStatus 调用完成
    async updateCommentStatuses(commentList) {
      return Promise.all(commentList.map(async item => {
        const response = await getCommentLikeStatus(item.commentId)
        this.$set(item, 'likeStatus', response.data.likeStatus)
        this.$set(item, 'dislikeStatus', response.data.dislikeStatus)
      }))
    },
    async openSubComment(authorName, children) {
      this.authorName = authorName
      this.subCommentList = children
      // 获取评论点赞状态（对每一条子级评论）
      // 等待所有的 getCommentLikeStatus 调用完成
      await this.updateCommentStatuses(this.subCommentList)
      this.innerDrawer = true
    },
    sendComment(parentId, replyId, content) {
      this.sendCommentInfo.parentId = parentId
      this.sendCommentInfo.replyId = replyId
      this.sendCommentInfo.content = content

      saveComment(this.sendCommentInfo).then(async() => {
        // 发送成功后提示，刷新评论列表
        this.$message({
          message: '发送成功',
          type: 'success'
        })
        await this.getCommentList()
        this.commentList.forEach(item => {
          if (this.currentComment.commentId === item.commentId) {
            this.currentComment.children = item.children
          }
        })
        // 如果当前正在查看子评论，刷新子评论
        if (this.innerDrawer) {
          this.innerDrawer = false
          this.openSubComment(this.currentComment.authorName, this.currentComment.children)
        }
        this.textarea = ''
      })
    },
    deleteComment(commentId) {
      this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteComment(commentId).then(async() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          await this.getCommentList()
          this.commentList.forEach(item => {
            if (this.currentComment.commentId === item.commentId) {
              this.currentComment.children = item.children
            }
          })
          // 如果当前正在查看子评论，刷新子评论
          if (this.innerDrawer) {
            this.innerDrawer = false
            this.openSubComment(this.currentComment.authorName, this.currentComment.children)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleLike(commentId) {
        likeComment(commentId).then(() => {
          this.$message({
            message: '成功',
            type: 'success'
          })
          this.getCommentList()
        })
    },
    handleDislike(commentId) {
        dislikeComment(commentId).then(() => {
          this.$message({
            message: '成功',
            type: 'success'
          })
          this.getCommentList()
        })
    },

    handleClose(done) {
      done()
    }
  }
}
</script>

<style>
.text {
  font-size: 16px; /* 调整字体大小 */
  line-height: 1.5; /* 增加行间距 */
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width: 100%;
}
</style>
