<template>
  <div>
    <div class="main-page">
      <p>1.播放设置</p>

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
         <input class="timer-input" 
        type="number" 
        max="150"
        min="5"
        @keyup.enter="timerToTurnOff"
        v-model="timerPlay"/>分
        <el-button round type="info" 
         size="mini" 
         @click="timerToTurnOff"
         >确定</el-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "setting",
  data() {
    return {
      playNextSelf:true,
      timerPlay:10,
      timer:null,
    };
  },
  computed:{
  
  },
  watch:{
    playNextSelf(n){
      localStorage.setItem('playNextSelf',n);
    }
  },
  created() {

  },
  methods: {
    timerToTurnOff(){
      clearTimeout(this.timer);
      if(this.timerPlay > 150){
        this.timerPlay = 150
      }
      if(this.timerPlay < 5){
        this.timerPlay = 5
      }
      let timeMs = this.timerPlay * 60 * 1000; 
      this.timer = setTimeout(()=>{
         this.$store.commit('changePlayState',false);
      },timeMs)
    }
  }
};
</script>

<style scoped>
.main-page {
  margin: 20px 50px;
}
.item {
  margin-left:20px;
  font-size: 12px;
  color: rgb(124, 124, 124);
}
.timer-input{
  background:rgb(124, 124, 124);
  width: 50px;
  height: 28px;
 border-radius: 7px;
  border:none;
  outline: none;
  text-align: center;
  color: #ffffff;
}
input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{
   -webkit-appearance: none !important;
}
</style>

