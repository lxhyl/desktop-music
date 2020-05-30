<template>
  <div>
    <div class="flex-container">
      <div class="flex-item" v-for="(item,index) in list" :key="index">
        <div class="item-avatar">
          <el-avatar :src="item.fromUser.avatarUrl+'?param=30y30'" size="small"></el-avatar>
        </div>
        <div class="item-msg">
          <p class="item-msg-title">{{item.fromUser.nickname}}</p>
          <p class="item-msg-des">{{item.lastMsg.msg}}</p>
        </div>
      </div>
    </div>
    <p style="text-align:center;margin:0;">
      <el-link v-if="allMsg.length > 10 && page != 0" @click="lastPage">上一页</el-link>
      <el-link v-if="allMsg.length > 10 && page < (allMsg.length / 10) - 1" @click="nextPage">下一页</el-link>
    </p>
  </div>
</template>

<script>
export default {
  name:"msgSX",
  data() {
    return {
      id: 0, //用户id
      list: [], //私信列表数组
      allMsg: [],
      page: 0 //当前页
    };
  },
  created() {
    this.getUserMes();
    this.id = this.$store.state.userid;
  },
  mounted() {},
  methods: {
    //拿用户消息
    getUserMes() {
      this.$axios.get(`${this.$domain}/msg/private`).then(res => {
        this.allMsg = res.data.msgs.concat(res.data.msgs);
        this.list = this.allMsg.slice(0, 10);
        for (let i = 0; i < this.allMsg.length; i++) {
           if(typeof  this.allMsg[i].lastMsg == "string"){
            this.allMsg[i].lastMsg = JSON.parse(this.allMsg[i].lastMsg);
           }
          
        }
      })
         .catch(() => {

        });
    },
    //lastPage 上一页
    lastPage() {
      this.page -= 1;
      this.list = this.allMsg.slice(this.page * 10, (this.page + 1) * 10);
    },
    nextPage() {
      this.page += 1;
      this.list = this.allMsg.slice(this.page * 10, (this.page + 1) * 10);
    }
  }
};
</script>

<style scoped>
.flex-container {
  display: flex;
  flex-direction:column;
  width: 100%;
  height: 500px;
  flex-wrap: wrap;
  overflow-y: hidden;
  overflow-x: hidden;
}
.flex-item {
  width: 100%;
  height: 50px;
  position: relative;
}
.item-avatar {
  float: left;
  width: 30px;
  height: 30px;
  margin-top: 10px;
}
.item-msg {
  margin-left: 30px;
  margin-top: 10px;
  font-size: 12px;
  height: 50px;
  top: 0;
  position: absolute;
}
.item-msg-title {
  width: 260px;
  height: 15px;
  line-height: 15px;
  margin: 0;
  padding: 0;
  font-size: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: rgb(45, 96, 155);
}
.item-msg-des {
  width: 260px;
  height: 25px;
  margin: 0;
  padding: 0;
  font-size: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #dcdde3;
}
</style>