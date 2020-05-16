<template>
  <div>play{{musicid}}</div>
</template>

<script>
export default {
  name: "play",
  inject: ["reload"],
  // 监听路由  刷新组件
  watch: {
    $route(to, from) {
      if (to.fullPath != from.fullPath) {
        this.reload();
      }
    }
  },
  data() {
    return {
      musicid: null
    };
  },
  created() {
    this.musicid = this.$route.query.id;
  }
};
</script>

<style scoped>
</style>