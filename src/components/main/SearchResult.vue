<template>
  <div>
    <div class="search-header">
      <p>
        搜索:
        <span style="color:rgb(184, 37, 37);">“{{keywords}}”</span>
        找到如下内容
      </p>
    </div>
    <div>
      <el-row class="caidan">
        <el-col @click.native="routerTo('/search')" class="caidan-item" :span="6">单曲</el-col>
        <el-col @click.native="routerTo('/search/lists')" class="caidan-item" :span="6">歌单</el-col>
        <el-col @click.native="routerTo('/search/users')" class="caidan-item" :span="6">用户</el-col>
        <el-col @click.native="routerTo('/search/videos')" class="caidan-item" :span="6">视频</el-col>
      </el-row>

      <el-divider></el-divider>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
export default {
  name: "searchResult",
  inject: ["reload", "reloadPlay"],
  data() {
    return {
      keywords: null //搜索关键
    };
  },
  computed: {},
  // 监听路由  刷新组件
  watch: {
    $route(to, from) {
      if (to.fullPath != from.fullPath) {
        this.reload();
      }
    }
  },
  created() {
    this.keywords = this.$route.query.keyword;
  },
  mounted() {},
  methods: {
    routerTo(e) {
      this.$router.push(`${e}?keyword=${this.keywords}`);
    }
  }
};
</script>

<style scoped>
.search-header {
  margin-left: 20px;
}
.search-header > p {
  font-size: 12px;
}
.caidan {
  height: 40px;
  margin-top: 10px;
}
.caidan-item {
  text-align: center;
  height: 40px;
  line-height: 40px;
}
.caidan-item:hover {
  color: rgb(184, 37, 37);
}
.li-container:nth-child(odd) {
  background-color: #222225;
}
.li-container {
  height: 25px;
  line-height: 25px;
  margin: 0 15px;
}
.li-num {
  font-size: 8px;
  color: rgb(124, 124, 124);
  text-align: center;
}
.li-name {
  font-size: 10px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.loading {
  text-align: center;
  font-size: 16px;
}
</style>