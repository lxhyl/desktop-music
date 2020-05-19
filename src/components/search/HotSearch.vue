<template>
  <div>
      <div class="history">
         <el-row>
             <el-col :span="6">播放历史</el-col>
              <el-col :span="14">
                  <span class="el-icon-delete"></span>
              </el-col>
               <el-col :span="4" style="text-align:right;">
                   <span class="el-icon-close"></span>
               </el-col>
         </el-row>
      </div>
      <div class="hot-search"></div>
  </div>
</template>

<script>
export default {
  data() {
      return {
          history:[],//搜索历史
          hotSearch:[],//热搜
      }
  },
  created() {
      this.getHotSearch();
  },
  mounted() {},
  methods: {
    //拿到热搜列表
    getHotSearch() {
      this.$axios.get(`${this.$domain}/search/hot/detail`).then(res => {
        console.log(res);
      });
    },
    deleteHistory(){
        console.log('111')
    }
  }
};
</script>

<style scoped>
</style>