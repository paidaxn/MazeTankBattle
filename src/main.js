import Vue from 'vue';
import ElementUI from 'element-ui';
import lodash from 'lodash';
import PIXI from 'pixi.js'
import App from './App.vue';
import router from './router/router';
import store from './store/store';
import 'element-ui/lib/theme-chalk/index.css';
import '@/common/less/reset.less';
import api from './api/index'; //封装的api
import axios from './axios/index'; //未封装直接调用
import 'swiper/dist/css/swiper.css';

import UTILS from './common/js/utils';

Vue.config.productionTip = false;

if (process.env.NODE_ENV === 'development' && process.env.VUE_APP_MOCK_ENABLED === 'true') {
    console.info('当前使用mock数据');
    require('./mock/mock.js');
}
Vue.use(ElementUI);
Vue.prototype.$http = api;
Vue.prototype.axios = axios;
Vue.prototype.PIXI = PIXI;
Vue.prototype.UTILS = UTILS;
Vue.prototype.$lodash = lodash;
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');

/**
 * 根据自己需要
 * 修改elemment插件的默认值
 * 可以减少项目中的代码量
 */
// ElementUI.Switch.props.activeValue.default = 1;
// ElementUI.Switch.props.inactiveValue.default = 0;
// ElementUI.TimePicker.mixins[0].props.valueFormat.default = "yyyy-MM-dd HH:mm:ss";
// ElementUI.TimePicker.mixins[0].props.defaultTime = "['12:00:00', '08:00:00']";
ElementUI.Table.props.border.default = true;
ElementUI.Table.props.size.default = 'mini';
ElementUI.TableColumn.props.align.default = 'center';
