<template>
  <div>
    <div class="header" v-if="djInfo">
      <div class="header-left">
        <img :src="djInfo.picUrl+'?param=180y180'" />
      </div>
      <div class="header-main">
        <div class="header-main-content">
          <el-row style="height:40px;">
            <el-col style="height:40px;" :span="2">
              <span class="gedantext">电台</span>
            </el-col>
            <el-col :span="22">{{djInfo.name}}</el-col>
          </el-row>
          <p class="album-info">
            <span>主播:</span>
            {{djInfo.dj.nickname}}
          </p>
          <p class="album-info">
            <span>发布日期:</span>
            {{djInfo.createTime | toTime | toTimeGetOnlyDay}}
          </p>

          <p class="album-des" v-if="djInfo.desc">
            <span>描述:</span>
            {{djInfo.desc}}
          </p>
          <p v-else class="album-des">
            <span>暂无描述</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "djlists",
  inject: ["reload", "reloadPlay"],
  data() {
    return {
      rid: 0, //电台id
      djInfo: null //电台详情
    };
  },
  // 监听路由  刷新组件
  watch: {
    $route(to, from) {
      if (to.fullPath != from.fullPath) {
        this.reload();
      }
    }
  },
  created() {
    this.rid = this.$route.query.rid;
  },
  mounted() {
    this.rid && this.getDjDetail(this.rid);
  },
  methods: {
    getDjDetail(rid) {
      this.$axios
        .get(`${this.$domain}/dj/detail?rid=${rid}`)
        .then(res => {
          console.log(res);
          this.djInfo = res.data.djRadio;
        })
        .catch();
    }
  }
};
</script>

<style scoped>
.header {
  width: 820px;
  height: 220px;
}
.header-left {
  width: 220px;
  height: 220px;
  float: left;
}
.header-left > img {
  width: 180px;
  height: 180px;
  margin: 20px;
}
.header-main {
  height: 220px;
  margin-left: 220px;
  position: relative;
}
.header-main-content {
  position: absolute;
  height: 180px;
  width: 100%;
  top: 20px;
}
.gedantext {
  height: 20px;
  width: 40px;
  line-height: 20px;
  text-align: center;
  border: 1px solid rgb(184, 37, 37);
  color: rgb(184, 37, 37);
  font-size: 15px;
  border-radius: 10px;
  display: inline-block;
}
.album-info {
  margin: 0;
  line-height: 30px;
  height: 30px;
  font-size: 14px;
}
.album-info,
.album-des > span {
  color: rgb(124, 124, 124);
}
.album-des {
  margin: 0;
  font-size: 12px;
  width: 590px;
  line-height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  word-break: break-all;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>