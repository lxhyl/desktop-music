import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

//axios
import axios from 'axios';
Vue.prototype.$axios = axios;
axios.defaults.withCredentials = true;
Vue.prototype.$domain = 'http://zhangpengfan.xyz:3000'

//路由
import router from './router/router';

//vuex
import store from './store/index'

import Line from 'v-charts/lib/line.common.min.js'
Vue.component(Line.name, Line);

import 'element-ui/lib/theme-chalk/index.css';
import {
  Col, Row, Image, Button, ButtonGroup, Input, Avatar, Popover,
  Form, FormItem, Link, Message, Tag,Slider,Timeline,
  TimelineItem,Switch,Divider
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
Vue.use(Timeline);
Vue.use(TimelineItem);
Vue.use(Switch);
Vue.use(Divider);
Vue.prototype.$message = Message;




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
  return new Date(e).Format('yy-MM-dd');
})

//歌曲时长格式化
Vue.filter('songToTime', function (e) {
  let m = Math.floor(e / 1000 / 60);
  let s = Math.round((e - m * 60 * 1000)/1000)
  m = m >= 10 ? m : `0${m}`;
  s = s >= 10 ? s : `0${s}`;
  return `${m}:${s}`;
})


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
