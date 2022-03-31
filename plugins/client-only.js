import Vue from 'vue';
import Vue2TouchEvents from 'vue2-touch-events'
import VueAwesomeSwiper from 'vue-awesome-swiper';
import VueLazyload from 'vue-lazyload';
import VTooltip from 'v-tooltip';
import Inputmask from 'inputmask';
import vuescroll from 'vuescroll';
import * as rive from 'rive-js';
import { VueHammer } from 'vue2-hammer'
Vue.use(VueHammer)
//import VueThreeSixty from 'vue-360'



Vue.prototype.$rive = rive;

//Vue.use(VueThreeSixty)
Vue.use(Vue2TouchEvents)
Vue.use(VueAwesomeSwiper);
Vue.use(VueLazyload);
Vue.use(VTooltip, {
  defaultContainer: false
});

Vue.use({
  install: function(Vue, options) {
    Vue.directive('mask', {
      bind: function(el, binding) {
        if (!binding.value) return;
        Inputmask(binding.value).mask(el);
      }
    });
  }
});

Vue.use(vuescroll, {
  ops: {
    scrollPanel: {
      scrollingX: false
    },
    rail: {
      // keepShow: true,
      background: '#ffffff ',
      opacity: 0,
      size: '11px',
      gutterOfSide: '0px',
    },
    bar: {
      onlyShowBarOnScroll: false,
      size: '7px',
      minSize: 0.1,
      keepShow: true,
      background: '#ffffff',
      opacity: 1,
      specifyBorderRadius: '4px',
    }
  }
});
