<template>
  <div>
    <div class="container">
      <div class="item" 
      v-for="(item,index) in list"
      @click="openAlbum(item.id)" 
      :key="'al'+index">
        <img :src="item.picUrl+'?param=150y150'" loading="lazy" />
        <p>{{item.name}}</p>
        <p style="color:rgb(124, 124, 124)">{{item.artist.name}}</p>
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
    this.getAlbum();
  },
  methods: {
    getAlbum() {
      this.$axios
        .get(`${this.$domain}/top/album?offset=0&limit=60`)
        .then(res => {
          this.list = res.data.albums;
        })
        .catch();
    },
    openAlbum(id){
     
      this.$router.push(`/album?id=${id}`)
    }
  }
};


</script>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.item {
  width: 150px;
  display: inline-block;
  margin: 15px;
}
.item > img {
  width: 150px;
  height: 150px;
  display: inline-block;
}
.item > p {
  margin: 0;
  line-height: 20px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>