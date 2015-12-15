var Video = require('../index');

var div = document.createElement('div');
div.id = 'youtube-video';
document.body.appendChild(div);

var myVid = new Video({
	type: 'youtube',
	url:'XZmGGAbHqa0',
	el:'youtube-video',
	width: 1000,
	height: 600,
	parameters: {
		controls: 0,
		autoplay: 0,
		loop: 0,
		showinfo: 0
	},
	muted: false
},function(error, player){
	if(!error){
		this.youtubePlayer = player;
	}
}.bind(this));