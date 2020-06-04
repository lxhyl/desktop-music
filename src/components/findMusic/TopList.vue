<template>
  <div>
    <div class="container">
      <div class="item" 
      v-for="(item,index) in list" 
      :key="'top'+index"
      @click="goToList(item.id)"
      >
        <img :src="item.coverImgUrl"  loading="lazy"/>
        <p>{{item.name}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    };
  },
  created() {
    this.getTopLists();
  },
  methods: {
    getTopLists() {
      this.$axios
        .get(`${this.$domain}/toplist`)
        .then(res => {
          this.list = res.data.list;
        })
        .catch(() => {});
    },
    goToList(id){
       this.$router.push(`/playlist?id=${id}`);
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}
.item {
  width: 120px;
  height: 140px;
  margin: 15px;
}
.item > img {
  width: 120px;
  height: 120px;
}
.item > p {
  margin: 0;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>