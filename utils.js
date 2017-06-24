
// 背景の動的生成
phina.namespace(function() {

  window.generateStrippedRect = function(width, height, boarderNum) {
    // 青系
    // var BGColor = "#D7D4F7";
    // var borderMainColor = "#5D63E7";

    // 木っぽい
    var BGColor = "#EAD979";
    var borderMainColor = "#CCBE47";
    var borderWidth = width / boarderNum;
    var c = phina.graphics.Canvas().setSize(width, height);

    // c.strokeStyle = false;
    c.fillStyle = BGColor;
    c.fillRect(0, 0, width, height);
    c.fillStyle = borderMainColor;
    for (var i = 0; i < boarderNum; i+=2) {
      c.fillRect(i*borderWidth, 0, borderWidth, height);
    }

    return c;
  };

  // 星を散りばめた背景
  window.generateStarPatternRect = function(width, height, lineNumX, lineNumY) {
    var BGColor = "#D7D4F7";
    var starColor = "#E8B7DE";
    var lineWidth = width / lineNumX;
    var lineHeight = height / lineNumX;
    var starRadius = lineWidth * 0.6;
    var c = phina.graphics.Canvas().setSize(width, height);

    c.fillStyle = BGColor;
    c.fillRect(0, 0, width, height);
    c.fillStyle = starColor;
    for (var y = 0; y <= lineNumX; y++) {
      for (var x = 0; x <= lineNumX; x++) {
        if (y%2 === 0) {
          if (x%2 === 0) c.fillStar(x*lineWidth, y*lineHeight, starRadius, 5, 0.38);
        } else {
          if (x%2 === 1) c.fillStar(x*lineWidth, y*lineHeight, starRadius, 5, 0.38);
        }
      }
    }

    return c;
  };

});
