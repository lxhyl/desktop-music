<template>
  <div>
    
    <div v-if="this.$store.state.musicInfo">
      <el-row style="height:50px;">
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
          :span="2"
        >{{nowtime}}</el-col>
        <el-col :span="9" class="item">
          <el-slider v-model="time" :format-tooltip="formatTooltip" :max="musicAllTime"></el-slider>
        </el-col>
        <el-col
          style="color:rgb(124, 124, 124);font-size:10px;"
          class="item"
          :span="1"
        >{{this.$store.state.musicInfo.songs[0].dt | songToTime}}</el-col>
        <el-col class="item" :span="3">3</el-col>
        <el-col class="item" :span="2">1</el-col>
        <el-col class="item" :span="2">1</el-col>
        <el-col class="item" :span="2">1</el-col>
      </el-row>
    </div>
     <audio v-if="getDataOk" :src="musicUrl" 
     style="width:0;height:0;"></audio>
  </div>
</template>

<script>
export default {
  name: "play",
  inject: ["reloadPlay"],
  // 监听路由  刷新组件
  data() {
    return {
      getDataOk: false, //是否获取到数据
      musicid: null, // 音乐id
      time:0,//播放进度 单位s
      nowtime: 0, // 播放进度 格式化后的时间
      musicUrl:null,//音乐文件存储地址
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
  },
  methods: {
    //获取音乐存储地址
    getSongUrl() {
      this.$axios
        .get(`${this.$domain}/song/url?br=128000&id=${this.musicid}`)
        .then(res => {
          this.musicUrl = res.data.data[0].url;
          this.getDataOk = true;
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
      this.nowtime = str
      return str;
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
</style>