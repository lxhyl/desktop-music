<template>
  <div>
    <div class="main-page">
      <p>1. 播放设置</p>

      <div class="item">
        <div class="setting-one-item">
          <p>1.1 是否自动播放下一曲</p>
          <p>
            <el-switch
              v-model="playNextSelf"
              inactive-color="rgb(124, 124, 124)"
              active-color="rgb(184, 37, 37)"
            ></el-switch>
          </p>
        </div>
       
        <div class="setting-one-item">
          <p>1.2 顺序播放/随机播放</p>
           <p style="font-size:11px;">
            <el-switch
              v-model="playRandom"
              inactive-color="rgb(124, 124, 124)"
              active-color="rgb(184, 37, 37)"
            ></el-switch>
          </p>
        </div>
        <div class="setting-one-item">
          <p>1.3 遇到无版权或会员专属曲目时是否自动切换</p>
           <el-switch
              v-model="canNotplayToNext"
              inactive-color="rgb(124, 124, 124)"
              active-color="rgb(184, 37, 37)"
            ></el-switch>
        </div>
        <div class="setting-one-item">
          <p>1.4 定时停止播放(5-150分钟)</p>
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

        <div class="setting-one-item">
          <p>1.5 音乐品质(单位k)</p>
          <el-tag
            class="br-item"
            v-for="(item,index) in br"
             effect="dark"
            :type="item.type"
            @click.native="changeBr(item)"
            :key="'br-'+index"
          >{{item.v}}</el-tag>
        </div>
      </div>
        <el-divider></el-divider>
      <p>2. 账号</p>
      <div class="item">
        <el-button
          v-if="this.$store.state.userid"
          round
          type="info"
          size="mini"
          @click="logout"
        >退出登陆</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "setting",
  inject: ["reload", "reloadPlay"],
  data() {
    return {
      playNextSelf: true,
      timerPlay: 10,
      timer: null,
      playRandom:false,//是否是随机播放
      canNotplayToNext:true,//
    };
  },
  computed: {
    br: function() {
      let nowBr = this.$store.state.br;
      let brs = [
        { v: 128, type: "info" },
        { v: 320, type: "info" },
        { v: 480, type: "info" },
        { v: 640, type: "info" },
        { v: 800, type: "info" },
        { v: 999, type: "info" }
      ];
   
      for (let i = 0; i < brs.length; i++) {
        if (brs[i].v == nowBr / 1000) {
          brs[i].type = "danger";
        }
      }
      return brs;
    }
  },
  watch: {
    playNextSelf(n) {
      localStorage.setItem("playNextSelf", n);
    },
    //顺序播放/随机播放
    playRandom(n){
      this.$store.commit('changeRandomPlay',n);
    },
    //遇到会员或无版权单曲时是否自动切换下一首
    canNotplayToNext(n){
      this.$store.commit('changeCanNotplayToNext',n);
    }
  },
  created() {},
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
    },
    //改变码率
    changeBr(e) {
      this.br;
      this.$store.commit("changeBr", e.v);
      if (this.$store.state.isPlaying) {
        this.reloadPlay();
      }
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
.br-item {
  margin-right: 10px;
}
.setting-one-item{
  margin-top:20px;
}
</style>

