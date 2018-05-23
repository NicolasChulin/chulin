/**
 * [description]
 * @author  chulin
 * @description extend tracking
 * @description created in 2018-05-23 13:50:00
 */
(function (window, undefined) {

  tracking.trackVideo_ = function(element, tracker) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var width;
    var height;

    var resizeCanvas_ = function() {
      width = element.offsetWidth;
      height = element.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resizeCanvas_();
    element.addEventListener('resize', resizeCanvas_);

    var requestId;
    var start;
    var aniDuring = tracker.aniDuring ? tracker.aniDuring : 2000;
    var requestAnimationFrame_ = function() {
      requestId = window.requestAnimationFrame(function(timestamp) {
        if (element.readyState === element.HAVE_ENOUGH_DATA) {
          try {
            context.drawImage(element, 0, 0, width, height);
          } catch (err) {}

          if (!start) start = timestamp;
          var during = timestamp - start;
          if (during > aniDuring) {
            start = timestamp;
            tracking.trackCanvasInternal_(canvas, tracker);
          }
        }
        requestAnimationFrame_();
      });
    };

    var task = new tracking.TrackerTask(tracker);
    task.on('stop', function() {
      window.cancelAnimationFrame(requestId);
    });
    task.on('run', function() {
      requestAnimationFrame_();
    });
    return task.run();
  };

  /**
   * Specifies requestAnimationFrame time during, unit ms.
   * @default 2000
   * @type {number}
   */
  tracking.ObjectTracker.prototype.aniDuring = 2000;

  /**
   * Gets the aniDuring.
   * @return {TypedArray.<number>}
   */
  tracking.ObjectTracker.prototype.getAniDuring = function() {
    return this.aniDuring;
  };

  /**
   * Sets the aniDuring.
   * @param {TypedArray.<number>} aniDuring
   */
  tracking.ObjectTracker.prototype.setAniDuring = function(aniDuring) {
    this.aniDuring = aniDuring;
  };

})(window);


/**
 * TrackingFace class for application
 */
(function (window, undefined) {

  /**
   * @param       {[type]} opts.videoId 视频元素id，默认为vide
   * @param       {[type]} opts.canvasId canva元素id，默认为canvas
   * @param       {[type]} opts.aniDuring 视频捕捉间隔，默认2000 ms
   * @constructor
   */
  function TrackingFace (opts) {

    var opts = typeof opts === 'undefined' ? {} : opts;
    this.stopT = 0;
    this.runT = 0;
    this.stopDuring = 3000;
    this.runDuring = 300;
    this.videoId = opts.videoId || 'video';
    this.canvasId = opts.canvasId || 'canvas';
    this.aniDuring = opts.aniDuring || 2000;
    this.tracker =  new tracking.ObjectTracker('face');
    this.trackTask = null
    this.morePeopleWarning = null
    this.nonePeopleWarning = null
  }

  /**
   * 开始视频捕捉
   * @param  {[function]} morePeopleWarning [more people catched callback]
   * @param  {[function]} nonePeopleWarning [none people catched callback]
   */
  TrackingFace.prototype.catchView = function (morePeopleWarning, nonePeopleWarning) {

    this.tracker.setInitialScale(4);
    this.tracker.setStepSize(2);
    this.tracker.setEdgesDensity(0.1);
    this.tracker.setAniDuring(this.aniDuring);
    this.morePeopleWarning = morePeopleWarning;
    this.nonePeopleWarning = nonePeopleWarning;
    this.trackTask = tracking.track('#' + this.videoId, this.tracker, { camera: true });
    this.bindEvent()
  }

  /**
   * bind event
   */
  TrackingFace.prototype.bindEvent = function () {
    var _this = this;
    var canvas = document.getElementById(_this.canvasId);
    var videoDom = document.getElementById(_this.videoId);
    var context = canvas.getContext('2d');

    _this.tracker.on('track', function (event) {
      context.clearRect(0, 0, canvas.width, canvas.height);

      if (event.data.length > 1) {
        // 出现多人情况
        // 截取视频图像
        context.drawImage(videoDom, 0, 0, canvas.width, canvas.height);
        var shotImg = canvas.toDataURL('image/jpeg', 0.5);
        // 触发回调
        if (typeof _this.morePeopleWarning === 'function') _this.morePeopleWarning(shotImg)

      } else if (event.data.length === 0) {
        // 没有人情况-回调
        if (typeof _this.nonePeopleWarning === 'function') _this.nonePeopleWarning()
      } else {
        // console.log('1111')
        // console.log(event.data)
      }

      // 绘制头像识别框
      event.data.forEach(function (rect) {
        context.strokeStyle = '#dd0a20';
        context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        context.font = '11px Helvetica';
        context.fillStyle = "#dd0a20";
        context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
        context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
      });
    });
  }

  /**
   * 停止捕捉任务
   */
  TrackingFace.prototype.stopCatch = function () {
    this.trackTask.stop();
  }

  /**
   * 开始捕捉任务
   */
  TrackingFace.prototype.runCatch = function () {
    this.trackTask.run();
  }

  // 周期阶段性捕捉最好不用
  // 周期性捕捉，每捕捉500毫秒，暂停2500毫秒
  /**
   * 开启周期停止
   */
  TrackingFace.prototype.periodStopCatch = function () {
    var _this = this;
    _this.stopCatch();
    _this.stopT = setTimeout(function () {
      _this.periodRunCatch()
    }, _this.stopDuring)
  }

  /**
   * 开启周期运行
   */
  TrackingFace.prototype.periodRunCatch = function () {
    var _this = this;
    _this.runCatch()
    _this.runT = setTimeout(function () {
      _this.periodStopCatch()
    }, _this.runDuring)
  }

  /**
   * 清除周期性捕捉
   */
  TrackingFace.prototype.clearPeriod = function () {
    clearTimeout(this.stopT);
    clearTimeout(this.runT);
    this.stopCatch()
  }

  window.TrackingFace = TrackingFace;

})(window);
