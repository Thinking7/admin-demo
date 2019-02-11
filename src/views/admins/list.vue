<template>
  <div class="app-container">
    <el-button type="primary" icon="el-icon-edit" style="margin-bottom:20px;float: right" @click="handleUpdate()">添加</el-button>
    <el-table
      :data="list"
      border
      style="width: 120%">
      <el-table-column prop="id" label="ID" width="120"></el-table-column>
      <el-table-column prop="username" label="用户名" width="120"></el-table-column>
      <el-table-column prop="nickname" label="昵称" width="120"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
      <el-table-column prop="face_img" label="头像" width="180">
        <template slot-scope="scope">
          <img style="width: 100px;height: 100px;text-align: center" :src="scope.row.face_img" alt="">
        </template>
      </el-table-column>
      <el-table-column prop="is_lock" label="是否锁定" width="120">
        <template slot-scope="scope">
          <el-tag type="warning" v-show="scope.row.is_lock">锁定</el-tag>
          <el-tag type="success" v-show="!scope.row.is_lock">正常</el-tag>

        </template>
      </el-table-column>
      <el-table-column prop="super_master" label="超级管理员" width="120">
        <template slot-scope="scope">
          <el-tag type="success" v-show="scope.row.super_master">是</el-tag>
          <el-tag type="info" v-show="!scope.row.super_master">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="last_login_time" label="最后登录时间" width="120"></el-table-column>
      <el-table-column prop="create_time" label="创建日期" width="120"></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="管理员管理" :visible.sync="dialogFormVisible">
      <el-form :model="form" :inline="true" ref="adminsForm" :rules="adminRules">
        <el-input v-model="form.id" auto-complete="off" v-show="false"></el-input>
        <el-form-item label="昵称" :label-width="formLabelWidth" size="medium">
          <el-input v-model="form.nickname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth" size="medium">
          <el-input v-model="form.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="form.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" type="password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否锁定" :label-width="formLabelWidth">
          <el-switch
            v-model="form.is_lock"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>

        <el-form-item label="超级管理员" :label-width="formLabelWidth">
          <el-switch
            v-model="form.super_master"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="用户头像" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="/ajax/common/uploadImg?type=user"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.face_img" :src="form.face_img" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
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
  import {fetchList, editAdmins} from '@/api/admins'

  export default {
    name: 'adminList',
    data() {
      return {
        list: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10
        },
        dialogFormVisible: false,
        form: {
          id: '',
          username: '',
          nickname: '',
          phone: '',
          face_img: '',
          is_lock: true,
          super_master: false,
          password: ''
        },
        total:0,
        formLabelWidth: '120px',
        adminRules: {
          username: [{required: true, trigger: 'blur'}],
          nickname: [{required: true, trigger: 'blur'}],
          phone: [{required: true, trigger: 'blur'}],
          face_img: [{required: true, trigger: 'blur'}],
        },
      }
    },
    created() {
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
        this.dialogFormVisible = true;
      },
      submit() {
        this.$refs.adminsForm.validate(valid => {
          if (valid) {
            this.loading = true
            editAdmins(this.form).then(response => {
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
        this.form.face_img = res.url;
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

