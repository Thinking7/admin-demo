<template>
  <div class="app-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-button type="primary" icon="el-icon-edit" style="margin-bottom:20px;float: right;" @click="handleUpdate()">
        添加
      </el-button>
    </el-breadcrumb>
    <el-table
      :data="list"
      border
      style="width: 120%">
      <el-table-column prop="id" label="ID" ></el-table-column>
      <el-table-column prop="title" label="标题" ></el-table-column>
      <el-table-column prop="group_name" label="分组" ></el-table-column>
      <el-table-column prop="start_time" label="开始时间" ></el-table-column>
      <el-table-column prop="end_time" label="结束时间" ></el-table-column>
      <el-table-column prop="img" label="图片" >
        <template slot-scope="scope">
          <img style="width: 50px;height: 50px;text-align: center" :src="scope.row.img" alt="">
        </template>
      </el-table-column>
      <el-table-column prop="is_enable" label="是否启用" >
        <template slot-scope="scope">
          <el-tag type="warning" v-show="scope.row.is_enable">启用</el-tag>
          <el-tag type="success" v-show="!scope.row.is_enable">关闭</el-tag>

        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建日期" ></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
          <span>|</span>
          <el-button type="text" size="small" @click="handleDelete(scope.row.id)">删除

          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="横幅管理" :visible.sync="dialogFormVisible">
      <el-form :model="form" :inline="true" ref="navForm" :rules="bannerRules">
        <el-input v-model="form.id" auto-complete="off" v-show="false"></el-input>
        <el-form-item label="标题" :label-width="formLabelWidth" size="medium">
          <el-input v-model="form.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="链接" :label-width="formLabelWidth" size="medium">
          <el-input placeholder="请输入URL" v-model="form.url">
          </el-input>
        </el-form-item>
        <el-form-item label="分组" :label-width="formLabelWidth" size="medium">
          <el-select v-model="form.group_id" placeholder="请选择分组">
            <el-option
              v-for="item in groupList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <el-switch
            v-model="form.is_enable"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="活动时间" :label-width="formLabelWidth">
          <el-col :span="11">
            <el-date-picker
              style="width: 210px"
              v-model="form.start_time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker
              style="width: 210px"
              v-model="form.end_time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="/ajax/common/uploadImg?type=user"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.img" :src="form.img" class="avatar">
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
  import {fetchList, edit, del, fetchGroupAll} from '@/api/banner'

  export default {
    name: 'navList',
    data() {
      return {
        list: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10
        },
        total: 0,
        dialogFormVisible: false,
        form: {
          id: '',
          img: '',
          title: '',
          group_id: '',
          url: '',
          start_time: '',
          end_time: '',
          is_enable: false,
        },
        groupList: {},
        formLabelWidth: '120px',
        bannerRules: {
          title: [{required: true, trigger: 'blur',message:'标题不可为空'}],
          img: [{required: true, trigger: 'blur',message:"图片不可为空"}],
          url: [{required: true, trigger: 'blur'}],
          group_id: [{required: true, trigger: 'blur'}],
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
        this.getGroupList();
        this.form = Object.assign({}, row);
        this.dialogFormVisible = true;
      },
      getGroupList() {
        fetchGroupAll().then(response => {
          this.groupList = response.data;
        })
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
        this.form.img = res.url;
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
        this.loading = true
        del({'id': id}).then(response => {
          this.getList();
          this.dialogFormVisible = false;
          this.listLoading = false;
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
