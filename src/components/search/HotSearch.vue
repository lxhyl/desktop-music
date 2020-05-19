<template>
  <div class="scrollbar-main" id="style-2">
     
     <span @click="colseSearch" 
     style="color:white;font-size:20px;"
     class="el-icon-close close"
     ></span>
    <div v-if="history.length > 0" class="history">
      <el-row>
        <el-col :span="6">播放历史</el-col>
        <el-col :span="18">
          <span class="el-icon-delete"></span>
        </el-col>
      </el-row>
    </div>
    <div class="hot-search">
      <p>热搜榜</p>
      <div v-for="(item,index) in hotSearch" :key="index" class="item">
        <span class="item-index">{{index + 1}}</span>
        <div class="item-main">
          <p  >
            <span class="item-search-word">{{item.searchWord}}</span>
            <span class="item-score">{{item.score}}</span>
            <span class="item-icon" v-if="item.iconType" >
              <img  :src="item.iconUrl" />
              </span>
          </p>
          <p class="item-content">
            {{item.content}}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      history: [], //搜索历史
      hotSearch: [] //热搜
    };
  },
  created() {
    this.getHotSearch();
  },
  mounted() {},
  methods: {
    //拿到热搜列表
    getHotSearch() {
      this.$axios.get(`${this.$domain}/search/hot/detail`).then(res => {
        this.hotSearch = res.data.data
      });
    },
    deleteHistory() {
      console.log("111");
    },
    colseSearch() {
      this.$store.commit("changeSearchPopover", false);
    }
  }
};
</script>

<style scoped>
p{
  margin: 0;
}
.close{
  width: 280px;
  text-align: right;
  right: 0;
}
.item{
  height: 40px;
  margin:10px 0;
}
.item-index{
  height: 40px;
  line-height: 40px;
  width:30px;
  float: left;
}
.item-main{
  height: 40px;
  margin-left:30px;
}
.item-main > p{
  height: 20px;
  line-height: 20px;
}
.item-icon{
  height: 20px;
  width:20px;
  margin-left:5px;
}
.item-icon > img{
  height: 10px;
  width: 20px;
}
.item-content{
  font-size: 11px;
   overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item-search-word{
  height: 20px;
  line-height: 20px;
  color:white;
  font-size: 12px;
   overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item-score{
  margin-left:10px;
  font-size: 10px;
   overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.scrollbar-main {
  position: relative;
  height: 400px;
  width: 300px;
  overflow-y: scroll;
  overflow-x: hidden;
}

#style-2::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: rgb(45, 47, 51);
}

#style-2::-webkit-scrollbar {
  width: 8px;
  background-color: rgb(45, 47, 51);
}

#style-2::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: rgb(25, 27, 31);
}
</style>