import Vue from 'vue'
import Router from 'vue-router'


const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error)
}


Vue.use(Router)

//发现音乐栏
//个性推荐
import FindMusic from '../components/findMusic/Index.vue'
import Gxtj from '../components/findMusic/Gxtj.vue'
import Zbdt from "../components/findMusic/Zbdt.vue"
import TopList from "../components/findMusic/TopList.vue"
import NewSongs from "../components/findMusic/NewSongs.vue"
import Xgsd from "../components/findMusic/Xgsd.vue"
import Xdsj from "../components/findMusic/Xdsj.vue"

//视频栏
import VideoIndex from "../components/video/Index.vue"
import VideoGroup from "../components/video/VideoGroup.vue"
import PlayVideo from "../components/video/PlayVideo.vue"
// 用户主页
import Me from "../components/main/Me.vue"
// 播放排行
import PlayRank from "../components/main/PlayRank.vue"
//播放历史
import PlayHistory from "../components/main/PlayHistory.vue"
// 歌单列表
import PlayList from "../components/PlayList.vue"
// 播放详情组件
import PlayDetail from "../components/main/PlayDetail.vue"
//专辑
import Album from "../components/Album.vue"

// 搜索结果
import SearchResult from "../components/main/SearchResult.vue"
import SearchSongs from "../components/search/SearchSongs.vue"
//歌单
import SearchPlayLists from "../components/search/PlayLists";
//用户
import SearchUsers from "../components/search/Users"
//视频
import SearchVideo from "../components/search/SearchVideo"


//设置
import Setting from "../components/main/Setting.vue"
//404
import Notfound from '../components/main/404.vue'
export default new Router({
    mode: 'hash',
    routes: [
        {
            path: '/',
            name: "findmusic",
            component: FindMusic,
            children: [
                {
                    path: '/',
                    name: 'gxtj',
                    component: Gxtj,
                },
                {
                    path: '/zbdt',
                    name: 'zbdt',
                    component: Zbdt
                },{
                    path:'/topList',
                    name:'topList',
                    component:TopList,
                },{
                    path:'/newSongs',
                    name:'newSongs',
                    component:NewSongs,
                    children:[
                       {
                           path:'/newSongs',
                           component:Xgsd
                       },
                       {
                           path:'/newSongs/album',
                           component:Xdsj
                       }

                       
                    ]
                }
            ]
        },
        {
          path:'/video',
          name:'video',
          component:VideoIndex,
          children:[
              {
                  path:'/video',
                  name:'videoGroup',
                  component:VideoGroup
              },
          ]
        },
        {
            path: '/rank',
            name: 'rank',
            component: PlayRank
        },
        {
            path: '/history',
            name: 'history',
            component: PlayHistory
        },
        {
            path: '/me',
            name: "me",
            component: Me,
        },
        {
            path: '/playlist',
            name: "playlist",
            component: PlayList,
        },
        {
            path:'/album',
            name:'album',
            component:Album

        },
        {
            path: '/playDetail',
            name: 'playDetail',
            component: PlayDetail,
        },
        {
            path: '/search',
            name: 'search',
            component: SearchResult,
            children:[
                {
                   path:'/search',
                   component:SearchSongs
                },
                {
                    path:'/search/lists',
                    component:SearchPlayLists,
                },
                {
                    path:'/search/users',
                    component:SearchUsers,
                },
                {
                    path:'/search/videos',
                    component:SearchVideo,

                }
            ]
        },
        {
            path: '/setting',
            name: 'setting',
            component: Setting
        },
        {
            path:'/playVideo',
            name:'playVideo',
            component:PlayVideo
         },
        {
            path: '/*',
            name:'404',
            component: Notfound
        }

    ]
})