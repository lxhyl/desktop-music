<template>
  <div>
    <div class="contaner">
       <div 
       v-for="(item,index) in lists"
       :key="index"
       class="item"
       @click="playVideo(item.vid)"
       >
       <div class="item-img">
           <img :src="item.coverUrl+'?param=210y140'" loading="lazy" />
       </div>
       <p class="title">{{item.title}}</p>
       <p class="creator">{{item.creator[0].userName}}</p>
       </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      keyword: "",
      lists: []
    };
  },
  created() {
    this.keyword = this.$route.query.keyword;
  },
  mounted() {
    this.getVideo(this.keyword);
  },
  methods: {
    getVideo(e) {
      this.$axios
        .get(`${this.$domain}/search?keywords=${e}&type=1014`)
        .then(res => {
          this.lists = res.data.result.videos;
    
        })
        .catch();
    },
    playVideo(e){
      
           this.$router.push(`/playVideo?vid=${e}`);
    }
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  display: flex;
  
  flex-wrap: nowrap;
  clear:both;
  text-align:center;
}
.item {
  width: 210px;
  height: 200px;
  margin-right: 0;
  margin: 10px 30px;
  display: inline-block;
}
.item-img{
    width: 210px;
    height: 140px;
}
.item-img > img {
    width: 100%;
    height: 100%;
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
</style>