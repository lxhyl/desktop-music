<template>
  <div>
    <div class="main-page">
      <p>1. 播放设置</p>

      <div class="item">
        <p>是否自动播放下一曲</p>
        <p>
          <el-switch
            v-model="playNextSelf"
            inactive-color="rgb(124, 124, 124)"
            active-color="rgb(184, 37, 37)"
          ></el-switch>
        </p>
        <p>定时停止播放(5-150分钟)</p>
        <p>
          <input
            class="timer-input"
            type="number"
            max="150"
            min="5"
            @keyup.enter="timerToTurnOff"
            v-model="timerPlay"
          />分
          <el-button round type="info" size="mini" @click="timerToTurnOff">确定</el-button>
        </p>
      </div>
      <p>2. 账号</p>
      <div class="item">
        <el-button v-if="this.$store.state.userid" round type="info" size="mini" @click="logout">退出登陆</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "setting",
  inject: ["reload"],
  data() {
    return {
      playNextSelf: true,
      timerPlay: 10,
      timer: null,
    };
  },
  computed: {},
  watch: {
    playNextSelf(n) {
      localStorage.setItem("playNextSelf", n);
    }
  },
  created() {
  },
  methods: {
    //定时关闭
    timerToTurnOff() {
      clearTimeout(this.timer);
      if (this.timerPlay > 150) {
        this.timerPlay = 150;
      }
      if (this.timerPlay < 5) {
        this.timerPlay = 5;
      }
      let timeMs = this.timerPlay * 60 * 1000;
      this.$message({
        message: `设置成功，${this.timerPlay}分钟后停止播放`,
        type: "success"
      });
      this.timer = setTimeout(() => {
        this.$store.commit("changePlayState", false);
      }, timeMs);
    },
    //退出登陆
    logout() {
      this.$confirm("是否登出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios.get(`${this.$domain}/logout`).then(() => {
            localStorage.clear();
            this.$message({
              showClose: true,
              message: "已登出",
              type: "warning",
              duration: 2000
            });
            location.reload();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    }
  }
};
</script>

<style scoped>
.main-page {
  margin: 20px 50px;
}
.item {
  margin-left: 20px;
  font-size: 12px;
  color: rgb(124, 124, 124);
}
.timer-input {
  background: rgb(124, 124, 124);
  width: 50px;
  height: 28px;
  border-radius: 7px;
  border: none;
  outline: none;
  text-align: center;
  color: #ffffff;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
</style>

