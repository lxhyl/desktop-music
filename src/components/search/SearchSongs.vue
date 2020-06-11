<template>
  <div>
    <div v-if="getSongsListOk">
      <el-row class="li-container">
        <el-col class="li-num" :span="2">索引</el-col>
        <el-col class="li-name" :span="8">音乐标题</el-col>
        <el-col class="li-name" :span="6">歌手</el-col>
        <el-col class="li-name" :span="6">专辑</el-col>
        <el-col class="li-name" :span="2">时长</el-col>
      </el-row>
      <el-row
        v-for="(item,index) in songsList"
        :key="item.id"
        @click.native="playSong(item.id)"
        class="li-container"
      >
        <el-col class="li-num" :span="2">{{index+1}}</el-col>
        <el-col class="li-name" :span="8">{{item.name}}</el-col>
        <el-col class="li-name" :span="6">{{item.ar}}</el-col>
        <el-col class="li-name" :span="6">{{item.album}}</el-col>
        <el-col class="li-name" :span="2">{{item.time | songToTime}}</el-col>
      </el-row>
    </div>
    <p v-if="loading" class="loading">
      <span class="el-icon-loading"></span>加载中...
    </p>
  </div>
</template>

<script>
export default {
  inject:['reloadPlay'],
  data() {
    return {
      songsList: [], //音乐列表
      getSongsListOk: false, //是否搜索到
      loading: true //是否加载中
    };
  },
  created() {
    this.keywords = this.$route.query.keyword;
  },
  mounted() {
    this.getSearchSongResult();
  },
  methods: {
    getSearchSongResult() {
      this.$axios
        .get(`${this.$domain}/search?keywords=${this.keywords}`)
        .then(res => {
          let songs = res.data.result.songs;
          for (let i = 0; i < songs.length; i++) {
            let obj = {
              id: songs[i].id,
              name: songs[i].name,
              album: songs[i].album.name,
              ar: songs[i].artists[0].name,
              time: songs[i].duration
            };
            this.songsList.push(obj);
          }
          this.getSongsListOk = true;
          this.loading = false;
        })
        .catch(() => {});
    },
    //播放音乐
    playSong(id) {
      this.$router.push(`/playDetail?id=${id}`);
      // 更新音乐ID
      this.$store.commit("getMusicId", id);
      this.$store.commit("setFm", false);
      // 将歌单更新到vuex state
      this.playAllLists();
      // 刷新PLAY组件
      this.reloadPlay();
    },
    //播放全部音乐
    playAllLists() {
      this.$store.commit("getPlayLists", this.songsList);
    }
  }
};
</script>

<style scoped>
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