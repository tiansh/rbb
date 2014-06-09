# Replace Bilibili bofqi #

<span style="font-size: 60px; font-weight: bold; line-height: 80px;">[点此进入脚本主页](http://tiansh.github.io/rbb/)</span>

<span style="font-size: 60px; font-weight: bold; line-height: 80px;">[点此直接安装脚本](http://tiansh.github.io/rbb/replace_bilibili_bofqi.user.js)</span>

用户请移步脚本主页，本页面主要介绍脚本的一些实现原理。

[其他一些bilibili视频的相关问题见wiki。](https://github.com/tiansh/rbb/wiki)

本脚本最早发布在userscripts.org网站上（176946），考虑到该网站不能稳定地访问，所以移动到了github上。关于2.21以前的历史版本，可以到userscripts上找到。

## 获取cid ##

获取视频地址需要获取cid。这里整理当前可用的获取cid的途径。

### 通过API获取 ###

<code>http://api.bilibili.com/view?type=json&id={aid}&batch=1&appkey={appkey}</code>

包括标题、描述、cid、分页标题等信息。<br />
信息最全，但是有频率限制，在不需要详细信息时可以优先考虑使用其他的途径。

### 通过pagelist获取 ###

<code>http://www.bilibili.tv/widget/getPageList?aid={aid}</code>

包括cid、分页标题。

### 通过HTML5接口获取 ###

<code>http://www.bilibili.tv/m/html5?aid={aid}&page={pid}</code>

仅限单个分页，可获取cid。

### 通过flash参数获取 ###

flash参数中"cid"或"\*-cid"可以提供cid

## 获取aid ##

<code>http://interface.bilibili.com/player?id=cid:{cid}</code>

可以通过cid获取aid

## 相邻视频推测cid ##

如果不能直接获取cid，会考虑通过相邻的视频的cid获取aid。

这里的实现是基于cid[i] > cid[j] 当且仅当 aid[i] > aid[j]在大多数情况下成立作为假设的。

当前脚本的实现方法是：
* 获取前后若干视频的cid
  * 忽略有多个分页的视频
  * 获取不超过6个视频的cid，或不超过12个视频（包括获取失败）
* 根据这些cid推断cid可能的区间
  * 如果两边都没有获取到cid则报告失败
  * 如果一边没有获取到cid，使用另一侧最大/小的cid作为替代
  * 去掉右侧比左侧所有数字都小的，和左侧比右侧所有数字都大的
  * 找到两边的中位数，把另一边在这个中位数以外的部分砍掉
  * 再找两边最靠里的数，把另一边在这里面的部分砍掉
  * 最后再找两边最靠里的数，认为我们要的cid在这个范围内
* 根据cid可能的区间尝试
  * 从中间往两边进行尝试
  * 如果进行了32次网络访问不能找到视频则放弃
    * 使用了缓存的情况下可能实际上已经尝试了更多个视频
  * 如果找到了某个分页之后已找到分页数×4＋6个视频查找失败则停止
* 最后整理得到aid的列表


## 检查是否可以正常播放 ##

<code>http://interface.bilibili.com/playurl?cid={cid}</code>

如果返回succ或suee则说明成功


## 修复网页全屏和浮动播放器 ##

请参考：http://static.hdslb.com/js/page.arc.js


## 获取新番专题相关内容 ##

参考：<br />
<code>http://api.bilibili.com/spview?spid={spid}&season\_id={season\_id}&bangumi=1</code><br />
<code>http://api.bilibili.tv/sp?spid={spid}</code>

spview中的bangumi参数为0/1用于区分是所属番剧还是相关视频。

这两个API似乎不需要appkey的样子……


## 完整版新番列表 ##

新番列表隐藏了部分视频，如果需要完整版新番列表，需要通过手机的加载方式获取。
<code>http://api.bilibili.com/list?pagesize=24&type=json&page=1&ios=0&order=default&appkey={appkey}&platform=ios&tid=33</code>。

## 其他视频信息 ##

### 搜索的自动补全 ###

在搜索框输入 /av\d+/ 形式的字串，会提示对应视频的标题。可以用此获取视频标题

<code>http://www.bilibili.tv/suggest?term=av{{aid}}&jsoncallback={{callback}}&rnd={{random}}&\_={{date}}</code>

返回是 JSONP 形式的，要注意的是callback是不可省的，否则会直接不返回数据。

### 补档页面使用的接口 ###

这个接口可以获取部分视频的信息，尚不确定什么条件下可以获取到，什么情况下不行。

<code>http://www.bilibili.tv/html/arc/{{aid}}.html</code>

返回的是 HTML 的片段。

## 脚本接口 ##

其他脚本使用本脚本接口的方法

```javascript
// 参数：第一个参数为对应的函数名（String，如"ping"、"getCid"）
// 后面的若干个参数为传给这个函数的参数
var rbb = function () {
  if (!unsafeWindow.replaceBilibiliBofqi) unsafeWindow.replaceBilibiliBofqi = [];
  unsafeWindow.replaceBilibiliBofqi.push(Array.apply(Array, arguments));
  return unsafeWindow.replaceBilibiliBofqi.constructor.name !== 'Array';
};
```

如上代码提供了调用本脚本接口的方法，如rbb('ping', function () { alert('replace bilibili bofqi loaded!'); });可以检查本脚本是否已被加载。

脚本提供的接口包括下列接口 

### ping ###

* 检查本脚本是否被加载，或注册本脚本被加载时的回调函数
* 参数：callback 回调函数（Function）
  * 参数： （无）

### getAid ###

* 通过cid获得aid和pid信息
* 参数：cid 视频的chatid，如529622（Number）
  * onsucc 成功获取时的回调函数（Function）
  * 参数：id 一个包括aid和pid的对象，如{"aid":314,"pid":1}。
  * onerror 获取失败的回调函数（Function）
  * 参数：（无）

### cid ###

* 获取当前视频的cid
* 参数：callback 返回cid的回调函数（Function）
  * 参数：null 当前无法获取或不是视频页面（可忽略，获取后会在重新调用回调函数）
  * 参数：cid 视频的cid（Number）
  * 在一些情况导致替换了当前页面的播放器后，可能会反复调用该回调函数

### getCid ###

* 通过aid和pid获取cid
* 参数：id 一个包括aid（articlecid，av号）和pid（pageid）的对象，
       如{"aid":314,"pid":1}；或{"aid":314,"pid":null}。（Object）
  * onsucc 成功获取时的回调函数（Function）
  * 参数：cid（Number），如529622（对应第一种参数）；
          或一个pid到cid的键值对组（Object），如{"1":529622}（对应第二种参数）
  * onerror 获取失败时的回调函数（Function）
  * 参数：（无）
  * methods 获取cid使用哪些方法和这些方法的顺序（String构成的Array）
  * 可能的取值：
    * "direct" 直接获取（可能包括HTML5、AssDown、PlayList等）
    * "api" 通过API获取
    * "undirect" 间接获取（通过相邻视频的cid猜测）
    * "cached" 读取缓存（如果之前获取过且用户没有禁用缓存）

说明：如果只需要一个分页请勿将pid留空，可以有更大的几率获取到cid。如果只需要当前视频的cid，请使用cid接口。


### replaced ###

* 注册发生替换播放器事件时的回调函数
* 参数：callback 替换播放器时回调（Function）
  * 参数：true 表示事件已经被注册
  * 参数：cid 播放器被替换时调用，参数是视频的cid（Number）

### added ###

* 注册添加评论等相关信息时的回调函数
* 参数：callback 替换播放器时回调（Function）
  * 参数：（无）

