<template>
  <div class="app-container">
    <el-descriptions class="margin-top" title="个人信息" :column="3" :size="size" border>
      <template slot="extra">
        <el-button type="primary" size="small" @click="dialogFormVisible = true">编辑信息</el-button>
      </template>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user"></i>
          用户名
        </template>
        {{ userInfo.username }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user"></i>
          昵称
        </template>
        {{ userInfo.nickname }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-phone-outline" />
          手机号
        </template>
        {{ userInfo.phone }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-message" />
          邮箱
        </template>
        {{ userInfo.email }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          账号类型
        </template>
        <el-tag size="small">{{ userInfo.roleName }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-office-building"></i>
          个人描述
        </template>
        {{ userInfo.description }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-s-flag" />
          创建时间
        </template>
        {{ userInfo.createTime }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-loading" />
          最后更新
        </template>
        {{ userInfo.updateTime }}
      </el-descriptions-item>
    </el-descriptions>

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
import { getInfo, updateInfo } from '@/api/user'

export default {
  data() {
    return {
      dialogFormVisible: false,
      userId: '',
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
      size: ''
    }
  },
  created() {
    this.userId = this.$store.getters.id
    this.getUserInfo(this.userId)
  },
  methods: {
    async getUserInfo(id) {
      await getInfo(id).then(res => {
        this.userInfo = res.data
      })
    },
    edit() {
      this.userInfo.id = this.userId
      updateInfo(this.userInfo).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          // 关闭对话框
          this.dialogFormVisible = false
          // 刷新当前页面
          this.getUserInfo(this.userId)
        } else {
          this.$message({
            message: '修改失败',
            type: 'error'
          });
        }
      });
    }
  }
}
</script>
