import { mapState } from 'vuex';

export const StatsMixin = {
  computed: {
    ...mapState(['myAnnouncementStats','myPackageStats']),

    circleStats() {
      let stats = this.myAnnouncementStats;
      return [
        { label: 'announcements', value: stats.announce_count, from: false, color: this.isDarkMode ? '#FFFFFF' : '#081A3E' },
        { label: 'views_count', value: stats.announce_view_count, from: false, color: '#29A53E' },
        { label: 'favorites', value: stats.total_favorites, from: false, color: '#F81734' },
        { label: 'messages', value: stats.message_count, from: false, color: '#246EB2' }
      ]
    },
    packageStats() {
      let stats = this.myPackageStats.list;
      let statsStyle = {
        1: { color: '#F81734', icon: 'vip' },
        2: { color: '#29A53E', icon: 'premium' },
        4: { color: this.isDarkMode ? '#FFFFFF' : '#081A3E', icon: 'top' }
      }
      return Object.keys(stats)
        .map(key => ({...statsStyle[key], ...stats[key]}));
    },
    announceStats() {
      let stats = this.myAnnouncementStats;
      return {
        package: this.myPackageStats.package,
        possible: stats.possible_announce_count,
        used: stats.used_announce_count,
        left: stats.possible_announce_count < stats.used_announce_count 
          ? 0 : (stats.possible_announce_count - stats.used_announce_count),
        calls: stats.call_count,
        contract: {
          price: stats.package_price,
          left_days: stats.agreement_left_days,
          end_date: stats.agreement_end_date
        }
      }
    },
    mostViewed() {
      return Object.values(this.myAnnouncementStats.most_viewed_announces);
    }
  }
}