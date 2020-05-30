<template>
  <div>
    <div v-if="getDataOk">
      <el-popover width="210" offset="150">
        <div id="qrcode"></div>
        <div slot="reference" @click="shareSong" class="share el-icon-share"></div>
      </el-popover>

      <div class="left">
        <img class="song-pic" :src="musicInfo.songs[0].al.picUrl" />
        <el-tooltip effect="dark" content="单击红心可喜欢音乐">
          <img @click="likeThisSong" class="love-song" src="../../assets/love.png" />
        </el-tooltip>
      </div>
      <div class="main-danmu">
        <canvas v-show="showCanvas" ref="canvas" id="canvas" width="820" height="300"></canvas>
        <div v-show="!showCanvas" class="no-canvas">
          <div v-show="getSameDataOk" style="height:300px;width:250px;float:left;">
            <p style="width:300px;height:20px;line-height:20px;font-sie:14px;">相似歌曲</p>
            <div
              class="same-item same-song"
              v-for="(item,index) in sameSongs"
              :key="index"
              @click="playSameSong(item.id,index)"
            >
              <div class="same-pic">
                <img :src="item.picUrl+'?param=30y30'" />
              </div>
              <div class="same-text">
                <p class="same-name" style="color:white;">{{item.name}}</p>
                <p class="same-art">{{item.artists}}</p>
              </div>
            </div>
          </div>
          <div v-show="getUsersOk" class="user">
            <p style="width:300px;height:20px;line-height:20px;font-sie:14px;">听过这首歌的人</p>
            <el-row
              style="height:50px;margin-top:5px;"
              v-for="(item,index) in sameUsers"
              :key="index"
              @click.native="toUserPage(item.id)"
            >
              <el-col :span="4" class="user-pic-con">
                <img class="user-pic" :src="item.avar+'?param=30y30'" />
              </el-col>
              <el-col :span="10" class="user-name">
                {{item.name}}
                <span v-if="item.gender == 1" class="el-icon-male male"></span>
                <span v-if="item.gender == 2" class="el-icon-female female"></span>
              </el-col>
              <el-col :span="10" class="user-why">{{item.time}}</el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="lyric" id="lyric">
        <div v-if="!nolyric">
          <p
            v-for="(item,index) in lyric"
            :key="index"
            :id="index"
            style="text-align:center;"
          >{{item.lrc}}</p>
        </div>
        <div v-else class="no-lyric">纯音乐，请您欣赏</div>
      </div>

      <div class="danmu-setting">
        <p style="text-align:center;">弹幕设置</p>
        <el-row class="cow">
          <el-col class="text" :span="8">是否显示弹幕</el-col>
          <el-col :span="16" style="line-height:40px;">
            <el-switch
              v-model="showCanvas"
              inactive-color="rgb(124, 124, 124)"
              active-color="rgb(184, 37, 37)"
            ></el-switch>
          </el-col>
        </el-row>
        <el-row class="cow">
          <el-col class="text" :span="8">暂停(运动)</el-col>
          <el-col :span="16" style="line-height:40px;">
            <el-switch
              v-model="stopOrMove"
              inactive-color="rgb(124, 124, 124)"
              active-color="rgb(184, 37, 37)"
            ></el-switch>
          </el-col>
        </el-row>
        <el-row class="cow">
          <el-col class="text" :span="8">同时显示的弹幕条数{{canvasItemNum}}</el-col>
          <el-col :span="16">
            <el-slider
              v-model="canvasItemNum"
              :min="itemNumMin"
              :max="itemNumMax"
              @change="userChangeNum"
            ></el-slider>
          </el-col>
        </el-row>

        <el-row class="cow">
          <el-col class="text" :span="8">速度(每帧间隔时间){{canvasItemV}}ms</el-col>
          <el-col :span="16">
            <el-slider v-model="canvasItemV" :min="itemVMin" :max="itemVMax" @change="userChangeV"></el-slider>
          </el-col>
        </el-row>
        <el-row class="cow">
          <el-col class="text" :span="8">发送弹幕(评论)</el-col>
          <el-col :span="16" class="pinglun">
            <input
              v-model="pinglun"
              type="text"
              class="send-pinglun"
              v-on:keyup.enter="send"
              placeholder="请输入"
            />
          </el-col>
        </el-row>
      </div>
    </div>
    <p v-else style="text-align:center;">加载中...</p>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
