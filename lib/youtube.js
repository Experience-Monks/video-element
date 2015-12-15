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

		var paramsVars = options.parameters;
		paramsVars.rel = (typeof options.relatedVideos !== 'undefined' && options.relatedVideos === false) ? 0 : 1;

		var player = new youtube.Player(id, {
			videoId: url,
			height: options.height,
			width: options.width,
			playerVars: paramsVars
		});
		player.api = youtube;
		callback(undefined,player);
	});
}
