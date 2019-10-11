(function($,root){
    var control;
    var $playList = $("<div class = 'play-list'>"+
        "<div class='play-header'>播放列表</div>" + 
        "<ul class = 'list-wrapper'></ul>" +
        "<div class='close-btn'>关闭</div>") 
    //渲染播放列表dom
    function renderList(songList){
        var html = '';
        for(var i = 0;i < songList.length;i++){
            html += "<li><h3 >"+songList[i].song+"-<span>"+songList[i].singer+"</span></h3></li>"
        }
        $playList.find("ul").html(html);
        $('body').append($playList);
        bindEvent();
    }  
    function show(contolIndex){
        control = contolIndex;
        $playList.addClass("show");
        signSong(control.index);
    }
    function bindEvent(){
        $playList.on("click",".close-btn",function(){

            $playList.removeClass("show")
        })
        $playList.find("li").on("click",function(){
            var index = $(this).index();
            signSong(index);
            control.index = index;
            $('body').trigger("play:change",[index,true]);
            $('body').find(".play-btn").addClass("playing");
            setTimeout(function(){
                $playList.removeClass("show")
            }, 200);
        })
    }
    function signSong(index){
        $playList.find(".sign").removeClass("sign");
        $playList.find("ul li").eq(index).addClass("sign");
    }
    root.playList = {
        renderList : renderList,
        show : show
    }
})(window.Zepto,window.player || (window.player = {}))