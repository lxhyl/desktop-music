<template>
  <div v-if="getDataOk">
    <div class="left">
      <img :src="musicInfo.songs[0].al.picUrl" />
    </div>
    <div class="main-danmu">
    </div>
    <div class="lyric">

    </div>
  </div>
</template>

<script>
export default {
  name: "playDetail",
  inject: ["reload"],
  // 监听路由  刷新组件
  watch: {
    $route(to, from) {
      if (to.fullPath !== from.fullPath) {
        this.reload();
      }
    }
  },
  data() {
    return {
      musicid: null,
      musicInfo: null,
      getDataOk: false //是否拿到数据
    };
  },
  created() {
    this.musicid = this.$route.query.id;
  },
  mounted() {
    this.musicid && this.getSongDetail();
  },
  methods: {
    getSongDetail() {
      this.$axios
        .get(`${this.$domain}/song/detail?ids=${this.musicid}`)
        .then(res => {
          //更新VUEX的音乐信息
          this.$store.commit("getMusicInfo", res.data);
          this.musicInfo = res.data;
          this.getDataOk = true;
          console.log(this.musicInfo);
        });
    }
  }
};
</script>

<style scoped>
.left {
  width: 300px;
  height: 300px;
  text-align: center;
  float: left;
}
.left > img {
  position: relative;
  top: 50px;
  height: 200px;
  width: 200px;
  border-radius: 100%;
  animation: turn 16s linear infinite;
}
@keyframes turn {
  0% {
    -webkit-transform: rotate(0deg);
  }
  25% {
    -webkit-transform: rotate(90deg);
  }
  50% {
    -webkit-transform: rotate(180deg);
  }
  75% {
    -webkit-transform: rotate(270deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
.main-danmu{
  margin-left: 300px;
  width: 520px;
  height: 300px;
  background-color: yellow;
}
.lyric{
  width: 520px;
  height: 268px;
  background-color: violet;
}
</style>