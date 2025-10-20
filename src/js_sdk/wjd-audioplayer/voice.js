/**
 * Notes: APP语音播报
 * @author WJD
 * @version 1.0.0
 * @Date 2022-01-26
 */

import store from '../../store'

// 是否播放中
let isPlaying = false;
// 播放列表
let currentAudio = [];
// 播放顺序
let playIndex = 0
// 播放器
let audioPlayer = null;
// 平台
let platform = 'iOS';
// 定时器
let timer = null;
// socket地址
const socketUrl = "wss://gateworker.yngod.cn:8686";

const voice = {
	// 创建播放器
	init: () => {
		platform = plus.os.name;
		if (platform == 'Android') {
			let MediaPlayer = plus.android.importClass("android.media.MediaPlayer");
			audioPlayer = new MediaPlayer()
		}
		if (platform == "iOS") {
			let AVAudioPlayer = plus.ios.importClass("AVAudioPlayer");
			audioPlayer = new AVAudioPlayer();
		}
		console.log('创建播放器成功');
		voice.playAudio();
	},
	// 连接socket
	connectSocketGlobal: () => {
		uni.connectSocket({
			url: socketUrl,
			success: (res) => {
				// console.log('连接成功');
			}
		})

		uni.onSocketOpen((success) => {
			console.log('WebSocket连接已打开！');
			let storeIds = store.state.storeIds;
			if (storeIds.length > 0) {
				storeIds.forEach(sid => {
					uni.sendSocketMessage({
						data: sid.toString(),
						success: (s) => {
							console.log('成功');
						}
					});
				})
			}
			store.commit('setData', {
				key: 'socketIsOpen',
				val: true
			});
		})

		uni.onSocketError(function(error) {
			console.log('WebSocket连接打开失败，请检查！');
		});

		uni.onSocketMessage((res) => {
			console.log('接收播报数据', res)
			//按接收的内容播放信息
			try {
				if (typeof res == 'string') {
					res = JSON.parse(res);
				}
				if (typeof res.data == 'string') {
					res.data = JSON.parse(res.data);
				}
				if(res.data?.Hearbeat) {
					uni.sendSocketMessage({
						data: "hearbeat",
						success: (s) => {
							console.log('成功');
						}
					});
					return ;
				}
				if (res.data.needPlay) {
					try {
						var parseStr = voice.parseAudioData(res.data);
					} catch (e) {
						// console.log('解析出错', e)
					}
					// console.log('解析数据', parseStr)
					voice.addAudioQueue(parseStr);
				}
			} catch (e) {}
		})
	},
	//解析服务器数据
	parseAudioData: function(serverData) {
		let audio = [];
		//头部
		//处理中间数字
		serverData.data = parseFloat(serverData.data).toString();
		//如果当前数字中没有小数点，则用.00补足
		if (serverData.data.indexOf('.') == -1) serverData.data += '.00';
		let dot = serverData.data.indexOf('.');
		let l = serverData.data.length;
		for (let n = 0; n < l; n++) {
			//如果上一位是0则不加入
			if (audio[audio.length - 1] != 0 || serverData.data.substr(n, 1) != '0') {
				audio.push(serverData.data.substr(n, 1));
				//根据当前数字的位置与dot的位置决定后缀并且当前不是小数点
				if (serverData.data.substr(n, 1) != '.' && serverData.data.substr(n, 1) != '0') {
					if (dot - n == 2) {
						audio.push('ten');
					} else if (dot - n == 3) {
						audio.push('hundred');
					} else if (dot - n == 4) {
						audio.push('thousand');
					} else if (dot - n == 5) {
						audio.push('ten_thousand');
					}
				}
			}
		}
		//如果出现1shi则去掉1
		let _audio = audio.join('&');
		if (audio[0] == 1) {
			_audio = _audio.replace('1&shi', 'shi'); //应对一十元问题
		}
		if (audio[0] != 0) {
			_audio = _audio.replace('0&.', '.'); //应对一十点问题
		}
		if (_audio.indexOf('.&0') == _audio.length - 2 - 1) { //应对末尾是.0
			_audio = _audio.substr(0, _audio.length - 2 - 2);
		}
		//加入前缀
		if (_audio) {
			_audio = 'header_' + serverData.header.toString() + '&' + _audio;
		} else {
			_audio = 'header_' + serverData.header.toString();
		}
		audio = _audio.split("&");
		//如果有金额
		if (l) {
			audio.push('yuan');
		}
		//底部
		if (serverData.footer) {
			audio.push('footer');
		}
		let result = [];
		audio.map(item => {
			if (item != '.')
				result.push(`/static/audio/tts_${item}.mp3`);
			else
				result.push(`/static/audio/tts_dot.mp3`);
		})
		return result;
	},
	// 随机数
	getRandomKey: () => {
		var max = 99999;
		var min = 1;
		return (Date.parse(new Date()) + '' + parseInt(Math.random() * (max - min + 1) + min, 10)).toString();
	},

	// 语言播报语音数据 加入到队列里面
	addAudioQueue: (parseStr) => {
		let audioList = store.state.audioList;
		audioList[voice.getRandomKey()] = parseStr;
		store.commit('setData', {
			key: 'audioList',
			val: audioList
		});
	},
	// 重置播放列表
	resetPlayList: () => {
		playIndex = 0;
		currentAudio = ['/static/audio/no1s.mp3'];
	},
	clearTimer: () => {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}

	},
	// 播放音频
	playAudio: () => {

		if (isPlaying) {
			console.log('播放中，请等待...')
			return false;
		}
		if (audioPlayer == null) {
			console.log('未启动音频播放器');
			return false;
		}

		let audioList = store.state.audioList;
		if (currentAudio.length == 0) {
			const keys = Object.keys(audioList)
			if (keys.length) {
				currentAudio = Object.values(audioList)[0]
				delete audioList[keys[0]]
				playIndex = 0
				store.commit('setData', {
					key: 'audioList',
					val: audioList
				});
			} else {
				voice.resetPlayList();
			}
		}
		console.log('正在播报：', currentAudio[playIndex]);
		let path = plus.io.convertLocalFileSystemURL(currentAudio[playIndex]);
		let currentTime = 0; // 当前流媒体的播放的位置，单位是秒
		let currentDuration = 0; // 当前文件时长
		if (platform == 'iOS') {
			let NSData = plus.ios.importClass("NSData");
			let AVAudioPlayer = plus.ios.importClass("AVAudioPlayer");
			let pathFileData = NSData.dataWithContentsOfFile(path);
			audioPlayer.initWithDataerror(pathFileData, null);
			// audioPlayer.setNumberOfLoops(-1); //-1：无限循环   
			audioPlayer.prepareToPlay(); //初始化播放器  
			audioPlayer.play();
			isPlaying = audioPlayer.isPlaying();
			// 当前播放进度 currentTime 秒
		} else {
			let MediaPlayer = plus.android.importClass("android.media.MediaPlayer");
			audioPlayer.setDataSource(path); //指定音频文件路径  
			// audioPlayer.setLooping(true); //设置为循环播放  
			audioPlayer.prepare(); //初始化播放器MediaPlayer  
			audioPlayer.start();
			isPlaying = audioPlayer.isPlaying();
			// 获取音乐的总时长  
			// console.log(audioPlayer.getDuration());
			// 当前播放进度  getCurrentPosition 毫秒
		}
		timer = setInterval(function() {
			currentTime = platform == 'iOS' ? audioPlayer.currentTime() : audioPlayer
				.getCurrentPosition() / 1000;
			currentDuration = platform == 'iOS' ? audioPlayer.duration() : audioPlayer
				.getDuration() / 1000;
			if (currentTime == currentDuration || currentTime == 0) {
				isPlaying = false;
				voice.clearTimer();
				if (playIndex < currentAudio.length - 1) {
					playIndex++
				} else {
					currentAudio = [];
					playIndex = 0;
				}
				if (Object.keys(audioList).length == 0 && currentAudio.length == 0) {
					voice.resetPlayList();
				}
				voice.playAudio();
			}
		}, 200);
	}
}

export default voice
