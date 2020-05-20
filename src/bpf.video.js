/**
 * Customize video.js by blackpet
 *
 * @see https://videojs.com
 * @author blackpet
 * @date 2020.5.4
 */
// import videojs from 'video.js'
// import 'videojs-youtube'
// import 'video.js/dist/video-js.css'
// import '@videojs/themes/dist/fantasy/index.css'
// import './bpf.video.css'
const videojs = require('video.js')
require('videojs-youtube')
require('video.js/dist/video-js.css')
require('@videojs/themes/dist/fantasy/index.css')
require('./bpf.video.css')

function BpfVideo(id, _bpfOption, _videoOption) {

  let containerId;
  let videoId;
  let video;

  let initdone = false;

  const bpfOption = {
    debug: false,

    callback: null,
    callbackParam: null,
    callbackInterval: 5,

    currentTime: 0,

    ready: null
  }

  const videoOption = {
    width: 800,
    height: 450,
    // autoplay: true,
    controls: true,
    preload: 'auto',

    // youtube only allows limits up to x2
    playbackRates: [0.2, 0.5, 1, 1.2, 1.5, 2],
  }

  const timer = {
    played: 0,
    opened: 0,

    elapsedPlay: 0,
    elapsedOpen: 0,

    timestamp: 0,
    elapsed: 0,
    interval: 5, // 진도체크 갱신 단위 (s)

    intervalId: null,

    tiktok: true, // 타이머 작동 유무

    /**
     * start timer
     */
    start: () => {
      timer.timestamp = new Date().getTime();
    },

    /**
     * dispose timer (clearInterval)
     */
    dispose: () => {
      video.clearInterval(timer.intervalId);
    },

    /**
     * count-up timer
     * @param player
     * @param forced update progress
     */
    increaseTime: (player, updateProgress) => {
      log(timer);
      if (updateProgress) log('forced updateProgress!');

      timer.elapsed = (new Date().getTime() - timer.timestamp) / 1000;

      // played time
      timer.played += player.paused() ? 0 : timer.elapsed * player.playbackRate();
      timer.elapsedPlay += player.paused() ? 0 : timer.elapsed * player.playbackRate();
      // opened time
      timer.opened += timer.elapsed;
      timer.elapsedOpen += timer.elapsed;

      timer.timestamp = new Date().getTime();

      // update study progress
      if (updateProgress || timer.opened % timer.interval < 1) {
        timer.updateProgress();

        // reset elapsed time
        timer.elapsedPlay = timer.elapsedOpen = 0;
      }
    },

    /**
     * update study progress
     */
    updateProgress: () => {
      if (!!bpfOption.callback && typeof bpfOption.callback === 'function') {
        log(`callback!!! timer`, getTimer());
        const param = bpfOption.callbackParam || {};
        bpfOption.callback(getTimer(), param);
      } else {
        log(`abstract updateProgress(). Be sure to overwrite it! timer`, getTimer());
      }
    }
  } // end of timer

  // on-ready videojs
  function readyVideo() {
    const $video = this;

    log('currentSrc', $video.currentSrc());
    log('currentType', $video.currentType());
    log($video.el().dataset);

    let options = {};

    if ($video.currentType() === 'video/youtube') {
      options = Object.assign(options, {
        techOrder: ['youtube'],
        forceSSL: true,
        forceHTML5: true,
        Origin: 'http://localhost:4000'
      });
    }

    // current time
    if (bpfOption.currentTime > 0) {
      // wait for video metadata to load, then set time
      $video.on("loadedmetadata", function(){
        $video.setTimeout(() => {
          this.currentTime(bpfOption.currentTime);
          log(`setCurrentTime to ${bpfOption.currentTime}`, 'loadedmetadata');
        }, 500);
      });

      // iPhone/iPad need to play first, then set the time
      // events: https://www.w3.org/TR/html5/embedded-content-0.html#mediaevents
      $video.on("canplaythrough", function(){
        if(!initdone)
        {
          log(`setCurrentTime to ${bpfOption.currentTime}`, 'canplaythrough');
          this.currentTime(bpfOption.currentTime);
          initdone = true;
        }
      });
    }

    $video.options(options);
    $video.play();

    // start timer
    timer.start();
    timer.intervalId = $video.setInterval(function () {

      timer.increaseTime($video);

      // 최초에 자동재생 되지 않은 경우는 재생 하자!
      if(timer.opened < 2 && $video.paused()) this.play();
    }, 1000);

    // execute user define ready function
    if (!!bpfOption.ready && typeof bpfOption.ready === 'function') {
      bpfOption.ready();
    }
  }

  // create media element by type
  function createMedia() {
    // detect media type
    const type = _videoOption.sources instanceof Array ? _videoOption.sources[0].type : _videoOption.sources.type;
    // video / audio Exception type arrays...
    const videoType = ['application/x-mpegurl'];
    const audioType = [];

    // create media element by type
    let tag;
    if (type.startsWith('video/')) {
      tag = 'video';
    } else if (type.startsWith('audio/')) {
      tag = 'audio';
    } else if (videoType.indexOf(type) > -1) {
      tag = 'video';
    } else if (audioType.indexOf(type) > -1) {
      tag = 'audio';
    } else {
      throw new Error(`Not suppored media type "${type}"`);
    }
    const media = document.createElement(tag);
    media.classList.add('video-js', 'vjs-theme-fantasy', 'bpf-video');

    return media;
  }

  function disposeExistsPlayer() {
    // dispose legacy videojs if exists
    if (!!document.querySelector(`#${containerId} .bpf-video`) && !!document.querySelector(`#${containerId} .bpf-video`).player) {
      document.querySelector(`#${containerId} .bpf-video`).player.dispose();
    }
  }

  // create videojs
  function init() {
    containerId = id;
    // generate random video id
    videoId = id + '-' + Math.random().toString(36).substring(2, 10);

    // dispose legacy videojs if exists
    disposeExistsPlayer();

    // create media element by type
    const media = createMedia();
    media.id = videoId;
    document.getElementById(id).insertAdjacentElement('afterbegin', media);

    // extends options...
    Object.assign(bpfOption, _bpfOption);
    Object.assign(videoOption, _videoOption);
    log(bpfOption, videoOption);
    // timer interval
    timer.interval = bpfOption.callbackInterval;

    // create videojs
    video = videojs.default(videoId, videoOption);

    video.ready(readyVideo);
    video.on('ended', () => timer.increaseTime(video, true));
  }

  init();

  // logger
  function log(...args) {
    if (bpfOption.debug) {
      console.log(videoId, args);
    }
  }

  function debugging(_flag) {
    var flag = !bpfOption.debug;
    if (typeof _flag === 'boolean') {
      flag = _flag;
    }
    bpfOption.debug = flag;
  }

  function getTimer() {
    return {
      opened: Math.round(timer.opened * 100) / 100,
      played: Math.round(timer.played * 100) / 100,
      elapsedPlay: Math.round(timer.elapsedPlay * 100) / 100,
      elapsedOpen: Math.round(timer.elapsedOpen * 100) / 100,
      currentTime: Math.round(video.currentTime() * 100) / 100,

      dispose: timer.dispose
    }
  }

  return {
    video: video,
    bpfOption: bpfOption,
    videoOption: videoOption,
    debugging: debugging,
    getTimer: getTimer,
    dispose: disposeExistsPlayer
  }
} // end of function BpfVideo



module.exports = (id, _bpfOption = {}, _videoOption = {}) => {
  return new BpfVideo(id, _bpfOption, _videoOption);
}