export default {
  name: "playDetail",
  inject: ["reload", "reloadPlay"],
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
        if (document.getElementById(i)) {
          document.getElementById(i).style.color = "rgb(124, 124, 124)";
        }
        let last = this.lyric[i].time;
        let next = this.lyric[i + 1].time;

        if (last <= playTime && playTime < next) {
          let item = document.getElementById(i);
          if (item) {
            item.scrollIntoView();
            item.style.color = "white";
          }
        }
      }
    },

    //监听显示的弹幕条数
    comments: function(n) {
      if (n.length < this.canvasItemNum) {
        this.comments.push(this.allComments.splice(0, 1)[0]);
      }
    },
    // 如果评论数不够 就发请求获取新评论
    allComments: function(n) {
      if (n.length < 35) {
        this.getComment();
      }
    },

    // 监听是否暂停弹幕
    stopOrMove: function(n) {
      clearInterval(this.canvasTimer);
      if (n) {
        if (this.showCanvas) {
          this.canvasTimer = setInterval(() => {
            this.draw();
          }, this.canvasItemV);
        }
      } else {
        clearInterval(this.canvasTimer);
        this.canvasTimer = null;
      }
    },
    //监听是否显示弹幕
    // 不显示就推荐相似音乐 用户
    showCanvas: function(n) {
      localStorage.setItem("showCanvas", n);
      clearInterval(this.canvasTimer);
      if (n) {
        if (this.stopOrMove) {
          clearInterval(this.canvasTimer);
          this.$nextTick(() => {
            this.canvas = this.$refs.canvas;
            this.canvasTimer = setInterval(() => {
              this.draw();
            }, this.canvasItemV);
          });
        } else {
          clearInterval(this.canvasTimer);
          this.$nextTick(() => {
            this.canvas = this.$refs.canvas;
            this.draw();
          });
        }
      } else {
        clearInterval(this.canvasTimer);
        this.canvas = null;
        //获取相似歌曲
        this.getSameSong();
        //获取最近听过这首歌的用户
        this.getListenedUser();
      }
    }
  },
  data() {
    return {
      musicid: null, //音乐ID
      musicInfo: null, //音乐信息
      getDataOk: false, //是否拿到数据
      lyric: [], //歌词数组
      nolyric: false, //是否是纯音乐
      stopOrMove: true, //canvas弹幕 运动or暂停
      canvas: null, //canvas
      allComments: [], //所有评论
      comments: [], //canvas绘制的评论
      offset: 0, //评论分页
      canvasTimer: null, //canvas绘制定时器
      canvasItemNum: 10, // 屏幕显示的弹幕数
      itemNumMin: 1, //最少同时显示弹幕
      itemNumMax: 35, //最多同时显示的弹幕
      canvasItemV: 30, //弹幕速度
      itemVMin: 10, //最快速度
      itemVMax: 40, //最慢速度
      pinglun: "", //评论内容
      showCanvas: null, //是否显示弹幕
      sameSongs: [], //相似音乐
      sameUsers: [], //最近听过这首歌的用户
      getSameDataOk: false, //是否获取到音乐或数据
      getUsersOk: false, //是否获取到最近听歌的用户
      link: "" //分享链接
    };
  },
  computed: {
    nowPlayTime: function() {
      return this.$store.state.musicPlayTime;
    }
  },
  created() {
    this.musicid = this.$route.query.id;

    // 更新音乐ID
    this.$store.commit("getMusicId", this.musicid);
    //如果歌曲详情和目前播放的歌曲不同
    // 就略过显示歌曲详情,继续路由
    let storeMusicId = this.$store.state.musicid;
    if (this.musicid != storeMusicId) {
      this.$router.go(1);
    }

    if (localStorage.getItem("canvasItemV")) {
      this.canvasItemV = Number(localStorage.getItem("canvasItemV"));
    }
    if (localStorage.getItem("canvasItemN")) {
      this.canvasItemNum = Number(localStorage.getItem("canvasItemN"));
    }
    if (localStorage.getItem("showCanvas") === "false") {
      this.showCanvas = false;
    } else {
      this.showCanvas = true;
    }
    this.link = "http://zhangpengfan.xyz/#" + this.$route.fullPath;
  },
  mounted() {
    this.musicid && this.getSongDetail();
    this.musicid && this.getLyric();
    this.getComment();
    if (this.showCanvas === true && this.stopOrMove === true) {
      setTimeout(() => {
        this.canvas = this.$refs.canvas;
        if (!this.canvasTimer) {
          this.canvasTimer = setInterval(() => {
            this.draw();
          }, this.canvasItemV);
        }
      }, 1000);
    }

    // 监听键盘 如果按的是enter键，就发送弹幕
    document.addEventListener("keyup", e => {
      if (e.keyCode == 13) {
        this.send();
      } else {
        return;
      }
    });

    if (!this.$store.state.isPlaying) {
      this.$router.push(`/playDetail?id=${this.musicid}`);
      if (!this.$store.state.playLists) {
        this.$store.commit(`getPlayLists`, []);
      }

      this.reloadPlay();
    }
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
        if (res.data.nolyric) {
          this.nolyric = true;

          return;
        }
        //字符串按行变为数组
        // 分别拿到时间，歌词
        let arr = res.data.lrc.lyric.split("\n");
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].length) {
            let right = arr[i].indexOf("]");
            let time = arr[i].substr(1, right - 1);
            let m = time.substr(0, 2);
            let s = time.substr(3, 2);
            let ms = parseInt(time.substr(6));
            time = m * 60 * 1000 + s * 1000 + ms;
            let lrc = arr[i].substr(right + 1);
            let json = {
              time, //时间 单位ms
              lrc, // 歌词
              i // 索引
            };
            this.lyric.push(json);
          }
        }
      });
    },
    //获取评论
    getComment() {
      this.$axios
        .get(
          `${this.$domain}/comment/music?id=${this.musicid}&limit=50&offset=${this.offset}`
        )
        .then(res => {
          let arr = res.data.comments;
          for (let i = 0; i < arr.length; i++) {
            let content = arr[i].content;
            let r = Math.floor(Math.random() * 256);
            let g = Math.floor(Math.random() * 256);
            let b = Math.floor(Math.random() * 256);
            let c = `rgb(${r},${g},${b})`;
            let t = Math.floor(Math.random() * 270 + 15);
            let v = Math.random() * 3 + 1;
            let l = 820 - i;
            let obj = {
              content, //内容
              c, // 弹幕颜色
              t, //顶部偏移
              l, //左部偏移
              v // 速度
            };
            this.allComments.push(obj);
          }
          if (this.offset == 0) {
            this.comments = this.allComments.splice(0, this.canvasItemNum);
          }
          this.offset += 1;
        });
    },

    draw() {
      if (!this.canvas) {
        return;
      }
      let ctx = this.canvas.getContext("2d");
      ctx.font = "20px Microsoft YaHei";
      ctx.clearRect(0, 0, 820, 290);
      for (let i = 0; i < this.comments.length; i++) {
        ctx.fillStyle = this.comments[i].c;
        ctx.fillText(
          this.comments[i].content,
          this.comments[i].l,
          this.comments[i].t
        );
        this.comments[i].l -= this.comments[i].v;
        let w = ctx.measureText(this.comments[i].content).width;
        if (w * 2 + this.comments[i].l <= 0) {
          this.comments.splice(i, 1);
          i--;
        }
      }
    },

    //改变速度
    userChangeV(e) {
      localStorage.setItem("canvasItemV", e);
      clearInterval(this.canvasTimer);
      if (this.showCanvas && this.stopOrMove) {
        this.canvasTimer = setInterval(() => {
          this.draw();
        }, e);
      }
    },
    //改变弹幕数量
    userChangeNum(e) {
      localStorage.setItem("canvasItemN", e);
    },
    //发送弹幕 评论
    send() {
      if (this.pinglun == "") {
        return;
      }
      this.showCanvas = true;
      let content = `“${this.pinglun}”`;
      let canvas = document.createElement("canvas");
      if (canvas) {
        let ctx = canvas.getContext("2d");
        let w = ctx.measureText(content).width;
        let t = Math.floor(Math.random() * 270 + 15);
        let obj = {
          content,
          c: "#ffffff",
          t,
          l: 820,
          v: 1,
          w
        };
        this.comments.push(obj);
        this.pinglun = "";
      }
    },
    //获取相似歌曲
    getSameSong() {
      this.sameSongs = [];
      this.$axios
        .get(`${this.$domain}/simi/song?id=${this.musicid}`)
        .then(res => {
          let arr = res.data.songs;
          for (let i = 0; i < arr.length; i++) {
            let name = arr[i].name;
            let artists = arr[i].artists[0].name;
            let picUrl = arr[i].album.picUrl;
            let id = arr[i].id;
            let dt = arr[i].dt;
            let obj = {
              id,
              name,
              artists,
              picUrl,
              dt
            };
            this.sameSongs.push(obj);
          }
          this.getSameDataOk = true;
        });
    },
    //播放推荐歌曲
    playSameSong(id, index) {
      let playList = this.$store.state.playLists;

      let obj = {
        name: this.sameSongs[index].name,
        ar: this.sameSongs[index].artists,
        time: this.sameSongs[index].dt,
        id: this.sameSongs[index].id
      };
      playList.push(obj);
      this.$store.commit("getPlayLists", playList);
      this.$router.replace(`/playDetail?id=${id}`);
      this.$store.commit("getMusicId", id);
      this.reloadPlay();
    },
    //最近听过这首歌的用户
    getListenedUser() {
      this.sameUsers = [];
      this.$axios
        .get(`${this.$domain}/simi/user?id=${this.musicid}`)
        .then(res => {
          let arr = res.data.userprofiles;
          for (let i = 0; i < arr.length; i++) {
            let name = arr[i].nickname;
            let time = arr[i].recommendReason;
            let id = arr[i].userId;
            let avar = arr[i].avatarUrl;
            let gender = arr[i].gender;
            let obj = {
              name,
              time,
              id,
              avar,
              gender
            };
            this.sameUsers.push(obj);
          }
          this.getUsersOk = true;
        });
    },
    //跳转用户页
    toUserPage(id) {
      localStorage.setItem("anotherUserId", id);
      this.$router.push(`/me?id=${id}`);
    },
    //生成二维码
    qrcode() {
      new QRCode("qrcode", {
        width: 200,
        height: 200, // 高度
        text: this.link, // 二维码内容
        render: "canvas", // 渲染方式
        background: "#f0f", // 背景色
        foreground: "#ff0" // 前景色
      });
    },
    shareSong() {
      document.getElementById("qrcode").innerHTML = "";
      this.$nextTick(function() {
        this.qrcode();
      });
    },
    //喜欢音乐
    likeThisSong() {
      let id = this.musicid;
      this.$axios
        .get(`${this.$domain}/like?id=${id}`)
        .then(() => {
          this.$message({
            showClose: true,
            message: "已加入至喜欢列表",
            type: "warning",
            duration: 2000
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: "加入失败,请登录",
            type: "warning",
            duration: 2000
          });
        });
    }
  }
};
</script>

