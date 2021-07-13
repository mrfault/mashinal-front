<template>
  <div class="pages-contact-us pt-5">
    <div class="container">
      <breadcrumbs :crumbs="crumbs">
        <share-it type="contact" />
      </breadcrumbs>
      <div class="card mb-2 mb-lg-3">
        <h2 class="title-with-line">
          <span>{{ $t('contact_information') }}</span>
        </h2>
        <div class="row contact-us_info">
          <div class="col-lg-4">
            <div class="contact-us_info-details">
              <icon name="phone-call" />
              <a :href="`tel:${support.phone}`">{{ support.phone }}</a>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="contact-us_info-details">
              <icon name="envelope" />
              <a :href="`mailto:${support.email}`">{{ support.email }}</a>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="contact-us_info-details">
              <icon name="time" />
              <span>{{ support.worktime }}</span>
            </div>
          </div>
        </div>
        <template v-if="isMobileBreakpoint">
          <hr />
          <share-it type="contact" />
        </template>
      </div>
      <div class="card">
        <h2 class="title-with-line">
          <span>{{ $t('contact_us') }}</span>
        </h2>
        <form class="form" @submit.prevent="sendMessage">
          <div class="row">
            <div class="col-lg-4 mb-2 mb-lg-3">
              <form-text-input 
                v-model="form.email"
                autocomplete="email" 
                :maxlength="255"
                :placeholder="$t('email')" 
                :mask="$maskEmail()" 
                :invalid="$v.form.email.$error"
              />
            </div>
            <div class="col-lg-12 mb-2 mb-lg-3">
              <form-textarea 
                v-model="form.message" 
                :placeholder="$t('message')" 
                :invalid="$v.form.message.$error"
                :maxlength="3000" 
              />
            </div>
            <div class="col-lg-2 offset-lg-10">
              <button type="submit" class="btn btn--green full-width">
                {{ $t('send') }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import { required, email } from 'vuelidate/lib/validators';

  export default {
    name: 'pages-contact-us',
    nuxtI18n: {
      paths: {
        az: '/elaqe'
      }
    },
    head() {
      return this.$headMeta({
        title: this.$t('contact_us')
      });
    },
    data() {
      return  {
        pending: false,
        form: {
          email: '',
          message: ''
        },
        support: {
          phone: '*8787',
          email: 'support@mashin.al',
          worktime: this.$t('worktime_support')
        }
      }
    },
    validations: {
      form: {
        email: { required, email },
        message: { required }
      }
    },
    computed: {
      crumbs() {
        return [
          { name: this.$t('contact_us') }
        ]
      }
    },
    methods: {
      async sendMessage() {
        this.$v.$touch();
        if (this.pending || this.$v.$pending || this.$v.$error) return;
        this.pending = true;
        try {
          await this.$axios.$post('/save_mail', this.form);
          this.pending = false;
          this.form.email = '';
          this.form.message = '';
          this.$v.$reset();
          this.$toasted.success(this.$t('message_sent_successfully'));
        } catch(err) {
          this.pending = false;
        }
      }
    }
  }
</script>