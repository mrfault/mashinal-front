import Vue from 'vue';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import Inputmask from 'inputmask';
import vuescroll from 'vuescroll';

Vue.use(VueAwesomeSwiper);

Vue.use({
  install: function(Vue, options) {
    Vue.directive('mask', {
      bind: function(el, binding) {
        if(!binding.value) return;
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