<template>
  <div v-infinite-scroll="getEvent" infinite-scroll-immediate="false">
    <div v-if="lists" class="page">
      <div class="event-item" v-for="(item,index) in lists" :key="'event'+index">
        <div class="item-header">
          <div class="item-header-pic">
            <img :src="item.user.picUrl+'?param=40y40'" />
          </div>
          <div class="item-header-main">
            <p class="item-header-main-name" @click="goTouserPage(item.user.id)">{{item.user.name}}</p>
            <p class="item-header-main-time">{{item.time | toTime}}</p>
          </div>
        </div>
        <div class="event-main">
          <p style="font-size:14px;line-height:25px;">{{item.json.msg}}</p>

          <div
            class="item-header"
            v-if="item.json.song"
            @click="playMusic(item.json.song.id)"
            style="background:rgb(30,33,38);width:460px;margin:10px 0;"
          >
            <div class="item-header-pic">
              <img style="border-radius:0;" :src="item.json.song.album.picUrl+'?param=40y40'" />
            </div>
            <div class="item-header-main">
              <p class="item-header-main-name">{{item.json.song.name}}</p>
              <p class="item-header-main-time">{{item.json.song.artists[0].name}}</p>
            </div>
          </div>

          <div v-if="item.pics.length > 0" class="main-img-container">
            <img
              v-for="(pic,index) in item.pics"
              :key="'pic'+index"
              :src="pic.originUrl+'?param=150y150'"
            />
          </div>
        </div>
        <p class="line"></p>
      </div>
      <div class="right">
          <p>热门话题</p>
          <p v-for="(item,index) in hot"
          class="hot"
          :key="'hot-'+index"
          >
          #{{item.title}}#
          </p> 
      </div>
    </div>
    <p v-else>暂无数据</p>
  </div>
</template>

<script>
export default {
  inject: ["reloadPlay"],
  components:{
 
  },
  data() {
    return {
      lists: null,
      lasttime: -1, //动态分页时间
      hot:[],//热门话题
    };
  },
  created() {
    this.getEvent();
    this.getHotComment();
  },
  methods: {
    getEvent() {
      this.$axios
        .get(`${this.$domain}/event?pagesize=10&lasttime=${this.lasttime}`)
        .then(res => {
          let arr = res.data.event;
          this.lasttime = arr[arr.length - 1].eventTime;
          arr.map(item => {
            if (item.user.userId) {
              let user = {
                id: item.user.userId,
                name: item.user.nickname,
                picUrl: item.user.avatarUrl
              };
              let time = item.eventTime;
              let pics = item.pics;
              let json = JSON.parse(item.json);

              this.lists = this.lists ? this.lists : [];
              this.lists.push({
                user,
                pics,
                json,
                time
              });
            }
          });
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
      this.$store.commit("getPlayLists", []);
      // 刷新PLAY组件
      this.reloadPlay();
    },
    goTouserPage(id) {
      localStorage.setItem("anotherUserId", id);
      this.$router.push(`/me?id=${id}`);
    },
    //热评
    getHotComment(){
        this.$axios.get(`${this.$domain}/hot/topic?limit=10`)
        .then(res => {
            console.log(res);
            this.hot = res.data.hot;
        })
        .catch()
    }
  }
};
</script>

<style scoped>
p {
  margin: 0;
}
.loading {
  margin: 20px;
  line-height: 30px;
  height: 30px;
  text-align: center;
}
.line {
  height: 1px;
  background-color: white;
  transform: scaleY(0.1);
  margin: 5px 25px 5px 0px;
}

.event-item {
  width: 550px;
  margin: 20px;
  float: left;
}
.right{
    margin-left:550px;
}
.hot{
    margin:5px 0;
    font-size: 12px;
    color: rgb(124, 124, 124);
}
.item-header {
  height: 60px;
}
.item-header-pic {
  float: left;
  position: relative;
  height: 60px;
  width: 60px;
  text-align: center;
  line-height: 60px;
}
.item-header-pic > img {
  height: 40px;
  position: absolute;
  top: 10px;
  left: 10px;
  border-radius: 100%;
  width: 40px;
}
.item-header-main {
  margin-left: 60px;
  height: 60px;
}
.item-header-main > p {
  margin: 0;
  padding: 0;
  font-size: 12px;
}
.item-header-main-name {
  color: #409eff;
  line-height: 35px;
  height: 35px;
}
.item-header-main-time {
  font-size: 10px;
  color: rgb(124, 124, 124);
}
.event-main {
  margin-left: 60px;
}
.main-img-container {
  display: flex;
  flex-wrap: wrap;
  display: inline-block;
}
.main-img-container > img {
  width: 150px;
  height: 150px;
  margin: 0px 2px 1px 2px;
}
</style>