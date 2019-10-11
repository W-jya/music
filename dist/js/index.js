var root = window.player;
var dataList = [];
var len = 0;    //获取数据长度
var audio = root.audioManager;
var contolIndex;     //当前展示的索引
var timer = null;
var duration = 0;

// 获取数据
function getData(url) {
    $.ajax({
        type: 'GET',
        url: url,
        success: function (data) {
            root.render(data[0]);
            dataList = data;
            len = data.length;
            root.playList.renderList(data);
            contolIndex = new root.controlIndex(len);
            audio.getAudio(data[0].audio);
            root.pro.renderAllTime(data[0].duration);
            duration = data[0].duration;
            bindEvent();
            bindTouchEvent();
        },
        error: function () {
            console.log('error');
        }
    })
}
// 绑定点击事件
function bindEvent() {
    $('body').on('play:change', function(e, index) {
        audio.getAudio(dataList[index].audio);
        root.render(dataList[index]);
        if (audio.status == 'play') {
            audio.play();
            root.pro.start(0);
            rotated(0);
        }
        root.pro.renderAllTime(dataList[index].duration);
        root.pro.update(0);
         
        $('.img-box').attr('data-deg', 0);
        $('.img-box').css({
            transform: 'rotateZ(' + 0 + 'deg)',
            transition: 'none'
        })
    })
    //上一首
    $('.prev').on('click', function (e) {
        var i = contolIndex.prev();
        $('body').trigger('play:change', i);
    });
    //下一首
    $('.next').on('click', function(e) {
        var i = contolIndex.next();
        $('body').trigger('play:change', i);
    });
    //播放暂停
    $('.play').on('click', function (e) {
        if (audio.status == 'pause') {
            audio.play();
            root.pro.start();
            var deg = $('.img-box').attr('data-deg') || 0;
            rotated(deg);
        } else {
            clearInterval(timer);
            audio.pause();
            root.pro.stop();
        }
        $('.play').toggleClass('playing');
    })
    //歌曲列表
    $('.list').on('click', function(){
        root.playList.show(contolIndex);
    })

    $('.like').on('click', function () {
        // var isLike = dataList[contolIndex.index].isLike;
        $('.like').toggleClass('liking');
        
    })
}
function bindTouchEvent() {
    var left =  $('.pro-bottom').offset().left;
    var width = $('.pro-bottom').offset().width;
    $('.spot').on('touchstart', function (e) {
        root.pro.stop();
    }).on('touchmove', function (e) {
        var x = e.changedTouches[0].clientX - left;
        var per = x / width;
        if (per >= 0 && per < 1) {
            root.pro.update(per);
        }
    }).on('touchend', function (e) {
        var x = e.changedTouches[0].clientX - left;
        var per = x / width;
        var curTime = per *  dataList[contolIndex.index].duration;;
        if (per >= 0 && per < 1) {
            audio.playTo(curTime);
            audio.play();
            root.pro.start(per);
            audio.status == 'play';
            $('.play').addClass('playing');
       }
       
    })
}
//自动播放  
$(audio.audio).on('ended', function () {
    $('.next').trigger('click');
})
function rotated(deg) {
    clearInterval(timer);
    deg = parseInt(deg);
    timer = setInterval(function () {
        deg += 2;
        $('.img-box').attr('data-deg', deg);
        $('.img-box').css({
            transform: 'rotateZ(' + deg + 'deg)',
            transition: 'transform 0.2s linear'
        })
    }, 200);
}
getData('../mock/data.json');


// 信息 + 图片渲染到页面上
// ，点击按钮
// 音频的播放与暂停  切歌
//  图片旋转
// 列表切歌 --> 作业
// 进度条运动与拖拽