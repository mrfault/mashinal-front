
import Vue from 'vue';
import Vuelidate from 'vuelidate';
import VueScrollTo from 'vue-scrollto';
import vuescroll from 'vuescroll';
import Croppa from 'vue-croppa';

Vue.use(Vuelidate);

Vue.use(VueScrollTo, {
  container: 'body',
  duration: 300,
  easing: 'ease',
  offset: 0,
  force: true,
  cancelable: false,
  onStart: false,
  onDone: false,
  onCancel: false,
  x: false,
  y: true
});

Vue.use(vuescroll, {
  ops: {
    // The global config
    rail: {
      background: '#f2f2f2 ',
      opacity: 1,
      size: '0.25rem',
      gutterOfSide: '0.125rem',
    },
    bar: {
      onlyShowBarOnScroll: true,
      size: '0.125rem',
      minSize: 0.1,
      keepShow: false,
      background: '#243749',
      opacity: 1,
      specifyBorderRadius: '0.3125rem',
    }
  },
  name: 'vuescroll'
});

Vue.use(Croppa);