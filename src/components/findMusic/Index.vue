<template>
  <div class="page" >
    <div >
    <el-row class="header-menu">
      <el-col class="header-item" :span="4">个性推荐</el-col>
      <el-col  class="header-item" :span="4">歌单</el-col>
      <el-col  class="header-item" :span="4">主播电台</el-col>
      <el-col  class="header-item" :span="4">排行榜</el-col>
      <el-col  class="header-item" :span="4">歌手</el-col>
      <el-col  class="header-item" :span="4">最新音乐</el-col>
    </el-row>
    <p class="line"></p>
    <router-view class="router-view"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "findMusicIndex",

};
</script>

<style scoped>
.header-menu{
  height: 40px;
  margin-left:100px;
  margin-right: 100px;
  text-align: center;
  line-height: 40px;
}
.header-item{
  height: 40px;
  line-height: 40px;
}
.line{
  height: 1px;
  background-color: white;
  transform: scaleY(0.5);
  margin: 0 30px;
}
.router-view{
  margin: 0 30px;
}
</style>