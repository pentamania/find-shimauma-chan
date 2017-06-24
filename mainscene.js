
/**
 * mainscene
 */
phina.namespace(function() {
  var randXs, randYs;

  phina.define('phina.game.MainScene', {
    superClass: 'phina.display.DisplayScene',

    targets: [],

    init: function(options) {
      this.superInit(options);
      var self = this;
      var gx = this.gridX;
      var gy = this.gridY;
      this._lv = 0;
      this.currentStage = 1;
      this.isSleeping = true;
      this._tapCount = 0;
      // this.backgroundColor = "#B459F4";

      this.fromJSON({
        children: {

          "backgroundLayer": {
            className: 'Sprite',
            arguments: ['strippedBackground'],
            x: gx.center(),
            y: gy.center(),
          },

          "mainLayer": {
            className: 'CircleClippedLayer',
            // arguments: options,
            arguments: [options, 0, this.width*1.25, 0],
            x: gx.center(),
            y: gy.center(),
            backgroundColor: 'purple',
          },

          "readyLabel": {
            className: 'Label',
            arguments: {
              text: "READY?",
              fontFamily: "'Gloria Hallelujah'",
              // fontFamily: "'gloria-hallelujah'",
              // fontFamily: 'Nova Mono',
              fontSize: 46,
              fill: "#4D3307",
              stroke: false,
            },
            x: gx.center(),
            y: gy.center(),
            rotation: -1000,
            alpha: 0,
          },

          // タイマー
          "timerLabel": {
            className: 'TimerLabel',
            x: gx.center(),
            y: gy.span(1),
          },

        }
      });

      var mainLayer = this.mainLayer.fromJSON({
        children: {
          // サバンナ画像
          "background": {
            className: 'Sprite',
            arguments: ['background', options.width, options.height],
            // x: gx.center(),
            // y: gy.center(),
          },

          "targetLayer": {
            className: 'DisplayElement',
            arguments: options,
          },

          "shadeRect": {
            className: 'RectangleShape',
            arguments: {
              width: options.width,
              height: options.height,
              fill: "black",
              stroke: false,
              padding: 0,
            },
            visible: false,
            alpha: 0.8,
          },

          "spotLight": {
            className: 'SpotLightCircle',
            arguments: [SPOT_LIGHT_RADIUS, SPOT_LIGHT_RADIUS, 0],
            visible: false,
          },
        }
      });

      // this.tweener = phina.accessory.Tweener().attachTo(this);

      // レベルアップ管理とか
      var lvupLabel = LevelUpEffectLabel(gx.center(), gy.span(4)).addChildTo(this);
      this.on('levelup', function() {
        switch (this._lv) {
          case 0:
            lvupLabel.show();
            mainLayer.shadeRect.setVisible(true);
            break;
          case 1:
            lvupLabel.show();
            mainLayer.spotLight.setVisible(true);
            break;
          default:
            break;
        }

        this._lv++;
      });

      this.setUpTarget();

      // 開始前"ready"ラベル
      this.readyLabel.tweener.clear()
      .to({rotation: 0, alpha: 1}, 500)
      .wait(1000)
      .to({rotation: 360, alpha: 0, scaleX: 0, scaleY: 0}, 200)
      .call(function() {
        this.readyLabel.visible = false;
        this.isSleeping = false;
        this.mainLayer.open();
      }, this);

    },

    update: function(app) {
      var p = app.pointer;
      var spotLight = this.mainLayer.spotLight;
      var kb = app.keyboard;

      // タイマー更新
      if (!this.isSleeping) this.timerLabel.value += app.deltaTime;

      // app.domElement.style.cursor = "pointer";
      if (!this.isSleeping && p.getPointingStart()) {
        SoundManager.play('search');
        this._tapCount++;
      }

      // スポットライト移動
      if (spotLight.visible && p.getPointing()) {
        spotLight.setPosition(p.x-this.mainLayer.x, p.y-this.mainLayer.y);
      }

      if (kb.getKeyDown('escape')) {
        this.exit('main');
      }
    },

    // ターゲットのセットアップ
    setUpTarget: function() {
      var self = this;
      var mainLayer = this.mainLayer;

      // 二週目以降、すでにターゲット用意している場合
      if (this.targets.length > 0) {
        this.targets.forEach(function(target) {
          if (target.has('pointstart')) {
            target.clear('pointstart');
            target.on('pointstart', function() {self.targetPointing(target)});
          }
          mainLayer.targetLayer.addChild(target);
        });
        this.resetTargetPosition();
        return;
      }

      // キャラクターをかぶらないよう配置
      randXs = [].range(-this.width*0.5+GRID_UNIT, this.width*0.5-GRID_UNIT, GRID_UNIT).shuffle();
      randYs = [].range(-this.height*0.5+GRID_UNIT, this.height*0.5-GRID_UNIT, GRID_UNIT).shuffle();

      TARGET_NUM.times(function(i, n) {
        // ターゲット設定
        // if (i === 0) target.isTarget = true;
        var isTarget = (i === 0) ? true : false;

        var target = Target(isTarget)
        .addChildTo(mainLayer.targetLayer)
        .setInteractive(true)
        .setPosition(randXs[i], randYs[i])
        ;

        self.targets.push(target);
        // 正解のみタップ時
        if (target.isTarget) target.on('pointstart', function() {self.targetPointing(target)});
      });

    },

    targetPointing: function(target) {
      var self = this;
      // はずれ
      // if (!target.isTarget) return;
      if (self.isSleeping) return;
      SoundManager.play('snap');

      // 正解
      self.isSleeping = true;

      // レベルアップ
      if (self.currentStage !== 0 && self.currentStage%3 === 0) {
        self.flare("levelup");
      }

      // this.mainLayer.setClipCenter(target.x, target.y);
      this.mainLayer.close(function() {
        if (self.currentStage >= STAGE_NUM) {
          // gameover
          self.exit({
            resultTime: self.timerLabel.value,
            tapCount: self._tapCount,
          });
        }

        self.currentStage++;
        self.resetTargetPosition();
        self.mainLayer.open(function() {
          self.isSleeping = false;
        });
      });

      // mainLayer.transitionCircle.close(function() {
      //   self.resetTargetPosition();
      //   mainLayer.transitionCircle.open();
      // });
    },

    resetTargetPosition: function() {
      randXs.shuffle();
      randYs.shuffle();
      // console.log(randXs, randYs);
      this.targets.forEach(function(target, i) {
        target.setPosition(randXs[i], randYs[i]);
        // if (target.isTarget) console.log(target.position);
      }.bind(this));
    },

  });

});

