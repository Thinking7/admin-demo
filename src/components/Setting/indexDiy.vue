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
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="type_text" label="类型"></el-table-column>
      <el-table-column prop="order_num" label="排序"></el-table-column>
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
          <el-button type="text" size="small" @click="handleDelete(scope.row.id)">删除

          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="首页DIY管理" :visible.sync="dialogFormVisible">
      <el-form :model="diyForm" :inline="true">
        <el-input v-model="diyForm.id" auto-complete="off" v-show="false"></el-input>
        <el-input v-model="diyForm.type" default="index_diy" auto-complete="off" v-show="false"></el-input>
        <el-form-item label="名称" :label-width="formLabelWidth" size="medium">
          <el-input v-model="diyForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth" size="medium">
          <el-input v-model="diyForm.order_num" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <el-switch
            v-model="diyForm.is_enable"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <div class="editor-container">
          <Tinymce :height=400 ref="editor" v-model="diyForm.text"/>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import {fetchList, edit, del} from '@/api/setting'
  import Tinymce from '@/components/Tinymce'

  export default {
    name: "indexDiy",
    data() {
      return {
        list: null,
        listLoading: true,
        total: 0,
        dialogFormVisible: false,
        diyForm: {},
        formLabelWidth: '120px',
      }
    },
    created() {
      this.initForm();
      this.getList();
    },
    components: {Tinymce},

    methods: {
      initForm() {
        this.diyForm = {
          id: '',
          name: '',
          type: 'index_diy',
          order_num: '',
          is_enable: true,
          text: ''
        }
      },
      getList() {
        this.listLoading = true;
        fetchList({type: 'index_diy'}).then(response => {
          this.list = response.data.list;
          this.total = response.data.count;
          this.listLoading = false
        })
      },
      handleUpdate(row) {
        this.dialogFormVisible = true;
        this.initForm();
        if (row) {
          this.diyForm = Object.assign({}, row);
          if(this.$refs.editor){
            this.$refs.editor.setContent(this.diyForm.text)
          }
        }
      },
      submit() {
        this.loading = true;
        this.diyForm.type = 'index_diy';
        edit(this.diyForm).then(response => {
          this.getList();
          this.dialogFormVisible = false;
          this.listLoading = false;
          this.$notify({
            title: '成功',
            message: '编辑成功',
            type: 'success'
          });
          this.initForm()
        })
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

<style scoped>

</style>
