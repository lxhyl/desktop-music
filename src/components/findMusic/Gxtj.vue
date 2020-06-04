<template>
  <div class="page">
    <el-carousel style="margin-top:20px;" :interval="4000" type="card" height="200px">
      <el-carousel-item
        v-for="(item,index) in banners"
        style="width:540px;left:-80px;"
        @click.native="openBanner(item.url)"
        :key="'banner' +index"
      >
        <img :src="item.imageUrl" loading="lazy" class="banner-img" object-fit="fill" />
      </el-carousel-item>
    </el-carousel>
    <div v-if="this.$store.state.userid">
      <p>每日推荐</p>
      <div class="item-container">
        <div class="gd-item" @click="getRecommendSongs">
          <div class="gd-main-item">
            <p class="gd-day">星期{{new Date().getDay() | toChinese}}</p>
            <p class="gd-fullday">{{new Date().getDate()}}</p>
          </div>
          <p class="gd-name-item">每日歌曲推荐</p>
        </div>
        <div
          v-for="(item,index) in playList"
          :key="'playlist'+index"
          class="gd-item"
          @click="openPlayList(item.id)"
        >
          <img :src="item.picUrl+'?param=130y150'" loading="lazy" class="gd-main-item" />
          <span class="el-icon-service play-count">{{item.playcount}}次</span>
          <div class="el-icon-video-play gd-show-play"></div>
          <p class="gd-name-item">{{item.name}}</p>
        </div>
      </div>
    </div>
    <p v-else class="not-login">点击右上角登陆以获取专属每日推荐歌曲，歌单...</p>
    <div>
      <div class="item-container">
        <p style="width:100%;">推荐歌单</p>
        <div
          v-for="(item,index) in tjPlayLists"
          :key="'tjplaylist'+index"
          class="gd-item"
          @click="openPlayList(item.id)"
        >
          <img :src="item.picUrl+'?param=130y150'" loading="lazy" class="gd-main-item" />
          <span class="el-icon-service play-count">{{item.playCount}}次</span>
          <div class="el-icon-video-play gd-show-play"></div>
          <p class="gd-name-item">{{item.name}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "gxtj",
  inject: ["reloadPlay"],
  data() {
    return {
      banners: [],
      playList: [], //每日推荐歌单
      showPlay: false,
      tjPlayLists: [] //推荐歌单
    };
  },

  computed: {
    islogin: function() {
      if (this.$store.state.userid) {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    islogin: function(n) {
      if (n) {
        this.getRecommendList();
      }
    }
  },
  created() {},
  mounted() {
    this.getBanner();
    this.getTuiJian();
  },
  methods: {
    getBanner() {
      this.$axios
        .get(`${this.$domain}/banner?type=0`)
        .then(res => {
          this.banners = res.data.banners;
        })
        .catch(() => {});
    },
    openBanner(e) {
      if (e) {
        window.open(e, "_blank");
      }
    },
    //每日推荐歌曲
    getRecommendSongs() {
      this.$message.closeAll();
      this.$message({
        showClose: false,
        message: "搜寻歌曲中...🎼",
        type: "warning",
        duration: 0
      });
      this.$axios
        .get(`${this.$domain}/recommend/songs`)
        .then(res => {
          this.playtuijian = true;
          this.$message.closeAll();
          let arr = res.data.data.dailySongs;
          let result = [];
          for (let i = 0; i < arr.length; i++) {
            let obj = {
              id: arr[i].id,
              name: arr[i].name,
              ar: arr[i].artists[0].name,
              time: arr[i].duration
            };
            result.push(obj);
          }
          let id = result[0].id;
          this.$message({
            showClose: true,
            message: "推荐歌曲已加入至播放列表🎶",
            type: "warning",
            duration: 2000
          });
          this.$router.push(`/playDetail?id=${id}`);
          // 更新音乐ID
          this.$store.commit("changePlayState", true);
          this.$store.commit("getMusicId", id);
          this.$store.commit("getPlayLists", result);
          this.reloadPlay();
        })
        .catch(() => {
          this.$message({
            showClose: false,
            message: "找不到歌曲了...",
            type: "warning",
            duration: 0
          });
        });
    },
    //每日推荐歌单
    getRecommendList() {
      this.$axios
        .get(`${this.$domain}/recommend/resource`)
        .then(res => {
          this.playList = res.data.recommend;

          this.playList.forEach(item => {
            item.showPlay = false;
          });
        })
        .catch(() => {});
    },
    //打开歌单
    openPlayList(id) {
      this.$router.push(`/playlist?id=${id}`);
    },
    //推荐歌单
    getTuiJian() {
      this.$axios
        .get(`${this.$domain}/personalized`)
        .then(res => {
          this.tjPlayLists = res.data.result.splice(15, 29);
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
.banner-img {
  height: 100%;
  width: 100%;
}
.item-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  width: 100%;
}
.not-login {
  font-size: 11px;
  color: rgb(173, 175, 178);
}
.gd-item {
  width: 130px;
  height: 170px;
  z-index: 0;
  position: relative;
  margin: 10px;
}
.gd-main-item {
  background: white;
  height: 150px;
  width: 130px;
  z-index: 10;
}
.gd-name-item {
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
  height: 20px;
  line-height: 20px;
}
.gd-day {
  z-index: 11;
  color: rgb(124, 124, 124);
  font-size: 16px;
  margin: 0;
  width: 100%;
  text-align: center;
  height: 40px;
  line-height: 40px;
}
.gd-fullday {
  margin: 0;
  font-size: 90px;
  width: 100%;
  height: 110px;
  text-align: center;
  line-height: 110px;
  color: rgb(184, 37, 37);
}
.play-count {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 10px;
  background-color: rgb(124, 124, 124);
}
.gd-show-play {
  position: absolute;
  top: 0;
  font-size: 30px;
  left: 0px;
  height: 150px;
  width: 130px;
  line-height: 150px;
  text-align: center;
  color: white;
  opacity: 0;
}
.gd-show-play:hover {
  opacity: 1;
}
</style>