// ==UserScript==
// @name        Replace bilibili bofqi
// @namespace   http://userscripts.org/users/ts
// @description 替换哔哩哔哩弹幕网（bilibili.com, bilibili.tv, bilibili.kankanews.com）播放器为原生播放器，直接外站跳转链接可长按选择播放位置，处理少量未审核或仅限会员的视频。
// @include     /^http://([^/]*\.)?bilibili\.com(/.*)?$/
// @include     /^http://([^/]*\.)?bilibili\.tv(/.*)?$/
// @include     /^http://([^/]*\.)?bilibili\.kankanews\.com(/.*)?$/
// @version     2.44
// @updateURL   https://tiansh.github.io/rbb/replace_bilibili_bofqi.meta.js
// @downloadURL https://tiansh.github.io/rbb/replace_bilibili_bofqi.user.js
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @grant       unsafeWindow
// @copyright   2013+, 田生
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @license     CC Attribution-ShareAlike 4.0 International; http://creativecommons.org/licenses/by-sa/4.0/
// @run-at      document-start
// ==/UserScript==

