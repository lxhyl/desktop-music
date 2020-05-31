<template>
  <div>
    <div class="flex-container">
      <div class="flex-item" v-for="(item,index) in list" :key="index">
        <div class="item-left">
          <el-avatar
            :src="item.notice.user.avatarUrl+'?param=30y30'"
            size="small"
            style="width:30px;height:30px;"
          ></el-avatar>
        </div>
        <div class="item-msg">
          <p class="item-hf-main">
            <span class="item-hf-name">
              {{item.notice.user.nickname}}
              <span style="color:#607D8B;">赞了我</span>
            </span>
            <span class="item-hf-time">{{item.time | toTime | toTimeGetOnlyDay}}</span>
          </p>
          <p v-if="item.notice.comment" class="item-my-msg">{{item.notice.comment.content}}</p>
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
  name: "msgTZ",
  data() {
    return {
      page: 0, //分页
      list: [], //列表
      loading: true, //加载中
      time: 0, //此页最后时间
      lastTime: [0] //前面页时间
    };
  },
  created() {},
  mounted() {
    this.getTongZhi();
  },
  methods: {
    getTongZhi() {
      this.list = [];
      this.$axios
        .get(
          `${this.$domain}/msg/notices?limit=10&lasttime=${
            this.lastTime[this.page]
          }`
        )
        .then(res => {
          this.list = res.data.notices;
          for (let i = 0; i < this.list.length; i++) {
            if (typeof this.list[i].notice == "string") {
              this.list[i].notice = JSON.parse(this.list[i].notice);
            }
          }
          this.lastTime.push(this.list[this.list.length - 1].time)
          this.loading = false;
        })
           .catch(() => {

        });
    },
    lastPage() {
      this.loading = true;
      this.page -= 1;
      this.getTongZhi();
    },
    nextPage() {
      this.loading = true;
      this.page += 1;
      this.time = this.list[9].time;
      this.getTongZhi();
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
  height: 50px;
}
.item-left {
  float: left;
  width: 30px;
  height: 30px;
}
.item-msg {
  margin-left: 30px;
  height: 50px;
}
.item-hf-main {
  margin: 0;
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
}
.item-hf-time {
  float: right;
  font-size: 9px;
  text-align: center;
  margin-right: 10px;
}
.item-my-msg {
  height: 25px;
  line-height: 25px;
  margin: 0;
  font-size: 11px;
  width: 240px;
  color: #dcdde3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>