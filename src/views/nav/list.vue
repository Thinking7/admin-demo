<template>
  <div class="app-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '#' }" ><span @click="getSonList(0)">导航组管理</span></el-breadcrumb-item>
        <el-breadcrumb-item v-if="listQuery.pid > 0">二级导航</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" icon="el-icon-edit" style="margin-bottom:20px;float: right;" @click="handleUpdate()">
        添加
      </el-button>
    </el-breadcrumb>
    <el-table
      :data="list"
      border
      style="width: 120%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="title" label="导航标题"></el-table-column>
      <el-table-column prop="url" label="链接地址"></el-table-column>
      <el-table-column prop="is_enable" label="是否启用">
        <template slot-scope="scope">
          <el-tag type="warning" v-show="scope.row.is_enable">启用</el-tag>
          <el-tag type="success" v-show="!scope.row.is_enable">关闭</el-tag>

        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建日期"></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
      >
        <template slot-scope="scope" width="200">
          <el-button type="text" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
          <span>|</span>
          <el-button type="text" size="small" @click="getSonList(scope.row.id)" v-if="listQuery.pid < 1">查看子目录
          </el-button>
          <span v-if="listQuery.pid < 1">|</span>
          <el-button type="text" size="small" @click="handleDelete(scope.row.id)">删除

          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="导航管理" :visible.sync="dialogFormVisible">
      <el-form :model="form" :inline="true" ref="navForm" :rules="navRules">
        <el-input v-model="form.parent_id" auto-complete="off" v-show="false"></el-input>
        <el-input v-model="form.id" auto-complete="off" v-show="false"></el-input>
        <el-form-item label="导航标题" :label-width="formLabelWidth" size="medium">
          <el-input v-model="form.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="链接地址" :label-width="formLabelWidth" size="medium">
          <el-input v-model="form.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <el-switch
            v-model="form.is_enable"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
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
  import {fetchList, edit, del} from '@/api/nav'

  export default {
    name: 'navList',
    data() {
      return {
        list: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          pid: 0
        },
        total: 0,
        dialogFormVisible: false,
        form: this.initForm(),
        formLabelWidth: '120px',
        navRules: {
          title: [{required: true, trigger: 'blur'}],
          sub_title: [{required: true, trigger: 'blur'}],
          url: [{required: true, trigger: 'blur'}],
          icon: [{required: true, trigger: 'blur'}],
        },
      }
    },
    created() {
      this.getList()
    },

    methods: {
      initForm() {
        return {
          id: '',
          parent_id: '',
          title: '',
          url: '',
          is_enable: true,
        }
      },
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
        this.$refs.navForm.validate(valid => {
          if (valid) {
            this.loading = true
            edit(this.form).then(response => {
              this.getList();
              this.dialogFormVisible = false;
              this.listLoading = false;
              this.$notify({
                title: '成功',
                message: '编辑成功',
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
        console.log(id)
        this.listQuery.pid = id;
        this.listQuery.page = 1;
        this.getList();
      },
      handleDelete(id) {
        this.loading = true
        del({'id': id}).then(response => {
          this.getList();
          this.dialogFormVisible = false;
          this.listLoading = false
          this.$notify({
            title: '成功',
            type: 'success'
          });
        })
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
