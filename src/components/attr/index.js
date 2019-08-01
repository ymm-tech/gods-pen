
import Data from './Data'
import MEvent from './Event'
import MFunction from './Function'
import Resource from './Resource'
import Richtext from './RichText'
import Vue from 'vue'

function install () {
  Vue.component('attr-data', Data)
  Vue.component('attr-resource', Resource)
  Vue.component('attr-function', MFunction)
  Vue.component('attr-richtext', Richtext)
  Vue.component('attr-event', MEvent)
}

export default {
  install
}
