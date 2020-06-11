<template>
  <div>
    <p style="text-align:center;">
      <el-button-group>
        <el-button type="info" @click="routerTo('/newSongs')" size="mini">新歌速递</el-button>
        <el-button type="info" @click="routerTo('/newSongs/album')" size="mini">新碟上架</el-button>
      </el-button-group>
    </p>
    <keep-alive>
    <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "newSongs",
  data() {
    return {};
  },
  methods:{
    routerTo(e){
      this.$router.push(e);
    }
  }
};
</script>

<style scoped>
</style>