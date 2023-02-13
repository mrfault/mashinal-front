<template>
    <div class="collapse-content">
<!--        @click="collapsed = !collapsed"-->
        <component
            :is="(titleWithLine || titleWithHr) ? 'h2' : 'h3'"
            :class="{'title-with-line': titleWithLine}"
        >
            <span>{{ title }}</span>
<!--            <icon :name="`chevron-${collapsed ? 'down' : 'up'}`" class="cursor-pointer"/>-->
        </component>

        <component :is="animate ? 'transition-expand' : 'div'">
            <div v-if="!collapsed">
                <hr v-if="titleWithHr"/>
                <slot/>
            </div>
        </component>
    </div>
</template>

<script>
export default {
    props: {
        title: String,
        firstCollapsed: Boolean,
        titleWithLine: Boolean,
        titleWithHr: Boolean,
        animate: Boolean
    },
    data() {
        return {
            collapsed: this.firstCollapsed
        }
    },
    beforeDestroy() {
        this.collapsed = false;
    }
}
</script>