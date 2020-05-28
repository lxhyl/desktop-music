<template>
  <div>
     <div>
        <el-row v-for="(item,index) in playLists" 
        :key="index"
        class="row container"
        @click.native="openLists(item.id)"
        >
            <el-col :span="2">
                <img loading="lazy" :src="item.coverImgUrl+'?param=50y50'">
            </el-col>
            <el-col class="name" :span="12">
                {{item.name}}
            </el-col>
            <el-col class="num" :span="2">
                {{item.trackCount}}
            </el-col>
            <el-col class="by" :span="8">
             <span>by</span>
            {{item.creator.nickname}}
            </el-col>
        </el-row>
    </div>
    <p v-show="loading" class="loading">
      <span class="el-icon-loading"></span>加载中...
    </p>
  </div>
</template>

<script>
export default {
  name: "searchPlayLists",
  data() {
    return {
      keywords: "",
      playLists: [],
      loading: true
    };
  },
  created() {
    this.keywords = this.$route.query.keyword;
  },
  mounted() {
    this.keywords && this.getPlayList();
  },
  methods: {
    getPlayList() {
      this.$axios
        .get(`${this.$domain}/search?keywords=${this.keywords}&type=1000`)
        .then(res => {
          this.playLists = res.data.result.playlists;
          this.loading = false;
        });
    },
    openLists(id){
          this.$router.push(`/playlist?id=${id}`);
    }
  }
};
</script>

<style scoped>

.container:nth-child(odd) {
  background-color: #222225;
}
.row{
    height: 50px;
    margin:0 10px;
}
img {
    height: 40px;
    width: 40px;
}
.name{
    line-height: 40px;
    font-size: 13px;
}
.num{
    font-size: 11px;
    line-height: 40px;
    color:rgb(124, 124, 124);
}
.by{
       font-size: 12px;
    line-height: 40px;
    color:rgb(124, 124, 124);
}

</style>