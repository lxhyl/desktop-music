<template>
  <div>play{{musicid}}</div>
</template>

<script>
export default {
  name: "play",
  inject: ["reloadPlay"],
  // 监听路由  刷新组件
  data() {
    return {
      musicid: null
    };
  },
  computed:{
   isPlaying (){
     return this.$store.state.isPlaying
   }
  },
  watch:{
     isPlaying(oldV,newV){
      console.log(oldV,'---',newV);
     }
  },
  created() {
    this.musicid = this.$route.query.id;
  },
  mounted(){
     this.musicid && this.getSongDetail();
  },
  methods:{
      getSongDetail(){
        this.$axios.get(`${this.$domain}/song/detail?ids=${this.musicid}`)
        .then(res => {
          console.log(res);
        })
      }
  }
};
</script>

<style scoped>
</style>