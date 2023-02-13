<template>
    <div class="additionalInformation">
        <slot name="before"/>

        <template v-if="comment">
            <h2 class="additionalInformation__title">{{ $t('seller_comment') }}</h2>

            <div class="comment">
                <p>{{ comment.trim() }}</p>
            </div>
        </template>

        <slot name="after"/>
    </div>
</template>

<script>
    export default {
        props: {
            comment: String
        }
    }
</script>

<style lang="scss" scoped>
    .additionalInformation {
        padding: 32px;
        background-color: #FFFFFF;
        border: 1px solid #E3E8EF;
        border-radius: 12px;
        &__title {
            font-weight: 600;
            font-size: 24px;
            line-height: 28px;
            color: #202939;
            margin-bottom: 16px;
        }
    }
</style>
