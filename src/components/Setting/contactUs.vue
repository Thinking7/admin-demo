<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="150px">
      <div class="editor-container">
        <Tinymce :height=400 ref="editor" v-model="form.text"/>
      </div>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" style="float: right;margin-top: 15px;">更新</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
  import {getContactUsInfo, editContactUs} from '@/api/setting'
  import Tinymce from '@/components/Tinymce'

  export default {
    name: "contactUs",
    data() {
      return {
        form: {
          text: ''
        },
      }
    },
    created() {
      this.initForm();
    },
    components: {Tinymce},
    methods: {
      onSubmit() {
        editContactUs({options:this.form}).then(response => {
          this.$notify({
            title: '成功',
            type: 'success'
          });
        })
      },
      initForm() {
        getContactUsInfo().then(response => {
          this.form.text = response.data;
        })
      },
    }
  }
</script>

<style scoped>

</style>
