<template>
  <div id="app">
    <TopHeader />
    <Left v-if="isFirstLogin" class="left-aide" />
    <keep-alive exclude="playlist,playDetail,searchResult,Me">
      <router-view
        id="style-2"
        v-if="isRouterAlive"
        class="main scrollbar-main"
        style="height:568px;"
      ></router-view>
    </keep-alive>
  

    <Play v-if="this.$store.state.isPlaying" class="play" />
  </div>
</template>

<script>
import TopHeader from "./components/TopHeader";
import Left from "./components/Left";
import Play from "./components/Play";
export default {
  name: "App",
  components: {
    TopHeader,
    Left,
    Play
  },
  provide() {
    return {
      reload: this.reload,
      reloadLeft: this.reloadLeft,
      reloadPlay: this.reloadPlay
    };
  },
  watch: {},
  data() {
    return {
      isRouterAlive: true,
      isPlaying: false,
      isFirstLogin: true
    };
  },
  created() {},
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    },
    reloadLeft() {
      this.isFirstLogin = false;
      this.$nextTick(function() {
        this.isFirstLogin = true;
      });
    },
    reloadPlay() {
      this.$store.commit("changePlayState", false);
      this.$nextTick(function() {
        this.$store.commit("changePlayState", true);
      });
    }
  }
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #dcdde3;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  width: 1020px;
  height: 620px;
  margin: auto;
  background: #222225;
  z-index: -1;
}
.left-aide {
  width: 200px;
  height: 568px;
  float: left;
  background-color: rgb(25, 27, 31);
}
.main {
  margin-left: 200px;
  height: 568px;
  width: 820px;
  background-color: rgb(25, 27, 31);
  position: relative;
}
.scrollbar-main {
  position: relative;
  height: 568px;
  width: 820px;
  background-color: rgb(25, 27, 31);
  overflow-y: scroll;
  overflow-x: hidden;
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

.play {
  width: 1020px;
  height: 50px;
  background: #222225;
}
.zhanwei {
  margin-left: 200px;
  height: 568px;
  width: 820px;
  background-color: rgb(25, 27, 31);
  position: relative;
}
</style>
