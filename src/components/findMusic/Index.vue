<template>
  <div class="page" >
    <div >
    <el-row class="header-menu">
      <el-col @click.native="routerTo('/')" class="header-item" :span="6">个性推荐</el-col>
        <el-col @click.native="routerTo('/newSongs')"  class="header-item" :span="6">最新音乐</el-col>
       <el-col @click.native="routerTo('/topList')"  class="header-item" :span="6">排行榜</el-col>
      <el-col @click.native="routerTo('/zbdt')"  class="header-item" :span="6">主播电台</el-col>
    
    </el-row>
    <p class="line"></p>
    <keep-alive>
    <router-view class="router-view"></router-view>
    </keep-alive>
    </div>
  </div>
</template>

<script>
export default {
  name: "findMusicIndex",
  methods:{
    routerTo(e){
       this.$router.push(e)
    }
  }
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