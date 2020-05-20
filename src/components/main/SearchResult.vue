<template>
  <div>搜索结果</div>
</template>

<script>
export default {
  name: "searchResult",
  inject: ["reload"],
   // 监听路由  刷新组件
  watch: {
    $route(to, from) {
      if (to.fullPath != from.fullPath) {
        this.reload();
      }
    }
  },
  created() {
    console.log("111");
  }
};
</script>

<style scoped>
</style>