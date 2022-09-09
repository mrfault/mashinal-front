export const SalonsMixin = {
  methods: {
    getLogo(logo) {
      return logo
        ? this.$withBaseUrl(logo)
        : `/img/salon-logo-${this.colorMode}.jpg`
    },
    getCover(cover, type) {
      return cover
        ? this.$withBaseUrl(cover)
        : `/img/salon-cover-${type}-${this.colorMode}${
            this.isMobileBreakpoint ? '-m' : ''
          }.jpg`
    },
    getTotalCount(salon) {
      return salon.announcements?.total || salon.announcement_count || 0
    },
    getConcatPhones(
      phones,
      max = 2,
      clickable = true,
      msg = false,
      shortNumber = false,
    ) {
      return (
        (shortNumber
          ? `<a style="font-weight: 500;" onclick="event.stopPropagation()" href="tel:${shortNumber}">${shortNumber}</a>`
          : '') +
        (phones || [])
          .filter((phone) => phone)
          .slice(0, max)
          .map((phone, i) =>
            `${phone}`
              .replace(
                /(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/g,
                '<span class="d-flex flex-row"><a style="font-weight: 500;" ' +
                  (clickable
                    ? 'onclick="event.stopPropagation()" href="tel:+' +
                      phone +
                      '"'
                    : 'href="javascript:void(0);"') +
                  '>+$1 $2 $3 $4 $5' +
                  (msg
                    ? `${msg.whatsapp[i] ? '{WHATSAPP}' : ''}${
                        msg.telegram[i] ? '{TELEGRAM}' : ''
                      }`
                    : '') +
                  '</a></span>',
              )
              .replace(
                '{WHATSAPP}',
                `<a rel="noopener" class="ml-1" target="_blank" href="https://wa.me/${phone}"><img src="/icons/whatsapp-circle.svg" alt="" /></a>`,
              )
              .replace(
                '{TELEGRAM}',
                `<a rel="noopener" class="ml-1" target="_blank" href="https://t.me/+${phone}"><img src="/icons/telegram-circle.svg" alt="" /></a>`,
              ),
          )
          .join(msg ? '' : ', ')
      )
    },
    getWorkingDays(days, hours) {
      if (!days && !hours) return false
      let strHours = hours?.start ? `<span style="font-weight: 500;">${hours.start} - ${hours.end}</span>` : ''
      if (!days || !days.length) return strHours
      let weekDays = [...days].sort(),
        dayRows = [],
        lastKey = 0
      for (let i = 0; i < weekDays.length; i++) {
        let day = parseInt(weekDays[i])
        if (i === 0) dayRows[lastKey] = [day]
        else if (day - 1 == weekDays[i - 1]) dayRows[lastKey].push(day)
        else dayRows[++lastKey] = [day]
      }
      let strDays = this.$t('days-short')
      let everyDay = this.$t('everyday')
      let everyDayEnabled = false;

      if(dayRows.length && dayRows[0].length === 7) {
        everyDayEnabled = true;
      }
      return (
        '<table>' +
        dayRows
          .map((row) =>
            row.length === 1
              ? `<tr><td style="font-weight: 500">${strDays[row[0] - 1]}</td><td>${strHours}</td></tr>`
              : `<tr>
                    <td style="font-weight: 500">${everyDayEnabled ? everyDay : (strDays[row[0] - 1]+' - '+strDays[row[row.length - 1] - 1])} </td>
                    <td style="font-weight: 500">${strHours}</td>
                </tr>`,
          )
          .join('') +
        '</table>'
      )
    },
  },
}