<style scoped>
.share {
  position: absolute;
  top: 5px;
  right: 0;
  z-index: 1000;
  font-size: 25px;
  color: rgb(184, 37, 37);
}
.left {
  width: 300px;
  height: 300px;
  text-align: center;
  position: absolute;
}

.song-pic {
  position: relative;
  top: 50px;
  height: 200px;
  width: 200px;
  border-radius: 100%;
  animation: turn 16s linear infinite;
}
.love-song {
  width: 40px;
  height: 40px;
  position: absolute;
  left: 130px;
  top: 130px;
  outline: none;
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
  margin-left: 0px;
  width: 820px;
  height: 300px;
  z-index: -1;
}
.lyric {
  width: 300px;
  height: 268px;
  overflow: scroll;
  float: left;
}
.lyric > p {
  font-size: 12px;
  text-align: center;
  color: rgb(124, 124, 124);
}

.lyric::-webkit-scrollbar {
  display: none;
}
.danmu-setting {
  height: 268px;
  margin-left: 350px;
  margin-right: 10px;
}
p {
  height: 30px;
  margin: 0;
  color: rgb(124, 124, 124);
  font-size: 12px;
}
.cow {
  height: 40px;
  color: rgb(124, 124, 124);
  font-size: 12px;
}
.text {
  position: relative;
  top: 10px;
  height: 40px;
  line-height: 30px;
}
.pinglun {
  position: relative;
  top: 10px;
  height: 30px;
  line-height: 30px;
}
.pinglun > input {
  border: none;
  outline: none;
  height: 25px;
  border-radius: 5px;
}
.no-canvas {
  margin-left: 300px;
  height: 290px;
}
.same-song {
  float: left;
  width: 250px;
  height: 300px;
}
.same-item {
  margin-top: 5px;
  height: 50px;
  width: 250px;
}
.same-pic {
  float: left;
  height: 30px;
  width: 30px;
}
.same-pic > img {
  height: 30px;
  width: 30px;
}
.same-text {
  margin-left: 30px;
  height: 30px;
}
.same-text > p {
  height: 20px;
  font-size: 12px;
  line-height: 15px;
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.user {
  margin-left: 250px;
  width: 250px;
  height: 300px;
}
.user-name {
  font-size: 11px;
  line-height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.user-pic-con {
  height: 50px;
  line-height: 50px;
}
.user-pic {
  width: 30px;
  height: 30px;
  border-radius: 100%;
}
.male {
  font-size: 16px;
  color: rgb(19, 101, 142);
}
.female {
  font-size: 16px;
  color: rgb(175, 112, 163);
}
.user-why {
  height: 50px;
  line-height: 30px;
  font-size: 12px;
}
.no-lyric {
  line-height: 268px;
  width: 300px;
  text-align: center;
}
.send-pinglun {
  background-color: rgb(124, 124, 124);
  color: white;
  font-size: 12px;
  padding-left: 5px;
}
.send-pinglun::-webkit-input-placeholder {
  color: white;
  font-size: 12px;
}
.send-pinglun::-ms-input-placeholder {
  color: white;
  font-size: 12px;
}
.send-pinglun::-moz-input-placeholder {
  color: white;
  font-size: 12px;
}
</style>