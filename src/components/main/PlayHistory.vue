<template>
  <div>
    <div v-if="lists.length > 0">
      <el-row class="title-elrow">
        <el-col :span="18">
          历史记录
          <span style="font-size:12px;color: rgb(124, 124, 124);">（数据存储于浏览器💽）</span>
        </el-col>
        <el-col :span="6">
          <el-button
            type="text"
            @click.native="getPlayHistory"
            size="mini"
            icon="el-icon-refresh"
          >刷新</el-button>

          <el-button
            type="text"
            @click.native="deletePlayHistory"
            size="mini"
            icon="el-icon-delete"
          >删除所有记录</el-button>
        </el-col>
      </el-row>
      <el-row class="li-container">
        <el-col :span="1" class="li-num">序号</el-col>
        <el-col :span="7" class="li-name" style="color:rgb(124, 124, 124);">音乐名</el-col>
        <el-col :span="7" class="li-name" style="color:rgb(124, 124, 124);">歌手</el-col>
        <el-col :span="5" class="li-name" style="color:rgb(124, 124, 124);">上次播放时间</el-col>
      </el-row>
      <el-row
        v-for="(item,index) in lists"
        :key="index"
        @click.native="playSong(item.id)"
        class="li-container"
      >
        <el-col :span="1" class="li-num">{{index + 1}}</el-col>
        <el-col :span="7" class="li-name">{{item.name}}</el-col>
        <el-col :span="7" class="li-name">{{item.ar}}</el-col>
        <el-col :span="5" class="li-name">{{item.listenTime | toTime}}</el-col>
      </el-row>
    </div>
    <div v-else>
      <el-row class="title-elrow">
        <el-col :span="20">暂无记录，试试这些新音乐吧</el-col>
        <el-col :span="4">
          <el-button
            type="text"
            @click.native="getPlayHistory"
            size="mini"
            icon="el-icon-refresh"
          >刷新</el-button>
        </el-col>
      </el-row>
      <div class="newsongs-container">
        <el-card
          v-for="(item,index) in newSongs"
          :key="'newSong-'+ index"
          class="card"
          @click.native="playSong(item.id)"
        >
          <img :src="item.picUrl+'?param=100y150'" loading="lazy" />
          <p class="newsong-name">{{item.name}}</p>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ["reloadPlay"],
  data() {
    return {
      lists: [],
      newSongs: [] //推荐新歌
    };
  },
  created() {
    this.getPlayHistory();
  },
  methods: {
    getPlayHistory() {
      let arr = JSON.parse(localStorage.getItem("playHistory"));
      if (arr) {
        this.lists = arr;
      } else {
        this.lists = [];
        this.$axios
          .get(`${this.$domain}/personalized/newsong`)
          .then(res => {
            this.newSongs = res.data.result;
          })
          .catch(() => {});
      }
    },
    deletePlayHistory() {
      console.log(111);
      localStorage.removeItem("playHistory");
      this.getPlayHistory();
    },
    playSong(id) {
      this.$router.push(`/playDetail?id=${id}`);
      // 更新音乐ID 播放列表
      this.$store.commit("getMusicId", id);
     
      this.$store.commit("getPlayLists", []);
      //关闭fm模式
      this.$store.commit("setFm", false);
      this.reloadPlay();
    },

  }
};
</script>

<style scoped>
.title-elrow {
  margin: 20px;
}
.container {
  margin-bottom: 20px;
}
.li-container:nth-child(odd) {
  background-color: #222225;
}
.li-container {
  height: 25px;
  line-height: 25px;
  margin: 0 15px;
}
.li-num {
  font-size: 8px;
  color: rgb(124, 124, 124);
  text-align: center;
}
.li-name {
  font-size: 10px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.newsongs-container {
  display: flex;
  flex-wrap: wrap;
  margin: 20px;
}
.card {
  margin-right: 10px;
  margin-top: 30px;
}
.newsong-name {
  font-size: 12px;
  margin: 0;
  width: 100px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>