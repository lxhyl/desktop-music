<template>
  <div>
    <div class="container" v-infinite-scroll="load" infinite-scroll-immediate="false">
      <div
        class="item"
        v-for="(item,index) in list"
        @click="playVideo(item.data.vid)"
        :key="'video'+index"
      >
        <img :src="item.data.coverUrl+'?param=210y140'" 
        alt="图片加载失败"
        loading="lazy" />
        <p class="title">{{item.data.title}}</p>
        <p class="creator">By: {{item.data.creator.nickname}}</p>
      </div>
    </div>
    <p v-show="loadInfo" class="loading">加载中...</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      defalutId: 59106, //默认视频组id;
      list: [], //视频列表
      loadInfo: false //
    };
  },
  watch: {
    list: function(n) {
      if (n.length > 200) {
        this.list.splice(0, 49);
      }
    }
  },
  created() {
    let id = this.$route.query.vid;
    if (id) {
      this.defalutId = id;
    }
    this.getVideos();
  },
  mounted() {},
  methods: {
    getVideos() {
      this.loadInfo = true;
      this.$axios
        .get(
          `${this.$domain}/video/group?id=${
            this.defalutId
          }&timestamp=${new Date().getTime()}`
        )
        .then(res => {
          this.list = this.list.concat(res.data.datas);
          this.loadInfo = false;
        })
        .catch(() => {});
    },
    load() {
      this.getVideos();
    },
    playVideo(id) {
      this.$router.push(`/playVideo?vid=${id}`);
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
}
.item {
  width: 210px;
  height: 200px;
  margin: 10px 30px;
}
.item > img {
  width: 210px;
  height: 140px;
}
.title {
  margin: 0;
  width: 210px;
  height: 20px;
  font-size: 13px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.creator {
  margin: 0;
  height: 20px;
  line-height: 20px;
  font-size: 11px;
  color: rgb(124, 124, 124);
}
.loading {
  width: 100%;
  text-align: center;
}
</style>