export default {
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
        this.$cookies.remove('asan_token')

        await this.$auth.logout();
        let origin = this.$env.IS_LOCAL ? 'http://localhost:3000/asan/garage-services' : 'https://dev.mashin.al/asan/garage-services'
        location.href = 'https://asanlogintest.my.gov.az/auth?origin='+origin;
      }else {
        if(!this.$auth.loggedIn) {
          this.$router.push('/asan/garage-services');
        }
      }
    }

    ,
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
