<template>
  <div></div>
</template>

<script>
export default {
  data() {
      return {

      }
  },
  created() {
      this.getHotSearch();
  },
  mounted() {},
  methods: {
    getHotSearch() {
      this.$axios.get(`${this.$domain}/search/hot/detail`).then(res => {
        console.log(res);
      });
    }
  }
};
</script>

<style scoped>
</style>