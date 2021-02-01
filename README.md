<p align="center"><a href="https://godspen.ymm56.com/" target="_blank" rel="noopener noreferrer"><img width="200" src="https://godspen.ymm56.com/doc/logo.png"></a></p>

<p align="center">
  <a href="https://godspen.ymm56.com/"><img src="https://img.shields.io/github/license/ymm-tech/gods-pen" alt="License"></a>
  <a href="https://godspen.ymm56.com/"><img src="https://img.shields.io/github/package-json/v/ymm-tech/gods-pen"></a>
</p>

 <p
    style="
color: red;
font-size: 12px;
"
  >满帮大前端营销团队招人了，一起来做码良，一起玩转营销，目前组内加上我5个人 ，3个女生哟，团队氛围非常好，计划新增6人，欢迎技术强，有担当的兄弟姐妹加入，坐标南京 主要技术栈vue，有兴趣的可将简历发给到 kunming.wangkm@amh-group.com 。谢谢！</p>

## :house: 官网

  官网： https://godspen.ymm56.com/

  使用手册： https://godspen.ymm56.com/doc/cookbook/introduce.html

  在线体验： https://godspen.ymm56.com/admin/#/home

  私有部署： https://godspen.ymm56.com/doc/cookbook/install.html

  组件商城： https://godspen.ymm56.com/shop/


