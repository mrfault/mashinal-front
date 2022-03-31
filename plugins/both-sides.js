
import Vue from 'vue';
import Vuelidate from 'vuelidate';
import VueScrollTo from 'vue-scrollto';
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


Vue.use(Croppa);
