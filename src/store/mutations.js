
function changeState(state,oldValue,newValue){
    state[oldValue] = newValue;
}

export default {
   changeState,
   getUserId(state, id) {
      state.userid = id;
   },
   getMusicId(state, id) {
      state.musicid = id;
   },
   //用户歌单
   getUserList(state,value){
     let arr = [];
     let userid = localStorage.getItem('userid');
     for(let i=0;i<value.length;i++){
        if(userid == value[i].creator.userId){
           arr.push(value[i]);
        }
     }
     state.userList = arr;
   },
   //改变播放状态
   changePlayState(state, value) {
      state.isPlaying = value;
   },
   //获取音乐信息 添加进历史记录
   getMusicInfo(state, value) {
      //将新值于老值比较，如果不相等再更新
      let o =JSON.stringify(state.musicInfo);
      let n = JSON.stringify(value);
      if(o === n){
        return;
      }
      if (state.musicid == value.privileges[0].id) {
         state.musicInfo = value;
         let id = value.songs[0].id;
         let name = value.songs[0].name;
         let ar = value.songs[0].ar[0].name;    
         let song = {
            id,
            listenTime: new Date().getTime(),
            name,
            ar
          };
          let history = JSON.parse(localStorage.getItem("playHistory"));
          if (history) {
            history.unshift(song);
            if (history.length > 100) {
              history.pop();
            }
            let str = JSON.stringify(history);
            localStorage.setItem("playHistory", str);
          } else {
            //如果第一次听歌，初始化听歌历史数组
            let arr = [song];
            let str = JSON.stringify(arr);
            localStorage.setItem("playHistory", str);
          }
      }

   },
   //更新音乐播放时长
   getMusicPlayTime(state, value) {
      state.musicPlayTime = value;
   },
   //改变音量
   setMusicVolume(state, value) {
      state.musicVolume = value
   },
   // 更新音乐列表
   getPlayLists(state, lists) {
      state.playLists = lists;
   },
   //打开关闭搜索弹框
   changeSearchPopover(state, value) {
      state.searchPopover = value;
   },
   // 改变搜索词
   setSearchKey(state, value) {
      state.searchKey = value;
   },
   //改变fm模式
   setFm(state, value) {
      state.fm = value;
   },
   //改变音乐码率
   changeBr(state, value) {
      state.br = parseInt(value) * 1000;
   },
   //改变播放模式，顺序/随机
   changeRandomPlay(state, value) {
      state.randomPlay = value;
   },
   //遇到会员或无版权单曲时是否自动切换下一首
   changeCanNotplayToNext(state, value) {
      state.canNotplayToNext.value = value;
      state.canNotplayToNext.num += 1;
   },
   //是否在播放
   isplaying(state,value){
      state.playing = value
   },
   getcommentFocus(state,value){
      state.commentFocus = value;
   },
   //是否显示主界面
   getshowMain(state,value){
      state.showMain = value
   }
}