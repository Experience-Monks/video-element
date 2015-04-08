# video-element

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

A simple HTML5/YouTube Video Element with a unified interface

## Installation

```bash
npm i video-element
```

## Usage

[![NPM](https://nodei.co/npm/video-element.png)](https://www.npmjs.com/package/video-element)

The constructor can be used with or without the "new" keyword

```bash
var Video = require('video-element');
var myVid = new Video(options,callback);
```

OR

```bash
var Video = require('video-element');
Video(options,function(error,player) {
	if (!error) {
		// use player
	}
});
```

The options parameter accepts these properties:

```bash
type: 'youtube', 				// defaults to html5
url: 'videos/myVideo.mp4', 		// or just the youtube ID if using youtube
formats: ['mp4','webm','ogg'] 	// The list of available video file format
								// it will pick the best one for the browser
el: 'vid2', 					// The dom element to add the player to,
								// this can be left blank and you can use appendTo later
width: '100%',
height: '100%',
controls: true,
autoplay: false,
preload: true,
poster: '',
loop: false,
muted: false
```

The callback parameter returns an error as the first paramenter, and the player object as the second. If there is an error, the player will be undefined, if not, the error will be undefined.

#### Signals

The player implements signals for its event interface, these are the available signals:

onInit: player has been created
onReady: player is ready to play
onPlay: player has started playing
onPause: player is paused
onEnd: player has reached the end of the video
onProgress: dispatched on a timer while the video is playing, useful for tracking time/duration/load
onBuffering: player is buffering more video
onError: player has encountered an error

#### `player.play()`

Plays the video

#### `player.pause()`

Pauses the video

#### `player.appendTo(dom)`

Adds the player to a dom element, if a string, it will assume its an ID and use document.getElementByID.

#### `player.destroy()`

Destroys the video and removes it from the dom

## License

MIT, see [LICENSE.md](http://github.com/njam3/video-element/blob/master/LICENSE.md) for details.
