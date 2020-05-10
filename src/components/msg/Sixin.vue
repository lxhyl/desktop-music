<template>
  <div>
      <div v-infinite-scroll class="flex-container"></div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      id:0,//用户id
      list:[],//私信列表数组
    }
  },
  created(){
    this.getUserMes();
  },
  mounted(){
    console.log(this.id)
  },
  methods:{
    getUserMes(){
      this.id = this.$store.state.userid;
       this.$axios.get('http://zhangpengfan.xyz:3000/msg/private')
       .then(res => {
         console.log(res);
       })
    }
  }

}
</script>

<style scoped>

</style>