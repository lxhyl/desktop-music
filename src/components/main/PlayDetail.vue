<template>
  <div>播放详情页{{musicid}}</div>
</template>

<script>
export default {
  name: "playDetail",
  inject: ["reload"],
  // 监听路由  刷新组件
  watch: {
    $route(to, from) {
      if (to.fullPath !== from.fullPath) {
        this.reload();
      }
    }
  },
  data() {
    return {
      musicid: null,
      musicInfo:null,
    };
  },
  created() {
    this.musicid = this.$route.query.id;
  },
  mounted() {
    this.musicid && this.getSongDetail();
  },
  methods: {
    getSongDetail() {
      this.$axios
        .get(`${this.$domain}/song/detail?ids=${this.musicid}`)
        .then(res => {
         //更新VUEX的音乐信息
          this.$store.commit('getMusicInfo',res.data);
          this.musicInfo = res.data;
          // console.log(this.musicInfo);
        });
    }
  }
};
</script>

<style scoped>
</style>