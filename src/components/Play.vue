<template>
  <div>
    <div v-if="this.$store.state.musicInfo">
      <el-row style="height:50px;margin-left:5px;">
        <el-col :span="1" class="item">
          <el-avatar
            shape="square"
            :src="this.$store.state.musicInfo.songs[0].al.picUrl+'?param=40y40'"
            class="music-pic"
          ></el-avatar>
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
          <div
            @click="openDetail"
            @contextmenu.prevent="openDialog(musicid)"
            class="el-icon-rank open-detail"
          ></div>
        </el-col>
        <el-col :span="2" style="height:50px;">
          <span
            class="name-arname"
            style="line-height:30px;"
            draggable="true"
            :id="this.$store.state.musicInfo.songs[0].id"
          >{{this.$store.state.musicInfo.songs[0].name}}</span>

          <p
            class="name-arname"
            style="color:rgb(124, 124, 124);height:20px;"
          >{{this.$store.state.musicInfo.songs[0].ar[0].name}}</p>
        </el-col>
        <el-col
          style="color:rgb(124, 124, 124);font-size:10px;text-align:center;"
          class="item"
          :span="1"
        >{{nowtime}}</el-col>
        <el-col :span="9" class="item">
          <el-slider
            v-model="time"
            :format-tooltip="formatTooltip"
            :max="musicAllTime"
            @change="userChangeTime"
          ></el-slider>
        </el-col>
        <el-col
          style="color:rgb(124, 124, 124);font-size:10px;text-align:center;"
          class="item"
          :span="1"
        >{{this.$store.state.musicInfo.songs[0].dt | songToTime}}</el-col>
        <el-col class="item" style="line-height:50px;text-align:right;" :span="1">
          <img class="volume" :src="volumeImgUrl" />
        </el-col>
        <el-col class="item" :span="2">
          <el-slider v-model="volume" @change="volumeChange" :max="maxVolume" :step="stepVolume"></el-slider>
        </el-col>
        <el-col class="item item-icon" style="text-align:right;" :span="2">
          <span
            id="last"
            v-if="this.$store.state.playLists.length > 1 && !this.$store.state.fm"
            @click="debouncePlayLastMusic"
            class="el-icon-caret-left"
          ></span>
        </el-col>
        <el-col class="item item-icon" :span="2">
          <span v-if="isPlaying" @click="stop" class="el-icon-video-pause"></span>
          <span v-else @click="play" class="el-icon-video-play"></span>
        </el-col>
        <el-col class="item item-icon" style="text-align:left;" :span="2">
          <span
            id="next"
            v-if="this.$store.state.playLists.length > 1"
            @click="debouncePlayNextMusic"
            class="el-icon-caret-right"
          ></span>
        </el-col>
        <el-col :span="1" class="item item-icon" style="color:rgb(173, 175, 178);">
          <el-popover trigger="click" width="300" placement="top" offset="150">
            <div class="scrollbar-main" id="style-2">
              <el-row>
                <el-col class="li-name" style="color:rgb(124, 124, 124);" :span="18">音乐标题</el-col>
                <el-col :span="3" class="li-name" style="color:rgb(124, 124, 124);">歌手</el-col>
                <el-col
                  :span="3"
                  class="li-name"
                  style="text-align:center;color:rgb(124, 124, 124);"
                >时长</el-col>
              </el-row>
              <el-row
                v-for="(item,index) in this.$store.state.playLists"
                :key="index"
                @click.native="playListsMusic(item.id)"
              >
                <el-col :span="15" class="li-name">{{item.name}}</el-col>
                <el-col :span="6" class="li-name" style="text-align:center;">{{item.ar}}</el-col>
                <el-col :span="3" class="li-name">{{item.time | songToTime}}</el-col>
              </el-row>
            </div>
            <span slot="reference" class="el-icon-s-unfold"></span>
          </el-popover>
        </el-col>
      </el-row>
    </div>
    <div v-else>刷新下吧</div>
    <audio
      ref="audio"
      v-if="getDataOk"
      autoplay
      :src="musicUrl"
      crossorigin="anonymous"
      style="width:0;height:0;"
    ></audio>
  </div>
