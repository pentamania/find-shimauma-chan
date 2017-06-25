
/**
 * phina.js extend
 */
phina.asset.SoundManager.setVolume(0.3);
// 音源が存在しない場合再生を取りやめる & loop設定追加
phina.asset.SoundManager.play = function(name, loop) {
  var sound = phina.asset.AssetManager.get('sound', name);
  if (!sound) return;

  if (loop) sound.setLoop(true);
  sound.volume = this.getVolume();
  sound.play();

  return sound;
};

// Label デフォルトパラメータの再定義
phina.display.Label.defaults = ({}).$safe({
  // fontFamily: "'Rounded Mplus 1c'",
  fontFamily: "'meirio', 'HiraKakuProN-W3'",
}, phina.display.Label.defaults);


/**
 * global const
 */
var GAME_VERSION = "1.0.0";
var SCREEN_WIDTH = 600;
var SCREEN_HEIGHT = 600;
var DEBUG_MODE = false;

var SPOT_LIGHT_RADIUS = SCREEN_WIDTH * 0.15;
var GRID_UNIT = 12;
phina.namespace(function(){
  var maxTarget = (SCREEN_WIDTH - GRID_UNIT*2) / GRID_UNIT;
  phina.global.TARGET_NUM = Math.min(maxTarget, 48);
});
var STAGE_NUM = 10;
// var HASHTAGS = ["シマウマちゃん探しゲーム"];
var HASHTAGS = ["あそこにシマウマちゃんがいるねゲーム"];
var MUTE_SOUND = false;
if (DEBUG_MODE) {
  MUTE_SOUND = true;
  STAGE_NUM = 1;
}
var CLEAR_GRADES = [{
  border: 25000,
  grade: 'S',
  message: "ア、ア、アワワワ",
  // message: "やべーよ～"
},{
  border: 35000,
  grade: 'A',
  message: "すっごーい！",
},{
  border: 45000,
  grade: 'B',
  message: "やりますね",
},{
  border: 60000,
  grade: 'C',
  message: "私たちならやれる！",
  // message: "へーき、へーき",
},{
  border: Infinity,
  grade: 'D',
  message: "全然分からん！",
}];
