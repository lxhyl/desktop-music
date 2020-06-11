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
          <el-popover placement="bottom" trigger="manual" v-model="searchPopover" width="300">
            <!-- 热搜 -->
            <hot-search v-if="hotSearchControl" />
            <!-- 搜索建议 -->
            <search v-if="searchControl" />
            <input
              id="search-input"
              type="text"
              slot="reference"
              v-model="searchKey"
              @focus="openSearchPopover"
              @blur="closeSearchPopover"
              @keyup.enter="search"
              placeholder="搜索音乐，视频，歌词，电台"
              class="search-input"
            />
          </el-popover>
          <span @click="search" class="search-icon el-icon-search"></span>
          <span id="colsePopover"></span>
        </div>
      </el-col>
      <el-col class="row-header" :span="3">
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
      <el-col class="row-header" :span="2" style="text-align:center">
        <el-popover
          v-if="isLogin"
          style="background:#222225;"
          placement="bottom"
          width="280"
          trigger="click"
        >
          <p style="text-align:center;">
            <button
              @click="routerToPage('sixin')"
              class="msg-router-botton"
              size="mini"
              style="margin:0;"
            >私信</button>
            <button
              @click="routerToPage('pinglun')"
              class="msg-router-botton"
              size="mini"
              style="margin:0;"
            >评论</button>
            <button
              @click="routerToPage('tongzhi')"
              class="msg-router-botton"
              size="mini"
              style="margin:0;"
            >通知</button>
          </p>
          <Pinglun v-if="routerMsg == 'pinglun'" />
          <Sixin v-if="routerMsg == 'sixin'" />
          <Tongzhi v-if="routerMsg == 'tongzhi'" />

          <span slot="reference" class="el-icon-message" style="font-size:16px;line-height:50px;"></span>
        </el-popover>
      </el-col>
      <el-col class="row-header" :span="1" style="text-align:center">
        <span
          class="el-icon-setting"
          style="font-size:16px;line-height:50px;"
          @click="routerToSetting"
        ></span>
      </el-col>
      <el-col class="row-header" :span="2" style="text-align:center">
        <span @click="close" class="el-icon-close" style="font-size:16px;line-height:50px;"></span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// header消息列表
// 评论的
import Pinglun from "../components/msg/Pinglun.vue";
// 私信的
import Sixin from "../components/msg/Sixin.vue";
// 通知
import Tongzhi from "../components/msg/Tongzhi.vue";
// 热搜
import HotSearch from "./search/HotSearch.vue";
// 搜索建议
import Search from "./search/Search.vue";
export default {
  name: "TopHeader",
  inject: ["reload", "reloadLeft"],
  components: {
    Pinglun,
    Sixin,
    Tongzhi,
    HotSearch,
    Search
  },
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
      routerMsg: "sixin", //消息列表路由
      firstLogin: null, //是否第一次登陆
      searchKey: "", //搜索关键词
      hotSearchControl: false, //是否显示热搜组件
      searchDebounceTimer: null, //搜索框防抖
      searchControl: false //是否显示搜索提示组件
    };
  },
  computed: {
    //获取VUEX中 是否显示搜索弹框
    searchPopover: {
      get: function() {
        return this.$store.state.searchPopover;
      },
      set: function(e) {
        this.$store.state.searchPopover = e;
      }
    }
  },
  //监听searchKey 搜索关键词
  watch: {
    searchKey: function(n) {
      // 搜索框防抖  200ms延时
      if (n == "") {
        // this.$store.commit("changeSearchPopover", true);
        this.searchControl = false;

        this.hotSearchControl = true;
      }
      if (this.searchDebounceTimer != null) {
        clearTimeout(this.searchDebounceTimer);
        this.searchDebounceTimer = null;
      } else {
        this.searchDebounceTimer = setTimeout(() => {
          if (n !== "") {
            this.$store.commit("setSearchKey", n);
            this.hotSearchControl = false;
            this.searchControl = false;
            this.$nextTick(() => {
              this.searchControl = true;
            });
          }
        }, 200);
      }
    }
  },
  created() {
    this.firstLogin = localStorage.getItem("firstLogin");
    let phone = localStorage.getItem("phone");
    let password = localStorage.getItem("password");
    if (phone && password) {
      this.loginForm.phone = phone;
      this.loginForm.password = password;
      this.login();
    }
  },
  mounted(){
    document.addEventListener('keyup',(e)=>{
      if(e.keyCode === 83){
        let input = document.getElementById('search-input');
        if(input){
          input.focus();
        }
      }
    })
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
          .post(`${this.$domain}/login/cellphone`, {
            phone: this.loginForm.phone,
            password: this.loginForm.password
          })
          .then(res => {
            this.accountInfo = res.data;
            document.title = `${res.data.profile.nickname}的云音乐`;
            document.cookie = res.data.cookie;
            this.isLogin = true;
            this.$store.commit("getUserId", res.data.account.id);
            //如果是第一次登陆  初始化数据
            if (!localStorage.getItem("userid")) {
              localStorage.setItem("userid", res.data.account.id);
              localStorage.setItem("anotherUserId", res.data.account.id);
              localStorage.setItem("playNextSelf", true);
              this.reloadLeft();
            }

            document.getElementById("colsePopover").click();
          })
          .catch(() => {
            this.$message("登陆失败，请检查账号密码");
          });
      }
    },
    showUserPage() {
      let myId = localStorage.getItem("userid");
      localStorage.setItem("anotherUserId", myId);
      this.$router.push(`/me?id=${localStorage.getItem("userid")}`);
    },
    routerToPage(e) {
      this.routerMsg = e;
    },
    //关闭页面
    close() {
      window.opener = null;
      window.open("about:blank", "_top").close();
    },
    //打开搜索弹出框
    openSearchPopover() {
      this.$store.commit("changeSearchPopover", true);
      this.hotSearchControl = true;
    },
    //关闭搜索框
    closeSearch() {
      this.$store.commit("changeSearchPopover", false);
    },
    //搜索
    search() {
      if (this.searchKey == "") {
        return;
      }
      let input = document.getElementById("search-input");
      if (input) {
        input.blur();
      }
      this.$store.commit("changeSearchPopover", false);
      let his = JSON.parse(localStorage.getItem("history"));
      //第一次搜索
      if (his === null) {
        his = [];
      }
      //搜索历史中是否已有
      for (let i = 0; i < his.length; i++) {
        if (his[i] == this.searchKey) {
          this.$router.push(`/search?keyword=${this.searchKey}`);
          return;
        }
      }
      if (his.length >= 10) {
        his.push(this.searchKey);
        his.splice(0, 1);
      } else {
        his.push(this.searchKey);
      }

      let str = JSON.stringify(his);
      localStorage.setItem("history", str);

      this.$router.push(`/search?keyword=${this.searchKey}`);
      this.searchKey = "";
      this.searchPopover;
    },
    //路由至设置
    routerToSetting() {
      this.$router.push("/setting");
    },
    closeSearchPopover(){
       this.$store.commit("changeSearchPopover", false);
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
  border-bottom: 2px solid rgb(184, 37, 37);
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
  width: 100px;
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
.msg-router-botton {
  background-color: rgb(45, 47, 51);
  border: none;
  outline: none;
  color: #dcdde3;
  font-size: 12px;
}
.msg-router-botton:hover {
  background-color: rgb(58, 58, 63);
}
</style>
