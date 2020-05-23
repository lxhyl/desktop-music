<template>
  <div v-if="getDataOk">
    <div class="left">
      <img :src="musicInfo.songs[0].al.picUrl" />
    </div>
    <div class="main-danmu">
      <canvas ref="canvas" id="canvas" width="500" height="300"></canvas>
    </div>
    <div class="lyric" id="lyric">
      {{nowLyric}}
      <p v-for="(item,index) in lyric" :key="index" :id="index">{{item.lrc}}</p>
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
    },
    //监听现在播放的时长，歌词跳转
    nowPlayTime: function(n) {
      let playTime = n * 1000;
      for (let i = 0; i < this.lyric.length - 1; i++) {
        document.getElementById(i).style.color = "rgb(124, 124, 124)";
        let last = this.lyric[i].time;
        let next = this.lyric[i + 1].time;
        if (last < playTime && playTime < next) {
          let item = document.getElementById(i);
          if (item) {
            item.scrollIntoView();
            item.style.color = "white";
          }
        }
      }
    }
  },
  data() {
    return {
      musicid: null,//音乐ID
      musicInfo: null,//音乐信息
      getDataOk: false, //是否拿到数据
      lyric: [], //歌词
      nowLyric: "", //现在唱到的歌词
      timer: null, //歌词定时器
      canvas: null, //canvas
      comments: [], //canvas绘制的评论
      offset: 0 //评论分页
    };
  },
  computed: {
    nowPlayTime: function() {
      return this.$store.state.musicPlayTime;
    }
  },
  created() {
    this.musicid = this.$route.query.id;
  },
  mounted() {
    this.musicid && this.getSongDetail();
    this.musicid && this.getLyric();
    this.getComment();
    setTimeout(() => {
      this.canvas = this.$refs.canvas;
    },1000);
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
        });
    },
    //获取解析歌词
    getLyric() {
      this.$axios.get(`${this.$domain}/lyric?id=${this.musicid}`).then(res => {
        let arr = res.data.lrc.lyric.split("\n");
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].length) {
            let time = arr[i].substr(1, 9);
            let m = time.substr(0, 2);
            let s = time.substr(3, 5);
            let ms = parseInt(time.substr(6));
            time = m * 60 * 1000 + s * 1000 + ms;
            let lrc;
            arr[i][10] == "]"
              ? (lrc = arr[i].substr(11))
              : (lrc = arr[i].substr(10));
            let json = {
              time,
              lrc,
              i
            };
            this.lyric.push(json);
          }
        }
      });
    },
    getComment() {
      this.$axios
        .get(
          `${this.$domain}/comment/music?id=${this.musicid}&offset=${this
            .offset * 20}`
        )
        .then(res => {
          let arr = res.data.comments;
          for (let i = 0; i < arr.length; i++) {
            let content = arr[i].content;
            let r = Math.floor(Math.random() * 256);
            let g = Math.floor(Math.random() * 256);
            let b = Math.floor(Math.random() * 256);
            let c = `rgb(${r},${g},${b})`;
            let t = Math.floor(Math.random() * 290 + 10);
            let l = 500 - i;
            let json = {
              content,
              c,
              t,
              l
            };
            this.comments.push(json);
          }
          this.offset += 1;
        });
    },
    draw() {}
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
.main-danmu {
  margin-left: 300px;
  width: 520px;
  height: 300px;
}
.lyric {
  width: 300px;
  height: 268px;
  overflow: scroll;
}
.lyric > p {
  font-size: 12px;
  text-align: center;
  color: rgb(124, 124, 124);
}

.lyric::-webkit-scrollbar {
  display: none;
}
canvas {
  font-size: 16px;
}
</style>