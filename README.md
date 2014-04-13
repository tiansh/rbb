<span style="font-size: 60px; font-weight: bold; line-height: 80px;">[点此安装脚本](http://tiansh.github.io/rbb/replace_bilibili_bofqi.user.js)</span>

<span style="font-size: 60px; font-weight: bold; line-height: 80px;">[点此进入脚本主页](http://tiansh.github.io/rbb/)</span>


# 脚本接口 #

其他脚本使用本脚本接口的方法

<pre><code>// 参数：第一个参数为对应的函数名（String，如"ping"、"getCid"）
// 后面的若干个参数为传给这个函数的参数
var rbb = function () {
  if (!unsafeWindow.replaceBilibiliBofqi) unsafeWindow.replaceBilibiliBofqi = [];
  unsafeWindow.replaceBilibiliBofqi.push(Array.apply(Array, arguments));
  return unsafeWindow.replaceBilibiliBofqi.constructor.name !== 'Array';
};</pre></code>

如上代码提供了调用本脚本接口的方法，如rbb('ping', function () { alert('replace bilibili bofqi loaded!'); });可以检查本脚本是否已被加载。

脚本提供的接口包括下列接口 

## ping ##

* 检查本脚本是否被加载，或注册本脚本被加载时的回调函数
* 参数：callback 回调函数（Function）
  * 参数： （无）

## getAid ##

* 通过cid获得aid和pid信息
* 参数：cid 视频的chatid，如529622（Number）
  * onsucc 成功获取时的回调函数（Function）
  * 参数：id 一个包括aid和pid的对象，如{"aid":314,"pid":1}。
  * onerror 获取失败的回调函数（Function）
  * 参数：（无）

## cid ##

* 获取当前视频的cid
* 参数：callback 返回cid的回调函数（Function）
  * 参数：null 当前无法获取或不是视频页面（可忽略，获取后会在重新调用回调函数）
  * 参数：cid 视频的cid（Number）
  * 在一些情况导致替换了当前页面的播放器后，可能会反复调用该回调函数

## getCid ##

* 通过aid和pid获取cid
* 参数：id 一个包括aid（articlecid，av号）和pid（pageid）的对象，
       如{"aid":314,"pid":1}；或{"aid":314,"pid":null}。（Object）
  * onsucc 成功获取时的回调函数（Function）
  * 参数：cid（Number），如529622（对应第一种参数）；
          或一个pid到cid的键值对组（Object），如{"1":529622}（对应第二种参数）
  * onerror 获取失败时的回调函数（Function）
  * 参数：（无）
  * methods 获取cid使用哪些方法和这些方法的顺序（String构成的Array）
  * 可能的取值："direct" 直接获取（可能包括API、HTML5、AssDown、PlayList等）
    * "undirect" 间接获取（通过相邻视频的cid猜测）
    * "cached" 读取缓存（如果之前获取过且用户没有禁用缓存）

说明：如果只需要一个分页请勿将pid留空，可以有更大的几率获取到cid。如果只需要当前视频的cid，请使用cid接口。


## replaced ##

* 注册发生替换播放器事件时的回调函数
* 参数：callback 替换播放器时回调（Function）
  * 参数：true 表示事件已经被注册
  * 参数：cid 播放器被替换时调用，参数是视频的cid（Number）

## added ##

* 注册添加评论等相关信息时的回调函数
* 参数：callback 替换播放器时回调（Function）
  * 参数：（无）