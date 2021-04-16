import { Component, ViewChild, ElementRef, OnInit, NgZone, AfterViewInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-animation-sandbox',
  templateUrl: './animation-sandbox.component.html',
  styleUrls: ['./animation-sandbox.component.css']
})

export class AnimationSandboxComponent implements AfterViewInit {
  @Input() tileDiv: any;
  @ViewChild("myCelebration") myCelebration: ElementRef;

	constructor(
  ) { }

  static canvas;
  static libraryCanvas;
  static allowResize;
  static isWorker: any;
  static initialized;
  static animationObj;
  static counter:number = 0;
  globalOpts;
  globalDisableForReducedMotion;
  shouldUseWorker;
  worker;
  resizer;
  preferLessMotion;
  
  ngAfterViewInit(): void {
    
  }

  celebrate() {
    AnimationSandboxComponent.libraryCanvas = !(AnimationSandboxComponent.canvas);
    AnimationSandboxComponent.allowResize= !!this.prop(this.globalOpts || {}, 'resize');
    this.globalDisableForReducedMotion = this.prop(this.globalOpts, 'disableForReducedMotion', Boolean);
    this.shouldUseWorker = this.canUseWorker && !!this.prop(this.globalOpts || {}, 'useWorker');
    this.worker = this.shouldUseWorker ? this.getWorker() : null;
    this.resizer = AnimationSandboxComponent.canvas ? this.setCanvasWindowSize : this.setCanvasWindowSize;
    AnimationSandboxComponent.initialized = (AnimationSandboxComponent.canvas && this.worker) ? !AnimationSandboxComponent.canvas : false;
    this.preferLessMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion)').matches;
    AnimationSandboxComponent.animationObj;
   

