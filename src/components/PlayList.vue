<template>
  <div>
    <div v-if="getDataOk">
      <div class="header">
        <div class="header-avatar">
          <img :src="playList.playlist.coverImgUrl" />
        </div>
        <div class="header-main">
          <div class="header-main-children">
            <el-row style="height:40px;line-height:40px;">
              <el-col style="height:40px;" :span="2">
                <span class="gedantext">歌单</span>
              </el-col>
              <el-col style="height:40px;font-size:16px;" :span="14">{{playList.playlist.name}}</el-col>
              <el-col class="header-one-txt" style="height:40px;" :span="3">
                歌曲数
                {{playList.playlist.trackCount}}
              </el-col>
              <el-col class="header-one-txt" style="height:40px;" :span="5">
                播放数
                {{playList.playlist.playCount}}
              </el-col>
            </el-row>

            <el-row class="header-main-two">
              <el-col :span="2">
                <el-avatar
                  style="line-height:40px;height:30px;width:30px;position:relative;top:5px;"
                  :src="playList.playlist.creator.avatarUrl"
                  size="small"
                ></el-avatar>
              </el-col>
              <el-col :span="5">{{playList.playlist.creator.nickname}}</el-col>
              <el-col :span="17">
                {{playList.playlist.createTime | toTime}}
                创建
              </el-col>
            </el-row>
            <br />
            <el-row class="header-main-two">
              <el-col :span="4">
                <button @click="playAllLists" class="el-icon-video-play play-all">播放全部</button>
              </el-col>
              <el-col :span="4">
                <button
                  @click="sharePlayList"
                  class="el-icon-share share"
                >分享({{playList.playlist.shareCount}})</button>
              </el-col>
              <el-col :span="16">
                <div class="header-search">
                  <input v-model="searchName" placeholder="搜索歌单音乐" class="search-input" />
                  <span class="search-icon el-icon-search"></span>
                </div>
              </el-col>
            </el-row>
            <el-row
              v-if="playList.playlist.description"
              class="header-main-two playlist-des"
            >简介:{{playList.playlist.description}}</el-row>
          </div>
        </div>
      </div>
      <div class="container">
        <el-row class="li-container" style="background-color: #222225;">
          <el-col :span="1" class="li-num">序号</el-col>
          <el-col :span="7" class="li-name" style="color:rgb(124, 124, 124);">音乐标题</el-col>
          <el-col :span="7" class="li-name" style="color:rgb(124, 124, 124);">歌手</el-col>
          <el-col :span="7" class="li-name" style="color:rgb(124, 124, 124);">专辑</el-col>
          <el-col :span="2" class="li-name" style="text-align:center;color:rgb(124, 124, 124);">时长</el-col>
        </el-row>
        <el-dialog title="添加到歌单" width="500px" :visible.sync="dialog">
          <el-tag
            v-for="(item,index) in this.$store.state.userList"
            effect="dark"
            style="margin:5px;"
            type="info"
            :key="'userlist-'+index"
            @click.native="addToPlayList(item.id)"
          >{{item.name}}</el-tag>
        </el-dialog>
        <!-- 歌单列表 -->
        <el-row
          v-for="(item,index) in computedList"
          :key="index"
          :id="item.id"
          :title="item.name"
          @click.native="playMusic(item.id)"
          @contextmenu.prevent.native="openDialog(item.id)"
          draggable="true"
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
    <div v-else class="loading">加载中...</div>
  </div>
</template>



