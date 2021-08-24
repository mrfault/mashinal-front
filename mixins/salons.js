export const SalonsMixin = {
  methods: {
    getLogo(logo) {
      return this.$withBaseUrl(logo);
    },
    getCover(cover) {
      return this.$withBaseUrl(cover);
    },
    getConcatPhones(phones) {
      return phones
        .slice(0, this.brief ? 1 : 10)
        .map(phone => phone.replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/g, '<a onclick="event.stopPropagation()" href="tel:+'+phone+'">+$1 $2 $3 $4 $5</a>'))
        .join(', ');
    },
    getWorkingDays(days, hours) {
      if(!days && !hours) return false;
      let strHours = hours ? `${hours.start} - ${hours.end}` : '';
      if(!days) return strHours;
      let weekDays = [...days].sort(), dayRows = [], lastKey = 0;
      for (let i = 0; i < weekDays.length; i++) {
        let day = parseInt(weekDays[i]);
        if(i === 0) dayRows[lastKey] = [day];
        else if(day - 1 == weekDays[i - 1])
          dayRows[lastKey].push(day);
        else dayRows[++lastKey] = [day];
      }
      let strDays = this.$t('days-short');
      return dayRows.map(row => row.length === 1
        ? `${strDays[row[0] - 1]} ${strHours}`
        : `<span>${strDays[row[0] - 1]} - </span><span>${strDays[row[row.length - 1] - 1]} ${strHours}</span>`).join('<br/>');
    }
  }
}