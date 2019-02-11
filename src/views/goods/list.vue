<template>
  <div class="app-container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <router-link :to="'/goods/edit?cid='+listQuery.category_id">
        <el-button type="primary" icon="el-icon-edit" style="margin-bottom:20px;float: right;" v-if="is_edit" @click="handleUpdate()">
          添加
        </el-button>
      </router-link>

    </el-breadcrumb>
    <el-table
      :data="list"
      border
      style="width: 200%">
      <el-table-column prop="id" label="ID" ></el-table-column>
      <el-table-column prop="name" label="名称" ></el-table-column>
      <el-table-column prop="options.description" label="描述" width="350px"></el-table-column>
      <el-table-column prop="options.code" label="编号" ></el-table-column>
      <el-table-column prop="options.pv" label="浏览量" ></el-table-column>
      <el-table-column prop="category_name" label="分组id" ></el-table-column>
      <el-table-column prop="is_enable" label="是否启用" >
        <template slot-scope="scope">
          <el-tag type="warning" v-show="scope.row.is_enable">启用</el-tag>
          <el-tag type="success" v-show="!scope.row.is_enable">关闭</el-tag>

        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建日期" ></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <router-link :to="'/goods/edit?id='+scope.row.id">
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
  import {fetchList, edit, del} from '@/api/goods'

  export default {
    name: 'goodsList',
    data() {
      return {
        list: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          category_id: 0
        },
        total: 0,
        dialogFormVisible: false,
        is_edit: false,
        formLabelWidth: '200px',
      }
    },
    created() {
      const params = this.$route.query;
      if (params.cid) {
        this.listQuery.category_id = params.cid;
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
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
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
