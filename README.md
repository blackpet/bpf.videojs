# Bpf.Videojs

Bpf.Videojs 는 [videojs](https://videojs.com)를 Customizing 하여 개발한 플레이어 입니다.


<br><br>


# Usage
### 1. bpf.video.js 파일을 페이지 내에 삽입

```
<script src="/static/common/js/bpf.video.js"></script>
```


### 2. container tag 작성
실행 시 video Tag의 id를 매개변수로 사용하기 때문에 **id attribute 는 필수**입니다.


```
<div id="my-video"></div>
```



#### full-version
```
<script>

  // [optional] bpf.videojs Options
  var bpfOption = {
    debug: true, // debugging log 사용 유무
    
    callback: function (timer, param) {
      // 진도체크용 callback function
      // TODO 진도체크 등... 
      console.log('mp4 callback!!!', timer, param);
    },
    callbackParam: {key1: 1, key2: 2}, // callback() 시 2번째 argument [param] 으로 전달할 parameters
    callbackInterval: 10, // callback 이 호출될 시간 간격 (초) [default: 5]
    
    currentTime: 100, // 100초 부터 재생 시작 [default: 0]
    
    ready: function () {
      // video loading 이후 실행될 script
      // TODO ...
      $('#debuggingMp4Btn, #debuggingMp4Btn2, #debuggingMp4Btn3').prop('disabled', false);
      $('#debuggingMp4Btn').click(mp4.debugging);
      $('#debuggingMp4Btn2').click( function() {mp4.debugging(true);} );
      $('#debuggingMp4Btn3').click( function() {mp4.debugging(false);} );
    }
  };
  
  // [optional] original videojs Options
  var videoOption = {
    width: 800, 
    height: 450, 
    sources: {src: 'https://www.radiantmediaplayer.com/media/bbb-360p.mp4', type: 'video/mp4'},
    poster: 'https://w.namu.la/s/9073525ef7fd39a5ac0592ae925a030eb23a122ff207e41fb4f2867bbcb4db2df961ab065f3975196f04302569878624fd23fc41a1b6e0aa92b78835064f3b7572bf9a811fefa0eb422fa503f7273541deba6e35c0a710f05bbd2bbd0d06092f'
  }

  var mp4 = bpf.videojs('my-video', bpfOption, videoOption);
  
</script>
```


#### simple-version (진도체크 없이 기본옵션으로 단순 재생만 할 경우)
```
<script>

  var video = bpf.videojs('my-video', {}, {sources: {src: 'https://www.radiantmediaplayer.com/media/bbb-360p.mp4', type: 'video/mp4'}});
  
</script>
```



<br><br>


# API

## source type

### video
video mime type 에 해당하는 모든 source

```
sources: {src: 'https://www.radiantmediaplayer.com/media/bbb-360p.mp4', type: 'video/mp4'}
```

MP4 파일은 `type="video/mp4"` 를 지정합니다.



### audio
audio mime type 에 해당하는 모든 source

```
sources: {src: 'http://www.hochmuth.com/mp3/Bloch_Prayer.mp3', type: 'audio/mp3'}
```

MP3 파일은 `type="audio/mp3"` 를 지정합니다.




### youtube

```
sources: {src: 'https://www.youtube.com/watch?v=ahaosybofjs', type: 'video/youtube'}
```

Youtube 의 경우 `type="video/youtube"` 를 지정합니다.


<br><br>

## Options

### bpfOption

bpf.videojs 의 Customizing 한 옵션입니다.


> bpfOption = {debug, callback, callbackParam, callbackInterval, currentTime, ready}



#### debug

* **default: false**

debugging log 를 활성화/비활성화 하는 옵션입니다.


> debug: true / false



#### callback()

진도체크 등과 같은 재생 중 재생시간을 자동저장할 수 있는 callback function 입니다.


> callback: function(timer, param)


* timer: {played, opened, elapsedPlay, elapsedOpen, currentTime, dispose}
    * played: 플레이어를 재생한 시간, 배속 적용 시 배속도 반영된 재생 시간 (초)
    * opened: 플레이어 초기화 후 경과된 물리 시간 (초)
    * elapsedPlay: 이전 callback.played 에서 신규로 경과된 재생 시간 (초)
    * elapsedOpen: 이전 callback.opened 에서 신규로 경과된 물리 시간 (초)
    * currentTime: media의 현재 재생 시간 (current position)
    * dispose(): timer 객체 폐기, 더이상 callback 되지 않는다

* param: 생성시 전달한 **callbackParam** 을 그대로 전달해 줍니다. (ex. 진도체크 시 과정/차수/컨텐츠 ID 등)


#### callbackParam

callback()의 2번째 arguments 로 전달받을 파라메터


#### callbackInterval

callback()이 실행될 실행 주기 (초)



#### currentTime

media 재생 시작 시간 (current position) 지정





#### ready()

bpf.videojs 가 초기화 된 직후에 실행






### videoOption

videojs 원본 option 입니다. 
기본적으로 {sources, width, height, poster} 등을 사용할 수 있습니다.
구체적인 option 정보는 Video.js Option을 참조 바랍니다.

참조: [Video.js Options Reference](https://docs.videojs.com/tutorial-options.html)




<br><br>

## return value

```
<script>

  var video = bpf.videojs('my-video');
  
</script>
```



bpf.videojs 로 video 생성 시 반환되는 자료형


> {video, bpfOption, videoOption, debugging, getTimer(), dispose()}


### video

videojs Object


### bpfOption / videoOption

생성 시 전달한 option 정보와 default option을 합한 option 정보


### debugging(bool)

debugging log를 활성화/비활성화 할 수 있는 function

argument를 전달하지 않으면 상태가 toggle 됩니다.


### getTimer()

> return {opened, played, elapsedOpen, elapsedPlay, currentTime}



### dispose()

> void

bpf.videojs 객체를 폐기한다.






