var Class = require('js-oop');
var Signal = require('signals').Signal;
var on = require('dom-event');

var Video = new Class({
	currentTime: {
		get: function() {
			return (this.isYoutube) ? this.player.getCurrentTime() : this.player.currentTime;
		},
		set: function(value) {
			(this.isYoutube) ? this.player.seekTo(value) : this.player.currentTime = value;
		}
	},
	volume: {
		get: function() {
			return (this.isYoutube) ? this.player.setVolume && this.player.getVolume() : this.player.volume;
		},
		set: function(value) {
			(this.isYoutube) ? this.player.setVolume && this.player.setVolume(value) : this.player.volume = value;
		}
	},
	muted: {
		get: function() {
			return (this.isYoutube) ? this.player.isMuted() : this.player.muted;
		},
		set: function(value) {
			if (this.isYoutube) {
				(value) ? this.player.mute() : this.player.unMute();
			} else {
				this.player.muted = value;
			}
		}
	},
	playbackRate: {
		get: function() {
			return (this.isYoutube) ? this.player.getPlaybackRate() : this.player.playbackRate;
		},
		set: function(value) {
			(this.isYoutube) ? this.player.setPlaybackRate(value) : this.player.playbackRate = value;
		}
	},
	currentSrc: {
		get: function() {
			return (this.isYoutube) ? this.player.getVideoURL() : this.player.currentSrc;
		}
	},
	width: {
		get: function() {
			return this.options.width;
		},
		set: function(value) {
			this.options.width = value;
			((this.isYoutube) ? this.player.getIframe() : this.player).setAttribute('width',this.options.width);
		}
	},
	height: {
		get: function() {
			return this.options.height;
		},
		set: function(value) {
			this.options.height = value;
			((this.isYoutube) ? this.player.getIframe() : this.player).setAttribute('height',this.options.height);
		}
	},
	videoWidth: {
		get: function() {
			return (this.isYoutube) ? this.options.width : this.player.videoWidth;
		}
	},
	videoHeight: {
		get: function() {
			return (this.isYoutube) ? this.options.height : this.player.videoHeight;
		}
	},
	duration: {
		get: function() {
			return this._duration;
		}
	},
	loaded: {
		get: function() {
			return this._loaded;
		}
	},
	_duration: 0,
	_loaded: 0,
	initialize: function(options,callback) {
		if (!(this instanceof Video)) return new Video(options,callback);
		options.width = options.width || 'auto';
		options.height = options.height || 'auto';

		// Signals
		this.onInit = new Signal();
		this.onReady = new Signal();
		this.onPlay = new Signal();
		this.onPause = new Signal();
		this.onEnd = new Signal();
		this.onProgress = new Signal();
		this.onBuffering = new Signal();
		this.onError = new Signal();
    this.playing = false;

    this._ready = this._ready.bind(this);
    this._checkYoutubeState = this._checkYoutubeState.bind(this);
    this._checkYoutubeError = this._checkYoutubeError.bind(this);
    this._checkHTML5State = this._checkHTML5State.bind(this);
    this._checkHTML5Error = this._checkHTML5Error.bind(this);

		this.options = options;
		this.callback = callback;
		this.isYoutube = (options.type === 'youtube');
		options.el = (typeof(options.el) === 'string') ? document.getElementById(options.el) : options.el;

    var _this = this;

    if (this.isYoutube) {
			require('./lib/youtube')(options.url,options,function(error,player) {
				if (!error) {
					_this.player = player;
					_this.player.addEventListener('onReady',_this._ready);
					_this.player.addEventListener('onStateChange',_this._checkYoutubeState);
					_this.player.addEventListener('onError',_this._checkYoutubeError);
					_this.onInit.dispatch();
					if (this.callback) this.callback(undefined,this);
				} else {
					this.onError.dispatch(error.message);
					if (this.callback) this.callback(error);
				}
			}.bind(_this));
		} else {
			require('./lib/html5.js')(options.url,options,function(error,player) {
				if (!error) {
					this.player = player;

					on(this.player,'error',this._checkHTML5Error);
					on(this.player,'canplay',this._checkHTML5State);
					on(this.player,'ended',this._checkHTML5State);
					on(this.player,'play',this._checkHTML5State);
					on(this.player,'pause',this._checkHTML5State);
					on(this.player,'waiting',this._checkHTML5State);
					if (options.el) options.el.appendChild(this.player);
					this.onInit.dispatch();
					if (this.callback) this.callback(undefined,this);
				} else {
					this.onError.dispatch(error.message);
					if (this.callback) this.callback(error);
				}
			}.bind(this));
		}
	},
	_checkYoutubeState: function(e) {
		switch (e.data) {
			case this.player.api.PlayerState.CUED:
				// this._ready();
				break;
			case this.player.api.PlayerState.ENDED:
				this.onEnd.dispatch();
				break;
			case this.player.api.PlayerState.PLAYING:
				this.playing = true;
				this.onPlay.dispatch();
				break;
			case this.player.api.PlayerState.PAUSED:
        this.playing = false;
				this.onPause.dispatch();
				break;
			case this.player.api.PlayerState.BUFFERING:
				this.onBuffering.dispatch();
				break;
		}
	},
	_checkYoutubeError: function(e) {
		switch (e.data) {
			case 2:
				this.onError.dispatch('Invalid YouTube Parameter');
				break;
			case 100:
				this.onError.dispatch('YouTube Video Not Found');
				break;
			case 101:
			case 150:
				this.onError.dispatch('Cannot Embed YouTube Player');
				break;
		}
	},
	_checkHTML5Error: function(e) {
		switch (e.target.error.code) {
			case e.target.error.MEDIA_ERR_ABORTED:
				this.onError.dispatch('You aborted the video playback.');
			break;
			case e.target.error.MEDIA_ERR_NETWORK:
				this.onError.dispatch('A network error caused the video download to fail part-way.');
			break;
			case e.target.error.MEDIA_ERR_DECODE:
				this.onError.dispatch('The video playback was aborted due to a corruption problem or because the video used features your browser did not support.');
			break;
			case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
				this.onError.dispatch('The video could not be loaded, either because the server or network failed or because the format is not supported.');
			break;
			default:
				this.onError.dispatch('An unknown error occurred.');
			break;
		}
	},
	_checkHTML5State: function(e) {
		this.playing = false;
		switch (e.type) {
			case "canplay":
				this._ready();
				break;
			case "ended":
				this.onEnd.dispatch();
				break;
			case "play":
				this.playing = true;
				this.onPlay.dispatch();
				break;
			case "pause":
				this.onPause.dispatch();
				break;
			case "waiting":
				this.onBuffering.dispatch();
				break;
		}
	},
	_ready: function() {
		if (!this._readySent) {
			if (this.options.type === 'youtube' && this.options.muted) this.player.mute();
			this._readySent = true;
			this.onReady.dispatch();
			this.tick = setInterval(this._check.bind(this),50);
		}
	},
	_check: function() {
		if (this._duration<=0) this._duration = this.player.getDuration();
		this._loaded = this.player.getVideoLoadedFraction();
		if (this.playing) this.onProgress.dispatch();
	},
	play: function() {
		if (this._readySent && !this.playing) {
			(this.isYoutube) ? this.player.playVideo() : this.player.play();
		}
	},
	pause: function() {
		if (this._readySent && this.playing) {
			(this.isYoutube) ? this.player.pauseVideo() : this.player.pause();
		}
	},
	appendTo: function(dom) {
		this.options.el = (typeof(dom) === 'string') ? document.getElementById(dom) : dom;
		this.options.el.appendChild(this.player);
	},
	destroy: function() {
		if (this.isYoutube) {
			if (this.player.removeEventListener) {
				this.player.removeEventListener('onStateChange',this._checkYoutubeState);
				this.player.removeEventListener('onError',this._checkYoutubeError);
			} else {
				this._checkYoutubeState = function() {};
				this._checkYoutubeError = function() {};
			}
			this.player.destroy();
		} else {
			on.off(this.player,'statechange',this.checkHTML5State);
			on.off(this.player,'error',this._checkHTML5Error);
			this.player.source.setAttribute('src','');
			this.player.removeChild(this.player.source);
			this.player.source = null;
			this.player.load();
			this.options.el.removeChild(this.player);
		}
	}
});

module.exports = Video;
