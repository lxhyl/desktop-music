<template>
  <div>
    <p class="title">
      <el-popover v-model="popover" width="600">
        <div>
          <el-tag
            type="info"
            class="video-group-item"
            @click.native="openVideoGroup(item.id,item.name)"
            effect="dark"
            v-for="(item,index) in videoGroupList"
            :key="'videoGroup'+index"
            size="mini"
          >{{item.name}}</el-tag>
        </div>
        <el-tag slot="reference" type="info" effect="dark">
          当前分类：
          {{nowVideoGroup.name}}
          <span class="el-icon-arrow-down"></span>
        </el-tag>
      </el-popover>
    </p>
    <router-view v-if="reload"></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nowVideoGroup: {
        id: 59106,
        name: "街头表演"
      },
      videoGroupList: [], //所有视频标签
      reload: true,//重载页面
      popover:false,//控制popover
    };
  },
  created() {
    this.getVideoList();
  },
  methods: {
    getVideoList() {
      this.$axios
        .get(`${this.$domain}/video/group/list`)
        .then(res => {
          this.videoGroupList = res.data.data;
        })
        .catch(() => {});
    },
    openVideoGroup(id,name) {
      this.nowVideoGroup = {
        id,
        name,
      }
      this.popover = false;
      this.reload = false;
      this.$nextTick(() => {
        this.$router.push(`/video?vid=${id}`);
        this.reload = true;
      });
    }
  }
};
</script>

<style scoped>
.title {
  margin: 10px;
}
.video-group-item {
  margin: 5px 2px;
}
</style>