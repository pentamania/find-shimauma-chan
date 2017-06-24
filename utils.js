
phina.namespace(function() {

  var g = phina.global;

  // 背景の動的生成： たてじま
  g.generateStrippedRect = function(width, height, boarderNum) {
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
  // g.generateStarPatternRect = function(width, height, lineNumX, lineNumY) {
  //   var BGColor = "#D7D4F7";
  //   var starColor = "#E8B7DE";
  //   var lineWidth = width / lineNumX;
  //   var lineHeight = height / lineNumX;
  //   var starRadius = lineWidth * 0.6;
  //   var c = phina.graphics.Canvas().setSize(width, height);

  //   c.fillStyle = BGColor;
  //   c.fillRect(0, 0, width, height);
  //   c.fillStyle = starColor;
  //   for (var y = 0; y <= lineNumX; y++) {
  //     for (var x = 0; x <= lineNumX; x++) {
  //       if (y%2 === 0) {
  //         if (x%2 === 0) c.fillStar(x*lineWidth, y*lineHeight, starRadius, 5, 0.38);
  //       } else {
  //         if (x%2 === 1) c.fillStar(x*lineWidth, y*lineHeight, starRadius, 5, 0.38);
  //       }
  //     }
  //   }

  //   return c;
  // };


  /**
   * ローカルストレージ管理オブジェクト
   */
  g.LocalStorageManager = {

    _defaultKey: "user_data",

    get defaultKey() {
      return this._defaultKey;
    },

    set defaultKey(v) {
      this._defaultKey = v;
    },

    // キーが存在しない場合は nullを返します
    load: function(key) {
      key = key || this._defaultKey;
      var data = window.localStorage.getItem(key);

      return JSON.parse(data);
    },

    save: function(key, dataObj) {
      key = key || this._defaultKey;
      // setItemはストレージが満杯の場合、例外を返します
      try {
        window.localStorage.setItem(key, JSON.stringify(dataObj));
      }
      catch(e) {
        console.warn("Fail saving to local storage", e)
      }
    },

    updateProp: function(key, prop, value) {
      key = key || this._defaultKey;
      var data = this.load(key);
      if (data == null) data = {}; // TODO: isObject
      data[prop] = value;
      this.save(key, data);
    },

    getProp: function(key, prop) {
      key = key || this._defaultKey;
      var data = this.load(key);
      if (data == null) return undefined;

      return data[prop];
    },

    // 順番は登録順では無いっぽい
    getAllData: function() {
      var ls = window.localStorage;
      var storageData = {};
      for (var i=0, len=ls.length; i < len; i++) {
        var key = ls.key(i);
        storageData[key] = this.load(key)
      }

      return storageData;
    },

    remove: function(key) {
      key = key || this._defaultKey;
      window.localStorage.remove(key);
    },

    clear: function() {
      window.localStorage.clear();
    },

    support: function() {
      return window.localStorage;
    },
  };

});
