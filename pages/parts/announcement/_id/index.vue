<template>
  <div class="pages-parts-id">
    <div class="container">
      <div class="announcements-inner">
        <!-- Breadcrumb -->
        <breadcrumbs :crumbs="crumbs">
          <share-it type="publish" />
          <span class="text-data">
            <icon name="eye" />
            {{ announcement.view_count }}
            <icon name="cursor" />
            {{ announcement.open_count }}
          </span>
          <span class="text-data">
            <icon name="calendar" />
            {{ announcement.humanize_created_at }}
          </span>
        </breadcrumbs>

        <div class="row flex-column flex-lg-row">
          <div class="col-auto">
            <gallery>
              <quick-info type="parts" brief />
              <announcement-specs type="parts" brief />
            </gallery>
            <comment :comment="announcement.comment" v-if="!isMobileBreakpoint">
              <template #before>
                <thumbs-gallery />
              </template>

              <template #after>
                <collapse-content
                  v-if="announcement.description"
                  :title="$t('seller_comment')"
                  :first-collapsed="false"
                >
                  <p>{{ announcement.description }}</p>
                </collapse-content>
              </template>
            </comment>
          </div>
          <div class="col-auto">
            <quick-info type="parts" />
            <announcement-specs type="parts" />
            <keywords />
          </div>
        </div>

        <grid
          :title="$t('relative_announcements')"
          :announcements="otherAnnouncements"
          :pending="pending"
          escape-duplicates
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import Gallery from '~/components/announcements/inner/Gallery';
import Comment from '~/components/announcements/inner/Comment';
import QuickInfo from '~/components/announcements/inner/QuickInfo';
import AnnouncementSpecs from '~/components/announcements/inner/AnnouncementSpecs';
import ThumbsGallery from '~/components/announcements/inner/ThumbsGallery';
import CollapseContent from '~/components/elements/CollapseContent';
import Keywords from '~/components/announcements/inner/Keywords';
import Grid from '~/components/announcements/Grid.vue';

export default {
  name: 'pages-parts-id',
  components: {
    Gallery,
    Comment,
    QuickInfo,
    AnnouncementSpecs,
    ThumbsGallery,
    CollapseContent,
    Keywords,
    Grid
  },
  nuxtI18n: {
    paths: {
      az: '/ehtiyat-hisseleri/elan/:id'
    }
  },
  head() {
    let announcementTitle = this.getAnnouncementTitle(this.announcement);
    let title = `${this.$t(`meta-title_announcement-${this.announcement.is_new ? 'new' : 'used'}`, { announce: `${announcementTitle}` })}`;
    let description = `${announcementTitle}, ${this.$t('meta-descr_announcement', { announce: `${this.announcement.price}` })}`;
    let image = this.getAnnouncementImage(this.announcement);
    return this.$headMeta({ title, description, image });
  },
  async asyncData({ store, route }) {
    await Promise.all([
      store.dispatch('getAnnouncementInner', route.params.id),
      store.dispatch('getComplaintOptions'),
      store.dispatch('getOptions'),
      store.dispatch('getAllOtherOptions'),
    ]);

    return {
      pending: false
    }
  },
  mounted() {
    this.getOtherAnnouncements()
    window.addEventListener('scroll', this.getNextAnnouncements)
  },
  methods: {
    async getNextAnnouncements() {
      if ((window.scrollY + 800 > document.body.scrollHeight) && !this.pending) {
        this.pending = true;
        const { current_page, last_page } = this.otherAnnouncementsPagination
        if (current_page ? current_page < last_page : true) {
          await this.getOtherAnnouncements()
        }
        this.pending = false;
      }
    },
    async getOtherAnnouncements() {
      const { current_page, last_page } = this.otherAnnouncementsPagination
      await this.$store.dispatch('parts/getOtherAnnouncements', {
        body: {
          category_id: this.announcement.category.id,
          sub_category_id: this.announcement.sub_category?.id
        },
        params: {
          page: (current_page || 0) + 1
        }
      })
    }
  },
  computed: {
    ...mapGetters({
      'announcement': 'announcement',
      'otherAnnouncements': 'parts/otherAnnouncements',
      'otherAnnouncementsPagination': 'parts/otherAnnouncementsPagination'
    }),
    crumbs() {
      const items = [
        {
          name: this.$t('all_parts'),
          route: '/parts'
        },{
          name: this.announcement.category.name[this.locale],
          route: `/parts/${this.announcement.category.slug[this.locale]}`
        },{
          name: this.announcement.sub_category?.name[this.locale],
          route: `/parts/${this.announcement.category.slug[this.locale]}?parts_filter={"subcategory":${this.announcement.sub_category?.id}}`
        },{
          name: this.announcement.brand?.name,
          route: `/parts/${this.announcement.category.slug[this.locale]}?parts_filter={"brand_ids":[${this.announcement.brand?.id}]}`
        },
        {
          name: '#' + this.announcement.id_unique
        }
      ]

      return items.filter(item => item.name)
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.getNextAnnouncements)
  }
}
</script>