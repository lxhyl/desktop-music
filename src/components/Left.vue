<template>
  <div class="scrollbar" id="style-2">
    <div class="force-overflow">
      <div>
        <p class="tuijian">推荐</p>
        <div class="tuijian-main">
          <p
            class="item"
            v-for="(item,index) in tuijian"
            :key="index"
            @click="routerToPage(item.router)"
          >
            <span :class="item.icon"></span>
            <span class="text">{{item.text}}</span>
          </p>
        </div>
      </div>
      <div v-if="userid">
        <p class="tuijian">我的音乐</p>
        <div class="tuijian-main">
          <p class="item" v-for="(item,index) in myMusic" :key="index">
            <span :class="item.icon"></span>
            <span class="text">{{item.text}}</span>
          </p>
        </div>
      </div>
      <div v-if="userid">
        <p class="tuijian">我的歌单</p>
        <div class="tuijian-main">
          <p
            class="item"
            v-for="(item,index) in myList"
            :key="index"
            style="line-height:20px;"
            @click="routerToPlayList(item.id)"
          >
            <span :class="item.icon"></span>
            <span class="text">{{item.name}}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "left",
  data() {
    return {
      userid: null, //用户id判断是否登陆
      // 推荐栏
      tuijian: [
        { icon: "el-icon-headset", text: "发现音乐", router: "/" },
        { icon: "el-icon-microphone", text: "私人FM", router: "/fm" },
        { icon: "el-icon-video-camera", text: "视频", router: "/video" },
        { icon: "el-icon-user", text: "朋友", router: "/friend" }
      ],
      // 我的音乐
      myMusic: [
        { icon: "el-icon-mic", text: "我的电台", router: "/myDT" },
        { icon: "el-icon-star-on", text: "我的收藏", router: "/mySC" }
      ],
      //我的歌单
      myList: []
    };
  },
  created() {
    this.userid = this.$store.state.userid;
    this.userid = localStorage.getItem("userid");
  },
  mounted() {
    this.userid && this.getMusciList()
  },
  methods: {
    getMusciList() {
      this.$axios
        .get(`${this.$domain}/user/playlist?uid=${this.userid}`)
        .then(res => {
          let arr = res.data.playlist;
          for (let i = 0; i < arr.length; i++) {
            let json = {
              icon: "el-icon-service",
              name: arr[i].name,
              id: arr[i].id
            };
            this.myList.push(json);
          }
        });
    },
    //路由至 e 页面
    routerToPage(e) {
      this.$router.push(e);
    },
    // 跳转歌单详情页 参数e为歌单id
    routerToPlayList(e) {
      this.$router.push(`/playlist?id=${e}`);
    },
    reloadLeftPage() {}
  }
};
</script>

<style scoped>
p {
  margin: 0;
  padding: 0;
}
.tuijian {
  font-size: 11px;
  text-indent: 10px;
  color: rgb(124, 124, 124);
}
.tuijian-main {
  font-size: 11px;
  margin-left: 5px;
  color: rgb(173, 175, 178);
}
.item {
  margin: 10px 0;
  margin-left: 10px;
}
.text {
  margin-left: 10px;
}
.scrollbar {
  position: relative;
  float: left;
  height: 618px;
  width: 200px;
  background-color: rgb(25, 27, 31);
  overflow-y: scroll;
}

#wrapper {
  text-align: center;
  width: 500px;
  margin: auto;
}
#style-2::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: rgb(25, 27, 31);
}

#style-2::-webkit-scrollbar {
  width: 8px;
  background-color: rgb(25, 27, 31);
}

#style-2::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: rgb(47, 49, 52);
}
</style>