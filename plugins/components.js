import Vue from 'vue';
// elements
import Icon from '~/components/elements/Icon';
import Timer from '~/components/elements/Timer';
import Breadcrumbs from '~/components/elements/Breadcrumbs';
import Pagination from '~/components/elements/Pagination';
import LoginTabs from '~/components/elements/LoginTabs';
import ActionBar from '~/components/elements/ActionBar';
import ModalPopup from '~/components/elements/ModalPopup';
import Backdrop from '~/components/elements/Backdrop';
import ShareIt from '~/components/elements/ShareIt';
// forms
import FormNumericInput from '~/components/forms/FormNumericInput';
import FormTextInput from '~/components/forms/FormTextInput';
import FormCheckbox from '~/components/forms/FormCheckbox';
import FormSelect from '~/components/forms/FormSelect';
import FormButtons from '~/components/forms/FormButtons';
import FormRange from '~/components/forms/FormRange';
// transitions
import TransitionExpand from '~/components/transitions/TransitionExpand';
// ***
Vue.component('icon', Icon);
Vue.component('timer', Timer);
Vue.component('breadcrumbs', Breadcrumbs);
Vue.component('pagination', Pagination);
Vue.component('login-tabs', LoginTabs);
Vue.component('action-bar', ActionBar);
Vue.component('backdrop', Backdrop);
Vue.component('modal-popup', ModalPopup);
Vue.component('share-it', ShareIt);
// ***
Vue.component('transition-expand', TransitionExpand);
// ***
Vue.component('form-numeric-input', FormNumericInput);
Vue.component('form-text-input', FormTextInput);
Vue.component('form-checkbox', FormCheckbox);
Vue.component('form-select', FormSelect);
Vue.component('form-buttons', FormButtons);
Vue.component('form-range', FormRange);