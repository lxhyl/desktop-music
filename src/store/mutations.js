


export default {
    getUserId(state,id){
       state.userid = id;
    },
    getMusicId(state,id){
       state.musicid= id;
    },
    //改变播放状态
    changePlayState(state,value){
       state.isPlaying = value;
    },
    //获取音乐信息
    getMusicInfo(state,value){
       state.musicInfo = value;
    },
    //更新音乐播放时长
    getMusicPlayTime(state,value){
      state.musicPlayTime = value;
    },
    // 更新音乐列表
    getPlayLists(state,lists){
       state.playLists= lists;
    }
}