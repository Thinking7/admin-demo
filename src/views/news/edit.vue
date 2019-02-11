<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" ref="postForm">

      <sticky :className="'sub-navbar '+postForm.status" v-show="postForm.group_id">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput name="name" v-model="postForm.title" required :maxlength="100">
                标题
              </MDinput>
            </el-form-item>
            <div class="postInfo-container">
              <el-row>
                <el-col :span="5">
                  <el-form-item label="作者:">
                    <el-input v-model="postForm.author"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5" style="    margin-left: 20%">
                  <el-form-item label="来源:">
                    <el-input v-model="postForm.origin"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div>
              <el-row>
                <el-col :span="5">
                  <el-form-item label="缩略图">
                    <el-upload
                      class="avatar-uploader"
                      action="/ajax/common/uploadImg?type=goods"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload">
                      <img v-if="postForm.cover" :src="postForm.cover" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </el-form-item>
                </el-col>

                <el-col :span="5" style="margin-left: 20%">
                  <el-form-item label="是否启用"  :label-width="formLabelWidth">
                    <el-switch
                      v-model="postForm.is_enable"
                      active-color="#13ce66"
                      inactive-color="#ff4949">
                    </el-switch>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>

        </el-row>


        <el-form-item style="margin-bottom: 40px;" label-width="45px" label="摘要:">
          <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入内容"
                    v-model="postForm.description">
          </el-input>
        </el-form-item>

        <div class="editor-container">
          <Tinymce :height=400 ref="editor" v-model="postForm.text"/>
        </div>
      </div>
    </el-form>

  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import MDinput from '@/components/MDinput'
  import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
  import Sticky from '@/components/Sticky' // 粘性header组件
  import {validateURL} from '@/utils/validate'
  import {edit, find} from '@/api/news'
  import {Message} from "element-ui";

  const defaultForm = {
    id: '',
    title: '',
    text: '',
    description: '',
    group_id: '',
    author: '',
    origin: '',
    is_enable: false,
    cover:''
  }

  export default {
    name: 'newsDetail',
    components: {Tinymce, MDinput, Sticky},
    data() {
      return {
        postForm: Object.assign({}, defaultForm),
        loading: false,
        groupListOptions: [],
        formLabelWidth: '68px',
      }
    },
    created() {
      const params = this.$route.query;
      if (!params) {
        Message({
          message: '参数不可为空~',
          type: 'error',
          duration: 5 * 1000
        })
        return;
      }

      if (params.id) {
        this.fetchData(params.id)
      } else {
        if (!params.gid) {
          Message({
            message: '分组id不可为空~',
            type: 'error',
            duration: 5 * 1000
          })
          return;
        }
        this.postForm = Object.assign({}, defaultForm)
        this.postForm.group_id = params.gid;
      }
    },
    methods: {
      fetchData(id) {
        find({id: id}).then(response => {
          this.postForm = response.data
        }).catch(err => {
          console.log(err)
        })
      },
      submitForm() {
        this.loading = true
        edit(this.postForm).then(response => {
          this.$notify({
            title: '成功',
            message: '发布新闻成功',
            type: 'success',
            duration: 2000
          })
          this.$router.push({path: '/news/list?gid=' + this.postForm.group_id})
        })
        this.loading = false
      },
      handleAvatarSuccess(res, file) {
        this.postForm.cover = res.url;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

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
      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;
        .editor-upload-btn-container {
          text-align: right;
          margin-right: 10px;
          .editor-upload-btn {
            display: inline-block;
          }
        }
      }
    }
    .word-counter {
      width: 40px;
      position: absolute;
      right: -10px;
      top: 0px;
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
