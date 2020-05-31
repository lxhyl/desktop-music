const state = {
     userid:null, //用户id
     musicid:null, 
     isPlaying:false, // 是否显示播放组件
     musicInfo:null, // 音乐信息
     musicPlayTime:0,//音乐播放时长
     musicVolume:0.5,//音量
     playLists:null,//播放列表
     searchPopover:false,//是否显示搜索弹出框
     searchKey:'',//搜索关键词
     fm:false,//是否是fm模式
     tuijian:false,//是否是推荐歌曲
     br:128000,//音乐码率
     randomPlay:false,//是否是随机播放
}
export default state

