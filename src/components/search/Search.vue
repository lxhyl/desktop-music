<template>
  <div>
    <div v-if="getDataOk">
      <div v-if="searchResult.albums && searchResult.albums.length > 0">
        <div v-for="(item,index) in searchResult.albums" :key="index" @click="search(item.name)">
          <div class="item-index">{{index + 1}}</div>
          <div class="item-main">
            <p class="item-name">{{item.name}}</p>
            <p>{{item.artist.name}}</p>
          </div>
        </div>
      </div>
      <p v-else>暂无数据</p>
    </div>
    <p v-else style="text-align:center;">加载中...</p>
  </div>
</template>

<script>
export default {
  name: "search",
  data() {
    return {
      searchKey: this.$store.state.searchKey, //搜索关键词
      getDataOk: false, //是否拿到数据
      searchResult: {} //搜索结果
    };
  },
  created() {},
  mounted() {
    this.getSearch();
  },
  methods: {
    getSearch() {
      this.$axios
        .get(`${this.$domain}/search/suggest?keywords=${this.searchKey}`)
        .then(res => {
          this.searchResult = res.data.result;
          this.getDataOk = true;
        })
           .catch(() => {

        });
    },
    search(e) {
      this.$store.commit("changeSearchPopover", false);
      this.$router.push(`/search?keyword=${e}`);
    }
  }
};
</script>

<style scoped>
.item-index {
  width: 30px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  float: left;
}
.item-main {
  margin-left: 30px;
}
.item-main > p {
  width: 280px;
  height: 20px;
  margin: 0;
  line-height: 20px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item-name {
  color: white;
}
</style>