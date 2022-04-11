<template>
  <div class="pages-dashboard-settings pt-2 pt-lg-5">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <component
        :is="isMobileBreakpoint ? 'mobile-screen' : 'div'"
        :bar-title="$t('user_information_edit')"
        @back="$router.push(pageRef || $localePath('/dashboard/'+$route.params.type))"
        height-auto
      >
        <div class="card profile-settings-card">
          <div class="row flex-wrap position-relative cover-with-avatar_edit">
            <div class="avatar_edit col-auto mb-2" id="anchor-logo">
              <div class="avatar_edit-inner">
                <form-image
                  v-model="form.logo"
                  :initial-image="getSalonImg('logo')"
                  :no-image="!hasLogo"
                  :width="isMobileBreakpoint ? 80 : 100"
                  :height="isMobileBreakpoint ? 80 : 100"
                  croppable
                  @new-image="hasLogo = true"
                  :autoSizing="false"
                />
              </div>
            </div>
            <div class="avatar_edit col-auto mb-2 cover" id="anchor-cover">
              <div class="avatar_edit-inner">
                <form-image
                  v-model="form.cover"
                  :initial-image="getSalonImg('cover')"
                  :no-image="!hasCover"
                  croppable
                  auto-sizing
                  @new-image="hasCover = true"
                />
              </div>
            </div>
            <p v-html="$t('logo_and_cover_sizing_info')" v-if="!isMobileBreakpoint"></p>
          </div>
          <p v-html="$t('logo_and_cover_sizing_info')" v-if="isMobileBreakpoint"></p>
          <div class="row">
            <div class="col-lg-4 mb-2 mb-lg-3">
              <form-text-input
                :maxlength="30"
                :placeholder="$t('name')"
                v-model="form.name"
                :invalid="isInvalid('name')"
                @change="removeError('name')"
                disabled
              />
            </div>
            <div class="col-lg-4 mb-2 mb-lg-3" v-for="i in 3" :key="i" :id="'anchor-phones'+(i === 1 ? '' : i)">
              <form-text-input v-if="i === 1 || typeof form.phones[i - 1] === 'string'"
                v-model="form.phones[i - 1]"
                autocomplete="tel"
                has-inputs
                :id="'phone_'+i"
                :placeholder="$t('contact_number')"
                :mask="$maskPhone()"
                :invalid="isInvalid('phones')"
                @change="removeError('phones')"
              >
                <template #inputs>
                  <form-checkbox v-model="form.telegram[i - 1]"
                    :input-name="'telegram_'+i" transparent label="<img src='/icons/telegram-circle.svg' alt='' />" />
                  <form-checkbox v-model="form.whatsapp[i - 1]"
                    :input-name="'whatsapp_'+i" transparent label="<img src='/icons/whatsapp-circle.svg' alt='' />" />
                </template>
              </form-text-input>
              <button v-else class="btn btn--primary-outline full-width text-left" @click="$set(form.phones, i - 1, ''), focusOnPhoneInput(i)">
                <icon name="plus-circle" />
                {{ $t(i == 2 ? 'add_second_number' : 'add_third_number') }}
              </button>
            </div>
            <div class="col-lg-4 mb-2 mb-lg-3" id="anchor-facebook">
              <form-text-input :placeholder="$t('short_number')" v-model="form.short_number" />
            </div>
            <div class="col-lg-4 mb-2 mb-lg-3" id="anchor-region_id">
              <form-select :label="$t('region')" :options="sellOptions.regions" v-model="form.region_id" has-search
                :invalid="isInvalid('region_id')" @change="removeError('region_id')" />
            </div>
            <div class="col-lg-4 mb-2 mb-lg-3" id="anchor-address">
              <form-text-input :placeholder="$t('address')" icon-name="placeholder" v-model="form.address"
                :invalid="isInvalid('address')" @change="removeError('address')" />
            </div>
            <div class="col-lg-2 mb-2 mb-lg-3">
              <pick-on-map-button :lat="form.lat" :lng="form.lng" :address="form.address"
                  @change-address="updateAddress" @change-latlng="updateLatLng">
                <form-text-input :placeholder="$t('address')" icon-name="placeholder" v-model="form.address"
                  :invalid="isInvalid('address')" @change="removeError('address')" />
              </pick-on-map-button>
            </div>
            <div class="col-lg-2 mb-2 mb-lg-3">
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
                  <form-select :label="$t('from_time')" :options="hoursOptions" v-model="form.working_hours.start"
                    @change="removeError('working_time')" :show-label-on-select="false" :clear-option="false" :allow-clear="false" wider />
                  <form-select :label="$t('to_time')" :options="hoursOptions" v-model="form.working_hours.end"
                    @change="removeError('working_time')" :show-label-on-select="false" :clear-option="false" :allow-clear="false" wider />
                </div>
              </form-select>
            </div>
            <div class="col-lg-4 mb-2 mb-lg-3" id="anchor-instagram">
              <form-text-input type="url" placeholder="Instagram URL" icon-name="link" v-model="form.instagram" block-class="placeholder-dark-blue-3" />
            </div>
            <div class="col-lg-4 mb-2 mb-lg-3" id="anchor-facebook">
              <form-text-input type="url" placeholder="Facebook URL" icon-name="link" v-model="form.facebook" block-class="placeholder-dark-blue-3" />
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
                :maxFiles="24"
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
    name: 'pages-dashboard-settings',
    mixins: [ToastErrorsMixin],
    components: {
      PickOnMapButton,
      FormGallery,
    },
    middleware: ['auth_general','auth_salon'],
    nuxtI18n: {
      paths: {
        az: '/idareetme-paneli/:type/parametrler'
      }
    },
    head() {
      return this.$headMeta({
        title: this.$t('user_information_edit')
      });
    },
    async asyncData({ store, route, app }) {
      await Promise.all([
        store.dispatch('getOptions'),
        store.dispatch('getMySalon', { id: app.$getDashboardId(route.params.type) })
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
          name: salon.name || '',
          phones: [...(salon.phones || [])].map(phone => '+'+phone),
          telegram: [...(salon.telegram || [])].slice(0, (salon.phones || []).length),
          whatsapp: [...(salon.whatsapp || [])].slice(0, (salon.phones || []).length),
          address: salon.address || '',
          lat: salon.lat || 0,
          lng: salon.lng || 0,
          region_id: salon.region_id || 1,
          working_days: [...(salon.working_days || [])],
          working_hours: {...salon.working_hours} || { start: '09:00', end: '18:00' },
          short_description: salon.short_description || '',
          description: salon.description || '',
          logo: null,
          cover: null,
          facebook: salon.facebook || '',
          instagram: salon.instagram || '',
          short_number: salon.short_number || ''
        },
        files: [],
        hasLogo: !!salon.logo,
        hasCover: !!salon.cover
      }
    },
    computed: {
      ...mapGetters(['sellOptions','mySalon']),

      crumbs() {
        return [
          { name: this.$t('dashboard'), route: '/dashboard/' + this.$route.params.type },
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
          .filter((phone, i) => {
            let pass = phone && phone.replace(/[\+\-\(\)]|[ ]|[\_]/g,'').length === 12;
            if (!pass) {
              this.form.telegram.splice(i, 1);
              this.form.whatsapp.splice(i, 1);
            }
            return pass;
          });
        if (!this.form.phones.length)
          this.$set(this.form.phones, 0, '');

        ['facebook','instagram'].map(key => {
          if (!this.form[key].match(new RegExp(/^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/))) {
            this.form[key] = '';
          }
        })

        // prepare data to send
        let formData = new FormData();
        for (let key in this.form) {
          if (key === 'name') continue;
          let value = this.form[key];
          let sendAsBinary = ['cover','logo'].includes(key);
          let sendAsStr = typeof value === 'object' && !sendAsBinary;
          if (key === 'phones') value = value.map(v => v.replace(/[\+\-\(\)]|[ ]/g,''));
          if (sendAsBinary) {
            if ((key === 'logo' && !this.hasLogo) || (key === 'cover' && !this.hasCover)) continue;
            value = await value?.promisedBlob('image/jpeg', 0.8);
            formData.append(key, value);
          } else if(value) {
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
          await this.updateMySalon({ id: this.$getDashboardId(this.$route.params.type), form: formData});
          await Promise.all([
            this.getMySalon({ id: this.$getDashboardId(this.$route.params.type) }),
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
        return this.mySalon[key] ? this.$withBaseUrl(this.mySalon[key]) : `/img/salon-${key === 'cover' ? `${key}-${this.mySalon.type_id}` : key}-${this.colorMode}.jpg`;
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
