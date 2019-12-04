/*
 * 在本地开发调试时，三个web项目和一个node项目都是在独立运行的
 * 因此需要配置每个服务的本地访问地址，以使能互相调用/请求
 * admin、editor、view、api 四个服务的默认端口号分别为
 * 8567、8565、8566、7051，因此默认配置如下
 * 如果还希望像先前只启动本项目（demo 模式）进行体验，将 API_PATH
 * 设置为 ‘https://godspen.ymm56.com/api/' 即可
 */

module.exports = {
  EDITOR_PATH: 'http://127.0.0.1:8565/', // 编辑器访问地址
  VIEW_PATH: 'http://127.0.0.1:8566/', // 页面客户端访问地址
  ADMIN_PATH: 'http://127.0.0.1:8567/', // 管理后台访问地址
  // API_PATH: 'http://127.0.0.1:7051/api', // api 服务端访问地址
  API_PATH: 'https://godspen.ymm56.com/api/', // 启动demo模式，使用官方 api 服务
}
