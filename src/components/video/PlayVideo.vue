<template>
  <div style="position: relative;">
    <div v-if="videoDetail && videoInfo">
      <div>
        <video
          width="810"
          height="450"
          controls
          autoplay
          :poster="videoDetail.coverUrl"
          :src="url"
        >{{vid}}</video>
      </div>
      <el-row class="handle">
        <el-col :span="15" class="title">{{videoDetail.title}}</el-col>
        <el-col :span="3">
          <button class="share el-icon-star-on" @click="likeVideo">点赞{{videoInfo.likedCount}}</button>
        </el-col>
        <el-col :span="3">
          <button
            class="share el-icon-folder-opened"
            @click="scVideo"
          >收藏{{videoDetail.subscribeCount}}</button>
        </el-col>
        <el-col :span="3">
          <button class="share el-icon-share" @click="share">分享{{videoInfo.shareCount}}</button>
        </el-col>
      </el-row>
    </div>
    <p v-else>加载中</p>
    <div class="red-line"></div>
    <p v-if="videoInfo" style="margin:10px 20px;">
      评论({{videoInfo.commentCount}})
      <span class="el-icon-bottom"></span>
    </p>
    <div v-if="comments" v-infinite-scroll="getComments" class="comment-container">
      <div v-for="(item,index) in comments" :key="'comment-'+index" class="comment-item">
        <div>
          <div class="item-img">
            <img :src="item.user.avatarUrl + '?param=50y50'" loading="lazy" />
          </div>
          <div class="item-main">
            <p>
              <span class="item-user">{{item.user.nickname}}:</span>
              {{item.content}}
            </p>
            <p
              v-if="item.beReplied.length>0"
              style="margin-top:0;line-height:30px;"
              class="bereplied"
            >
              <span class="item-user">@{{item.beReplied[0].user.nickname}}:</span>
              {{item.beReplied[0].content}}
            </p>
            <el-row class="item-elrow">
              <el-col class="item-time" :span="22">{{item.time | toTime}}</el-col>
              <el-col
                v-if="item.liked"
                :span="2"
                class="item-liked"
                @click.native="cancalLikeComment(item.commentId,index)"
              >已赞({{item.likedCount}})</el-col>
              <el-col
                v-else
                :span="2"
                class="item-not-liked"
                @click.native="likeComment(item.commentId,index)"
              >赞({{item.likedCount}})</el-col>
            </el-row>
          </div>
        </div>
        <p class="border-bottom"></p>
      </div>
    </div>
    <p class="loading" v-show="loading">
      <span class="el-icon-loading"></span>
      加载中
    </p>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  name: "playVideo",
  watch: {
    $route(to, from) {
      if (to.fullPath !== from.fullPath) {
        this.reload();
      }
    }
  },
  data() {
    return {
      vid: null, //视频id
      url: null, //视频地址
      videoDetail: null, // 视频信息
      videoInfo: null, //点赞等信息
      offset: 0, //评论分页
      comments: [], //评论
      commentsNowNum: 0, //以获取的评论总数
      sc: false, //是否收藏
      loading:false,//
    };
  },
  created() {
    this.vid = this.$route.query.vid;
    this.getVideoUrl(); //获取视频地址
    this.getVideoDetail(); //获取视频详情
    this.getVideoInfo(); //点赞等数据
  },
  mounted() {
    let timer = setInterval(() => {
      if (this.videoInfo) {
        if (this.commentsNowNum < this.videoInfo.commentCount) {
          this.getComments();
          clearInterval(timer);
          timer = null;
        }
      }
    }, 200);
  },
  methods: {
    getVideoUrl() {
      this.$axios
        .get(`${this.$domain}/video/url?id=${this.vid}`)
        .then(res => {
          this.url = res.data.urls[0].url;
        })
        .catch();
    },
    //详情
    getVideoDetail() {
      this.$axios
        .get(`${this.$domain}/video/detail?id=${this.vid}`)
        .then(res => {
          this.videoDetail = res.data.data;
        })
        .catch(() => {});
    },
    //点赞等数据
    getVideoInfo() {
      this.$axios
        .get(`${this.$domain}/video/detail/info?vid=${this.vid}`)
        .then(res => {
          this.videoInfo = res.data;
          this.getDataOk = true;
        })
        .catch(() => {});
    },
    getComments() {
      this.loading = false;
      if (this.videoInfo) {
        if (this.commentsNowNum < this.videoInfo.commentCount) {
          this.$axios
            .get(
              `${this.$domain}/comment/video?&id=${this.vid}&offset=${this.offset}`
            )
            .then(res => {
              this.comments = this.comments.concat(res.data.comments);
              this.offset += 1;
              this.commentsNowNum += 20;
              this.loading = true;
            })
            .catch(() => {});
        }
      }
    },
    //点赞评论
    likeComment(cid, index) {
      this.$axios
        .get(
          `${this.$domain}/comment/like?id=${this.vid}&cid=${cid}&type=5&t=1`
        )
        .then(()=> {
          this.comments[index].liked = true;
          this.comments[index].likedCount += 1;
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: "失败，检查下网络吧",
            type: "warning",
            duration: 2000
          });
        });
    },
    //取消点赞
    cancalLikeComment(cid, index) {
      this.$axios
        .get(
          `${this.$domain}/comment/like?id=${this.vid}&cid=${cid}&type=5&t=0`
        )
        .then(() => {
          this.comments[index].liked = false;
          this.comments[index].likedCount -= 1;
        })
        .catch(() => {
          this.$message({
            showClose: false,
            message: "失败，检查下网络吧",
            type: "warning",
            duration: 200
          });
        });
    },
    //视频点赞 取消
    likeVideo() {
      let t; //取消or点赞
      t = this.videoInfo.liked ? 0 : 1;
      this.$axios
        .get(`${this.$domain}/resource/like?t=${t}&type=5&id=${this.vid}`)
        .then(() => {
          if (t) {
            this.videoInfo.likedCount += 1;
            this.videoInfo.liked = true;
          } else {
            this.videoInfo.likedCount -= 1;
            this.videoInfo.liked = false;
          }
        });
    },
    //收藏视频
    scVideo() {
      if (this.sc) {
        return;
      }
      this.$axios
        .get(`${this.$domain}/video/sub?id=${this.vid}&t=1`)
        .then(() => {
          this.videoDetail.subscribeCount += 1;
          this.sc = true;
          this.$message({
            showClose: false,
            message: "收藏成功！可在我的收藏查看",
            type: "warning",
            duration: 2000
          });
        });
    },
    //分享到动态
    share() {
      this.$message({
        showClose: true,
        message: "暂不支持分享",
        type: "warning",
        duration: 2000
      });
    }
  }
};
</script>

