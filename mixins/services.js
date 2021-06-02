export const ServicesMixin = {
  methods: {
    getServiceIcon(type) {
      if(type == 1) return 'vip';
      else if(type == 2) return 'premium';
      else if(type == 4) return 'top';
    },
    getServiceLabel(count, label, shorten = false) {
      const replaced = (str) => !shorten ? str 
        : str.replace(/день|дня|дней/, 'д.').replace('gün', 'g.').replace('dəfə', 'd.').replace('штука', 'шт.');
      if(!['day','count'].includes(label)) return replaced(`${count} ${label}`);
      return replaced(this.$readPlural(count, this.$t('plural_forms_'+label)));
    },
    getReplacedName(name) {
      return name.replace('Поднять в Топ', 'В Топ')
    }
  },
  computed: {
    staticServices() {
      return [
        { type: 1, name: 'vip' },
        { type: 2, name: 'premium' },
        { type: 4, name: 'top' }
      ]
    }
  }
}