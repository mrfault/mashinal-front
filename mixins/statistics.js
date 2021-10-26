import { mapState } from 'vuex';

export const StatsMixin = {
  computed: {
    ...mapState(['myAnnouncementStats']),

    countStats() {
      let stats = this.myAnnouncementStats;
      return [
        { label: 'announcements', value: stats.announce_count, from: false, color: this.isDarkMode ? '#FFFFFF' : '#081A3E' },
        { label: 'views_count', value: stats.announce_view_count, from: false, color: '#29A53E' },
        { label: 'favorites', value: stats.total_favorites, from: false, color: '#F81734' },
        { label: 'messages', value: stats.message_count, from: false, color: '#246EB2' }
      ]
    },
    announcementStats() {
      let stats = this.myAnnouncementStats;
      return {
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
      let stats = this.myAnnouncementStats;
      return Object.values(stats.most_viewed_announces);
    }
  }
}