<style scoped>
video {
  z-index: 99;
  outline: none;
}
.red-line{
  margin:0 10px;
  width: 98%;
  height: 1px;
  background:rgb(184, 37, 37);
  
}
.share {
  border: none;
  outline: none;
  height: 25px;
  border-radius: 10px;
  font-size: 11px;
  color: white;
  background-color: rgb(184, 37, 37);
}
.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.handle {
  margin: 10px 10px;
}
.comment-container {
  width: 780px;
  margin-left: 20px;
  display: flex;
  flex-wrap: wrap;
}
.comment-item {
  width: 780px;
  position: relative;
  margin: 5px;
}
.border-bottom {
  background-color: rgb(54, 56, 60);
  height: 1px;
  margin: 5px;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.item-img {
  float: left;
  height: 50px;
  width: 50px;
}
.item-img > img {
  height: 40px;
  width: 40px;
  border-radius: 100%;
}
.item-main {
  margin-left: 50px;
}
.item-main > p {
  margin: 0;
  font-size: 12px;
  line-height: 20px;
}
.item-user {
  color: #409eff;
}
.bereplied {
  margin: 0;
  line-height: 30px;
  background-color: rgb(54, 56, 60);
}
.item-elrow {
  height: 20px;
  line-height: 30px;
  font-size: 11px;
}
.item-time {
  font-size: 11px;
  color: rgb(124, 124, 124);
}
.item-liked {
  font-size: 11px;
  color: rgb(184, 37, 37);
}
.item-not-liked {
  font-size: 11px;
}
.loading{
    text-align: center;
}
</style>