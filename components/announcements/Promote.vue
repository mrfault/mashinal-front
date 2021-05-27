<template>
  <div class="promote-announcement">
    
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { ServicesMixin } from '~/mixins/services';

export default {
  props: {
    announcement: {}
  },
  mixins: [ServicesMixin],
  
}
</script>