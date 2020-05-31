<template>
  <div>
    <div v-if="getDataOk">
     
      <div v-if="lists.length > 0" class="container">
        <p>总{{lists.length}}首</p>
        <el-row class="li-container">
          <el-col :span="1" class="li-num">序号</el-col>
          <el-col :span="7" class="li-name" style="color:rgb(124, 124, 124);">音乐标题</el-col>
          <el-col :span="7" class="li-name" style="color:rgb(124, 124, 124);">歌手</el-col>
          <el-col :span="7" class="li-name" style="color:rgb(124, 124, 124);">专辑</el-col>
          <el-col :span="2" class="li-name" style="text-align:center;color:rgb(124, 124, 124);">时长</el-col>
        </el-row>
        <el-row v-for="(item,index) in lists"
         @click.native="playSong(item.song.id)"
         :key="index" 
         class="li-container">
          <el-col :span="1" class="li-num">{{index + 1}}</el-col>
          <el-col :span="7" class="li-name">{{item.song.name}}</el-col>
          <el-col :span="7" class="li-name">{{item.song.ar[0].name}}</el-col>
          <el-col :span="7" class="li-name">{{item.song.al.name}}</el-col>
          <el-col :span="2" class="li-name" style="text-align:center;">{{item.song.dt | songToTime}}</el-col>
        </el-row>
      </div>
      <div v-else class="notListen">
          <p>本周暂无听歌记录,推荐这些音乐给你吧！</p>
          <div class="newsongs-container">
             <el-card v-for="(item,index) in newSongs"
             :key="'newSong-'+ index"
             class="card"
             @click.native="playSong(item.id)"
             >
             <img :src="item.picUrl+'?param=100y150'"
             loading="lazy"
             >
             <p class="newsong-name">{{item.name}}</p>
             </el-card>
          </div>
      </div>
    </div>
    <p v-else  class="loading">
        <span class="el-icon-loading"></span>加载中...
    </p>
  </div>
</template>

<script>
export default {
  name: "playHistory",
    inject: ["reloadPlay"],
  data() {
    return {
      uid: null, //用户id
      getDataOk: false, //
      lists: [], //播放历史列表
      newSongs:[],//推荐新歌
    };
  },
  created() {
    this.uid = localStorage.getItem("userid");
  },
  mounted() {
    this.uid && this.getList();
  },
  methods: {
    getList() {
      this.$axios
        .get(`${this.$domain}/user/record?uid=${this.uid}&type=1`)
        .then(res => {
          this.lists = res.data.weekData;
          this.getDataOk = true;
          if(this.lists.length  > 0){
              this.$axios.get(`${this.$domain}/personalized/newsong`)
              .then(res => {
                  this.newSongs = res.data.result;
              })
              .catch(()=>{})
          }
        })
        .catch(()=>{
          this.$message({
          showClose: true,
          message: "检查下网络吧",
          type: "warning",
          duration: 2000
        }); 
        })
    },
    //播放音乐
    playSong(id){
      this.$router.push(`/playDetail?id=${id}`);
      // 更新音乐ID
      this.$store.commit("getMusicId", id);
      //关闭fm模式
      this.$store.commit("setFm", false);
      this.reloadPlay();
    }
  }
};
</script>

<style scoped>
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
.loading {
  text-align: center;
  font-size: 16px;
}
.notListen{
    margin: 20px;
}
.newsongs-container{
    display: flex;
    flex-wrap: wrap;
}
.card{
    margin-right: 10px;
    margin-top:30px;
}
.newsong-name{
    font-size: 12px;
    margin: 0;
    width: 100px;
    text-align: center;
     overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>