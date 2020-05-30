<template>
  <div>
        <el-carousel style="margin-top:20px;" :interval="4000" type="card" height="200px">
      <el-carousel-item
        v-for="(item,index) in banners"
        style="width:540px;left:-80px;"
        @click.native="openBanner(item.url)"
        :key="'banner' +index"
      >
        <img :src="item.pic" loading="lazy" class="banner-img" object-fit="fill" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
   data(){
       return {
           banners:[]
       }
   },
   created(){
    this.getBanners();
   },
   mounted(){
    
   },
   methods:{
       getBanners(){
           this.$axios.get(`${this.$domain}/dj/banner`)
           .then(res => {
               console.log(res);
                 this.banners = res.data.data;
           })
       }
   }
}
</script>

<style scoped>
.banner-img {
  height: 100%;
  width: 100%;
}
</style>