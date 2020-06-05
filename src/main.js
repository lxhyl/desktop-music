import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

//axios
import axios from 'axios';
Vue.prototype.$axios = axios;
axios.defaults.withCredentials = true;
Vue.prototype.$domain = 'http://zhangpengfan.xyz/music'

//路由
import router from './router/router';

//vuex
import store from './store/index'

import Line from 'v-charts/lib/line.common.min.js'
Vue.component(Line.name, Line);

import 'element-ui/lib/theme-chalk/index.css';
import {
  Col, Row, Image, Button, ButtonGroup, Input, Avatar, Popover,
  Form, FormItem, Link, Message, Tag,Slider,Switch,Divider,
  Carousel,CarouselItem,Tooltip,MessageBox,Card,
  Dialog
} from 'element-ui';
Vue.use(Col);
Vue.use(Row);
Vue.use(Image);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Input);
Vue.use(Avatar);
Vue.use(Popover);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Link);
Vue.use(Tag);
Vue.use(Slider);
Vue.use(Switch);
Vue.use(Divider);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Tooltip);
Vue.use(Card);
Vue.use(Dialog);
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
//无限滚动
import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)



//过滤器  
// 日期格式化
Vue.filter('toTime', function (e) {
  Date.prototype.Format = function (fmt) {
    var o = {
      "M+": this.getMonth() + 1,
      "d+": this.getDate(),
      "h+": this.getHours(),
      "m+": this.getMinutes(),
      "s+": this.getSeconds(),
      "q+": Math.floor((this.getMonth() + 3) / 3),
      "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + ""));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
  return new Date(e).Format('yy-MM-dd/hh:mm:ss');
})
// 日期只取到天
Vue.filter('toTimeGetOnlyDay',function(e){
 return e.substr(0,10)
})

//歌曲时长格式化
Vue.filter('songToTime', function (e) {
  let m = Math.floor(e / 1000 / 60);
  let s = Math.round((e - m * 60 * 1000)/1000)
  m = m >= 10 ? m : `0${m}`;
  s = s >= 10 ? s : `0${s}`;
  return `${m}:${s}`;
})
//数字转汉字
Vue.filter('toChinese', function (e) {
   switch(e){
     case 1:
       return '一';
     case 2:
       return '二';
     case 3:
       return '三';
     case 4:
       return '四';
     case 5:
       return '五';
     case 6:
       return '六';
     case 0:
       return '日';
   }
})
//错误监控
Vue.config.errorHandler = function(err, vm, info) {
  console.log(`错误日志:`,err);
  console.log(`错误页面:`,vm);
  console.log('\n')
  console.log('%c开发者微信：ZPF100523163','background-image: linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%)');
  Vue.prototype.$message({
    showClose: true,
    message: "监控到错误（可按F12打开控制台以查看错误或联系开发者）",
    type: "error",
    duration: 0
  })

};


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
