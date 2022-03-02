export default {
  data() {
    return {
      showRedirect: false,
      timer: 5,
      interval:null,
      timeout:null,
    }
  },
  methods: {
    // async getAsanCerts() {
    //   let res = await fetch('https://apiasanlogintest.my.gov.az/ssoauthz/api/v1/token/certs',{
    //     headers: {
    //       Authorization: this.$cookies.get('asan_token')
    //     }
    //   })
    //   res = await res.json();
    // },

    async checkAsanToken() {
      let res = await fetch('https://apiasanlogintest.my.gov.az/ssoauthz/api/v1/token/check',{
        headers: {
          Authorization: this.$cookies.get('asan_token')
        }
      })
      res = await res.json()
      if(res.status === 401) {
        this.showRedirect = true;
        await new Promise((resolve, reject) => {
          clearTimeout(this.timeout);
          this.timeout = setTimeout(async ()=> {
            if(this.showRedirect) {
              this.$cookies.remove('asan_token')
              let origin = this.$env.IS_LOCAL ? 'http://localhost:3000/asan/garage-services' : 'https://dev.mashin.al/asan/garage-services'
              location.href = 'https://asanlogintest.my.gov.az/auth?origin='+origin;
            }else {
              this.timer = 5;
            }


          },5000)
          this.timer = 5;
          clearInterval(this.interval)
          this.interval = setInterval(() => {
            if(this.timer === 1) clearInterval(this.interval)
            this.timer--;
          },1000)

        });
      }
    },
    async asanLogin() {
      let res = await fetch('https://asanlogintest.my.gov.az/ssoauthz/api/v1/token',{
        credentials: 'include',
      })
      res = await res.json();
      if(res.status === 200) {
        this.$cookies.set('asan_token',res.data.token, { maxAge: 60 * 60 * 12, path: '/' });
      }

      await this.checkAsanToken();
    }
  },

}
