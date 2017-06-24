/**
 * LevelUpEffectLabel
 * レベルアップに表示するエフェクト
 */
phina.namespace(function() {

  phina.define('LevelUpEffectLabel', {
    superClass: 'phina.display.Label',

    init: function(x, y) {
      var options = {
        text: 'レベルアップ!',
        // fontFamily: "meirio",
        fontSize: 70,
        fill: "#F13167",
        stroke: "#847524",
        // lineHeight: 1.5,
        // padding: 20,
      };
      this.superInit(options);

      this.setPosition(x, y);
      this._reset();
    },

    _reset: function() {
      this.alpha = 0;
      this.scale = {x:1.2, y:1.2}
      // this.position.y = SCREEN_HEIGHT*1.2;
    },

    show: function() {
      this.tweener.clear()
      .to({alpha: 1, scaleX:1, scaleY:1}, 560, 'easeInOutQuad')
      .wait(1000)
      .call(function() {
        this.hide();
      }, this)
    },

    hide: function() {
      this.tweener.clear()
      .to({alpha: 0, scaleX:0, scaleY:0}, 200, 'easeInOutQuad')
      .call(function() {
        this._reset();
      }, this)

    }
  });

});

/**
 * GradeLabel
 * 評価をアニメーション表示するラベル
 */
phina.namespace(function() {

  var START_SCALE = 4.5;
  // var START_ROTATION = -640;
  var TERMINAL_ROTATION = 30;
  // var COLOR = "#856E41";
  var COLOR = "#CB4747";

  phina.define('GradeLabel', {
    superClass: 'phina.ui.Button',

    init: function(text, x, y) {
      this.superInit({
        text: text,
        width: 280,
        height: 80,
        backgroundColor: 'transparent',
        fill: null,
        stroke: COLOR,
        fontColor: COLOR,
        fontSize: 30,
      });

      this.fromJSON({
        alpha: 0,
        x: x,
        y: y,
        scaleX: START_SCALE,
        scaleY: START_SCALE,
        // rotation: START_ROTATION,
        rotation: TERMINAL_ROTATION,
        interactive: false,
      });

    },

    show: function(delay) {
      // var tween = "easeInOutQuart";
      var tween = "easeOutElastic";
      this.tweener.clear()
      .wait(delay)
      .to({alpha: 1,
        // rotation: TERMINAL_ROTATION,
        scaleX: 1, scaleY: 1
      }, 1500, tween)
    },

  });

});


/**
 * GlowLabel
 * 明滅を繰り返すラベル
 */
phina.namespace(function() {

  phina.define('GlowLabel', {
    superClass: 'phina.display.Label',

    init: function(text) {
      var options = {
        text: text,
        // fontFamily: 'meirio',
        // fontFamily: "'Mplus 1p', meirio",
        fill: "white",
        stroke: "gray",
        fontSize: 40,
      };
      this.superInit(options);

      this.tweener.clear()
      .setLoop(true)
      .to({alpha: 0}, 1200)
      .set({alpha: 1})
    },
  });

});


/**
 * タイマー兼ラベルクラス
 */
phina.namespace(function() {

  phina.define('TimerLabel', {
    superClass: 'phina.display.Label',

    value: 0,

    init: function(options) {
      options = ({
        fontFamily: "Gloria Hallelujah, meirio",
        fontSize: 50,
        strokeWidth: 4,
        fill: "green",
        stroke: "#71EC64",
      }).$safe(options)
      this.superInit(options);
      this.text = this.value;
      this.on('enterframe', function() {
        this.text = (this.value * 0.001).toFixed(1);
      });

      // "sec"を固定表示
      // this.unitLabel = Label({
      //   fontFamily: "Gloria Hallelujah, meirio",
      //   fontSize: 30,
      //   text: "sec",
      //   strokeWidth: 4,
      //   fill: "#AA723C",
      //   stroke: "#5F5249",
      // }).addChildTo(this)
      // .setPosition(this.width+this.padding, 0)
      // .setOrigin(0, 0)
      // ;

      this.alpha = 0.6;
    },

    reset: function() {
      this.value = 0;
    }
  });

});


/**
 * ターゲット
 */
