(function() {
	function HUD() {
		var $viewer = $("#viewscreen");
		this.ctx = $viewer[0].getContext('2d');
		$viewer.width = $viewer.width;
		$viewer.height = $viewer.height;
		this.ctx.canvas.width = $viewer.width();
		this.ctx.canvas.height = $viewer.height();
	}

	HUD.prototype.render = function(frameNumber,timeDelta,ship) {
		var ctx = this.ctx, $viewer = $("#viewscreen");
		ctx.clearRect(0,0,$viewer.width(),$viewer.height());
		ctx.fillStyle = "rgb(255,255,255)";
		ctx.font = "8pt monospace";
		if(frameNumber > 60) {
			ctx.fillText("STARSHIP " + ship.designation,50,50);
			ctx.fillText("Booster systems: ",50,60);
			ctx.fillText("Core Systems:",50,150);
			var stringLoc = 0;
			if(frameNumber > 180) {
				ship.boosters.forEach(function(booster) {
					if(booster.warning == "") {
						ctx.fillText(booster.position + " " + booster.orientation + ": " + booster.power,55,70 + stringLoc);
					} else {
						ctx.save();
						ctx.fillStyle = "rgb(255,0,0)";
						ctx.fillText(booster + ": " + ship.warningStrings.booster[booster],55,70 + stringLoc);
						ctx.restore();
					}
					stringLoc += 10;
				});
			} else {
				ctx.fillText("Loading" + Array(Math.floor((frameNumber / 10) % 5)).join("."),55,70);
			}
			if(frameNumber > 210) {
				if(ship.health.warning == "") {
					ctx.fillText("Structural Integrity: OK",55,160);
				} else {
					ctx.save();
					ctx.fillStyle = "rgb(255,0,0)";
					ctx.fillText("Structural Integrity: " + ship.health.warning,55,140);
					ctx.restore();
				}
			} else {
				ctx.fillText("Loading" + Array(Math.floor((frameNumber / 10) % 5)).join("."),55,160);
			}
		} else {
			ctx.fillText("Booting up" + Array(Math.floor((frameNumber / 10) % 5)).join("."),50,50);
		}

		ctx.save();

		// render the health bar
		if(frameNumber < 200 || frameNumber > 230 || frameNumber % 16 < 8) {
			if(ship.health > 30 || frameNumber % 16 < 8) {
				if(ship.health > 10 || frameNumber % 8 < 4) {
					for(var i = 0; i < Math.floor(ship.health / 10) && i*20 < frameNumber; i++) {
						if(i < 3) {
							ctx.fillStyle = "rgba(255,0,0,0.5)";
						} else {
							ctx.fillStyle = "rgba(0,255,0,0.5)";
						}
						ctx.fillRect(32 + (i * 18), $viewer.height() - 64 , 16, 32);
					}
				}
			}
		}
		ctx.restore();

		// render the fore gun rotation (yaw) indicator
		ctx.save();
		ctx.fillStyle = ctx.strokeStyle = "rgba(100,100,255,0.5)";
		if(frameNumber > 200) {
			ctx.beginPath();
			ctx.translate($viewer.width()-75,75);
			ctx.rotate(ship.cannons.fore.rotation.yaw);
			ctx.arc(0,0,50,0,Math.PI*2,true);
			ctx.moveTo(-40,0)
			ctx.lineTo(40,0);
			ctx.closePath();
			ctx.stroke();
			ctx.restore();
			// render the fore gun pitch indicator
			ctx.save();
			ctx.fillStyle = ctx.strokeStyle = "rgba(100,100,255,0.5)";
			ctx.beginPath();
			ctx.translate($viewer.width() - 150,25);
			ctx.moveTo(0,0);
			ctx.lineTo(0,100);
			ctx.moveTo(0,100 - (ship.cannons.fore.rotation.pitch / Math.PI)*100);
			ctx.lineTo(5,100 - (ship.cannons.fore.rotation.pitch / Math.PI)*100);
			ctx.closePath();
			ctx.stroke();
		} else {
			ctx.fillText("Loading" + Array(Math.floor((frameNumber / 10) % 5)).join("."),$viewer.width() - 125,75)
		}
		
		ctx.restore();

		

		// debug ship information
		ctx.save();
		var shipRot = ship.location.rotation.clone();
		var shipPos = ship.location.position.clone();
		var shipVel = ship.location.velocity.clone();
		// TODO: remove references to 'viewer' so that HUD is indepedant from what it's drawn on
		var $viewer = $("#viewscreen");
		ctx.fillStyle = "rgb(255,255,255)";
		ctx.fillText("Yaw: " + shipRot.y.toFixed(2),$viewer.width() - 200, $viewer.height() - 100);
		ctx.fillText("Pitch: " + shipRot.x.toFixed(2),$viewer.width() - 200, $viewer.height() - 90);
		ctx.fillText("Roll: " + shipRot.z.toFixed(2),$viewer.width() - 200, $viewer.height() - 80);
		ctx.fillText("X: " + shipPos.x.toFixed(2),$viewer.width() - 200,$viewer.height() - 70);
		ctx.fillText("Y: " + shipPos.y.toFixed(2),$viewer.width() - 200,$viewer.height() - 60);
		ctx.fillText("Z: " + shipPos.z.toFixed(2),$viewer.width() - 200,$viewer.height() - 50);
		ctx.fillText("Horizontal velocity: " + -(shipVel.z*100).toFixed(2),$viewer.width() - 200,$viewer.height() - 40);
		ctx.fillText("Vertical velocity: " + (shipVel.y*100).toFixed(2),$viewer.width() - 200,$viewer.height() - 30);
		ctx.restore();
	}
	window.HUD = HUD;
})();