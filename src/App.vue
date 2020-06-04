<template>
  <div id="app">
    <a
      href="https://github.com/zpfnb/desktop-music"
      target="_blank"
      class="github-corner"
      aria-label="View source on Github"
    >
      <svg viewBox="0 0 250 250" aria-hidden="true">
        <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z" />
        <path
          d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
          fill="currentColor"
          style="transform-origin: 130px 106px;"
          class="octo-arm"
        />
        <path
          d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
          fill="currentColor"
          class="octo-body"
        />
      </svg>
    </a>
    <TopHeader />
    <Left v-if="isFirstLogin" class="left-aide" />
    <keep-alive exclude="playlist,playDetail,searchResult,Me,">
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
  mounted() {
    document.addEventListener("keyup", e => {
      if (e.keyCode === 27) {
        this.$router.go(-1);
      }
    });
  },
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
  left:0;
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
.github-corner {
  border-bottom: 0;
  position: fixed;
  right: 0;
  text-decoration: none;
  top: 0;
  z-index: 1;
}
.github-corner svg {
    color: #fff;
    fill: var(--theme-color, #42b983);
    height: 80px;
    width: 80px;
}
</style>