</template>

<script>
export default {
  name: "play",
  inject: ["reloadPlay"],
  //  刷新播放组件
  data() {
    return {
      getDataOk: false, //是否获取到数据
      musicid: null, // 音乐id
      musicInfo: null, //
      time: 0, //播放进度 单位s
      nowtime: 0, // 播放进度 格式化后的时间
      musicUrl: null, //音乐文件存储地址
      isPlaying: false, // 是否在播放
      timer: null, // 1s定时器 加载歌曲进度
      volume: 0.5, //音量
      maxVolume: 1, // 最大音量
      stepVolume: 0.1, //调节音量步长
      volumeImgUrl: require("../assets/volume.png"), // 喇叭图片
      lyricTimer: null, //歌词计时器
      lastMusicTimer: false, //改变歌曲节流函数
      nextMusicTimer: false,
      debounde: false, //键盘节流
      thisTemplateSongInfo: null, //歌曲信息
      dialog: false //控制dialog
    };
  },
  computed: {
    // 计算音乐总时长
    musicAllTime: function() {
      let ms = this.$store.state.musicInfo.songs[0].dt;
      return Math.round(ms / 1000);
    },
    //是否是fm模式
    fm: function() {
      return this.$store.state.fmLists;
    }
    // musicInfo:function(){
    //   return this.$store.state.musicInfo;
    // }
  },
  watch: {
    volume: function(n) {
      if (this.$refs.audio) {
        this.$refs.audio.volume = n;
        this.$store.commit("setMusicVolume", n);
      }
    },
    isPlaying: function(n) {
      this.$store.commit("isplaying", n);
    }
  },
  created() {
    if (localStorage.getItem("playNextSelf") === null) {
      localStorage.setItem("playNextSelf", true);
    }
    // 监听键盘事件
    document.addEventListener("keyup", e => {
      //空格键就暂停或播放
      if (e.keyCode === 32) {
        if (this.isPlaying) {
          this.stop();
        } else {
          this.play();
        }
      }
      //增大音量
      if (e.keyCode === 39 && this.volume <= 0.9) {
        this.volume += 0.1;
        this.$store.commit(
          "setMusicVolume",
          this.$store.state.musicVolume + 0.1
        );
      }
      //减少音量
      if (e.keyCode === 37 && this.volume >= 0.1) {
        this.volume -= 0.1;
        this.$store.commit(
          "setMusicVolume",
          this.$store.state.musicVolume - 0.1
        );
      }
      if (this.debounde) {
        return;
      }
      // 上一曲
      if (e.keyCode === 38) {
        //不是fm模式时
        if (!this.$store.state.fm) {
          let last = document.getElementById("last");
          last.click();
        }
      }
      if (e.keyCode === 40) {
        let next = document.getElementById("next");
        next.click();
      }
    });
  },
  mounted() {
    this.volume = this.$store.state.musicVolume;
    this.musicid = this.$store.state.musicid;
    this.musicid && this.getSongUrl();

    // 当audio就绪 初始化音量
    let volumeTimer = setInterval(() => {
      if (this.$refs.audio) {
        this.$refs.audio.volume = this.$store.state.musicVolume;
        clearInterval(volumeTimer);
      }
    }, 200);

    // 拖动至歌单
    window.addEventListener("dragstart", e => {
      //定义拖动数据
      e.dataTransfer.setData("text/plain", e.target.id);
    });
  },

  // 在组件销毁前
  //更新听歌打卡
  beforeDestroy() {
    let id = this.musicid;
    let sourceid = this.$store.state.musicInfo.songs[0].al.id;
    let time = this.$store.state.musicPlayTime;
    this.$axios
      .post(`${this.$domain}/scrobble`, {
        id,
        sourceid,
        time
      })
      .then(() => {})
      .catch(() => {});
  },
  methods: {
    // getAudioData() {
    //   let audioElement = this.$refs.audio;
    //   let audioCtx = new AudioContext();
    //   //利用接口得到分析器
    //   let analyser = audioCtx.createAnalyser();
    //   //得到音源
    //   let source = audioCtx.createMediaElementSource(audioElement);
    //   // source=>middle
    //   source.connect(analyser);
    //   //middle=>termial
    //   analyser.connect(audioCtx.destination);
    //   // 设置傅里叶变化的参数,用来设置分析范围
    //   analyser.fftSize = 128;
    //   //根据范围得到不同音频的数量的长度
    //   let bufferLength = analyser.frequencyBinCount;
    //   //生成8位为一个item,长度为bufferLength的array
    //   let dataArray = new Uint8Array(bufferLength);
    //   //  将频率导入到该array
    //   analyser.getByteFrequencyData(dataArray);
    //   console.log(dataArray);
    // },
    //获取音乐存储地址
    getSongUrl() {
      this.$axios
        .get(
          `${this.$domain}/song/url?br=${this.$store.state.br}&id=${this.musicid}`
        )
        .then(res => {
          this.musicUrl = res.data.data[0].url;
          //如果是会员歌曲
          if (!this.musicUrl) {
            this.$message({
              showClose: true,
              message: "会员或无版权歌曲🥺",
              type: "warning",
              duration: 3000
            });

            //如果设置自动跳过，并且播放列表中有单曲的话
            //  并且跳转的次数小于播放列表单曲总数
            //  防止列表全无版权，进入死循环
            let tonext = this.$store.state.canNotplayToNext;
            if (
              tonext.value &&
              tonext.num < this.$store.state.playLists.length
            ) {
              this.$message.closeAll();
              this.$message({
                showClose: true,
                message: "会员或无版权歌曲🥺,已跳过",
                type: "warning",
                duration: 3000
              });

              this.playNextMusic();
              return;
            } else {
              this.$store.commit("changePlayState", false);
            }
          }

          this.getDataOk = true;
          this.oneSecondTime();
        })
        .catch(err => {
          // 如果出现403错误
          // 重新给audio赋值
          if (err.code == 403) {
            this.musicUrl = `https://music.163.com/song/media/outer/url?id=${this.musicid}.mp3`;
          } else {
            this.$router.replace("/404NotFound");
            this.$message({
              showClose: true,
              message: `${err}`,
              type: "warning",
              duration: 3000
            });
          }
        });
    },
    //格式化进度条显示数字
    formatTooltip(e) {
      let m, s;
      m = Math.floor(e / 60);
      s = e - m * 60;
      m = m >= 10 ? m : `0${m}`;
      s = s >= 10 ? s : `0${s}`;
      let str = `${m}:${s}`;
      this.nowtime = str;
      return str;
    },
    //暂停
    stop() {
      clearInterval(this.timer);
      this.timer = null;
      if (this.$refs.audio) {
        this.$refs.audio.pause();
      }
      this.isPlaying = false;
    },
    //播放
    play() {
      if (this.$refs.audio) {
        if (this.$refs.audio.readyState) {
          this.$refs.audio.play();
          this.isPlaying = true;
          this.oneSecondTime();
        } else {
          this.$message({
            showClose: true,
            message: "网有点慢,别急呀...",
            type: "warning",
            duration: 2000
          });
        }
      }
    },
    // 手动改变进度条
    userChangeTime(e) {
      this.time = e;
      this.$refs.audio.currentTime = e;
      if (this.$refs.audio.readyState) {
        if (this.$refs.audio.paused) {
          this.$refs.audio.play();
          this.isPlaying = true;
        }
      }
    },
    //定时器
    oneSecondTime() {
      let _this = this;
      //更新进度条
      this.timer = setInterval(() => {
        let ref = this.$refs.audio;
        if (ref) {
          if (ref.readyState) {
            this.isPlaying = true;
            if (!ref.paused) {
              _this.time += 1;
            }
          } else {
            this.isPlaying = false;
          }
        }
      }, 1000);
      // 200ms更新一次音乐已播放时长
      this.lyricTimer = setInterval(() => {
        let ref = this.$refs.audio;
        if (ref) {
          if (ref.readyState) {
            this.$store.commit(
              "getMusicPlayTime",
              _this.$refs.audio.currentTime
            );
          }
          // 如果音乐播放结束
          // 根据设置判断是否自动播放下一首音乐
          // 清除定时器
          if (this.$refs.audio.ended) {
            clearInterval(_this.lyricTimer);
            this.volume = this.$store.state.musicVolume;
            let self = localStorage.getItem("playNextSelf");
            if (self === "true") {
              this.playNextMusic();
            } else {
              this.$store.commit("getMusicId", this.musicid);
              this.reloadPlay();
            }
          }
        }
      }, 200);
    },
    // 音量改变时
    volumeChange(e) {
      this.$refs.audio.volume = e;
      this.$store.commit("setMusicVolume", e);
    },
    // 获取上一首音乐
    //  返回歌曲id
    getLastMusic() {
      let nowId = this.musicid;
      let lists = this.$store.state.playLists;
      for (let i = 0; i < lists.length; i++) {
        if (lists[i].id == nowId) {
          if (i == 0) {
            if (this.$store.state.fm) {
              return false;
            } else {
              return lists[lists.length - 1].id;
            }
          } else {
            return lists[i - 1].id;
          }
        }
      }
    },
    //获取下一首音乐
    //  返回歌曲id
    // 如果是fm模式，最后一首歌时返回false
    getNextMusic() {
      let nowId = this.musicid;
      let lists = this.$store.state.playLists;
      for (let i = 0; i < lists.length; i++) {
        if (lists[i].id == nowId) {
          if (i == lists.length - 1) {
            //如果是fm模式,就返回false
            if (this.$store.state.fm) {
              return false;
            } else {
              return lists[0].id;
            }
          } else {
            return lists[i + 1].id;
          }
        }
      }
    },
    // 播放下一首音乐
    playNextMusic() {
      let _this = this;
      if (this.$store.state.playLists.length === 0) {
        this.reloadPlay();
        return;
      }
      let id = this.getNextMusic();
      //如果是随机播放，产生一个随机数，重新赋值id;
      if (this.$store.state.randomPlay) {
        let le = this.$store.state.playLists.length;
        id = this.$store.state.playLists[Math.floor(Math.random() * le)].id;
      }

      if (id !== false) {
        this.$axios
          .get(`${this.$domain}/song/detail?ids=${id}`)
          .then(res => {
            /*
             需要先更新音乐id
             vuex中先判断播放的歌曲id，是否和歌曲数据中的id相等
             再决定是否赋值
             以防止歌曲详情页路由改变，而播放条也改变
            */
            _this.$store.commit("getMusicId", id);
            //更新VUEX的音乐信息
            _this.$store.commit("getMusicInfo", res.data);
            _this.reloadPlay();
            if (this.$route.name == "playDetail") {
              this.$router.replace(`/playDetail?id=${id}`).catch(() => {});
            }
          })
          .catch(() => {
            this.$message("网络出问题啦");
          });
      } else {
        this.getFmSongs();
      }
    },
    // 播放上一首音乐
    playLastMusic() {
      let _this = this;
      if (this.$store.state.playLists.length === 0) {
        this.reloadPlay();
        return;
      }
      let id = this.getLastMusic();
      if (this.$store.state.randomPlay) {
        let le = this.$store.state.playLists.length;
        id = this.$store.state.playLists[Math.floor(Math.random() * le)].id;
      }

      if (id !== false) {
        this.$axios
          .get(`${this.$domain}/song/detail?ids=${id}`)
          .then(res => {
            //更新VUEX的音乐信息
            _this.$store.commit("getMusicId", id);
            //更新VUEX的音乐信息
            _this.$store.commit("getMusicInfo", res.data);
            _this.reloadPlay();
            if (this.$route.name == "playDetail") {
              this.$router.replace(`/playDetail?id=${id}`).catch(() => {});
            }

            // 更新音乐ID
          })
          .catch(() => {
            this.$message("网络出问题啦");
          });
      }
    },
    //下一曲函数
    debouncePlayNextMusic() {
      if (this.nextMusicTimer !== null) {
        clearTimeout(this.nextMusicTimer);
        this.nextMusicTimer = null;
      }
      this.nextMusicTimer = setTimeout(() => {
        this.playNextMusic();
      }, 200);
    },
    //防抖播放上一首
    debouncePlayLastMusic() {
      if (this.lastMusicTimer !== null) {
        clearTimeout(this.lastMusicTimer);
        this.lastMusicTimer = null;
      }

      this.lastMusicTimer = setTimeout(() => {
        this.playLastMusic();
      }, 200);
    },
    // 点击播放音乐列表音乐
    playListsMusic(id) {
      this.$router.push(`/playDetail?id=${id}`);
      this.$store.commit("getMusicId", id);
      this.reloadPlay();
    },
    //点击图片 显示音乐详情
    openDetail() {
      let id = this.musicid;
      this.$store.commit("getshowMain", true);
      this.$router.push(`/playDetail?id=${id}`);
    },
    //私人fm推荐歌曲
    getFmSongs() {
      this.$axios
        .get(`${this.$domain}/personal_fm?timestamp=${new Date().getTime()}`)
        .then(res => {
          let songs = res.data.data;
          let result = [];
          for (let i = 0; i < songs.length; i++) {
            let obj = {
              id: songs[i].id,
              name: songs[i].name,
              album: songs[i].album.name,
              ar: songs[i].artists[0].name,
              time: songs[i].duration
            };
            result.push(obj);
          }
          let id = res.data.data[0].id;
          if (this.$route.path == "/playDetail") {
            this.$router.push(`/playDetail?id=${id}`);
          }
          // 更新音乐ID
          this.$store.commit("getMusicId", id);
          this.$store.commit("getPlayLists", result);
          this.reloadPlay();
        })
        .catch(() => {});
    },
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
.item {
  height: 50px;
  line-height: 50px;
}
.music-pic {
  height: 40px;
  width: 40px;
  position: relative;
  top: 5px;
}
.open-detail {
  height: 40px;
  width: 40px;
  position: absolute;
  left: 0;
  font-size: 0px;
  top: 5px;
  z-index: 999;
}
.open-detail:hover {
  font-size: 40px;
  color: rgb(184, 37, 37);
}
.name-arname {
  margin: 0;
  padding: 0;
  height: 25px;
  line-height: 20px;
  font-size: 11px;
  width: 80px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item-icon {
  text-align: center;
  font-size: 30px;
}
.volume {
  height: 20px;
  width: 20px;
  position: relative;
  top: 5px;
}
.li-name {
  font-size: 10px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 25px;
}
.li-container {
  height: 25px;
  line-height: 25px;
  margin: 0 15px;
}
.li-container:nth-child(odd) {
  background-color: #222225;
}
.scrollbar-main {
  position: relative;
  height: 400px;
  width: 300px;
  overflow-y: scroll;
  overflow-x: hidden;
}

#style-2::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: rgb(45, 47, 51);
}

#style-2::-webkit-scrollbar {
  width: 8px;
  background-color: rgb(45, 47, 51);
}

#style-2::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: rgb(25, 27, 31);
}
</style>