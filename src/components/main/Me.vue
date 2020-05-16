<template>
  <div  class="page">
    <div v-if="getOk">
    <div class="header">
      <div class="header-avatar">
        <img :src="userInfo.profile.avatarUrl" />
      </div>
      <div class="userinfo">
        <div class="userinfo-main">
          <el-row style="height:40px;line-height:40px;">
            <el-col :span="6" style="font-size:20px;">{{userInfo.profile.nickname}}</el-col>
            <el-col :span="1" style="font-size:20px;">
              <span
                v-if="userInfo.profile.gender == 1"
                class="el-icon-male"
                style="color:rgb(19,100,141)"
              ></span>
              <span
                v-if="userInfo.profile.gender == 2"
                class="el-icon-female"
                style="color:rgb(185,117,171)"
              ></span>
            </el-col>
            <el-col :span="12">
              <span class="lavel">Lv.{{userInfo.level}}</span>
            </el-col>
            <el-col :span="5">
              <span class="changeUserInfo">&nbsp;编辑个人信息&nbsp;</span>
            </el-col>
          </el-row>
          <p class="boder-bottom"></p>
          <el-row style="height:50px; margin-top:5px;margin-bottom:5px;">
            <el-col :span="3" style="height:50px;">
              <span class="user-info-number">{{userInfo.profile.eventCount}}</span>
              <br />
              <span class="user-info-text">动态</span>
            </el-col>
            <el-col :span="3" style="height:50px;">
              <span class="user-info-number">{{userInfo.profile.follows}}</span>
              <br />
              <span class="user-info-text">关注</span>
            </el-col>
            <el-col :span="18" style="height:50px;">
              <span class="user-info-number">{{userInfo.profile.followeds}}</span>
              <br />
              <span class="user-info-text">粉丝</span>
            </el-col>
          </el-row>
          <p class="user-info-msg">
            <span style="color:rgb(124, 124, 124)">创建时间:</span>
            {{userInfo.createTime | toTime}}
          </p>
          <p class="user-info-msg">
            <span style="color:rgb(124, 124, 124)">生日:</span>
            {{userInfo.profile.birthday | toTime}}
          </p>
          <p class="user-info-msg">
            <span style="color:rgb(124, 124, 124)">个人介绍:</span>
            {{userInfo.profile.signature}}
          </p>
        </div>
      </div>
    </div>
    <div class="main"  >
      <ve-line height="340px"
       style="color: rgb(173, 175, 178);"   :data="chartData"></ve-line>
    </div>
    </div>
    <div v-else class="loading">
       加载中
    </div>
  </div>
</template>

<script>
export default {
  name:"me",
  data() {
    return {
      userid: null,
      userInfo: null, //用户信息
      getOk: false, // 是否获取到用户信息
      chartData: {
        columns: ["歌单名","歌曲数","播放量"],
        rows: [
        
        ]
      }
    };
  },
  created() {
    this.userid = this.$store.state.userid;
    this.userid = localStorage.getItem("userid");
  },
  mounted() {
    this.getUserInfo();
    this.getUserDetail();
  },
  methods: {
    getUserInfo() {
      this.$axios
        .get(`${this.$domain}/user/detail?uid=${this.userid}`)
        .then(res => {
          this.userInfo = res.data;
          this.getOk = true;
        });
    },
    getUserDetail() {
      this.$axios
        .get(`${this.$domain}/user/playlist?uid=${this.userid}`)
        .then(res => {
          let arr = res.data.playlist;
          for(let i =0;i<arr.length;i++){
            // 用户自己创建的歌单
            if(!arr[i].subscribed){ 
            let json = {
              "歌单名":arr[i].name,
              "歌曲数":arr[i].trackCount,
              "播放量":arr[i].playCount,
            }
            this.chartData.rows.push(json);
            }
          }
        });
    }
  }
};
</script>

<style scoped>
p {
  margin: 0;
}
.header {
  width: 820px;
  height: 220px;
}
.header-avatar {
  float: left;
  width: 220px;
  height: 220px;
}
.header-avatar > img {
  width: 180px;
  height: 180px;
  margin: 20px;
}
.userinfo {
  margin-left: 220px;
  height: 220px;
}
.userinfo-main {
  position: relative;
  height: 180px;
  top: 20px;
}
.boder-bottom {
  position: relative;
}
.boder-bottom::before {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 1px;
  margin-right: 20px;
  border-top: 1px solid #e5e5e5;
  color: #e5e5e5;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.lavel {
  height: 20px;
  width: 35px;
  line-height: 20px;
  text-align: center;
  border: 1px solid rgb(184, 37, 37);
  color: rgb(184, 37, 37);
  font-size: 16px;
  border-radius: 10px;
  display: inline-block;
}
.changeUserInfo {
  display: inline-block;
  font-size: 12px;
  background: #222225;
  height: 25px;
  line-height: 25px;
  width: 100px;
  text-align: center;
  border-radius: 10px;
}
.user-info-number {
  font-size: 25px;
  height: 30px;
  line-height: 30px;
  display: inline-block;
}
.user-info-text {
  font-size: 10px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  color: rgb(124, 124, 124);
}
.user-info-msg {
  height: 25px;
  line-height: 25px;
  font-size: 12px;
}
.main {
  height: 340px;
  background-color: rgb(25, 27, 31);
}
.chart {
  width: 800px;
  margin: 10px;
}

</style>