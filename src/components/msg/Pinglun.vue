<template>
  <div>
    <div class="flex-container">
      <div v-if="!loading">
        <div class="flex-item" v-for="(item,index) in list" :key="index">
          <div class="item-avatar">
            <el-avatar :src="item.user.avatarUrl+'?param=30y30'" size="small"></el-avatar>
          </div>
          <div class="item-hf">
            <p class="item-hf-main">
              <span class="item-hf-name">{{item.user.nickname}}</span>
              <span class="item-hf-time">{{item.time | toTime}}</span>
            </p>
            <p class="item-hf-content">回复我：{{item.content}}</p>
          </div>
          <p class="me-msg">{{item.beRepliedContent}}</p>
        </div>
      </div>
      <p v-if="loading" style="text-align:center;font-size:16px;color:#dcdde3;">加载中...</p>
    </div>

    <p style="text-align:center;margin:0;">
      <el-link v-if="page >= 1" @click="lastPage">上一页</el-link>
      <el-link @click="nextPage">下一页</el-link>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: null, //用户id
      loading: false, //是否加载中
      lastTime: [], //前面页最后条数据时间
      time: 0, //此页最后条数据时间
      page: 0, //当前页
      list: []
    };
  },
  created() {
    // 初始化
    this.id = this.$store.state.userid;
  },
  mounted() {
    this.loading = true;
    this.getPingLun();
  },
  methods: {
    getPingLun() {
      this.$axios
        .get(
          `http://zhangpengfan.xyz:3000/msg/comments?uid=${this.id}&limit=5&before=${this.time}`
        )
        .then(res => {
          this.list = res.data.comments;
          this.loading = false;
        });
    },
    nextPage() {
      this.loading = true;
      this.page += 1;
      this.time = this.list[4].time;
      this.lastTime.push(this.list[4].time);
      this.getPingLun();
    },
    lastPage() {
      this.loading = true;
      if (this.page == 1) {
        this.page -= 1;
        this.$axios
          .get(
            `http://zhangpengfan.xyz:3000/msg/comments?uid=${this.id}&limit=5`
          )
          .then(res => {
            this.list = res.data.comments;
            this.loading = false;
          });
      }
      if (this.page >= 2) {
        this.page -= 1;
        this.time = this.lastTime[this.page];
        this.getPingLun();
      }
    }
  }
};
</script>

<style scoped>
.flex-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 500px;
  flex-wrap: wrap;
  overflow-y: hidden;
  overflow-x: hidden;
}
.flex-item {
  width: 100%;
  height: 80px;
  position: relative;
  margin-top: 10px;
}
.item-avatar {
  width: 30px;
  height: 30px;
  float: left;
}
.item-hf {
  margin-left: 30px;
}
.item-hf > p {
  margin: 0;
  padding: 0;
  line-height: 15px;
}
.item-hf-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 11px;
  color: rgb(45, 96, 155);
  width: 100px;
  float: left;
}
.item-hf-time {
  margin-left: 100px;
  font-size: 9px;
  text-align: right;
}
.item-hf-content {
  font-size: 10px;
  color: #dcdde3;
}
.me-msg {
  margin-top: 5px;
  font-size: 12px;
  margin-left: 30px;
  background-color: rgb(54, 56, 60);
}
</style>