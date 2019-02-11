<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" ref="postForm">

      <sticky :className="'sub-navbar '+postForm.status" v-show="postForm.category_id">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput name="name" v-model="postForm.name" required :maxlength="100">
                名称
              </MDinput>
            </el-form-item>
            <div class="postInfo-container">
              <el-row>
                <el-col :span="5">
                  <el-form-item label="编号:">
                    <el-input v-model="postForm.options.code"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5" style="    margin-left: 20%">
                  <el-form-item label="浏览量:">
                    <el-input v-model="postForm.options.pv"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="图片：">
              <el-upload
                class="upload-demo"
                action="/ajax/common/uploadImg?type=user"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
                :file-list="postForm.options.imgs"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
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

        <el-form-item style="margin-bottom: 40px;" label-width="45px" label="摘要:">
          <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入内容"
                    v-model="postForm.options.description">
          </el-input>
        </el-form-item>

        <div class="editor-container">
          <Tinymce :height=400 ref="editor" v-model="postForm.options.text"/>
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
  import {edit, find} from '@/api/goods'
  import {Message} from "element-ui";

  const defaultForm = {
    id: '',
    name: '',
    options: {
      'code': '',
      'description': '',
      'pv': '',
      'imgs': []
    },
    listObj: {},
    fileList: {},
    category_id: '',
    is_enable: true,
  }

  export default {
    name: 'goodsDetail',
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
        if (!params.cid) {
          Message({
            message: '分类id不可为空~',
            type: 'error',
            duration: 5 * 1000
          })
          return;
        }
        this.postForm = Object.assign({}, defaultForm)
        this.postForm.category_id = params.cid;
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
            message: '发布成功',
            type: 'success',
            duration: 2000
          })
          this.$router.push({path: '/goods/list?cid=' + this.postForm.category_id})
        })
        this.loading = false
      },
      handlePreview(file) {
        console.log(file);
      },
      checkAllSuccess() {
      },
      handleSubmit() {
      },
      handleSuccess(response, file) {
        let imgLen = this.postForm.options.imgs.length;
        response.id = file.uid;
        this.postForm.options.imgs[imgLen] = response;
      },
      handleRemove(file) {
        this.postForm.options.imgs.forEach((item, index) => {
          if (item.id === file.id) {
            delete this.postForm.options.imgs[index]

            return
          }
        })
      },
      beforeUpload(file) {

      }
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
</style>
