import Vue from 'vue';
import InlineSvg from 'vue-inline-svg';
// elements
import Icon from '~/components/elements/Icon';
import Timer from '~/components/elements/Timer';
import Breadcrumbs from '~/components/elements/Breadcrumbs';
import Pagination from '~/components/elements/Pagination';
import LoginTabs from '~/components/elements/LoginTabs';
import ActionBar from '~/components/elements/ActionBar';
import MobileScreen from '~/components/elements/MobileScreen';
import ModalPopup from '~/components/elements/ModalPopup';
import Backdrop from '~/components/elements/Backdrop';
import ShareIt from '~/components/elements/ShareIt';
import Loader from '~/components/elements/Loader';
import InfiniteLoading from '~/components/elements/InfiniteLoading';
import Popover from '~/components/elements/Popover';
// forms
import FormNumericInput from '~/components/forms/FormNumericInput';
import FormTextInput from '~/components/forms/FormTextInput';
import FormTextarea from '~/components/forms/FormTextarea';
import FormCheckbox from '~/components/forms/FormCheckbox';
import FormRadio from '~/components/forms/FormRadio';
import FormSelect from '~/components/forms/FormSelect';
import FormButtons from '~/components/forms/FormButtons';
import FormRange from '~/components/forms/FormRange';
import FormSwitch from '~/components/forms/FormSwitch';
import FormImage from '~/components/forms/FormImage';
import ContentEditable from '~/components/forms/ContentEditable';
// transitions
import TransitionExpand from '~/components/transitions/TransitionExpand';
import I360Viewer from "~/components/I360Viewer";
// ***
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
