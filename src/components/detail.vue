<template>
  <div :class="detailConfig.className">
    <v-card style="background-color: transparent; height: 100%">
      <v-card-title>
        <v-icon>{{ detailConfig.icon }}</v-icon>
        {{ detailConfig.title }}
      </v-card-title>
      <v-card-subtitle style="border-bottom: 1px solid #cccccc">{{ detailConfig.subTitle }}</v-card-subtitle>
      <v-card-text style="padding-bottom: 0;">
        <slot name="content"></slot>
      </v-card-text>
      <v-card-actions style="padding-top: 0; display: flex; align-items: center; justify-content: flex-end">
        <slot name="operate"></slot>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'detail',
  props: {
    detailConfig: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped lang="scss">
</style>
