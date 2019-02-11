<template>
  <el-tabs v-model="activeName2" type="card" @tab-click="handleClick" style="margin-left: 3px">
    <el-tab-pane label="首页DIY" name="index_diy">
      <index-diy></index-diy>
    </el-tab-pane>
    <el-tab-pane label="SEO优化" name="seo">
      <seo></seo>
    </el-tab-pane>
    <el-tab-pane label="联系我们" name="contactUs">
      <contact-us></contact-us>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import indexDiy from '@/components/Setting/indexDiy'
  import seo from '@/components/Setting/seo'
  import contactUs from '@/components/Setting/contactUs'
  export default {
    name: "index",
    data() {
      return {
        activeName2: 'index_diy'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    },
    components:{
      indexDiy,seo,contactUs
    }
  }
</script>

<style scoped>

</style>
