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
    <div>
      <el-row class="album-item-title">
        <el-col :span="14" style="text-align:center;">题目</el-col>
        <el-col :span="6">播放数</el-col>
        <el-col :span="4">赞</el-col>
      </el-row>
      <el-row v-for="(item,index) in djlist" 
      :key="'album'+index" class="album-item">
        <el-col :span="2" class="album-item-pic">
          <img :src="item.blurCoverUrl+'?param=40y40'" loading="lazy" />
        </el-col>
        <el-col class="album-item-name" :span="12">{{item.name}}</el-col>
        <el-col class="album-item-art" :span="6">{{item.listenerCount}}</el-col>
        <el-col class="album-item-art" :span="3">{{item.likedCount}}</el-col>
        <el-col :span="1" class="album-item-art">
          <span class="el-icon-arrow-right"></span>
        </el-col>
      </el-row>
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
      djInfo: null, //电台详情
      djlist: []
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
    this.rid && this.getDjLists(this.rid);
  },
  methods: {
    getDjDetail(rid) {
      this.$axios
        .get(`${this.$domain}/dj/detail?rid=${rid}`)
        .then(res => {
          this.djInfo = res.data.djRadio;
        })
        .catch();
    },
    getDjLists(rid) {
      this.$axios
        .get(`${this.$domain}/dj/program?rid=${rid}&limit=50`)
        .then(res => {
          console.log(res);
          this.djlist = res.data.programs;
        })
        .catch();
    },
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
.album {
  margin: 20px;
}
.album-item {
  height: 60px;
  position: relative;
  line-height: 60px;
  margin-left: 20px;
}
.album-item:nth-child(2n + 1) {
  background-color: #222225;
}
.album-item-pic {
  height: 60px;
}
.album-item-pic > img {
  height: 40px;
  width: 40px;
  position: absolute;
  top: 10px;
}
.album-item-name {
  font-size: 12px;
}
.album-item-art {
  font-size: 12px;
  color: rgb(124, 124, 124);
}
.album-item-title {
  font-size: 12px;
  height: 30px;
  line-height: 30px;
  color: rgb(124, 124, 124);
  background-color: #222225;
}
</style>