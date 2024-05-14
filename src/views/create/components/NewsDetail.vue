<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">
        <el-row>

          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                新闻标题
              </MDinput>
            </el-form-item>

          </el-col>
        </el-row>

        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item>

        <el-form-item prop="image_uri" style="margin-bottom: 30px;">
          <h3>新闻封面上传</h3>
          <Upload v-model="postForm.image_uri" />
        </el-form-item>

        <el-select v-model="postForm.tagId" clearable  placeholder="所属标签" style="width: 200px; margin-right: 20px;">
          <el-option
            v-for="item in tagOptions"
            v-if="item.deleteFlag === false"
            :key="item.tagId"
            :label="item.tagName"
            :value="item.tagId">
          </el-option>
        </el-select>
        <div style="display: flex; justify-content: center;">
          <el-button type="primary" @click="submitForm">发布</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { fetchArticle } from '@/api/article'
import Warning from './Warning'
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'
import { queryNewsTag } from '@/api/tag'
import { post } from '@/api/news'

const defaultForm = {
  title: '', // 文章题目
  content: '', // 文章内容
  image_uri: '', // 文章封面
  cover: '', // 文章封面
  tagId: undefined,
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 0
}

export default {
  name: 'NewsDetail',
  components: { Tinymce, MDinput, Upload, Sticky, Warning, CommentDropdown, PlatformDropdown, SourceUrlDropdown },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      tagOptions: [],
      tagListQuery: {
        newsId: '',
        mediaId: '',
        newsTagId: '',
        title: '',
      },

      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
      },
      tempRoute: {}
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
    this.getList()
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
    fetchData(id) {
      fetchArticle(id).then(response => {
        this.postForm = response.data

        // just for test
        this.postForm.title += `   Article Id:${this.postForm.id}`
        this.postForm.content_short += `   Article Id:${this.postForm.id}`

        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      this.postForm.cover = this.postForm.image_uri
      // 去除this.postForm.content中的所有<xxx>标签
      this.postForm.content = this.postForm.content.replace(/<p>/, '').replace(/<\/p>/, '')
      if (this.postForm.tagId === undefined) {
        this.$message({
          message: '请选择标签',
          type: 'error'
        })
        return
      }
      if (this.postForm.title === '') {
        this.$message({
          message: '请填写标题',
          type: 'error'
        })
        return
      }
      if (this.postForm.content === '') {
        this.$message({
          message: '请填写内容',
          type: 'error'
        })
        return
      }
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          post(this.postForm).then(() => {
            this.$notify({
              title: '成功',
              message: '发布文章成功',
              type: 'success',
              duration: 2000
            })
          })
          this.postForm.status = 'published'
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
