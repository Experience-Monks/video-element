var sdk = require('require-sdk')('https://www.youtube.com/iframe_api', 'YT');
var loaded = sdk.trigger();

window.onYouTubeIframeAPIReady = function () {
	loaded();
	delete window.onYouTubeIframeAPIReady;
};

module.exports = function(url, options, callback) {
	sdk(function (error, youtube) {
    var id = options.id || 'yt-player';
		options.el.innerHTML = '<div id="'+id+'"></div>';
		var player = new youtube.Player(id, {
			videoId: url,
			height: options.height,
			width: options.width,
			playerVars: {
				autoplay: options.autoplay ? 1 : 0,
				controls: options.controls ? 1 : 0,
				loop: options.loop ? 1 : 0,
        rel: (typeof options.relatedVideos !== 'undefined' && options.relatedVideos === false) ? 0 : 1
			}
		});
		player.api = youtube;
		callback(undefined,player);
	});
}
