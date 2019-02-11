<template>
  <div class="app-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <router-link :to="'/news/edit?gid='+listQuery.group_id">
        <el-button type="primary" icon="el-icon-edit" style="margin-bottom:20px;float: right;" v-if="is_edit" @click="handleUpdate()">
          添加
        </el-button>
      </router-link>

    </el-breadcrumb>
    <el-table
      :data="list"
      border
      stripe
      style="width: 200%">
      <el-table-column prop="id" label="ID" ></el-table-column>
      <el-table-column prop="title" label="新闻标题" ></el-table-column>
      <el-table-column prop="description" label="描述" width="250"></el-table-column>
      <el-table-column prop="group_name" label="分组id" ></el-table-column>
      <el-table-column prop="author" label="作者" ></el-table-column>
      <el-table-column prop="origin" label="来源" ></el-table-column>
      <el-table-column prop="is_enable" label="是否启用" >
        <template slot-scope="scope">
          <el-tag type="warning" v-show="scope.row.is_enable">启用</el-tag>
          <el-tag type="success" v-show="!scope.row.is_enable">关闭</el-tag>

        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建日期" ></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <router-link :to="'/news/edit?id='+scope.row.id">
            <el-button
              size="mini">编辑
            </el-button>
          </router-link>

          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>

</template>
<script>
  import {fetchList, edit, del} from '@/api/news'

  export default {
    name: 'newsList',
    data() {
      return {
        list: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          group_id: 0
        },
        total: 0,
        dialogFormVisible: false,
        form: {
          id: '',
          title: '',
          text: '',
          description: '',
          group_id: '',
          author: '',
          origin: '',
          is_enable: false,
        },
        is_edit: false,
        formLabelWidth: '200px',
        newsRules: {
          title: [{required: true, trigger: 'blur'}],
          sub_title: [{required: true, trigger: 'blur'}],
          url: [{required: true, trigger: 'blur'}],
          icon: [{required: true, trigger: 'blur'}],
        },
      }
    },
    created() {
      const params = this.$route.query;
      if (params.gid) {
        this.listQuery.group_id = params.gid;
        this.is_edit = true;
      }
      this.getList()
    },

    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data.list;
          this.total = response.data.count;
          this.listLoading = false
        })
      },
      handleUpdate(row) {
        this.form = Object.assign({}, row);
        this.form.parent_id = this.listQuery.pid;
        this.dialogFormVisible = true;
      },
      submit() {
        this.$refs.newsForm.validate(valid => {
          if (valid) {
            this.loading = true
            edit(this.form).then(response => {
              this.getList();
              this.dialogFormVisible = false;
              this.listLoading = false;
              this.$notify({
                title: '成功',
                type: 'success'
              });
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      handleAvatarSuccess(res, file) {
        this.form.icon = res.url;
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
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      getSonList(id) {
        this.listQuery.pid = id;
        this.listQuery.page = 1;
        this.getList();
      },
      handleDelete(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          del({'id': id}).then(response => {
            this.getList();
            this.dialogFormVisible = false;
            this.listLoading = false
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      }
    }
  }
</script>
<style>
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
