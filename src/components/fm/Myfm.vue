<template>
  <div>
    <div class="my-dj">
      <p>
        我订阅的电台
        <span style="color: rgb(124, 124, 124);">({{djlist.length + 1}})</span>
      </p>
      <div v-if="djlist.length > 0">
        <el-row
          v-for="(item,index) in djlist"
          :key="'album'+index"
          class="album-item"
          @click.native="openFm(item.id)"
        >
          <el-col :span="2" class="album-item-pic">
            <img :src="item.picUrl+'?param=40y40'" loading="lazy" />
          </el-col>
          <el-col class="album-item-name" :span="12">{{item.name}}</el-col>
          <el-col class="album-item-art" :span="6">{{item.dj.nickname}}</el-col>
          <el-col class="album-item-art" :span="3">节目{{item.programCount}}</el-col>
          <el-col :span="1" class="album-item-art">
            <span class="el-icon-arrow-right"></span>
          </el-col>
        </el-row>
      </div>
      <div v-else>
        <p class="album-item-art">你暂时没有收藏的专辑</p>
        <div>
 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      djlist: []
    };
  },
  created() {
    this.getdjList();
  },
  methods: {
    getdjList() {
      this.$axios
        .get(`${this.$domain}/dj/sublist`)
        .then(res => {
          this.djlist = res.data.djRadios;
        })
        .catch();
    },
    openFm(e) {
        this.$router.push(`/djlists?rid=${e}`);
    }
  }
};
</script>

<style scoped>
.my-dj {
  margin: 20px;
}
.album {
  margin: 20px;
}
.album-item {
  height: 60px;
  position: relative;
  line-height: 60px;
}
.album-item:nth-child(2n + 1) {
  background-color: #222225;
}
.album-item-pic {
  height: 60px;
}
.album-item-pic > img {
  height: 40px;
  width: 40px;
  position: absolute;
  top: 10px;
}
.album-item-name {
  font-size: 12px;
}
.album-item-art {
  font-size: 12px;
  color: rgb(124, 124, 124);
}
</style>