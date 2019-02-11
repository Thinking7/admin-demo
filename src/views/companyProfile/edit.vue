<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" ref="postForm">

      <sticky :className="'sub-navbar '+postForm.status">
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
                  <el-form-item label="短标题:">
                    <el-input v-model="postForm.sub_title"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <el-switch
            v-model="postForm.is_enable"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
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
  import {edit, find} from '@/api/companyProfile'

  const defaultForm = {
    id: '',
    title: '',
    text: '',
    sub_title: '',
    is_enable: false,
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
      if (params.id) {
        this.fetchData(params.id)
      } else {
        this.postForm = Object.assign({}, defaultForm)
      }
    },
    methods: {
      fetchData(id) {
        find({id:id}).then(response => {
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
          this.$router.push({path: '/companyProfile/list'})
        })
        this.loading = false
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
