<template>
<div>
  <button @click="login">Asan login</button>
</div>
</template>

<script>
export default {
  mounted() {
    if(this.$route.query.asan_token) {
      this.login();
    }
  },
  methods: {
    async getCerts() {
      let res = await fetch('https://apiasanlogintest.my.gov.az/ssoauthz/api/v1/token/certs',{
        headers: {
          Authorization: this.$cookies.get('asan_token')
        }
      })
      res = await res.json();
    },

    async checkToken() {
        let res = await fetch('https://apiasanlogintest.my.gov.az/ssoauthz/api/v1/token/check',{
          headers: {
            Authorization: this.$cookies.get('asan_token')
          }
        })
        res = await res.json()
         if(res.status === 401) {
           this.$cookies.remove('asan_token')
           location.href = 'https://asanlogintest.my.gov.az/auth?origin=http://localhost:3000?asan_token=true';
         }

    },
    async login() {
          let res = await fetch('https://asanlogintest.my.gov.az/ssoauthz/api/v1/token',{
            credentials: 'include',
          })
          res = await res.json();
          if(res.status === 200) {
            this.$cookies.set('asan_token',res.data.token, { maxAge: 60 * 60 * 12, path: '/' });
             this.getCerts();
             this.checkToken();
          }else if(res.status === 401) {
            this.checkToken();
          }


    }
  },

}
</script>

<style scoped>

</style>
