export const RoutesMixin = {
  computed: {
    partsRoutes() {
      return [
        {
          title: 'all',
          localeTitle: this.$t('all'),
          slug: '/',
          route: '/parts',
          icon: 'parts',
          showOnMenu: true
        },{
          title: 'parts',
          localeTitle: this.$t('parts'),
          slug: this.$t('slug_parts'),
          route: '/parts/' + this.$t('slug_parts'),
          icon: 'part-1',
          showOnMenu: true
        },{
          title: 'tyres_and_rims',
          localeTitle: this.$t('tyres_and_rims'),
          slug: this.$t('slug_tyres_and_rims'),
          route: '/parts/' + this.$t('slug_tyres'),
          icon: 'part-2',
          showOnMenu: true
        },{
          title: 'tyres',
          localeTitle: this.$t('tyres'),
          slug: this.$t('slug_tyres'),
          route: '/parts/' + this.$t('slug_tyres'),
          icon: null,
          showOnMenu: false
        },{
          title: 'rims',
          localeTitle: this.$t('rims'),
          slug: this.$t('slug_rims'),
          route: '/parts/' + this.$t('slug_rims'),
          icon: null,
          showOnMenu: false
        },{
          title: 'oil_and_auto_chemistry',
          localeTitle: this.$t('oil_and_auto_chemistry'),
          slug: this.$t('slug_oil_and_auto_chemistry'),
          route: '/parts/' + this.$t('slug_oil_and_auto_chemistry'),
          icon: 'part-3',
          showOnMenu: true
        },{
          title: 'batteries',
          localeTitle: this.$t('batteries'),
          slug: this.$t('slug_batteries'),
          route: '/parts/' + this.$t('slug_batteries'),
          icon: 'part-4',
          showOnMenu: true
        },{
          title: 'auto_accessories',
          localeTitle: this.$t('auto_accessories'),
          slug: this.$t('slug_auto_accessories'),
          route: '/parts/' + this.$t('slug_auto_accessories'),
          icon: 'part-5',
          showOnMenu: true
        },{
          title: 'repair_tools',
          localeTitle: this.$t('repair_tools'),
          slug: this.$t('slug_repair_tools'),
          route: '/parts/' + this.$t('slug_repair_tools'),
          icon: 'part-6',
          showOnMenu: true
        },
      ]
    }
  }
}