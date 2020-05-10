import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

//axios
import axios from 'axios';
Vue.prototype.$axios = axios;
axios.defaults.withCredentials =true;

//路由
import router from './router/router';

//vuex
import store from './store/index'



import 'element-ui/lib/theme-chalk/index.css';
import { Col,Row,Image,Button,ButtonGroup,Input,Avatar,Popover,Form,FormItem,Link,Message,Tag} from 'element-ui';
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
Vue.prototype.$message = Message;
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
