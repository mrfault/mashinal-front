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
            <icon name="star" />
            {{ announcement.favorites_count }}
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
              <site-banner v-if="!isMobileBreakpoint" class="mb-3" type="in-announcement" />
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
                  <p v-html="$nl2br(announcement.description)"></p>
                </collapse-content>
              </template>
            </comment>
          </div>
          <div class="col-auto">
            <quick-info type="parts" />
            <site-banner v-if="!isMobileBreakpoint" class="mb-3" type="in-announcement" />
            <announcement-specs type="parts" />
            <keywords
              class="card mb-lg-3"
              :title="$t('keywords')"
              :keywords="announcement.tags"
              label="name"
              clickable
              @click="keywordOnClick"
            />
          </div>
        </div>

        <relatives />

         <HandleIds :single="true" :type="'parts'" :items="[announcement.id]" />
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
import Relatives from '~/components/announcements/inner/Relatives';
import SiteBanner from "~/components/banners/SiteBanner";
import HandleIds from "~/components/announcements/HandleIds.vue";

export default {
  name: 'pages-parts-id',
  components: {
    SiteBanner,
    Gallery,
    Comment,
    QuickInfo,
    AnnouncementSpecs,
    ThumbsGallery,
    CollapseContent,
    Keywords,
    Relatives,
     HandleIds
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
      store.dispatch('getAllOtherOptions')
    ]);
  },
  methods: {
    keywordOnClick(keyword) {
      this.$router.push(`${this.$localePath('/parts')}?parts_filter=${JSON.stringify({text: keyword.name})}`)
    }
  },
  computed: {
    ...mapGetters(['announcement']),
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
}
</script>
