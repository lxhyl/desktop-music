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
        <el-col @click.native="routerMsg = 'songs'" class="caidan-item" :span="6">单曲</el-col>
        <el-col @click.native="routerMsg = 'searchPlayLists'" class="caidan-item" :span="6">歌单</el-col>
        <el-col @click.native="routerMsg = 'searchUsers'" class="caidan-item" :span="6">用户</el-col>
        <el-col class="caidan-item" :span="6">视频</el-col>
      </el-row>

      <el-divider></el-divider>
      <div v-show="routerMsg == 'songs'">
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

      <search-play-lists v-if="routerMsg == 'searchPlayLists'" />
      <search-users  v-if="routerMsg == 'searchUsers'" />
    </div>
  </div>
</template>

<script>
//歌单
import SearchPlayLists from "../search/PlayLists";
//用户
import SearchUsers from "../search/Users"
export default {
  name: "searchResult",
  inject: ["reload", "reloadPlay"],
  components: {
    SearchPlayLists,
    SearchUsers
  },
  data() {
    return {
      keywords: null, //搜索关键词

      type: 1, //搜索类型
      // 1：单曲，100：歌手，1000：歌单
      // 1002：用户， 1014:视频
      songsList: [], //音乐列表
      getSongsListOk: false, //是否搜索到
      routerMsg: "songs", //加载那个组件
      loading: true //是否加载中
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
        });
    },
    //播放音乐
    playSong(id) {
      this.$router.push(`/playDetail?id=${id}`);
      // 更新音乐ID
      this.$store.commit("getMusicId", id);
      this.$store.commit('setFm',false);
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