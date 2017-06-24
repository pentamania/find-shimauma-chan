
/**
 * Resultscene
 */
phina.namespace(function() {

  var buttonColor = '#7D5134';
  // rgba(240, 240, 240, 0.5)

  phina.define('phina.game.ResultScene', {
    superClass: 'phina.display.DisplayScene',

    init: function(options) {
      this.superInit(options);
      var self = this;
      var gx = this.gridX;
      var gy = this.gridY;

      // console.log(options);
      var resultSecStr = (options.resultTime* 0.001).toFixed(2);

      // 評価
      var gradeText = "";
      CLEAR_GRADES.some(function(gradeData) {
        gradeText = gradeData.grade +": "+ gradeData.message;
        if (options.resultTime < gradeData.border) {
          return true;
        };
      });

      this.fromJSON({
        _isActive: false,
        children: {
          'background': {
            className: 'Sprite',
            arguments: ['strippedBackground'],
            x: gx.center(),
            y: gy.center(),
          },

          "mainLayer": {
            className: 'CircleClippedLayer',
            arguments: [options, 0, this.width*1.25, 0],
          },
        }
      });

      var mainLayer = this.mainLayer.fromJSON({
        children: {

          'gradeLabel': {
            className: 'GradeLabel',
            arguments: [gradeText, gx.center(3), gy.span(6)],
          },

          'titleLabel': {
            className: 'phina.display.Label',
            arguments: {
              text: "りざると！",
              fill: "#F3EEEE",
              stroke: "#584F4A",
              strokeWidth: 4,
              fontSize: 64,
            },
            x: this.gridX.center(),
            y: this.gridY.span(3),
          },

          'scoreLabel': {
            className: 'phina.display.Label',
            arguments: {
              text: resultSecStr+' びょう',
              fill: "blue",
              stroke: "green",
              fontSize: 48,
            },
            x: gx.center(),
            y: gy.span(7),
          },

          'tapCountLabel': {
            className: 'phina.display.Label',
            arguments: {
              text: "タップかいすう： "+ options.tapCount+' かい',
              fill: "white",
              stroke: "#494949",
              fontSize: 16,
            },
            x: gx.center(),
            y: gy.span(8),
          },

          'playButton': {
            className: 'phina.ui.Button',
            arguments: [{
              text: 'もういっかい！',
              width: gx.span(7),
              // fontColor: params.fontColor,
              fontSize: 28,
              cornerRadius: 4,
              fill: buttonColor,
            }],
            x: gx.center(-4),
            y: gy.span(12),
            interactive: true,
          },

          'shareButton': {
            className: 'phina.ui.Button',
            arguments: [{
              text: 'みんなにしらせる',
              width: gx.span(7),
              fontColor: "#F89451",
              fontSize: 28,
              cornerRadius: 4,
              // fill: 'rgba(240, 240, 240, 0.5)',
              fill: buttonColor,
              // stroke: '#aaa',
              // strokeWidth: 2,
            }],
            x: gx.center(4),
            y: gy.span(12),
          },

        }
      });
      mainLayer.setClipCenter(gx.center(), gy.center());

      mainLayer.playButton.onpush = function() {
        this._isActive = true;
        mainLayer.close(function() {
          this.exit('main');
        }.bind(this));
      }.bind(this),

      mainLayer.shareButton.onclick = function() {
        if (this._isActive) return;
        var text = 'シマウマちゃんを{0}びょうでみつけたよ！\n'.format(resultSecStr);
        var url = phina.social.Twitter.createURL({
          text: text,
          hashtags: HASHTAGS,
        });

        window.open(url, 'share window', 'width=480, height=320');
      }.bind(this);

      mainLayer.open();
      mainLayer.gradeLabel.show(600);
    },

  });

});
