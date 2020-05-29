<template>
  <div>
    <div v-if="usersList.length > 0">
        <el-row v-for="(item,index) in usersList"
        :key="index"
        class="row"
        @click.native="openUsers(item.userId)"
        >
            <el-col style="text-align:center;" :span="2">
                <img :src="item.avatarUrl" loading='lazy' >
            </el-col>
             <el-col class="name" :span="22">
                 {{item.nickname}}
                 <span class="el-icon-male male" v-if="item.gender == 1"></span>
                <span class="el-icon-female female" v-if="item.gender == 2"></span>
             </el-col>
        </el-row>
    </div>
   <p v-else v-show="!loading" class="nothing">什么都没找到,换个关键词吧...</p>
    <p v-show="loading" class="loading">
      <span class="el-icon-loading"></span>加载中...
    </p>
     
  </div>
</template>

<script>
export default {
  name: "searchUsers",
  data() {
    return {
      keywords: "",
      loading:true,
      usersList:[],
    };
  },
  created() {
    this.keywords = this.$route.query.keyword;
  },
  mounted() {
    this.keywords && this.getUsers();
  },
  methods: {
    getUsers() {
      this.$axios
        .get(`${this.$domain}/search?keywords=${this.keywords}&type=1002`)
        .then(res => {
          this.usersList = res.data.result.userprofiles;
          this.loading = false;
        });
    },
    openUsers(id){
        localStorage.setItem('anotherUserId',id)
         this.$router.push(`/me?id=${id}`);
    }
  }
};
</script>

<style scoped>
img{
    height: 30px;
    width: 30px;
    border-radius: 100%;
    position: relative;
    top:10px;
}
.male {
  font-size: 16px;
  color: rgb(19, 101, 142);
 line-height: 50px;
}
.female {
  font-size: 16px;
  color: rgb(175, 112, 163);
  line-height: 50px;
}
.row{
    height: 50px;
    margin:0 10px;
}
.row:nth-child(odd) {
  background-color: #222225;
}
.name{
    line-height: 50px;
    font-size: 11px;
    height: 30px;
}
.nothing{
  text-align: center;
  width: 100%;
}
</style>