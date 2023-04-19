import Vue from 'vue';
import InlineSvg from 'vue-inline-svg';
// elements
const Icon  = () => import( '~/components/elements/Icon');
const Timer  = () => import( '~/components/elements/Timer');
const Breadcrumbs  = () => import( '~/components/elements/Breadcrumbs');
const Pagination  = () => import( '~/components/elements/Pagination');
const LoginTabs  = () => import( '~/components/elements/LoginTabs');
const ActionBar  = () => import( '~/components/elements/ActionBar');
const MobileScreen  = () => import( '~/components/elements/MobileScreen');
const ModalPopup  = () => import( '~/components/elements/ModalPopup');
const Backdrop  = () => import( '~/components/elements/Backdrop');
const ShareIt  = () => import( '~/components/elements/ShareIt');
const Loader  = () => import( '~/components/elements/Loader');
const InfiniteLoading  = () => import( '~/components/elements/InfiniteLoading');
const Popover  = () => import( '~/components/elements/Popover');
// forms
const FormNumericInput  = () => import( '~/components/forms/FormNumericInput');
const FormPriceInput  = () => import( '~/components/forms/FormPriceInput');
const FormTextInput  = () => import( '~/components/forms/FormTextInput');
const FormTextarea  = () => import( '~/components/forms/FormTextarea');
const FormCheckbox  = () => import( '~/components/forms/FormCheckbox');
const FormRadio  = () => import( '~/components/forms/FormRadio');
const FormSelect  = () => import( '~/components/forms/FormSelect');
const FormButtons  = () => import( '~/components/forms/FormButtons');
const FormRange  = () => import( '~/components/forms/FormRange');
const FormSwitch  = () => import( '~/components/forms/FormSwitch');
const FormImage  = () => import( '~/components/forms/FormImage');
const ContentEditable  = () => import( '~/components/forms/ContentEditable');
// transitions
const TransitionExpand  = () => import( '~/components/transitions/TransitionExpand');
const I360Viewer  = () => import( "~/components/I360Viewer")// ***
Vue.component('inline-svg', InlineSvg);
// ***
Vue.component('vue-three-sixty',I360Viewer)
Vue.component('icon', Icon);
Vue.component('timer', Timer);
Vue.component('breadcrumbs', Breadcrumbs);
Vue.component('pagination', Pagination);
Vue.component('login-tabs', LoginTabs);
Vue.component('action-bar', ActionBar);
Vue.component('mobile-screen', MobileScreen);
Vue.component('backdrop', Backdrop);
Vue.component('modal-popup', ModalPopup);
Vue.component('share-it', ShareIt);
Vue.component('loader', Loader);
Vue.component('infinite-loading', InfiniteLoading);
Vue.component('popover', Popover);
// ***
Vue.component('transition-expand', TransitionExpand);
// ***
Vue.component('form-numeric-input', FormNumericInput);
Vue.component('form-price-input', FormPriceInput);
Vue.component('form-text-input', FormTextInput);
Vue.component('form-textarea', FormTextarea);
Vue.component('form-checkbox', FormCheckbox);
Vue.component('form-radio', FormRadio);

Vue.component('form-select', FormSelect);
Vue.component('form-buttons', FormButtons);
Vue.component('form-range', FormRange);
Vue.component('form-switch', FormSwitch);
Vue.component('form-image', FormImage);
Vue.component('content-editable', ContentEditable);
