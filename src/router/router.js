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
import Gxtj from '../components/findMusic/Gxtj.vue'
import Zbdt from "../components/findMusic/Zbdt.vue"

// 用户主页
import Me from "../components/main/Me.vue"
// 播放历史
import PlayHistory from "../components/main/PlayHistory.vue"
// 歌单列表
import PlayList from "../components/PlayList.vue"
// 播放详情组件
import PlayDetail from "../components/main/PlayDetail.vue"
// 搜索结果
import SearchResult from "../components/main/SearchResult.vue"
//设置
import Setting from "../components/main/Setting.vue"
//404
import Notfound from '../components/main/404.vue'
export default new Router({
    mode:'hash',
    routes:[
       
        {
            path:'/',
            name:"findmusic",
            component:FindMusic,
            children:[
               {
                   path:'/',
                   name:'gxtj',
                   component:Gxtj,
               },
               {
                   path:'/zbdt',
                   name:'zbdt',
                   component:Zbdt
               }
            ]
        },
        {
           path:'/history',
           name:'history',
           component:PlayHistory
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
            path:'/playDetail',
            name:'playDetail',
            component:PlayDetail,
        },
        {
            path:'/search',
            name:'search',
            component:SearchResult
        },
        {
            path:'/setting',
            name:'setting',
            component:Setting
        },
        {
            path:'/*',
            component:Notfound
        }

    ]
})