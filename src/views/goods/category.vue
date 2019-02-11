<template>
  <div class="app-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '#' }" ><span @click="getSonList(0)">商品分类管理</span></el-breadcrumb-item>
        <el-breadcrumb-item v-if="listQuery.cid > 0">二级分类</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" icon="el-icon-edit" style="margin-bottom:20px;float: right;" @click="handleUpdate()">
        添加
      </el-button>
    </el-breadcrumb>
    <el-table
      :data="list"
      border
      stripe
      style="width: 200%">

      <el-table-column prop="id" label="ID" ></el-table-column>
      <el-table-column prop="name" label="标题" ></el-table-column>
      <el-table-column prop="description" label="描述" ></el-table-column>
      <el-table-column prop="is_enable" label="是否启用" >
        <template slot-scope="scope">
          <el-tag type="warning" v-show="scope.row.is_enable">启用</el-tag>
          <el-tag type="success" v-show="!scope.row.is_enable">关闭</el-tag>

        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建日期" ></el-table-column>
      <el-table-column label="操作"  width="350">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            @click="getSonList(scope.row.id)" v-if="listQuery.cid < 1">查看子目录
          </el-button>
          <router-link :to="'/goods/list?cid='+scope.row.id">
            <el-button
              size="mini">商品列表
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
    <el-dialog title="分类管理" :visible.sync="dialogFormVisible">
      <el-form :model="form" :inline="true" ref="newsForm" :rules="categoryRules">
        <el-input v-model="form.parent_id" auto-complete="off" v-show="false"></el-input>
        <el-input v-model="form.id" auto-complete="off" v-show="false"></el-input>
        <el-form-item label="名称" :label-width="formLabelWidth" size="medium">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth" size="medium">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="form.description">
          </el-input>
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
  import {fetchGroupList, groupEdit, groupDel} from '@/api/goods'

  export default {
    name: 'categoryList',
    data() {
      return {
        list: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          cid: 0
        },
        total: 0,
        dialogFormVisible: false,
        form: {
          id: '',
          parent_id: '',
          description:'',
          name: '',
          is_enable: false,
        },
        formLabelWidth: '200px',
        categoryRules: {
          name: [{required: true, trigger: 'blur'}],
          parent_id: [{required: true, trigger: 'blur'}],
          description: [{required: true, trigger: 'blur'}],
        },
      }
    },
    created() {
      this.getList()
    },

    methods: {
      getList() {
        this.listLoading = true
        fetchGroupList(this.listQuery).then(response => {
          this.list = response.data.list;
          this.total = response.data.count;
          this.listLoading = false
        })
      },
      handleUpdate(row) {
        this.form = Object.assign({}, row);
        this.form.parent_id = this.listQuery.cid;
        this.dialogFormVisible = true;
      },
      submit() {
        this.$refs.newsForm.validate(valid => {
          if (valid) {
            this.loading = true
            groupEdit(this.form).then(response => {
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
        this.listQuery.cid = id;
        this.listQuery.page = 1;
        this.getList();
      },
      handleDelete(id) {
        this.loading = true
        groupDel({'id':id}).then(response => {
          this.getList();
          this.dialogFormVisible = false;
          this.listLoading = false
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
