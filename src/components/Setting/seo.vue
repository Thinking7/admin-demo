<template>
  <el-form ref="form" :model="form" label-width="150px">
    <el-input v-model="form.name" style="width: 400px;" v-show="false"></el-input>
    <el-form-item label="图片ALT信息">
      <el-input v-model="form.options.img_name" style="width: 400px;"></el-input>
    </el-form-item>
    <el-form-item label="Meta及标题信息">
      <el-input v-model="form.options.meta_name" style="width: 400px;"></el-input>
    </el-form-item>
    <el-form-item label="Frame信息">
      <el-input v-model="form.options.frame_name" style="width: 400px;"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {getSeoInfo, editSeo} from '@/api/setting'

  export default {
    name: "seo",
    data() {
      return {
        form: {
          name: '',
          options: {
            img_name: '',
            meta_name: '',
            frame_name: ''
          }
        },
        data: null
      }
    },
    created() {
      this.initForm();
    },
    methods: {
      onSubmit() {
        editSeo(this.form).then(response => {
          this.$notify({
            title: '成功',
            type: 'success'
          });
        })
      },
      initForm() {
        getSeoInfo().then(response => {
          this.form = response.data;
        })
      },
    }
  }
</script>

<style scoped>

</style>
