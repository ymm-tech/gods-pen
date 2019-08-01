import Page from '../components/client/Page'
let config = require('../config/index')

var routerMap = {
  mode: 'history',
  base: '/' + config.VIEW_NAME,
  routes: [
    {
      path: '/:pageKey',
      component: Page
    },
    {
      path: '/:projectKey/:pageKey',
      component: Page
    }
  ]
}
export default routerMap
