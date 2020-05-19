<template>
  <div>
    <div v-if="this.$store.state.musicInfo">
      <el-row style="height:50px;margin-left:5px;">
        <el-col :span="1" class="item">
          <el-avatar
            shape="square"
            :src="this.$store.state.musicInfo.songs[0].al.picUrl"
            class="music-pic"
          ></el-avatar>
        </el-col>
        <el-col :span="2">
          <span class="name-arname">{{this.$store.state.musicInfo.songs[0].name}}</span>
          <br />
          <span
            class="name-arname"
            style="color:rgb(124, 124, 124);"
          >{{this.$store.state.musicInfo.songs[0].ar[0].name}}</span>
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
          <span v-if="this.$store.state.playLists.length > 1" 
          @click="playLastMusic()" 
          class="el-icon-caret-left"></span>
        </el-col>
        <el-col class="item item-icon" :span="2">
          <span v-if="isPlaying" @click="stop" class="el-icon-video-pause"></span>
          <span v-else @click="play" class="el-icon-video-play"></span>
        </el-col>
        <el-col class="item item-icon" style="text-align:left;" :span="2">
          <span v-if="this.$store.state.playLists.length > 1" @click="playNextMusic()" class="el-icon-caret-right"></span>
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
    <audio ref="audio" v-if="getDataOk" autoplay :src="musicUrl" style="width:0;height:0;"></audio>
  </div>
</template>

<script>
export default {
  name: "play",
  inject: ["reloadPlay"],
  //  刷新组件
  data() {
    return {
      getDataOk: false, //是否获取到数据
      musicid: null, // 音乐id
      time: 0, //播放进度 单位s
      nowtime: 0, // 播放进度 格式化后的时间
      musicUrl: null, //音乐文件存储地址
      isPlaying: true, // 是否在播放
      timer: null, // 1s定时器 加载歌曲进度
      volume: 0.5, //音量
      maxVolume: 1, // 最大音量
      stepVolume: 0.1, //调节音量步长
      volumeImgUrl: require("../assets/volume.png") // 喇叭图片
    };
  },
  computed: {
    // 计算音乐总时长
    musicAllTime: function() {
      let ms = this.$store.state.musicInfo.songs[0].dt;
      return Math.round(ms / 1000);
    }
  },
  watch: {},
  created() {
    this.musicid = this.$route.query.id;
  },
  mounted() {
    this.musicid && this.getSongUrl();
    // 当audio就绪 初始化音量
    let volumeTimer = setInterval(() => {
      if (this.$refs.audio) {
        this.$refs.audio.volume = this.volume;
        clearInterval(volumeTimer);
      }
    }, 100);
  },
  methods: {
    //获取音乐存储地址
    getSongUrl() {
      this.$axios
        .get(`${this.$domain}/song/url?br=128000&id=${this.musicid}`)
        .then(res => {
          this.musicUrl = res.data.data[0].url;
          this.getDataOk = true;
          this.oneSecondTime();
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
      this.$refs.audio.pause();
      this.isPlaying = false;
      clearInterval(this.timer);
      this.timer = null;
    },
    //播放
    play() {
      this.$refs.audio.play();
      this.isPlaying = true;
      this.oneSecondTime();
    },
    // 手动改变进度条
    userChangeTime(e) {
      this.time = e;
      this.$refs.audio.currentTime = e;
      if (this.$refs.audio.paused) {
        this.$refs.audio.play();
      }
    },
    //定时器
    oneSecondTime() {
      let _this = this;
      this.timer = setInterval(() => {
        if (this.$refs.audio) {
          if (_this.$refs.audio.readyState) {
            _this.time += 1;
          }
          // 如果音乐播放结束 自动播放下一首音乐
          // 清除定时器
          if (this.$refs.audio.ended) {
            clearInterval(_this.timer);
            this.playNextMusic();
          }
        }
      }, 1000);
    },
    // 音量改变时
    volumeChange(e) {
      this.$refs.audio.volume = e;
    },
    // 获取上一首音乐
    getLastMusic() {
      let nowId = this.musicid;
      let lists = this.$store.state.playLists;
      for (let i = 0; i < lists.length; i++) {
        if (lists[i].id == nowId) {
          if (i == 0) {
            return lists[lists.length - 1].id;
          } else {
            return lists[i - 1].id;
          }
        }
      }
    },
    //获取下一首音乐
    getNextMusic() {
      let nowId = this.musicid;
      let lists = this.$store.state.playLists;
      for (let i = 0; i < lists.length; i++) {
        if (lists[i].id == nowId) {
          if (i == lists.length - 1) {
            return lists[0].id;
          } else {
            return lists[i + 1].id;
          }
        }
      }
    },
    // 播放下一首音乐
    playNextMusic() {
      let id = this.getNextMusic();
      this.$router.push(`/playDetail?id=${id}`);
      // 更新音乐ID
      this.$store.commit("getMusicId", id);
      this.reloadPlay();
    },
    // 播放上一首音乐
    playLastMusic() {
      let id = this.getLastMusic();
      this.$router.push(`/playDetail?id=${id}`);
      // 更新音乐ID
      this.$store.commit("getMusicId", id);
      this.reloadPlay();
    },
    // 点击播放音乐列表音乐
    playListsMusic(id) {
      this.$router.push(`/playDetail?id=${id}`);
      this.$store.commit("getMusicId", id);
      this.reloadPlay();
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
.name-arname {
  height: 25px;
  line-height: 25px;
  font-size: 10px;
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
.scrollbar-main {
  position: relative;
  height: 300px;
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