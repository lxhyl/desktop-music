<template>
  <div class="scrollbar" id="style-2">
    <div class="force-overflow">
      <div>
        <p class="tuijian">推荐</p>
        <div class="tuijian-main">
          <p class="item" @click="routerToPage('/')">
            <span class="el-icon-headset"></span>
            <span class="text">发现音乐</span>
          </p>
          <p class="item" @click="fm">
            <span class="el-icon-microphone"></span>
            <span class="text">私人FM</span>
          </p>
          <p class="item" @click="routerToPage('/video')">
            <span class="el-icon-video-camera"></span>
            <span class="text">视频</span>
          </p>
          <p class="item" @click="routerToPage('/friends')">
            <span class="el-icon-user"></span>
            <span class="text">朋友(动态)</span>
          </p>
          <p class="item" @click="routerToPage('/history')">
            <span class="el-icon-notebook-2"></span>
            <span class="text">播放历史</span>
          </p>
        </div>
      </div>
      <div v-if="userid">
        <p class="tuijian">我的音乐</p>
        <div class="tuijian-main">
          <p
            class="item"
            v-for="(item,index) in myMusic"
            @click="routerToPage(item.router)"
            :key="index"
          >
            <span :class="item.icon"></span>
            <span class="text">{{item.text}}</span>
          </p>
          <p class="item" @click="routerToPage('/rank')">
            <span class="el-icon-medal-1"></span>
            <span class="text">播放排行</span>
          </p>
        </div>
      </div>
      <div v-if="userid">
        <p class="tuijian">
          我的歌单
          <el-popover
            trigger="manual"
            v-model="controlNewListsPopover"
            width="200"
            placement="right-start"
          >
            <p style="margin-bottom:10px;">新建歌单</p>
            <p style="width:190px;">
              <el-input placeholder="输入歌单名" size="mini" v-model="newSongLists">
                <el-button @click="getNewLists" slot="append">创建</el-button>
              </el-input>
            </p>
            <span
              @click="controlNewListsPopover = true"
              slot="reference"
              class="el-icon-circle-plus-outline"
            ></span>
          </el-popover>
        </p>
        <div class="tuijian-main">
          <p
            class="item"
            v-for="(item,index) in myList"
            :key="index"
            style="line-height:20px;"
            @click="routerToPlayList(item.id)"
            @contextmenu.prevent="deleteSongList(item.id,item.name)"
          >
            <span :class="item.icon"></span>
            <span
              class="text"
              :id="item.id"
              @drop.self="drop"
              @dragover.self="dropOver"
            >{{item.name}}</span>
          </p>
        </div>
      </div>
      <div v-else>
        <p class="tuijian">请登录以获取歌单...</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "left",
  inject: ["reloadPlay", "reloadLeft"],
  data() {
    return {
      userid: null, //用户id判断是否登陆,
      // 我的音乐
      myMusic: [
        { icon: "el-icon-mic", text: "我的电台", router: "/myDT" },
        { icon: "el-icon-star-on", text: "我的收藏", router: "/mycollect" }
      ],
      //我的歌单
      myList: [],
      //防抖函数
      timer: null,
      flag: false, //节流拖动事件
      newSongLists: "", //新建歌单名
      controlNewListsPopover: false
    };
  },
  created() {
    this.userid = this.$store.state.userid;
    this.userid = localStorage.getItem("userid");
  },
  mounted() {
    this.userid && this.getMusciList();
  },
  methods: {
    getMusciList() {
      this.$axios
        .get(`${this.$domain}/user/playlist?uid=${this.userid}&timestamp=${new Date().getTime()}`)
        .then(res => {
          let arr = res.data.playlist;
          for (let i = 0; i < arr.length; i++) {
            let json = {
              icon: "el-icon-service",
              name: arr[i].name,
              id: arr[i].id
            };
            this.myList.push(json);
          }
          // 拿到用户歌单
          this.$store.commit("getUserList", arr);
        })
        .catch(() => {});
    },
    //路由至 e 页面
    routerToPage(e) {
      if (e === "/video" && !this.$store.state.userid) {
        this.$message("请登录☹️");
        return;
      }
      this.$router.push(e);
    },
    // 跳转歌单详情页 参数e为歌单id
    routerToPlayList(e) {
      this.$router.push(`/playlist?id=${e}`);
    },
    fm() {
      if (!this.userid) {
        this.$message("请登录☹️");
        return;
      }
      //如果已经是fm了
      if (this.$store.state.fm) {
        return;
      }
      this.$store.commit("setFm", true);
      this.$message.closeAll();

      this.$message({
        showClose: false,
        message: "个性化推荐中🔎 ",
        type: "warning",
        duration: 0
      });
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$axios
          .get(`${this.$domain}/personal_fm?timestamp=${new Date().getTime()}`)
          .then(res => {
            this.$message.closeAll();
            this.$message({
              showClose: false,
              message: "歌曲搜寻成功💃🕺",
              type: "warning",
              duration: 2000
            });
            let songs = res.data.data;
            let result = [];
            for (let i = 0; i < songs.length; i++) {
              let obj = {
                id: songs[i].id,
                name: songs[i].name,
                album: songs[i].album.name,
                ar: songs[i].artists[0].name,
                time: songs[i].duration
              };
              result.push(obj);
            }
            let id = res.data.data[0].id;
            this.$router.push(`/playDetail?id=${id}`);
            // 更新音乐ID
            this.$store.commit("getMusicId", id);
            this.$store.commit("getPlayLists", result);
            this.reloadPlay();
          })
          .catch(() => {});
      }, 500);
    },
    //拖动事件 触发加入歌单
    drop(e) {
      e.preventDefault();
      this.$message({
        showClose: true,
        message: `添加中！`,
        type: "warning",
        duration: 2000
      });
      let data = e.dataTransfer.getData("text/plain");
      let listid = e.target.id;
      this.$axios
        .get(
          `${this.$domain}/playlist/tracks?op=add&pid=${listid}&tracks=${data}`
        )
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              showClose: true,
              message: "添加成功😊",
              type: "warning",
              duration: 2000
            });
          }
          if (res.data.code == 502) {
            this.$message({
              showClose: true,
              message: `歌单歌曲重复`,
              type: "warning",
              duration: 2000
            });
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: `失败,无权限：${err}`,
            type: "warning",
            duration: 2000
          });
        });
      this.flag = false;
    },
    //进入元素时
    dropOver(e) {
      e.preventDefault();
      if (!this.flag) {
        this.flag = true;
        this.$message({
          showClose: true,
          message: `松开鼠标即可加入`,
          type: "warning",
          duration: 2000
        });
      }
    },
    //新建歌单
    getNewLists() {
      if (this.newSongLists != "") {
        this.$axios
          .get(`${this.$domain}/playlist/create?name=${this.newSongLists}`)
          .then(res => {
            this.$message({
              showClose: true,
              message: `已新建歌单${this.newSongLists}`,
              type: "warning",
              duration: 2000
            });
            this.newSongLists = '';
          });
      }
      this.reloadLeft();
    },
    //删除歌单
    deleteSongList(id, name) {
      console.log(name);
      this.$confirm("此操作将永久删除该歌单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .get(`${this.$domain}/playlist/delete?id=${id}`)
            .then(() => {
              this.$message({
                type: "info",
                message: `已删除歌单${name}`
              });
              this.reloadLeft();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style scoped>
p {
  margin: 0;
  padding: 0;
}
.tuijian {
  font-size: 11px;
  text-indent: 10px;
  color: rgb(124, 124, 124);
  position: relative;
}
.tuijian > span {
  position: absolute;
  right: 10px;
  font-size: 16px;
}
.tuijian-main {
  font-size: 11px;
  margin-left: 5px;
  color: rgb(173, 175, 178);
}
.item {
  margin: 10px 5px;
}

.text {
  margin-left: 10px;
}
.scrollbar {
  position: relative;
  float: left;
  height: 618px;
  width: 200px;
  background-color: rgb(25, 27, 31);
  overflow-y: scroll;
}

#wrapper {
  text-align: center;
  width: 500px;
  margin: auto;
}
#style-2::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: rgb(25, 27, 31);
}

#style-2::-webkit-scrollbar {
  width: 8px;
  background-color: rgb(25, 27, 31);
}

#style-2::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: rgb(47, 49, 52);
}
</style>