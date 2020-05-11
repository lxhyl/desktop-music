<template>
  <div class="top-header">
    <el-row style="height:50px;line-height:50px;">
      <el-col class="row-header" :span="1" style="text-align:center;">
        <img :src="logoSrc" style="width:30px;height:30px;margin:10px 0px;" />
      </el-col>
      <el-col class="row-header" :span="3" style="font-size:18px;">网易云音乐</el-col>
      <el-col class="row-header" :span="2">
        <el-button-group class="row-header">
          <button @click="routerGo(-1)" class="mini-button el-icon-arrow-left"></button>
          <button @click="routerGo(1)" class="mini-button el-icon-arrow-right" style="left:25px;"></button>
        </el-button-group>
      </el-col>
      <el-col class="row-header" :span="10">
        <div class="header-search">
          <input placeholder="搜索音乐，视频，歌词，电台" class="search-input" />
          <span class="search-icon el-icon-search"></span>
          <span id="colsePopover"></span>
        </div>
      </el-col>
      <el-col class="row-header" :span="2">
        <el-avatar
          v-if="!isLogin"
          :src="avatarSrc"
          style="width:24px;height:24px;position: absolute;top:0;bottom:0;margin:auto 0;"
        ></el-avatar>

        <el-avatar
          v-if="isLogin"
          :src="accountInfo.profile.avatarUrl"
          @click.native="showUserPage"
          style="width:24px;height:24px;position: absolute;top:0;bottom:0;margin:auto 0;"
        ></el-avatar>

        <el-popover placement="bottom" width="250" trigger="click">
          <el-form style="font-size:14px;">
            <el-form-item label="手机号" style="margin:0;">
              <el-input
                v-model="loginForm.phone"
                type="text"
                maxlength="11"
                placeholder="请输入手机号"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="loginForm.password" placeholder="请输入密码" show-password clearable></el-input>
            </el-form-item>
            <el-form-item style="margin:0;">
              <el-button @click="login" style="width:100%">登陆</el-button>
              <p style="font-size:10px;line-height:20px;">
                <span>为了账号安全，找回，修改密码等操作请去</span>
                <el-link
                  href="https://music.163.com/"
                  target="_blank"
                  type="primary"
                  style="font-size:10px;"
                >网易云官网</el-link>
                <span>。此项目仅为学习，不保存任何密码账号信息</span>
              </p>
            </el-form-item>
          </el-form>
          <span v-if="!isLogin" slot="reference" class="user-login">点击登录</span>
        </el-popover>

        <span v-if="isLogin" class="user-login">{{accountInfo.profile.nickname}}</span>
      </el-col>
      <el-col class="row-header" :span="1">开通VIP</el-col>
      <el-col class="row-header" :span="2" style="text-align:center">
        <el-popover  style="background:#222225;" placement="bottom" width="280" trigger="click">
          <p style="text-align:center;">
            <button @click="routerToPage('sixin')" class="msg-router-botton" size="mini" style="margin:0;">私信</button>
            <button @click="routerToPage('pinglun')" class="msg-router-botton" size="mini" style="margin:0;">评论</button>
            <button @click="routerToPage('tongzhi')" class="msg-router-botton" size="mini" style="margin:0;">通知</button>
          </p>
          <router-view v-if="isLogin" :name="routerMsg"></router-view>
          <span slot="reference" class="el-icon-message" style="font-size:16px;line-height:50px;"></span>
        </el-popover>
      </el-col>
      <el-col class="row-header" :span="1" style="text-align:center">
        <span class="el-icon-setting" style="font-size:16px;line-height:50px;"></span>
      </el-col>
      <el-col class="row-header" :span="2" style="text-align:center">
        <span @click="close" class="el-icon-close" style="font-size:16px;line-height:50px;"></span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "TopHeader",
   inject: ["reload"],
  data() {
    return {
      logoSrc: require("../assets/logo.png"), //logo图片地址
      avatarSrc: require("../assets/avatar.png"), //未登录占位头像
      isLogin: false, //是否登陆
      loginForm: {
        phone: undefined,
        password: undefined
      },
      accountInfo: null, //账号信息
      routerMsg: "sixin" //消息列表路由
    };
  },
  created() {
    let phone = localStorage.getItem("phone");
    let password = localStorage.getItem("password");
    if (phone && password) {
      this.loginForm.phone = phone;
      this.loginForm.password = password;
      this.login();
    }
  },
  methods: {
    routerGo(e) {
      this.$router.go(e);
    },
    login() {
      if (this.loginForm.phone == "" || this.loginForm.password == "") {
        return;
      } else {
        localStorage.setItem("phone", this.loginForm.phone);
        localStorage.setItem("password", this.loginForm.password);

        this.$axios
          .get(
            `http://zhangpengfan.xyz:3000/login/cellphone?phone=${this.loginForm.phone}&password=${this.loginForm.password}`
          )
          .then(res => {
           
            this.accountInfo = res.data;
            this.isLogin = true;
            this.$store.commit('getUserId',res.data.account.id);
            this.reload();
            document.getElementById("colsePopover").click();
          })
          .catch(() => {
            this.$message("登陆失败，请检查账号密码");
          });
      }
    },
    showUserPage() {
      console.log("用户页");
      this.$router.push('/me')
    },
    routerToPage(e){
         this.routerMsg = e;
    },
    close() {
      window.opener = null;
      window.open("about:blank", "_top").close();
    }
  }
};
</script>
<style scoped>
.top-header {
  width: 1020px;
  height: 50px;
  z-index: 999;
  font-size: 10px;
  border-bottom: 2px solid rgb(110, 7, 7);
}
.row-header {
  height: 50px;
  position: relative;
}
.mini-button {
  position: absolute;
  top: 15px;
  height: 20px;
  width: 25px;
  background-color: #222225;
  border: none;
  outline: none;
  color: #dcdde3;
}
.mini-button:hover {
  border: 1px solid black;
}

.header-search {
  position: relative;
  top: 15px;
  border: none;
  background-color: #161618;
  width: 200px;
  height: 20px;
  border-radius: 10px 10px 10px 10px;
}
.search-input {
  position: absolute;
  left: 10px;
  width: 180px;
  height: 20px;
  background-color: #161618;
  border: none;
  outline: none;
  color: #dcdde3;
  padding: 0;
  font-size: 10px;
}
.search-icon {
  position: absolute;
  left: 180px;
  top: 4px;
  text-align: center;
  font-size: 12px;
}
.user-login {
  position: absolute;
  width: 50px;
  left: 24px;
  margin-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.theme-icon {
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: absolute;
}
.msg-router-botton{
  background-color: rgb(45, 47, 51);
  border:none;
  outline: none;
  color:#dcdde3 ;
  font-size: 12px;
}
.msg-router-botton:hover{
  background-color: rgb(58, 58, 63);
}
</style>
