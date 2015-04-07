module.exports = function(url, options, callback) {
	var player = document.createElement('video');
	player.setAttribute('width',options.width);
	player.setAttribute('height',options.height);
	if (options.autoplay) player.setAttribute('autoplay','');
	if (options.controls) player.setAttribute('controls','');
	if (options.loop) player.setAttribute('loop','');
	if (options.muted) player.setAttribute('muted','');
	if (options.poster) player.setAttribute('poster',options.poster);
	if (options.preload) player.setAttribute('preload','auto');
	player.getVideoLoadedFraction = function() {
		if (this.buffered && this.buffered.length > 0 && this.buffered.end && this.duration) {
			return (this.buffered.end(0)/this.duration);
		} else if (this.bytesTotal !== undefined && this.bytesTotal > 0 && this.bufferedBytes !== undefined) {
			return this.bufferedBytes / this.bytesTotal;
		} else {
			return 0;
		}
	};
	player.getDuration = function() {
		return this.duration;
	};
	options.formats = options.formats || ['mp4','webm','ogg'];
	var check,format;
	for (var i=0, len=options.length; i<len; i++) {
		check = player.canPlayType('video/'+options.formats[i].toLowerCase());
		if (check==="maybe" || check==="probably") {
			format = options.formats[i];
			break;
		}
	}
	if (format) {
		player.source = document.createElement('source');
		player.source.setAttribute('type','video/'+format);
		player.source.setAttribute('url',url.substr(0,url.lastIndexOf('.')+1)+format);
		player.appendChild(player.source);
		callback(undefined,player);
	} else {
		callback(new Error('HTML5 Video not supported'));
	}
};