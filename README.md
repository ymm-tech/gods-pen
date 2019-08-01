## 编辑器（含渲染器）

### 安装依赖

```bash
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

### 组件系统的核心逻辑

                 数据库组件信息                  生成node添加到组件树
组件添加 addone -------------------> getBaseNode -----------------------
                                                                       |    
                                                                       ↓    
递归渲染 <--------------------------------------------------------- 组件树 <--------------------- 已有组件树数据
|
↓
节点渲染  node-css
         node-fun
         node-move                   fire('load.end')                  迭代组合，实例化动态组件
         node-load && cLoader.load -------------------> registerNode ---------------------------|
                                                        |
                                                        |
          style  version label  数据劫持 <--------------|

组件数据流动

![](http://on-img.com/chart_image/5b486756e4b09a67416957fc.png)
