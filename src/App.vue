<template>
  <div id="app">
    <TopHeader />
    <Left v-if="isRouterAlive" class="left-aide" />
    <router-view v-if="isRouterAlive" class="main"></router-view>
  </div>
</template>

<script>
import TopHeader from "./components/TopHeader";
import Left from "./components/Left";
export default {
  name: "App",
  components: {
    TopHeader,
    Left
  },
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    }
  }
};
</script>

<style>
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
  height: 670px;
  margin: auto;
  background: #222225;
  z-index: -1;
}
.left-aide {
  width: 200px;
  height: 618px;
  float: left;
  background-color: rgb(25, 27, 31);
}
.main {
  margin-left: 200px;
  height: 618px;
}
.el-popover {
  background: rgb(45, 47, 51) !important;
  border: none !important;
}
</style>
