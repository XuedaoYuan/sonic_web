try {
	new Vue({
		el: '#app',
		data: {
			sonicSocket: null,
			sonicServer: null,
			EMOTICONS: ['happy', 'sad', 'heart', 'mad', 'star', 'oh'],
			ALPHABET: '',
			mode: 'ultrasonic',
			howVisualizer: false,
			message: '。。。',
			customStr: ''
		},
		created() {
			// this.ALPHABET = this.generateAlphabet(this.EMOTICONS);
			this.ALPHABET = '0123456789*';
		},
		mounted() {
			this.createSonicNetwork();
		},
		methods: {
			generateAlphabet: function(list) {
				var alphabet = '';
				for (var i = 0; i < Math.min(list.length, 9); i++) {
					alphabet += i.toString();
				}
				return alphabet;
			},
			createSonicNetwork: function(opt_coder) {
				// Stop the sonic server if it is listening.
				// 如果已经在监听就停止
				if (this.sonicServer) {
					this.sonicServer.stop();
				}
				if (opt_coder) {
					this.sonicServer = new SonicServer({ coder: opt_coder });
					this.sonicSocket = new SonicSocket({ coder: opt_coder });
				} else {
					this.sonicServer = new SonicServer({ alphabet: ALPHABET, debug: false });
					this.sonicSocket = new SonicSocket({ alphabet: ALPHABET });

					/* this.sonicServer = new SonicServer({ debug: false });
					this.sonicSocket = new SonicSocket({}); */
				}

				this.sonicServer.start();
				this.sonicServer.on('message', this.onIncomingEmoticon);
			},

			toggleMode: function() {
				if (this.mode === 'ultrasonic') {
					this.mode = 'audible';
					var coder = new SonicCoder({
						freqMin: 440, // 最低评率
						freqMax: 1760
					});
					this.createSonicNetwork(coder);
				} else {
					this.mode = 'ultrasonic';
					this.createSonicNetwork();
				}
			},
			toggleShowVisualizer: function() {
				this.howVisualizer = !this.howVisualizer;
				sonicServer.setDebug(this.howVisualizer);
			},
			handleSendCustomStr: function() {
				if (this.customStr) {
					let sendStr = this.divideSameLetter(this.customStr);
					this.sonicSocket.send(sendStr);
				}
			},
			// 点击 发送声音
			handleClickEmo: function(emo) {
				console.log(emo);
				this.sonicSocket.send(emo.toString());
			},
			onIncomingEmoticon: function(message) {
				console.log('message: ' + message);
				this.message = this.deleteDivide(message);
			},
			// 在相邻的字符间加入 ‘-’
			divideSameLetter: function(source) {
				if (!source) {
					return;
				}
				const divide = '*';
				const letters = source.split('');
				let prev;
				let target = [divide];
				for (let i = 0, len = letters.length; i < len; i++) {
					let letter = letters[i];
					if (letter === prev) {
						target.push(divide);
					} else {
						prev = letter;
					}
					target.push(letter);
				}
				target.push(divide);
				return target.join('');
			},
			// 去除字符里的 ‘-’
			deleteDivide: function(source) {
				return source.replace(/\*/g, '');
			}
		}
	});
} catch (error) {
	alert(error.toString());
}
