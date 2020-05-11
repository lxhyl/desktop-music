import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

//个性推荐
import Gxtj from '../components/main/Gxtj.vue'
// header消息列表

// 评论的
import Pinglun from "../components/msg/Pinglun.vue"
// 私信的
import Sixin from '../components/msg/Sixin.vue'
// 通知
import Tongzhi from '../components/msg/Tongzhi.vue'
export default new Router({
    mode:'hash',
    routes:[
        {
            path:'/',
            components:{
              default:Gxtj,
              pinglun:Pinglun,
              sixin:Sixin,
              tongzhi:Tongzhi,
            }
        }
    ]
})