<template>
  <div class="pages-profile-salon pt-2 pt-lg-5">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <component 
        :is="isMobileBreakpoint ? 'mobile-screen' : 'div'" 
        :bar-title="$t('user_information_edit')" 
        @back="$router.push(pageRef || $localePath('/profile'))" 
        height-auto
      >
        <div class="card profile-settings-card">
          <div class="row flex-nowrap">
            <div class="avatar_edit col-auto mb-2" id="anchor-logo">
              <form-image v-model="form.logo" :initial-image="getSalonImg('logo')" />
              <p class="text-center">100x100px</p>
            </div>
            <div class="avatar_edit col-auto mb-2 cover" id="anchor-cover">
              <form-image v-model="form.cover" :initial-image="getSalonImg('cover')" />
              <p class="text-center">1200x300px</p>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-4 mb-2 mb-lg-3">
              <form-text-input :maxlength="30" disabled 
                :placeholder="$t('name')" v-model="form.name" />
            </div>
            <div class="col-lg-4 mb-2 mb-lg-3" v-for="i in 2" :key="i" id="anchor-phones">
              <form-text-input v-if="i === 1 || typeof form.phones[i - 1] === 'string'"
                v-model="form.phones[i - 1]"
                autocomplete="tel" 
                :id="'phone_'+i"
                :placeholder="$t('contact_number')" 
                :mask="$maskPhone()"  
                :invalid="isInvalid('phones')" 
                @change="removeError('phones')" 
              />
              <button v-else class="btn btn--primary-outline full-width text-left" @click="$set(form.phones, i - 1, ''), focusOnPhoneInput(i)">
                <icon name="plus-circle" />
                {{ $t('add_second_number') }}
              </button>
            </div>
            <div class="col-lg-4 mb-2 mb-lg-3" id="anchor-region_id">
              <form-select :label="$t('region')" :options="sellOptions.regions" v-model="form.region_id" has-search 
                :invalid="isInvalid('region_id')" @change="removeError('region_id')" />
            </div>
            <div class="col-lg-4 mb-2 mb-lg-3" id="anchor-address">
              <form-text-input :placeholder="$t('address')" icon-name="placeholder" v-model="form.address"
                :invalid="isInvalid('address')" @change="removeError('address')" />
            </div>
            <div class="col-lg-4 mb-2 mb-lg-3">
              <pick-on-map-button :lat="form.lat" :lng="form.lng" :address="form.address"
                  @change-address="updateAddress" @change-latlng="updateLatLng">
                <form-text-input :placeholder="$t('address')" icon-name="placeholder" v-model="form.address" 
                  :invalid="isInvalid('address')" @change="removeError('address')" />
              </pick-on-map-button>
            </div>
            <div class="col-lg-4 mb-2 mb-lg-3">
              <button class="btn btn--dark-blue-2-outline full-width" @click="showPasswordModal = true">
                {{ $t('change_password') }}
              </button>
              <modal-popup
                :toggle="showPasswordModal"
                :title="$t('change_password_title')"
                @close="showPasswordModal = false"
              >
                <form class="form" @submit.prevent="changePassword" novalidate>
                  <div class="mb-2 mb-lg-3">
                    <form-text-input type="password" autocomplete="old-password" :maxlength="255" 
                      :placeholder="$t('current_password')"  v-model="pwdForm.old"
                    />
                  </div>
                  <div class="mb-2 mb-lg-3">
                    <form-text-input type="password" autocomplete="new-password" :maxlength="255" 
                      :placeholder="$t('new_password')"  v-model="pwdForm.password"
                    />
                  </div>
                  <div class="mb-2 mb-lg-3">
                    <form-text-input type="password" autocomplete="new-password" :maxlength="255" 
                      :placeholder="$t('confirm_new_password')"  v-model="pwdForm.password_confirmation"
                    />
                  </div>
                  <button type="submit" :class="['btn btn--green full-width', { pending: pending && showPasswordModal }]">
                    {{ $t('confirm') }}
                  </button>
                </form>
              </modal-popup>
            </div>
            <div class="col-lg-4 mb-2 mb-lg-3" id="anchor-working_days">
              <form-select :label="$t('work_days')" :options="daysOptions" v-model="form.working_days" :clear-option="false"
                :invalid="isInvalid('working_days')" @change="removeError('working_days')" multiple short-names-label />
            </div>
            <div class="col-lg-4 mb-2 mb-lg-3" id="anchor-working_hours">
              <form-select :label="$t('work_hours')" custom
                :values="{from: form.working_hours.start, to: form.working_hours.end, showPreposition: false }"
                :allow-clear="false"
              >
                <div class="form-merged">
                  <form-select :label="$t('from')" :options="hoursOptions" v-model="form.working_hours.start" 
                    @change="removeError('working_time')" :show-label-on-select="false" :clear-option="false" :allow-clear="false" />
                  <form-select :label="$t('from_time')" :options="hoursOptions" v-model="form.working_hours.end" 
                    @change="removeError('working_time')" :show-label-on-select="false" :clear-option="false" :allow-clear="false" />
                </div>
              </form-select>
            </div>
            <div class="col-lg-12 mb-2 mb-lg-3" id="anchor-short_description">
              <form-text-input :maxlength="1000" :placeholder="$t('short_information')" v-model="form.short_description" 
                @change="removeError('short_description')" :invalid="isInvalid('short_description')" />
            </div>
            <div class="col-lg-12 mb-2 mb-lg-3" id="anchor-description">
              <form-textarea :maxlength="1000" :placeholder="$t('general_information')" v-model="form.description" 
                @change="removeError('description')" :invalid="isInvalid('description')" />
            </div>
            <div class="col-lg-12" id="anchor-saved_gallery">
              <form-gallery
                itemClass="col-4 col-lg-1-8 mb-lg-3 mb-2"
                :maxFiles="21"
                :initialFiles="initialFiles"
                @change="filesOnChange"
                @loading="pending = $event"
              />
            </div>
            <div class="col-lg-2 offset-lg-10">
              <button :class="['btn btn--green full-width', {pending}]" @click="submit">{{ $t('confirm') }}</button>
            </div>
          </div>
        </div>
      </component>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import { ToastErrorsMixin } from '~/mixins/toast-errors'; 

  import PickOnMapButton from '~/components/elements/PickOnMapButton';
  import FormGallery from '~/components/forms/FormGallery';

  export default {
    name: 'pages-profile-salon',
    mixins: [ToastErrorsMixin],
    components: {
      PickOnMapButton,
      FormGallery,
    },
    middleware: ['auth_general','auth_salon'],
    nuxtI18n: {
      paths: {
        az: '/profil/salon'
      }
    },
    head() {
      return this.$headMeta({
        title: this.$t('user_information_edit')
      });
    },
    async asyncData({ store }) {
      await Promise.all([
        store.dispatch('getOptions'),
        store.dispatch('getMySalon')
      ]);

      let salon = store.getters.mySalon;
      
      return {
        showPasswordModal: false,
        pending: false,
        pwdForm: {
          old: '',
          password: '',
          password_confirmation: ''
        },
        form: {
          name: salon.name,
          phones: [...salon.phones].map(phone => '+'+phone),
          address: salon.address || '',
          lat: salon.lat || 0,
          lng: salon.lng || 0,
          region_id: salon.region_id || '',
          working_days: [...(salon.working_days || [])],
          working_hours: {...salon.working_hours} || { start: '09:00', end: '18:00' },
          short_description: salon.short_description || '',
          description: salon.description || '',
          logo: null,
          cover: null
        },
        files: []
      }
    },
    computed: {
      ...mapGetters(['sellOptions','mySalon']),

      crumbs() {
        return [
          { name: this.$t('dashboard'), route: '/profile/dashboard' },
          { name: this.$t('user_information_edit') }
        ]
      },

      hoursOptions() {
        let times = [];
        for(let i = 0; i < 24; i++) {
          let name = `${i < 10 ? '0'+i : i}:00`;
          times.push({ name, key: name });
        }
        return times;
      },
      daysOptions() {
        let days = [];
        for(let i = 1; i <= 7; i++) {
          days.push(this.getDayOption(i));
        }
        return days;
      },
      initialFiles() {
        return this.mySalon?.gallery_thumbs?.map((image, index) => ({
          preview: image,
          id: this.mySalon.gallery_ids[index],
          key: this.mySalon.gallery_ids[index],
        })) || []
      }
    },
    methods: {
      ...mapActions(['updateMySalon','getMySalon']),

      async submit() {
        if (this.pending) return;
        this.clearErrors();
        this.pending = true;
        // clear empty fields
        this.form.phones = this.form.phones
          .filter(p => p && p.replace(/[\+\-\(\)]|[ ]|[\_]/g,'').length === 12);
        if (!this.form.phones.length)
          this.$set(this.form.phones, 0, '');
        // prepare data to send
        let formData = new FormData();
        for (let key in this.form) {
          if (key === 'name') {
            continue;
          } else {
            let value = this.form[key];
            let sendAsBinary = ['cover','logo'].includes(key);
            let sendAsStr = typeof value === 'object' && !sendAsBinary;
            if (key === 'phones') value = value.map(v => v.replace(/[\+\-\(\)]|[ ]/g,''));
            if(!sendAsBinary || value)
              formData.append(key, sendAsStr ? JSON.stringify(value) : value);
          }
        }

        // Add new files to formData
        this.files.forEach(file => {
          if (file.hasOwnProperty('blob')) {
            formData.append('saved_gallery[]', file.blob)
          }
        })

        // Add gallery ids to formData
        const gallery_ids = []
        this.files.forEach((file, index) => {
          if (file.hasOwnProperty('id')) {
            gallery_ids.push({ position: index, id: file.id })
          }
        })
        formData.append('gallery_ids', JSON.stringify(gallery_ids))

        // Add removed gallery ids to formData
        const deleted_gallery = []
        this.mySalon.gallery_ids.forEach(id => {
          if (!this.files.map(({ id }) => id).includes(id)) {
            deleted_gallery.push(id)
          }
        })
        formData.append('deleted_gallery', JSON.stringify(deleted_gallery));

        // Add gallery count to formData
        formData.append('gallery_count', this.files.length);

        // update autosalon info
        try {
          await this.updateMySalon(formData);
          await Promise.all([
            this.getMySalon({id: this.user.autosalon?.id}),
            this.$auth.fetchUser()
          ]);
          this.$toasted.success(this.$t('saved_changes'));
          // reset form values
          this.$set(this.form, 'logo', null);
          this.$set(this.form, 'cover', null);
          this.$nuxt.$emit('gallery-update');
          this.pending = false;
        } catch({response: {status, data: {data, message}}}) {
          this.clearErrors();
          this.pending = false;
          let count = 0;
          Object.keys(data).reverse().map( (key) => {
            // show errors
            this.errors.push(key);
            this.showError(key, data[key][0], { fieldView: key, offset: this.isMobileBreakpoint ? -15 : -20 }, count === 0);
            count++;
          })
        }
      },

      getSalonImg(key) {
        return this.mySalon[key] ? this.$withBaseUrl(this.mySalon[key]) : `/img/salon-${key}.jpg`;
      },
      getDayOption(i) {
        i = parseInt(i);
        return {
          name: this.$t('days')[i - 1],
          nameShort: this.$t('days-short')[i - 1],
          key: i
        }
      },
      focusOnPhoneInput(i) {
        setTimeout(() => {
          this.$nextTick(() => {
            document.getElementById('phone_'+i).focus();
          });
        }, 0);
      },
      updateAddress(address) {
        this.form.address = address;
        this.removeError('address');
      },
      updateLatLng({ lat, lng }) {
        this.form.lat = lat;
        this.form.lng = lng;
      },
      async changePassword() {
        if (this.pending) return;
        this.pending = true;
        try {
          const data = await this.$axios.$post('/profile/change_password', this.pwdForm);
          this.pwdForm.old = '';
          this.pwdForm.password = '';
          this.pwdForm.password_confirmation = '';
          this.pending = false;
          this.showPasswordModal = false;
          this.$nextTick(() => {
            this.$toasted.show(data.message, { type: 'success' });
          });
        } catch(err) {
          this.pending = false;
        }
      },
      filesOnChange(files) {
        this.files = files
      }
    },
    created() {
      if (!this.form.phones.length)
        this.$set(this.form.phones, 0, '');
    }
  }
</script>