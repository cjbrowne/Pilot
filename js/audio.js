(function() {
	function Audio() {
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		if('AudioContext' in window) {
			this.speaker = new AudioContext();
		} else {
			console.log("Web Audio API not supported by this browser.  Audio disabled.");
			this.enabled = false;
		}
	}
	Audio.prototype.enabled = true;
	Audio.prototype.update = function(frameNumber,timeDelta,ship) {
		if(!this.enabled) return; // don't do anything if audio is disabled!
		switch(frameNumber) {
			case 60:
				this.makeBeep(200,1,400);
				break;
			case 180:
		        this.makeBeep(200,1,500);
		        break;
			case 220:
		        this.makeBeep(100,1,400);
		        break;
			case 225:
		        this.makeBeep(100,1,500);
		        break;
			case 230:
			    this.makeBeep(100,1,600);
        	break;
		}
		var boosterWarningCount = (ship.boosters.filter(function(b) { return b.warning != ""; })).length;
		if(boosterWarningCount > 0 && frameNumber % 20 == 0) {
			this.makeBeep(100,1,800);
		}
	}
	Audio.prototype.makeBeep = function(duration, type, freq, finishedCallback) {
	    duration = +duration;

	    freq = freq || 440;

	    // Only 0-4 are valid types.
	    type = (type % 5) || 0;

	    if (typeof finishedCallback != "function") {
	        finishedCallback = function () {};
	    }

	    var osc = this.speaker.createOscillator();

	    osc.type = type;

	    osc.connect(this.speaker.destination);
	    osc.frequency.value = freq;
	    osc.noteOn(0);

	    setTimeout(function () {
	        osc.noteOff(0);
	        finishedCallback();
	    }, duration);
	};
	Audio.prototype.playSound = function(sound) {
		var osc = this.speaker.createOscillator();
        var gain = this.speaker.createGain();
        osc.connect(gain);
        gain.connect(this.speaker.destination);
        switch(sound) {
            case 'bullet':
                osc.type = "square";
                osc.frequency.value = 2000;
                osc.frequency.setTargetAtTime(300,this.speaker.currentTime,0.2);
                gain.gain.value = 1.0;
                gain.gain.setTargetAtTime(0.0,this.speaker.currentTime,0.3);
                osc.noteOn(0);
                setTimeout(function() {
                        osc.noteOff(0);
                },300);
            break;
            case 'yellow-alert':
            	osc.type = "sawtooth";
                osc.frequency.value = 400;
                osc.frequency.setTargetAtTime(900,this.speaker.currentTime,0.3);
                osc.noteOn(0);
                setTimeout(function() {
                        osc.noteOff(0);
                },300);
            break;
            case 'red-alert':
            	osc.type = "sawtooth";
                osc.frequency.value = 500;
                osc.frequency.setTargetAtTime(1200,this.speaker.currentTime,0.2);
                osc.noteOn(0);
                setTimeout(function() {
                        osc.noteOff(0);
                },200);
            break;
        }
	}
	window.PilotAudio = Audio;
})();