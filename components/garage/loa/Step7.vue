<template>
  <form class="form" @submit.prevent="submit" novalidate>
    <div class="checkbox-row bg-greyish-blue-2 round-4 mb-2 mb-lg-3 pb-1 pt-1">
      <form-checkbox 
        v-for="(option, index) in letterPermissionOptions" 
        :key="index"
        :label="$t(option.name)" 
        :checked-value="option.key" 
        :id="''+option.key" 
        v-model="letterPermissions" 
      />
    </div>
    <button type="submit" :class="['btn btn--green full-width', { pending }]">
      {{ $t('go_further') }}
    </button>
  </form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      pending: false
    }
  },
  computed: {
    ...mapGetters('letterOfAttorney', ['stepSendData']),

    letterPermissions: {
      get() { 
        return this.stepSendData.letterPermissions
      },
      set(value) { 
        this.updateSendData({ key: 'letterPermissions', value });
      }
    },
    letterPermissionOptions() {
      return this.$t('letter_permission_options').map((name, i) => ({ key: i + 1, name }));
    }
  },
  methods: {
    ...mapActions('letterOfAttorney', ['updateSendData']),

    submit() {
      this.$emit('next');
    }
  }
}
</script>