    this.fire({angle: 90, origin: {x: .1}})
    setTimeout(() => this.fire({angle: 90, origin: {x: .2}}), 100)
    setTimeout(() => this.fire({angle: 90, origin: {x: .3}}), 300)
    setTimeout(() => this.fire({angle: 90, origin: {x: .4}}), 500)
    setTimeout(() => this.fire({angle: 90, origin: {x: .5}}), 700)
    setTimeout(() => this.fire({angle: 90, origin: {x: .6}}), 800)
    setTimeout(() => this.fire({angle: 90, origin: {x: .7}}), 600)
    setTimeout(() => this.fire({angle: 90, origin: {x: .8}}), 400)
    setTimeout(() => this.fire({angle: 90, origin: {x: .9}}), 200)
  }


  canUseWorker = !!(
    Worker &&
    Blob &&
    Promise &&
    OffscreenCanvas &&
    OffscreenCanvasRenderingContext2D &&
    HTMLCanvasElement &&
    HTMLCanvasElement.prototype.transferControlToOffscreen &&
    URL &&
    URL.createObjectURL);
  
  noop() {}
    
  // create a promise if it exists, otherwise, just
  // call the function directly
  promise(func) {
    // var ModulePromise = module.exports.Promise;
    let ModulePromise;
    var Prom = ModulePromise !== void 0 ? ModulePromise : Promise;

    if (typeof Prom === 'function') {
      return new Prom(func);
    }

    func(this.noop, this.noop);

    return null;
  }
  
  static raf = (function () {
    const frameRate = 42;
    var frame, cancel;
    var frames = {};
    var lastFrameTime = 0;

    if (typeof requestAnimationFrame === 'function' && typeof cancelAnimationFrame === 'function') {
      frame = function (cb) {
        var id = Math.random();

        frames[id] = requestAnimationFrame(function onFrame(time) {
          if (lastFrameTime === time || lastFrameTime + frameRate - 1 < time) {
            lastFrameTime = time;
            delete frames[id];

            cb();
          } else {
            frames[id] = requestAnimationFrame(onFrame);
          }
        });

        return id;
      };
      cancel = function (id) {
        if (frames[id]) {
          cancelAnimationFrame(frames[id]);
        }
      };
    } else {
      frame = function (cb) {
        return setTimeout(cb, frameRate);
      };
      cancel = function (timer) {
        return clearTimeout(timer);
      };
    }

    return { frame: frame, cancel: cancel };
  }());
  
  getWorker = (function () {
    var worker;
    var prom;
    var resolves = {};

    function decorate(worker) {
      function execute(options, callback) {
        worker.postMessage({ options: options || {}, callback: callback });
      }
      worker.init = function initWorker(canvas) {
        var offscreen = canvas.transferControlToOffscreen();
        worker.postMessage({ canvas: offscreen }, [offscreen]);
      };

      worker.fire = function fireWorker(options, size, done) {
        if (prom) {
          execute(options, null);
          return prom;
        }

        var id = Math.random().toString(36).slice(2);

        prom = new Promise(function (resolve) {
          function workerDone(msg) {
            if (msg.data.callback !== id) {
              return;
            }

            delete resolves[id];
            worker.removeEventListener('message', workerDone);

            prom = null;
            done();
            resolve(true);
          }

          worker.addEventListener('message', workerDone);
          execute(options, id);

          resolves[id] = workerDone.bind(null, { data: { callback: id }});
        });

        return prom;
      };

      worker.reset = function resetWorker() {
        worker.postMessage({ reset: true });

        for (var id in resolves) {
          resolves[id]();
          delete resolves[id];
        }
      };
    }
  
      return function () {
        if (worker) {
          return worker;
        }
  
        if (!this.isWorker && this.canUseWorker) {
          var code = [
            'var CONFETTI, SIZE = {}, module = {};',
            '(' + this.main.toString() + ')(this, module, true, SIZE);',
            'onmessage = function(msg) {',
            '  if (msg.data.options) {',
            '    CONFETTI(msg.data.options).then(function () {',
            '      if (msg.data.callback) {',
            '        postMessage({ callback: msg.data.callback });',
            '      }',
            '    });',
            '  } else if (msg.data.reset) {',
            '    CONFETTI.reset();',
            '  } else if (msg.data.resize) {',
            '    SIZE.width = msg.data.resize.width;',
            '    SIZE.height = msg.data.resize.height;',
            '  } else if (msg.data.canvas) {',
            '    SIZE.width = msg.data.canvas.width;',
            '    SIZE.height = msg.data.canvas.height;',
            '    CONFETTI = module.exports.create(msg.data.canvas);',
            '  }',
            '}',
          ].join('\n');
          try {
            worker = new Worker(URL.createObjectURL(new Blob([code])));
          } catch (e) {
            // eslint-disable-next-line no-console
            typeof console !== undefined && typeof console.warn === 'function' ? console.warn('🎊 Could not load worker', e) : null;
  
            return null;
          }
  
          decorate(worker);
        }
  
        return worker;
      };
    })();
  
    defaults = {
      particleCount: 350,
      angle: 90,
      spread: 90,
      startVelocity: 30,
      decay: .88,
      gravity: .5,
      drift: 0,
      ticks: 100,
      x: 0.2,
      y: 1.1,
      shapes: ['square', 'circle', 'triangle', 'cylinder'],
      zIndex: 100,
      colors: [
        '#0578DC',
        '#058C49',
        '#FDC263',
        '#FD9CD1',
        '#FC1005',
        '#FCFD37',
        '#CBE9F1',
        '#A41516',
        '#C86B6A',
        '#38DAE1'
      ],
      // probably should be true, but back-compat
      disableForReducedMotion: true,
      scalar: 0.5, 
      counter: 0
    };
  
    convert(val, transform) {
      return transform ? transform(val) : val;
    }
  
    isOk(val) {
      return !(val === null || val === undefined);
    }
  
    prop(options, name, transform?) {
      return this.convert(
        options && this.isOk(options[name]) ? options[name] : this.defaults[name],
        transform
      );
    }
  
    onlyPositiveInt(number){
      return number < 0 ? 0 : Math.floor(number);
    }
  
    randomInt(min, max) {
      // [min, max)
      return Math.floor(Math.random() * (max - min)) + min;
    }
  
    static toDecimal(str) {
      return parseInt(str, 16);
    }
  
    static hexToRgb(str) {
      var val = String(str).replace(/[^0-9a-f]/gi, '');
  
      if (val.length < 6) {
          val = val[0]+val[0]+val[1]+val[1]+val[2]+val[2];
      }
  
      return {
        r: AnimationSandboxComponent.toDecimal(val.substring(0,2)),
        g: AnimationSandboxComponent.toDecimal(val.substring(2,4)),
        b: AnimationSandboxComponent.toDecimal(val.substring(4,6))
      };
    }

    colorsToRgb(colors) {
      return colors.map(AnimationSandboxComponent.hexToRgb);
    }
  
    getOrigin(options) {
      var origin = this.prop(options, 'origin', Object);
      origin.x = this.prop(origin, 'x', Number);
      origin.y = this.prop(origin, 'y', Number);
  
      return origin;
    }
  
    setCanvasWindowSize(canvas) {
      // canvas.width = this.tileDiv.width;
      // canvas.height = this.tileDiv.height;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  
    static setCanvasRectSize(canvas) {
      var rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
  
    getCanvas(zIndex) {
      // var canvas = document.createElement('canvas');
      // canvas.style.position = 'absolute';
      // canvas.style.top = this.tileDiv.y + 'px';
      // canvas.style.left = this.tileDiv.x + 'px';
      // canvas.style.pointerEvents = 'none';
      // canvas.style.zIndex = zIndex;
      return this.myCelebration.nativeElement;
    }
  
    static ellipse(context, x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise?) {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.scale(radiusX, radiusY);
      context.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
      context.restore();
    }
  
    randomPhysics(opts) {
      var radAngle = opts.angle * (Math.PI / 180);
      var radSpread = opts.spread * (Math.PI / 180);
  
      return {
        x: opts.x,
        y: opts.y,
        wobble: Math.random() * 10,
        velocity: (opts.startVelocity * 0.5) + (Math.random() * opts.startVelocity),
        angle2D: -radAngle + ((0.5 * radSpread) - (Math.random() * radSpread)),
        tiltAngle: Math.random() * Math.PI,
        color: opts.color,
        shape: opts.shape,
        tick: 0,
        totalTicks: opts.ticks,
        decay: opts.decay,
        drift: opts.drift,
        random: Math.random() + 5,
        tiltSin: 0,
        tiltCos: 0,
        wobbleX: 0,
        wobbleY: 0,
        gravity: opts.gravity * 3,
        ovalScalar: 0.6,
        scalar: opts.scalar
      };
    }
  
    static updateConfetti(context: any, fetti: any) {
      if (!fetti.counter) fetti.counter = 0;
      if (fetti.counter > 5) {
        fetti.x += Math.cos(fetti.angle2D) * fetti.velocity + fetti.drift;
        fetti.y += Math.sin(fetti.angle2D) * fetti.velocity + fetti.gravity;
      } else {
        fetti.counter++;
        // fetti.x += 0;
        fetti.x += Math.cos(fetti.angle2D) * fetti.velocity + fetti.drift;
        fetti.y += Math.sin(fetti.angle2D) * fetti.velocity + fetti.gravity;
      }
      
      fetti.wobble += 0.1;
      fetti.velocity *= fetti.decay;
      fetti.tiltAngle += 0.1;
      fetti.tiltSin = Math.sin(fetti.tiltAngle);
      fetti.tiltCos = Math.cos(fetti.tiltAngle);
      fetti.random = Math.random() + 4;
      fetti.wobbleX = fetti.x + ((8 * fetti.scalar) * Math.cos(fetti.wobble));
      fetti.wobbleY = fetti.y + ((8 * fetti.scalar) * Math.sin(fetti.wobble));
  
      var progress = (fetti.tick++) / fetti.totalTicks;
  
      var x1 = fetti.x + (fetti.random * fetti.tiltCos);
      var y1 = fetti.y + (fetti.random * fetti.tiltSin);
      var x2 = fetti.wobbleX + (fetti.random * fetti.tiltCos);
      var y2 = fetti.wobbleY + (fetti.random * fetti.tiltSin);
      context.fillStyle = 'rgba(' + fetti.color.r + ', ' + fetti.color.g + ', ' + fetti.color.b + ', ' + (1 - progress) + ')';
      context.beginPath();
  
      if (fetti.shape === 'circle') {
        context.ellipse ?
          context.ellipse(fetti.x, fetti.y, Math.abs(x2 - x1) * fetti.ovalScalar, Math.abs(y2 - y1) * fetti.ovalScalar, Math.PI / 10 * fetti.wobble, 0, 2 * Math.PI) :
          this.ellipse(context, fetti.x, fetti.y, Math.abs(x2 - x1) * fetti.ovalScalar, Math.abs(y2 - y1) * fetti.ovalScalar, Math.PI / 10 * fetti.wobble, 0, 2 * Math.PI);
      } else {
        context.moveTo(Math.floor(fetti.x), Math.floor(fetti.y));
        context.lineTo(Math.floor(fetti.wobbleX), Math.floor(y1));
        context.lineTo(Math.floor(x2), Math.floor(y2));
        context.lineTo(Math.floor(x1), Math.floor(fetti.wobbleY));
      }
  
      context.closePath();
      context.fill();
  
      return fetti.tick < fetti.totalTicks;
    }
  
    animate(canvas, fettis, resizer, size, done) {
      var animatingFettis = fettis.slice();
      var context = canvas.getContext('2d');
      var animationFrame;
      var destroy;
  
      const prom = new Promise(function (resolve) {
        let isWorker = AnimationSandboxComponent.isWorker;
        function onDone() {
          animationFrame = destroy = null;
  
          context.clearRect(0, 0, size.width, size.height);
  
          done();
          resolve(true);
        }
  
        function update() {
          if (isWorker && !(size.width === this.workerSize.width && size.height === this.workerSize.height)) {
            size.width = canvas.width = this.workerSize.width;
            size.height = canvas.height = this.workerSize.height;
          }
  
          if (!size.width && !size.height) {
            resizer(canvas);
            size.width = canvas.width;
            size.height = canvas.height;
          }
  
          context.clearRect(0, 0, size.width, size.height);
  
          animatingFettis = animatingFettis.filter((particle) => {
            return AnimationSandboxComponent.updateConfetti(context, particle);
          });
  
          if (animatingFettis.length) {
            animationFrame = AnimationSandboxComponent.raf.frame(update);
          } else {
            onDone();
          }
        }

          const frames: any = {};
          let lastFrameTime = 0;
          const frame = (cb) => {
            const frameRate = 16;
            let lastFrameTime = 0;
            let id = Math.random();
    
            frames[id] = requestAnimationFrame(function onFrame(time) {
              if (lastFrameTime === time || lastFrameTime + frameRate - 1 < time) {
                lastFrameTime = time;
                delete frames[id];
    
                cb();
              } else {
                frames[id] = requestAnimationFrame(onFrame);
              }
            });
    
            return id;
          };
          const cancel = function (id) {
            if (frames[id]) {
              cancelAnimationFrame(frames[id]);
            }
          };

    
        animationFrame = frame(update);
        destroy = onDone;
      });
  
      return {
        addFettis: function (fettis) {
          animatingFettis = animatingFettis.concat(fettis);
  
          return prom;
        },
        canvas: canvas,
        promise: prom,
        reset: function () {
          if (animationFrame) {
            this.raf.cancel(animationFrame);
          }
  
          if (destroy) {
            destroy();
          }
        }
      };
    }
  
    fireLocal(options, size, done) {
      var particleCount = this.prop(options, 'particleCount', this.onlyPositiveInt);
      var angle = this.prop(options, 'angle', Number);
      var spread = this.prop(options, 'spread', Number);
      var startVelocity = this.prop(options, 'startVelocity', Number);
      var decay = this.prop(options, 'decay', Number);
      var gravity = this.prop(options, 'gravity', Number);
      var drift = this.prop(options, 'drift', Number);
      var colors = this.prop(options, 'colors', this.colorsToRgb);
      var ticks = this.prop(options, 'ticks', Number);
      var shapes = this.prop(options, 'shapes');
      var scalar = this.prop(options, 'scalar');
      var origin = this.getOrigin(options);
      var temp = particleCount;
      var fettis = [];

      var startX = AnimationSandboxComponent.canvas.width * origin.x;
      var startY = AnimationSandboxComponent.canvas.height * origin.y;
      while (temp--) {
        fettis.push(
          this.randomPhysics({
            x: startX,
            y: startY,
            angle: angle,
            spread: spread,
            startVelocity: startVelocity,
            color: colors[temp % colors.length],
            shape: shapes[this.randomInt(0, shapes.length)],
            ticks: ticks,
            decay: decay,
            gravity: gravity,
            drift: drift,
            scalar: scalar
          })
        );
      }


      // if we have a previous canvas already animating,
      // add to it
      if (AnimationSandboxComponent.animationObj) {
        return AnimationSandboxComponent.animationObj.addFettis(fettis);
      }
      AnimationSandboxComponent.animationObj = this.animate(AnimationSandboxComponent.canvas, fettis, this.resizer, size , done);

      return AnimationSandboxComponent.animationObj.promise;
    }

    fire(options) {
      var disableForReducedMotion = this.globalDisableForReducedMotion || this.prop(options, 'disableForReducedMotion', Boolean);
      var zIndex = this.prop(options, 'zIndex', Number);

      if (disableForReducedMotion && this.preferLessMotion) {
        return new Promise(function (resolve) {
          resolve(true);
        });
      }

      if (AnimationSandboxComponent.libraryCanvas && AnimationSandboxComponent.animationObj) {
        // use existing canvas from in-progress animation
        AnimationSandboxComponent.canvas = AnimationSandboxComponent.animationObj.canvas;
      } else if (AnimationSandboxComponent.libraryCanvas && !AnimationSandboxComponent.canvas) {
        // create and initialize a new canvas
        AnimationSandboxComponent.canvas = this.getCanvas(zIndex);
        // document.body.appendChild(AnimationSandboxComponent.canvas);
      }

      if (!AnimationSandboxComponent.allowResize && !AnimationSandboxComponent.initialized) {
        // initialize the size of a user-supplied canvas
        this.resizer(AnimationSandboxComponent.canvas);
      }

      var size = {
        // width: AnimationSandboxComponent.canvas.width,
        // height: AnimationSandboxComponent.canvas.height
        width: window.innerWidth,
        height: window.innerHeight
      };

      if (this.worker && !AnimationSandboxComponent.initialized) {
        this.worker.init(AnimationSandboxComponent.canvas);
      }

      AnimationSandboxComponent.initialized = true;

      if (this.worker) {
        AnimationSandboxComponent.canvas.__confetti_initialized = true;
      }

      function onResize() {
        if (this.worker) {
          // TODO this really shouldn't be immediate, because it is expensive
          var obj = {
            getBoundingClientRect: function () {
              if (!AnimationSandboxComponent.libraryCanvas) {
                return AnimationSandboxComponent.canvas.getBoundingClientRect();
              }
            }
          };

          this.resizer(obj);

          this.worker.postMessage({
            resize: {
              width: this.obj.width,
              height: this.obj.height
            }
          });
          return;
        }

        size.width = size.height = null;
      }

      function done() {
        AnimationSandboxComponent.animationObj = null;

        if (AnimationSandboxComponent.allowResize) {
          removeEventListener('resize', onResize);
        }

        if (AnimationSandboxComponent.libraryCanvas && AnimationSandboxComponent.canvas) {
          AnimationSandboxComponent.canvas.remove();
          AnimationSandboxComponent.canvas = null;
          AnimationSandboxComponent.initialized = false;
        }
      }

      if (AnimationSandboxComponent.allowResize) {
        addEventListener('resize', onResize, false);
      }

      if (this.worker) {
        return this.worker.fire(options, size, done);
      }

      return this.fireLocal(options, size, done);
    }

    reset = function () {
      if (this.worker) {
        this.worker.reset();
      }

      if (AnimationSandboxComponent.animationObj) {
        AnimationSandboxComponent.animationObj.reset();
      }
    };
  
      
}
