import Vue from 'vue';

const install = function(Vue) {
  Vue.prototype.$platform = {
    isPWA: () => navigator.standalone,
    isIOS: () => ['iPhone', 'iPad'].includes(navigator.platform),
    isAndroid: () => navigator.userAgent.match(/android/i)
  };
};

Vue.use({ install });
