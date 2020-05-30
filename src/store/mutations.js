


export default {
   getUserId(state, id) {
      state.userid = id;
   },
   getMusicId(state, id) {
      state.musicid = id;
   },
   //改变播放状态
   changePlayState(state, value) {
      state.isPlaying = value;
   },
   //获取音乐信息
   getMusicInfo(state, value) {
      if (state.musicid == value.privileges[0].id) {
         state.musicInfo = value;
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
}