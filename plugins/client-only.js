import Vue from 'vue';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import Inputmask from 'inputmask';

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