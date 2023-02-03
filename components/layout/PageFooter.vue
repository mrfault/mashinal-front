<template>
    <footer :class="['page-footer d-none d-lg-block', { 'mt--2': isPromotionsPage }]">
        <div class="container">
            <div class="row">
                <div class="col-4">
                    <div class="position-relative d-flex align-items-center">
                        <nuxt-link
                            class="logo"
                            :to="$localePath('/')"
                            @click.native="$nuxt.$emit('logo-click')"
                        >
                            <img
                                :src="$env.NEW_YEAR_SOON ? '/img/logo-white-newyear.svg' : '/img/logo_new.svg'"
                                alt="logo"
                                :style="$env.NEW_YEAR_SOON ? 'height: 50px;': ''"
                                v-if="!btlCookie"
                            />
                        </nuxt-link>

                        <div class="call-center">
                            <img src="/icons/subtract.svg"/>
                            <span>*8787</span>
                        </div>
                    </div>

<!--                    <p>{{ $t('learn_about_emerging_product_text') }}</p>-->

<!--                    <newsletter/>-->

                    <share-it type="contact"/>
                </div>

                <div class="col-3">
<!--                    <h4>{{ $t('site_map') }}</h4>-->
                    <ul class="menu">
                        <li v-for="menu in navbarMenusFooter[0]" :key="menu.title">
                            <nuxt-link :to="$localePath(menu.route)">
                                {{ $t(menu.title) }}
                            </nuxt-link>
                        </li>
                    </ul>
                </div>

                <div class="col-3">
<!--                    <h4>{{ $t('site_map') }}</h4>-->
                    <ul class="menu">
                        <li v-for="menu in navbarMenusFooter[1]" :key="menu.title">
                            <nuxt-link :to="$localePath(menu.route)">
                                {{ $t(menu.title) }}

                                <IconNovelties v-if="menu.icon === 'external-tab'" />
                            </nuxt-link>

                        </li>
                    </ul>
                </div>

                <div class="col-2">
<!--                    <h4>{{ $t('useful_links') }}</h4>-->
                    <ul class="menu">
                        <li v-for="menu in pageMenus.reverse()" :key="menu.url">
                            <nuxt-link :to="$localePath(menu.route)">
                                {{ menu.title[locale] || $t(menu.title) }}
                            </nuxt-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="page-footer__divider"></div>

        <mark>
            &copy; {{ currentYear }} Mashin.AL Developed by
            <a href="//al.ventures" target="_blank" rel="noopener">
                AlVentures
            </a>
        </mark>
    </footer>
</template>

<script>
import {MenusDataMixin} from '~/mixins/menus-data'

import Newsletter from '~/components/elements/Newsletter'
import IconNovelties from "~/components/elements/IconNovelties.vue";

export default {
    components: {
        Newsletter,
        IconNovelties
    },
    data() {
        return {}
    },
    mixins: [MenusDataMixin],
    watch: {
        $route(to, from) {
            if (this.$route.meta.name == 'promotions-page') {
                this.isPromotionsPage = true
            }
        },
    },
    computed: {
        isPromotionsPage() {
            if (this.$route.meta.name == 'promotions-page') {
                return true
            } else {
                return false
            }

        }
    }
}
</script>
