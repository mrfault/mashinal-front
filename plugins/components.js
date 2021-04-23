import Vue from 'vue';
// elements
import Icon from '~/components/elements/Icon';
import Timer from '~/components/elements/Timer';
import Breadcrumbs from '~/components/elements/Breadcrumbs';
import Paginate from '~/components/elements/Paginate';
import LoginTabs from '~/components/elements/LoginTabs';
// forms
import FormTextInput from '~/components/forms/FormTextInput';
import FormCheckbox from '~/components/forms/FormCheckbox';
import FormSelect from '~/components/forms/FormSelect';
// transitions
import TransitionExpand from '~/components/transitions/TransitionExpand';
// packages
import StackModal from '@innologica/vue-stackable-modal';
// ***
Vue.component('icon', Icon);
Vue.component('timer', Timer);
Vue.component('breadcrumbs', Breadcrumbs);
Vue.component('paginate', Paginate);
Vue.component('login-tabs', LoginTabs);
// ***
Vue.component('transition-expand', TransitionExpand);
// ***
Vue.component('form-text-input', FormTextInput);
Vue.component('form-checkbox', FormCheckbox);
Vue.component('form-select', FormSelect);
// ***
Vue.component('stack-modal', StackModal);