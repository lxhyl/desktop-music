


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
    }
}