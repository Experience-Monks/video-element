var sdk = require('require-sdk')('https://www.youtube.com/iframe_api', 'YT');
var loaded = sdk.trigger();

window.onYouTubeIframeAPIReady = function () {
	loaded();
	delete window.onYouTubeIframeAPIReady;
};

module.exports = function(url, options, callback) {
	sdk(function (error, youtube) {
		options.el.innerHTML = '<div id="yt-player"></div>';
		var player = new youtube.Player('yt-player', {
			videoId: url,
			height: options.height,
			width: options.width,
			playerVars: {
				autoplay: options.autoplay ? 1 : 0,
				controls: options.controls ? 1 : 0,
				loop: options.loop ? 1 : 0
			}
		});
		player.addEventListener('onReady',function(e) {
			callback(undefined,player);
		});
		player.api = youtube;
	});
}