phina.namespace(function() {

  var freqencyRange = [].range(400, 2500, 300);

  phina.define('Target', {
    superClass: 'phina.display.Sprite',

    isTarget : false,

    init: function(isTarget) {
      var name = (isTarget) ? 'genuine' : ['tridot', 'tora', 'tateshima'].pickup();
      this.superInit(name);
      this.isTarget = isTarget;
      // this.setScale(0.5, 0.5);

      // ランダムで向き変える
      this._flipped = 1;
      if ([0,1,2].pickup() === 0) {
        this.setScale(-1, 1);
        this._flipped = -1;
      }

      // アニメーションさせる
      var animateFreq = freqencyRange.pickup();
      this.age = 0;
      this.on('enterframe', function() {
        this.age++;
        if (this.age%animateFreq === 0) this.animate();
      })
    },

    animate: function() {
      this.tweener.clear()
      // .setLoop(1)
      .to({scaleX:1.1*this._flipped, scaleY:0.95}, 2000)
      .to({scaleX:0.9*this._flipped, scaleY:1.1}, 1900)
      .to({scaleX:1*this._flipped, scaleY:1}, 1900)
    },

  });

});


/**
 * 円形切り取りレイヤー
 */
phina.namespace(function() {

  phina.define('CircleClippedLayer', {
    superClass: 'phina.display.DisplayElement',

    _isAnimating : false,

    init: function(options, startRadius, openRadius, closeRadius, duration) {
      this.superInit(options);
      this.spotRadius = startRadius;
      this._openRadius = openRadius;
      this._closeRadius = closeRadius;
      this.duration = 450;
      // this.setOrigin(0, 0);
      this.clipCenter = phina.geom.Vector2(0, 0);
    },

    clip: function(c) {
      var cc = this.clipCenter;
      c.beginPath();
      c.arc(cc.x, cc.y, this.spotRadius*1.5, 0, Math.PI*2, false);
      c.arc(cc.x, cc.y, this.spotRadius*1.2, 0, Math.PI*2, true);
      c.arc(cc.x, cc.y, this.spotRadius, 0, Math.PI*2, false);
    },

    setClipCenter: function(x, y) {
      this.clipCenter.set(x, y);
      return this;
    },

    open: function(cb) {
      if (this._isAnimating) return;

      this._isAnimating = true;
      this.tweener.clear()
      .to({spotRadius: this._openRadius}, this.duration, "easeInCubic")
      .call(function() {
        this._isAnimating = false;
        if (typeof cb === 'function') cb();
      }, this)
    },

    close: function(cb) {
      if (this._isAnimating) return;

      this._isAnimating = true;
      this.tweener.clear()
      .to({spotRadius: this._closeRadius}, this.duration, "easeOutCubic")
      .call(function() {
        this._isAnimating = false;
        if (typeof cb === 'function') cb();
      }, this)
    },

  });

});


/**
 * blendModeによるスポットライトエフェクト
 */
phina.namespace(function() {

  phina.define('SpotLightCircle', {
    superClass: 'phina.display.CircleShape',

    _isAnimating : false,

    init: function(startRadius, openRadius, closeRadius) {
      var options = {
        radius: startRadius,
      };
      this.superInit(options);
      this.blendMode = 'destination-in';
      // this.openRadius = openRadius;
      // this.closeRadius = closeRadius;
      // this.duration = 700;
    },

    // open: function(cb) {
    //   if (this._isAnimating) return;

    //   this._isAnimating = true;
    //   this.tweener.clear()
    //   // .to({radius: this.openRadius}, this.duration, "easeOutCubic")
    //   .to({radius: this.openRadius}, this.duration, "easeInCubic")
    //   .call(function() {
    //     this._isAnimating = false;
    //     if (typeof cb === 'function') cb();
    //   }, this)
    // },

    // close: function(cb) {
    //   // console.log('cloase',this._isAnimating)
    //   if (this._isAnimating) return;

    //   this._isAnimating = true;
    //   this.tweener.clear()
    //   .to({radius: this.closeRadius}, this.duration, "easeOutCubic")
    //   .call(function() {
    //     this._isAnimating = false;
    //     if (typeof cb === 'function') cb();
    //   }, this)
    // }
  });

});
