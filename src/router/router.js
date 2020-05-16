import Vue from 'vue'
import Router from 'vue-router'

const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}


Vue.use(Router)




//发现音乐栏
//个性推荐
import FindMusic from '../components/findMusic/Index.vue'
// 用户主页
import Me from "../components/main/Me.vue"

// 歌单列表
import PlayList from "../components/PlayList.vue"
// 播放组件
import Play from "../components/Play.vue"
export default new Router({
    mode:'hash',
    routes:[
       
        {
            path:'/',
            name:"findmusic",
            component:FindMusic
        },
        {
            path:'/me',
            name:"me",
            component:Me,
        },
        {
            path:'/playlist',
            name:"playlist",
            component:PlayList,
        },
        {
            path:'/play',
            name:'play',
            component:Play,
        }

    ]
})