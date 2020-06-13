<template>
  <div>
    <div v-if="isok">
      <div class="header">
        <div class="header-left">
          <img :src="albumInfo.picUrl+'?param=180y180'" />
        </div>
        <div class="header-main">
          <div class="header-main-content">
            <el-row style="height:40px;">
              <el-col style="height:40px;" :span="2">
                <span class="gedantext">专辑</span>
              </el-col>
              <el-col :span="22">{{albumInfo.name}}</el-col>
            </el-row>
            <p class="album-info">
              <span>歌手:</span>
              {{albumInfo.artist.name}}
            </p>
            <p class="album-info">
              <span>发布日期:</span>
              {{albumInfo.publishTime | toTime | toTimeGetOnlyDay}}
            </p>
          
           
              <p class="album-des">
                <span>描述:</span>
                {{albumInfo.description}}
              </p>
          </div>
        </div>
      </div>
      <div>
        <el-row class="li-container" style="background-color: #222225;">
          <el-col :span="1" class="li-num">序号</el-col>
          <el-col :span="7" class="li-name" style="color:rgb(124, 124, 124);">音乐标题</el-col>
          <el-col :span="7" class="li-name" style="color:rgb(124, 124, 124);">歌手</el-col>
          <el-col :span="7" class="li-name" style="color:rgb(124, 124, 124);">专辑</el-col>
          <el-col :span="2" class="li-name" style="text-align:center;color:rgb(124, 124, 124);">时长</el-col>
        </el-row>
        <!-- 歌单列表 -->
        <el-row
          v-for="(item,index) in songs"
          :key="index"
          :id="item.id"
          :title="item.name"
          @click.native="playMusic(item.id)"
          class="li-container"
        >
          <el-col :span="1" class="li-num">{{index + 1}}</el-col>
          <el-col :span="7" class="li-name">{{item.name}}</el-col>
          <el-col :span="7" class="li-name">{{item.ar[0].name}}</el-col>
          <el-col :span="7" class="li-name">{{item.al.name}}</el-col>
          <el-col :span="2" class="li-name" style="text-align:center;">{{item.dt | songToTime}}</el-col>
        </el-row>
      </div>
    </div>
     <p v-else class="loading">
      <span class="el-icon-loading"></span>加载中...
    </p>
  </div>
</template>

<script>
export default {
  name: "album",
  inject: ["reload", "reloadPlay"],
  data() {
    return {
      id: 0,
      albumInfo: {},
      songs: [],
      isok: false
    };
  },
  watch: {
    $route(to, from) {
      if (to.fullPath != from.fullPath) {
        this.reload();
      }
    }
  },
  created() {
    this.id = this.$route.query.id;
  },
  mounted() {
    this.id && this.getAlbum(this.id);
  },
  methods: {
    getAlbum(id) {
      this.$axios
        .get(`${this.$domain}/album?id=${id}`)
        .then(res => {
          this.albumInfo = res.data.album;
          this.songs = res.data.songs;
          this.isok = true;
        })
        .catch();
    },
    playMusic(id) {
      this.$router.push(`/playDetail?id=${id}`);
      // 更新音乐ID
      this.$store.commit("getMusicId", id);
      //关闭fm模式
      this.$store.commit("setFm", false);
      // 将歌单更新到vuex state
      this.playAllLists();
      // 刷新PLAY组件
      this.reloadPlay();
    },
    // 播放全部音乐
    playAllLists() {
      let result = [];
      let musicList = this.songs;
      for (let i = 0; i < musicList.length; i++) {
        let obj = {
          name: musicList[i].name,
          ar: musicList[i].ar[0].name,
          time: musicList[i].dt,
          id: musicList[i].id
        };
        result.push(obj);
      }
      this.$store.commit("getPlayLists", result);
      this.$store.commit("setFm", false);
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
.album-info > span {
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
.description {
  font-size: 12px;
  line-height: 30px;
}
.album-des > span {
  color: rgb(124, 124, 124);
}
.container {
  margin-bottom: 20px;
}
.li-container:nth-child(2n + 1) {
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