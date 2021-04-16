import Vue from 'vue';

import Icon from '~/components/elements/Icon';
import Timer from '~/components/elements/Timer';
import Paginate from '~/components/elements/Paginate';
import LoginTabs from '~/components/elements/LoginTabs';
// forms
import InputText from '~/components/forms/InputText';
// packages
import StackModal from '@innologica/vue-stackable-modal';

Vue.component('icon', Icon);
Vue.component('timer', Timer);
Vue.component('paginate', Paginate);
Vue.component('login-tabs', LoginTabs);

Vue.component('input-text', InputText);

Vue.component('stack-modal', StackModal);