<script>
export default {
  name: "playlist",
  inject: ["reload", "reloadPlay"],
  data() {
    return {
      playListId: null, //歌单id
      playList: {}, //歌单信息
      getDataOk: false, //数据获取完毕
      searchName: "", // 搜索关键词
      dialog: false, //控制dialog
      nowMusicId: null //右键选中的音乐Id
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
  //计算属性来计算歌单搜索结果
  computed: {
    computedList: function() {
      return this.getSearchItem();
    }
  },
  created() {
    // 从路由参数获取歌单id
    this.playListId = this.$route.query.id;
    this.getPlayListInfo();
  },
  mounted() {
    window.addEventListener("dragstart", e => {
      //定义拖动数据
      e.dataTransfer.setData("text/plain", e.target.id);
    });
  },
  methods: {
    //获取歌单信息
    getPlayListInfo() {
      this.$axios
        .get(`${this.$domain}/playlist/detail?id=${this.playListId}`)
        .then(res => {
          this.playList = res.data;
          this.getDataOk = true;
        })
        .catch(() => {});
    },
    //分享到动态
    sharePlayList() {
      this.$axios
        .get(
          `${this.$domain}/share/resource?id=${this.playListId}&type=playlist&msg=分享歌单`
        )
        .then(() => {
          this.$message({
            message: "成功分享歌单到动态",
            type: "success",
            duration: 2000,
            showClose: true
          });
        })
        .catch(() => {});
    },
    // 播放组件 id为歌曲id
    playMusic(id) {
      this.$router.replace(`/playDetail?id=${id}`);
      // 更新音乐ID
      this.$store.commit("getMusicId", id);
      //关闭fm模式
      this.$store.commit("setFm", false);
      // 将歌单更新到vuex state
      this.playAllLists();
      // 刷新PLAY组件
      this.reloadPlay();
    },
    //计算搜索匹配项
    getSearchItem() {
      let e = this.searchName;
      if (e == "") {
        return this.playList.playlist.tracks;
      } else {
        return this.playList.playlist.tracks.filter(item => {
          let lowName = item.name.toLowerCase();
          let eLowerCase = e.toLowerCase();
          // 搜索歌名 搜索不到则搜索歌手
          if (lowName.includes(eLowerCase)) {
            return item;
          } else {
            let singerName = "";
            for (let i = 0; i < item.ar.length; i++) {
              singerName += item.ar[i].name.toLowerCase();
            }
            if (singerName.includes(eLowerCase)) {
              return item;
            }
          }
        });
      }
    },
    // 播放全部音乐
    playAllLists() {
      let result = [];
      let musicList = this.playList.playlist.tracks;
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
    },
    //打开dialog
    openDialog(id) {
      if (this.$store.state.userid) {
        this.dialog = true;
        this.nowMusicId = id;
      } else {
        this.$message({
          showClose: true,
          message: "登陆后才能收藏单曲哦",
          type: "warning",
          duration: 2000
        });
      }
    },
    addToPlayList(id) {
      let songId = this.nowMusicId;
      this.$axios
        .get(
          `${this.$domain}/playlist/tracks?op=add&pid=${id}&tracks=${songId}`
        )
        .then(res => {
          if (res.data.code == 200) {
            this.dialog = false;
            this.$message({
              showClose: true,
              message: "添加成功😊",
              type: "warning",
              duration: 2000
            });
          }
          if (res.data.code == 502) {
            this.$message({
              showClose: true,
              message: `歌单歌曲重复`,
              type: "warning",
              duration: 2000
            });
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: `失败,无权限：${err}`,
            type: "warning",
            duration: 2000
          });
        });
    }
  }
};
</script>


<style scoped>
.loading {
  width: 300px;
  font-size: 20px;
  position: relative;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
}
.header {
  width: 820px;
  height: 220px;
}
.header-avatar {
  float: left;
  width: 220px;
  height: 220px;
}
.header-avatar > img {
  width: 180px;
  height: 180px;
  margin: 20px;
}
.header-main {
  margin-left: 220px;
  margin-right: 10px;
}
.header-main-children {
  position: relative;
  height: 180px;
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
.header-one-txt {
  height: 40px;
  line-height: 40px;
  font-size: 10px;
  color: rgb(124, 124, 124);
}
.header-main-two {
  height: 40px;
  line-height: 40px;
  font-size: 11px;
  color: rgb(124, 124, 124);
}
.play-all {
  background-color: rgb(184, 37, 37);
  border: none;
  height: 25px;
  border-radius: 10px;
  font-size: 11px;
  color: white;
  outline: none;
}
.share {
  border: none;
  outline: none;
  height: 25px;
  border-radius: 10px;
  font-size: 11px;
  color: white;
  background-color: rgb(184, 37, 37);
}
.container {
  margin-bottom: 20px;
}
.li-container:nth-child(2n) {
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
.header-search {
  position: relative;
  border: none;
  top: 10px;
  background-color: #222225;
  width: 150px;
  height: 20px;
  line-height: 40px;
  border-radius: 10px 10px 10px 10px;
}
.search-input {
  position: absolute;
  left: 10px;
  width: 130px;
  height: 20px;
  background-color: #222225;
  border: none;
  outline: none;
  color: #dcdde3;
  padding: 0;
  font-size: 10px;
  line-height: 40px;
}
.search-icon {
  position: absolute;
  left: 130px;
  top: 4px;
  text-align: center;
  font-size: 12px;
}
.playlist-des {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>