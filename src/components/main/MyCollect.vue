<template>
  <div>
    <div class="album">
      <p>
        收藏的专辑
        <span class="el-icon-arrow-right"></span>
      </p>
      <div v-if="album.length > 0">
        <el-row
          v-for="(item,index) in album"
          :key="'album'+index"
          class="album-item"
          @click.native="openAlbum(item.id)"
        >
          <el-col :span="2" class="album-item-pic">
            <img :src="item.picUrl+'?param=40y40'" loading="lazy" />
          </el-col>
          <el-col class="album-item-name" :span="12">{{item.name}}</el-col>
          <el-col class="album-item-art" :span="6">{{item.artists[0].name}}</el-col>
          <el-col class="album-item-art" :span="3">{{item.size}}首</el-col>
          <el-col :span="1" class="album-item-art">
            <span class="el-icon-arrow-right"></span>
          </el-col>
        </el-row>
      </div>
      <p v-else class="album-item-art">你暂时没有收藏的专辑</p>
    </div>
    <div class="album">
      <p>
        收藏的视频
        <span class="el-icon-arrow-right"></span>
      </p>
      <div class="video-container" v-if="videos.length > 0">
        <div v-for="(item,index) in videos"
        @click="playVideo(item.vid)"
         :key="'video'+index" class="video-item">
          <div class="item-play-icon">
              <span class="el-icon-video-play"></span>
          </div>
          <img :src="item.coverUrl" />
          <p>{{item.title}}</p>
          <p style="color:rgb(124, 124, 124);">by:{{item.creator[0].userName}}</p>
        </div>
      </div>
       <p v-else class="album-item-art">你暂时没有收藏的视频</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      videos: [], //收藏的视频
      album: [] //收藏的专辑
    };
  },
  created() {
    this.getVideo();
    this.getAlbum();
  },
  methods: {
    getVideo() {
      this.$axios
        .get(`${this.$domain}/mv/sublist`)
        .then(res => {
          this.videos = res.data.data;
        })
        .catch();
    },
    getAlbum() {
      this.$axios.get(`${this.$domain}/album/sublist`).then(res => {
        this.album = res.data.data;
      });
    },
    openAlbum(id) {
      this.$router.push(`/album?id=${id}`);
    },
    playVideo(id){
        
        this.$router.push(`/playVideo?vid=${id}`);
    }
  }
};
</script>

<style scoped>
.album {
  margin: 20px;
}
.album-item {
  height: 60px;
  position: relative;
  line-height: 60px;
}
.album-item:nth-child(2n + 1) {
  background-color: #222225;
}
.album-item-pic {
  height: 60px;
}
.album-item-pic > img {
  height: 40px;
  width: 40px;
  position: absolute;
  top: 10px;
}
.album-item-name {
  font-size: 12px;
}
.album-item-art {
  font-size: 12px;
  color: rgb(124, 124, 124);
}
.video-container {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}
.video-item {
  position: relative;
  width: 210px;
  height: 180px;
  margin: 20px;
  z-index: 10;
}
.item-play-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 210px;
  height: 180px;
  opacity: 0;
  z-index: 100;
  font-size: 50px;
  text-align: center;
}
.item-play-icon > span{
 
 line-height: 140px;
}
.item-play-icon:hover{
 opacity: 1;
}
.video-item > img {
  width: 210px;
  height: 140px;
}
.video-item > p {
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>