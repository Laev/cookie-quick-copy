// 获取单个cookie
// chrome.cookies.get(
//   {
//     url: "http://iciba.com",
//     name: "",
//   },
//   function (cookie) {
//     console.log(cookie);
//   }
// );

// // 获取多个cookie，并设置到当前插件页面下
// chrome.cookies.getAll({ domain: ".iciba.com" }, function (cookie) {
//   cookie.forEach(function (c) {
//     console.log(c.name, c.value);
//     document.cookie = c.name + "=" + c.value + ";";
//   });
// });

// // 监控Cookie的变更
// chrome.cookies.onChanged.addListener(function (changeInfo) {
//   console.log(changeInfo);
// });
/* ->
  Object {cause: "overwrite", cookie: Object, removed: true}
  Object {cause: "explicit", cookie: Object, removed: false}
  Object {cause: "overwrite", cookie: Object, removed: true}
  Object {cause: "explicit", cookie: Object, removed: false}
  Object {cause: "overwrite", cookie: Object, removed: true}
  Object {cause: "explicit", cookie: Object, removed: false}
  Object {cause: "overwrite", cookie: Object, removed: true}
  Object {cause: "explicit", cookie: Object, removed: false}
  */
