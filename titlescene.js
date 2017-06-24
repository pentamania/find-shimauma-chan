
/**
 * titleScene
 */
phina.namespace(function() {

  phina.define('phina.game.TitleScene', {
    superClass: 'phina.display.DisplayScene',

    init: function(options) {
      this.superInit(options);
      var gx = this.gridX;
      var gy = this.gridY;
      this.backgroundColor = "#5C7DCC";

      // ハイスコア表記
      var lsm = LocalStorageManager;
      var bestRecord = lsm.getProp(null, "bestRecord") || 0;
      // var tapCount = lsm.getProp(null, "tapCount") || 0;
      // var bestRecordStr = (bestRecord) ? (bestRecord*0.001).toFixed(2) : " -- ";
      var bestRecordStr = (bestRecord*0.001).toFixed(2);
      var bestRecordLabelText = (bestRecord !== 0) ? "さいこうきろく: "+ bestRecordStr+ " びょう" : "";
      // console.log(bestRecord)

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
            // arguments: [options, this.width*1.25, this.width*1.25, 0],
            arguments: [options, 0, this.width*1.25, 0],
            // x: gx.center(),
            // y: gy.center(),
          },
        }
      });

      var mainLayer = this.mainLayer.fromJSON({
        children: {
          'titleLabel': {
            className: 'phina.display.Sprite',
            arguments: ['titleLogo'],
            // className: 'phina.display.Label',
            // arguments: {
            //   text: "あそこにシマウマちゃんがいるね！",
            //   fontFamily: 'Meirio',
            //   fill: "red",
            //   stroke: "green",
            //   fontSize: 50,
            // },
            x: this.gridX.center(),
            y: this.gridY.span(4),
          },

          // 'subtitleLabel': {
          //   className: 'phina.display.Label',
          //   arguments: {
          //     text: "Find It!",
          //     fontFamily: 'Nova Mono',
          //     fill: "red",
          //     stroke: false,
          //     fontSize: 32,
          //   },
          //   x: this.gridX.center(),
          //   y: this.gridY.span(6),
          // },

          // インスト表示
          // 'instTitleLabel': {
          //   className: 'phina.display.Label',
          //   arguments: {
          //     text: "あそびかた",
          //     // fontFamily: "'Rounded Mplus 1c', meirio",
          //     fill: "#595959",
          //     stroke: 'white',
          //     fontSize: 24,
          //   },
          //   x: this.gridX.center(),
          //   y: this.gridY.center(-1),
          // },
          'targetInstImage': {
            className: 'Target',
            arguments: [true],
            x: this.gridX.center(-2),
            y: this.gridY.center(1),
          },
          'targetInstLabel': {
            className: 'phina.display.Label',
            arguments: {
              text: "←みつけてタップ！",
              // fontFamily: "'Rounded Mplus 1c', meirio",
              textAlign: 'left',
              fill: "#595959",
              stroke: 'white',
              fontSize: 20,
            },
            x: this.gridX.center(2),
            y: this.gridY.center(1),
          },

          'bestRecordLabel': {
            className: 'phina.display.Label',
            arguments: {
              text: bestRecordLabelText,
              // text: "さいこうきろく: "+ bestRecordStr+ " びょう",
              // text: "さいこうきろく "+ bestRecordStr+ " びょう"+" (タップかいすう： "+tapCount+")",
              fill: "#7F1919",
              stroke: '#FFFADD',
              fontSize: 22,
            },
            x: this.gridX.center(),
            y: this.gridY.span(11),
          },
          // 'タップでスタート！'
          'startLabel': {
            className: 'GlowLabel',
            arguments: ["タップでスタート！"],
            x: this.gridX.center(),
            y: this.gridY.span(13),
          },

          'versionNumLabel': {
            className: 'phina.display.Label',
            arguments: {
              text: "Ver. "+ GAME_VERSION,
              // fontFamily: "'Rounded Mplus 1c', meirio",
              fill: "#595959",
              stroke: 'white',
              fontSize: 12,
            },
            x: this.gridX.center(),
            y: this.gridY.span(15),
          },
        }
      });

      mainLayer.setClipCenter(gx.center(), gy.center());
      mainLayer.open();

      // var spot = this.transitionCircle;
      this.on('pointend', function() {
        mainLayer.close(function() {
          this.exit();
        }.bind(this));
      });

      SoundManager.play('bgm', true);
    },

  });

});
