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

console.log('bpf.videojs started!!');


let options = {
  width: 800,
  height: 450,
  autoplay: true,
  controls: true,
  preload: 'auto',
  playbackRates: [0.2, 0.5, 1, 1.2, 1.5, 2] // youtube only allows limits up to x2

  , debug: false
}


function log(...args) {
  if (options.debug) {
    console.log(args);
  }
}




// module.exports = {
//   foo: () => console.log('foooooooo')
// }

function bpfvideojs(id, option) {
  Object.assign(options, option)
  log(options);

  this.foo = () => {
    console.log('fooooooooooo~');
  }
}

module.exports = bpfvideojs




