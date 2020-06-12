<template>
  <div>
    <div class="songs-main">
      <el-row>
        <el-col
          v-for="(item,index) in title"
          :key="'title' + index"
          :span="2"
          :class="item.class"
          @click.native="changeType(item.type)"
        >{{item.name}}</el-col>
      </el-row>
    </div>
    <div v-if="getDataOk">
      <el-row
        v-for="(item,index) in list"
        :key="'song'+index"
        @click.native="playSongs(item.id)"
        class="song-item"
      >
        <el-col :span="1" class="song-item-index">{{index+1}}</el-col>
        <el-col :span="2" class="song-item-img">
          <img :src="item.album.picUrl+'?param=40y40'" loading="lazy" />
        </el-col>
        <el-col :span="10" class="song-item-text" style="color:white;">{{item.name}}</el-col>
        <el-col :span="3" class="song-item-text">{{item.artists[0].name}}</el-col>
        <el-col :span="4" class="song-item-text">{{item.album.name}}</el-col>
        <el-col :span="4" class="song-item-time">{{item.duration | songToTime}}</el-col>
      </el-row>
    </div>
    <p v-else class="loading">
      <span class="el-icon-loading"></span>加载中...
    </p>
  </div>
</template>

<script>
export default {
      inject: [ "reloadPlay"],
  data() {
    return {
      type: 0,
      getDataOk: false,
      list: [] //新歌
    };
  },
  computed: {
    title: function() {
      let title = [
        {
          name: "全部",
          type: 0,
          class: "no-choose"
        },
        {
          name: "华语",
          type: 7,
          class: "no-choose"
        },
        {
          name: "欧美",
          type: 96,
          class: "no-choose"
        },
        {
          name: "日本",
          type: 8,
          class: "no-choose"
        },
        {
          name: "韩国",
          type: 16,
          class: "no-choose"
        }
      ];
      title.forEach(item => {
        if (item.type == this.type) {
          item.class = "choose";
        }
      });
      return title;
    }
  },
  created() {
    this.getNewSongs(this.type);
  },
  methods: {
    getNewSongs(type) {
      this.$axios
        .get(`${this.$domain}/top/song?type=${type}`)
        .then(res => {
          this.list = res.data.data;
          this.getDataOk = true;
        })
        .catch();
    },
    changeType(e) {
      this.getDataOk = false;
      this.type = e;
      this.getNewSongs(e);
    },
    playSongs(id) {
      this.$router.push(`/playDetail?id=${id}`);
      // 更新音乐ID
      this.$store.commit("getMusicId", id);
      //关闭fm模式
      this.$store.commit("setFm", false);
      this.$store.commit("getPlayLists", []);
      // 刷新PLAY组件
      this.reloadPlay();
    }
  }
};
</script>

<style scoped>
.songs-main {
  margin: 10px;
}
.choose {
  color: rgb(184, 37, 37);
}
.no-choose {
  color: rgb(173, 175, 178);
}
.loading {
  text-align: center;
  font-size: 16px;
}
.song-item {
  width: 100%;
}
.song-item:nth-child(2n+1) {
  background-color: #222225;
}
.song-item-index {
  font-size: 10px;
  line-height: 60px;
  color: rgb(124, 124, 124);
  text-align: center;
}
.song-item-img {
  line-height: 60px;
}
.song-item-img > img {
  position: relative;
  top: 10px;
  width: 40px;
  height: 40px;
}
.song-item-text {
  font-size: 12px;
  line-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: rgb(124, 124, 124);
}
.song-item-time {
  font-size: 11px;
  text-align: center;
  line-height: 60px;
  color: rgb(124, 124, 124);
}
</style>