import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Context } from 'vm';

@Component({
  selector: 'app-confetti',
  templateUrl: './confetti.component.html',
  styleUrls: ['./confetti.component.css']
})
export class ConfettiComponent implements AfterViewInit {

	@ViewChild("myCelebration") myCelebration: ElementRef;

	constructor() { }

	confettiSettings:{animationDuration: number, maxCount: number, speed: number, frameRate: number, alpha: number, gradient: boolean, maxConfettis: number} = {
		animationDuration: 2000,
		maxCount: 450,
		speed: 5,
		frameRate: 15,
		alpha: .9,
		gradient: true,
		maxConfettis: 1000
	}

  	supportsAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
	colors:String[] = ["rgba(30,144,255,", "rgba(107,142,35,", "rgba(255,215,0,", "rgba(255,192,203,", "rgba(106,90,205,", "rgba(173,216,230,", "rgba(238,130,238,", "rgba(152,251,152,", "rgba(70,130,180,", "rgba(244,164,96,", "rgba(210,105,30,", "rgba(220,20,60,"];
	animationPlaying:boolean = false;
	animationTimer = null;
	lastFrameTime:number = Date.now();
	confettiStreams: {color: string, color2: string, x:number, y:number, tilt:number, tiltAngleIncrement: number, tiltAngle: number}[] = [];
	streamAngle:number = 0;
	context:Context = null;

  ngAfterViewInit(): void {
	  this.celebrate();
  }

  celebrate() {
	let width = window.innerWidth;
	let height = window.innerHeight;

	window.requestAnimationFrame = (function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			function (callback) {
				return window.setTimeout(callback, this.confettiSettings.frameRate);
			};
	})();

	if (this.context === null) {this.context = this.myCelebration.nativeElement.getContext("2d");}

	let count = this.confettiSettings.maxCount;
	count = this.confettiStreams.length + this.confettiSettings.maxConfettis;
	while (this.confettiStreams.length < count) { this.confettiStreams.push(this.resetConfetti({}, width, height));}

	this.animationPlaying = true;
	this.play();
	setTimeout(() => {
		this.stopConfetti()
	}, this.confettiSettings.animationDuration);

	}

  resetConfetti(confetti:any, width:number, height:number) {
		confetti.color = this.colors[(Math.random() * this.colors.length) | 0] + (this.confettiSettings.alpha + ")");
		confetti.color2 = this.colors[(Math.random() * this.colors.length) | 0] + (this.confettiSettings.alpha + ")");
		confetti.x = Math.random() * width;
		confetti.y = Math.random() * height - height;
		confetti.diameter = Math.random() * 10 + 5;
		confetti.tilt = Math.random() * 10 - 10;
		confetti.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
		confetti.tiltAngle = Math.random() * Math.PI;
		return confetti;
	}

  play() {
		if (this.confettiStreams.length === 0) {
			this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
			this.animationTimer = null;
		} else {
			const now = Date.now();
			const delta = now - this.lastFrameTime;
			if (delta > this.confettiSettings.frameRate) {
				this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
				this.updateConfetti();
				this.drawConfetti(this.context);
				this.lastFrameTime = now - (delta % this.confettiSettings.frameRate);
			}
			this.animationTimer = requestAnimationFrame(this.play.bind(this));
		}
	}



	stopConfetti() {
		this.animationPlaying = false;
	}

  drawConfetti(context:Context) {
		let confetti;
		let x, y, x2, y2;
		for (let i = 0; i < this.confettiStreams.length; i++) {
			confetti = this.confettiStreams[i];
			context.beginPath();
			context.lineWidth = confetti.diameter;
			x2 = confetti.x + confetti.tilt;
			x = x2 + confetti.diameter / 2;
			y2 = confetti.y + confetti.tilt + confetti.diameter / 2;
			if (this.confettiSettings.gradient) {
				let gradient = context.createLinearGradient(x, confetti.y, x2, y2);
				gradient.addColorStop("0", confetti.color);
				gradient.addColorStop("1.0", confetti.color2);
				context.strokeStyle = gradient;
			} else
				context.strokeStyle = confetti.color;
			context.moveTo(x, confetti.y);
			context.lineTo(x2, y2);
			context.stroke();
		}
	}

	updateConfetti() {
		let width = window.innerWidth;
		let height = window.innerHeight;
		let confetti;
		this.streamAngle += 0.01;
		for (let i = 0; i < this.confettiStreams.length; i++) {
			confetti = this.confettiStreams[i];
			if (!this.animationPlaying && confetti.y < -15)
				confetti.y = height + 100;
			else {
				confetti.tiltAngle += confetti.tiltAngleIncrement;
				confetti.x += Math.sin(this.streamAngle) - 0.5;
				confetti.y += (Math.cos(this.streamAngle) + confetti.diameter + this.confettiSettings.speed) * 0.5;
				confetti.tilt = Math.sin(confetti.tiltAngle) * 15;
			}
			if (confetti.x > width + 20 || confetti.x < -20 || confetti.y > height) {
				if (this.animationPlaying && this.confettiStreams.length <= this.confettiSettings.maxCount)
					this.resetConfetti(confetti, width, height);
				else {
					this.confettiStreams.splice(i, 1);
					i--;
				}
			}
		}
	}



}