![](https://ymm-maliang.oss-cn-hangzhou.aliyuncs.com/ymm-maliang/access/ymm_1539588655850.png)

<p style="font-size:18px;" align="center">:point_right: `喜欢别忘了点个 Star 支持我们，你的支持是我们坚持的动力` :point_left:</p>

## 码良是什么

码良是一个`在线生成 H5 页面并提供页面管理和页面编辑的平台`，用于快速制作 H5 页面。用户无需掌握复杂的编程技术，通过简单拖拽、少量配置即可制作精美的页面，可用于营销场景下的页面制作。同时，也为开发者提供了`完备的编程接入能力`，通过脚本和组件的形式获得强大的组件行为和交互控制能力。

## 码良为谁而作

如上所述，码良不仅可服务于运营人员用来制作轻业务的营销页面，基于完备的编程接入能力，甚至可以作为开发者进行快速业务迭代的工具。 `码良的初心是创建一个开源免费的平台，希望有才的人在平台上贡献自己的组件，脚本，设计模板页面，如果需要后续可以提供组件或脚本开发者设置免费或则收费使用` 当然完全也支持公司内部搭建使用。

## 码良现状

码良发布于2018年3月初，截止2020年7月目前已经支撑运满满**4100**多个活动页面。期间也得到了很多反馈、建议，以及 Bug 报告，基于此，我们持续迭代，致力于提升操作效率，打磨用户体验。道阻且长，仍需努力。目前你在官网上体验的所有能力 完全开源开放。

## 支持功能
1. 编辑器
    - [x] 面向不同角色切换工作台，并可以自行拖拽
    - [x] 组件，以及组合组件
    - [x] 实时预览的动画编辑
    - [x] 实时预览，并可按帧拖动预览的动画编辑
    - [x] 脚本功能，灵活的扩展编辑器面板的属性（非常容易给组件额外添加自定义的属性和方法，完全自己代码控制）
    - [x] 样式编辑，基础模式，代码模式。方便开发和运营不同角色使用
    - [x] 在线预览
    - [x] 二维码预览
    - [x] 可导入psd
    - [x] 支持pc端和移动端

2. 组件商城
    - [x] 25+组件,也欢迎开发者贡献自己的组件，[查看所有组件](https://godspen.ymm56.com/shop/#/home)
    - [x] 可上传，下载自己或别人的组件
    - [x] 可出售自己开发的组件
    - [x] 可购买别人的组件

4. 后台管理与数据
    - [x] 可按团队管理页面 类似gitlab管理项目。合理的权限管理
    - [x] 表单数据收集，并有数据同居
    - [x] 支持页面的pv uv以及自定义埋点信息
    - [x] 方便的资源和组件管理
    
## 组件商城

提供第三方组件快速导入自己搭建的系统，也可以把自己开发比较好的组件上传到组件商城提供他人免费或者付费使用

![](https://cos.56qq.com/fis/20200302185707288fedd7c1b92ed755.gif)

## 组件接入简单

如果第三方组件满足不了你，我们提供方便的脚手架创建组件，你可以把一个小功能，一个页面，一个项目做成一个组件，暴露参数给其他同学在编辑器里面填写 [组件开发文档](https://godspen.ymm56.com/doc/develop/component.html)

*图为组件开发套件使用动图*

![](https://s2.ax1x.com/2020/01/16/lvegvn.gif)


## 脚本扩展组件功能
每个特定功能的组件可以通过组合各种功能（点击跳转，打点等等任何逻辑）脚本来达到对组件功能的扩展。完成特定的功能，并友好的提供参数给到组件的使用者在编辑器上填写。*目前每个脚本都是一个 Vue 对象，这对熟悉 Vue 的开发者非常友好，深入了解请前往 [码良是如何设计高扩展的在线网页制作平台的](https://github.com/ymm-tech/gods-pen/wiki/%E7%A0%81%E8%89%AF%E7%B3%BB%E7%BB%9F%E6%A0%B8%E5%BF%83%E5%AE%9E%E7%8E%B0%E6%80%9D%E8%B7%AF)*
![](https://ymm-maliang.oss-cn-hangzhou.aliyuncs.com/ymm-maliang/resource/ymm_1570591673129.png)

*图为编辑器工作区界面*
![](https://cos.56qq.com/fis/20191011171531762de15ff82e88a338.png)



## 组件动画展示
运营活动对一些简单的动画提供支持，方便做一些入场和出场的动画，提升活动的交互感，我们使用了 Animate.css 提供的一套 CSS 动画。并提供逐帧设置预览，方便使用。下面提供简单的展示
![](https://ymm-maliang.oss-cn-hangzhou.aliyuncs.com/ymm-maliang/resource/ymm_1577935881750.gif?t=1)

## 合成组件展示
合成组件就是选择已有的节点保存为一个通用的组件，方便下次直接使用

### 使用组合组件
![](https://ymm-maliang.oss-cn-hangzhou.aliyuncs.com/ymm-maliang/access/ymm_1539760696547.gif)
### 导出组合组件
![](https://ymm-maliang.oss-cn-hangzhou.aliyuncs.com/ymm-maliang/access/ymm_1539760806761.gif)

## 模板页面
页面模板的目的和组合组件类似，都是提供已经做好的内容，运营快速选择使用达到快速上线活动的目的,下面是简单的演示
![](https://ymm-maliang.oss-cn-hangzhou.aliyuncs.com/ymm-maliang/access/ymm_1539760521686.gif)


## 安装依赖
这里切记，使用 `yarn install` 命令安装依赖，不要使用 npm 直接安装依赖，以确保版本统一。
```bash
// yarn install == yarn
yarn
```

### 开发

```bash
npm start
```

### 构建

编辑器构建

```bash
npm run editor:build
```

渲染器构建

```bash
npm run client:build
```


### 技术实现和教程

* [开篇: 码良的正确打开方式](https://github.com/ymm-tech/gods-pen/wiki/%E5%BC%80%E7%AF%87:-%E7%A0%81%E8%89%AF%E7%9A%84%E6%AD%A3%E7%A1%AE%E6%89%93%E5%BC%80%E6%96%B9%E5%BC%8F)
* [码良是如何设计高扩展的在线网页制作平台的](https://github.com/ymm-tech/gods-pen/wiki/%E7%A0%81%E8%89%AF%E7%B3%BB%E7%BB%9F%E6%A0%B8%E5%BF%83%E5%AE%9E%E7%8E%B0%E6%80%9D%E8%B7%AF)
* [神笔已开，我该如何使用](https://github.com/ymm-tech/gods-pen/wiki/%E7%A5%9E%E7%AC%94%E5%B7%B2%E5%BC%80%EF%BC%8C%E6%88%91%E8%AF%A5%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8)
* [组件开发](https://github.com/ymm-tech/gods-pen/wiki/%E4%B9%9D%E5%B1%82%E4%B9%8B%E5%8F%B0%EF%BC%8C%E8%B5%B7%E4%BA%8E%E7%B4%AF%E5%9C%9F%EF%BC%9A%E7%A0%81%E8%89%AF%E7%BB%84%E4%BB%B6%E5%BC%80%E5%8F%91)
* [脚本扩展组件功能](https://github.com/ymm-tech/gods-pen/wiki/%E8%84%9A%E6%9C%AC%E6%89%A9%E5%B1%95%E7%BB%84%E4%BB%B6%E5%8A%9F%E8%83%BD)



## 常见问题

#### Node.js 版本须控制在 10.x ，使用诸如 11.x、12.x 的版本会导致在安装依赖时报错

#### 项目依赖须使用 yarn 安装，不推荐使用 npm ，否则会产生依赖版本上的问题

#### 在 Windows 系统上安装依赖时，如果缺少 C++ 编译环境会报错

>![](https://cos.56qq.com/fis/201910121010326537220190b4d0131b.png)
>可以尝试全局安装 [windows-build-tools](https://www.npmjs.com/package/windows-build-tools)
>windows-build-tools 是一个 npm 包，可以一键安装 c++ 编译所需的 python27、Visual Studio、C++ Build Tool 等。
>Both installations are conflict-free, meaning that they do not mess with existing installations of Visual Studio, C++ Build Tools, or Python

####  如果碰到安装 Sass 模块失败，单独安装一下即可


## License

[MIT](http://opensource.org/licenses/MIT)


## 交流群

| 钉钉 | 微信  |
| ------------- | ------------- |
|<img src="https://godspen.oss-cn-shanghai.aliyuncs.com/godspen/qrcode/WechatIMG40.jpeg" width="350px"><div align="center"> 优先加钉钉群 </div>|<img src="https://godspen.oss-cn-shanghai.aliyuncs.com/godspen/qrcode/qrcode.jpeg?t=3" width="300px"><div align="center"> 如果上面微信二维码过期，[点击我查看最新二维码](https://godspen.oss-cn-shanghai.aliyuncs.com/godspen/qrcode/qrcode.jpeg) 添加的时候备注上 `码良` 我再邀请你进入群聊 </div>|


## 支持我们

### 你可以打赏我们 :coffee: 来杯咖啡 :coffee:

<img src="https://ymm-maliang.oss-cn-hangzhou.aliyuncs.com/ymm-maliang/resource/ymm_1572852703575.jpeg" width="360px">

### 也可以点个 Star
开源项目需要的是持续地坚持，而我们坚持的动力当然也来自于你们的支持，希望你 :point_right: `来都来了，加个关注再走吧` :point_left:



