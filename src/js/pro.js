//控制进度条
(function ($, root) {
    //  渲染左右两块时间  进度条运动
    var duration = 0;   //总时间
    var frameId = null;
    var startTime = null;
    var lastPer = 0;

    // 渲染总时间
    function renderAllTime(time) {
        duration = time;
        time = formatTime(time);
        //  切换歌曲需要初始化上一段播放进度
        lastPer = 0;
        $('.all-time').html(time);
    }

    //  将时间转成分 : 秒
    function formatTime(t) {
        t = Math.round(t);
        var m = Math.floor(t / 60);
        var s = t - m * 60;
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
        return m + ':' + s;
    }

    // 音乐播放时执行
    function start(p) {
        lastPer = p == undefined ? lastPer : p;
        cancelAnimationFrame(frameId);
        // 存储当前点击播放的时候的时间戳
        startTime = new Date().getTime();
        function frame() {
            var curTime = new Date().getTime();
             // 当前歌曲播放的总进度 = 上一段的进度 + 当前段的进度
            var per = lastPer + (curTime - startTime) / (duration * 1000);
            if( per <= 1) update(per);
            else cancelAnimationFrame(frameId);
            frameId = requestAnimationFrame(frame); //延迟，更新的时间是屏幕刷新的频率
        }
        frame();
    }

    function stop() {
        cancelAnimationFrame(frameId);
        //记录暂停的时间戳
        var stopTime = new Date().getTime();
        lastPer = lastPer + (stopTime - startTime) / (duration * 1000);
    }

    // 更新当前时间 + 更新进度条
    function update(per) {
        var curTime = formatTime(per * duration);
        $('.cur-time').html(curTime);
        var translateX = (per - 1) * 100 + '%';
        $('.pro-top').css({
            transform: 'translateX(' + translateX + ')',
        });
    }

    root.pro = {
        renderAllTime: renderAllTime,
        start: start,
        stop: stop,
        update: update
    }
})(window.Zepto, window.player || (window.player = {}))
