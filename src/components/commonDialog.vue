<template>
  <div id="common_dialog" v-show="dialogConfig.status">
    <v-dialog v-model="dialog" width="500px">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{ dialogConfig.title }}
        </v-card-title>

        <v-card-text>
          {{ dialogConfig.content }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="() => this.$emit('close')"
          >
            取消
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="() => this.$emit(dialogConfig.event)"
          >
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
/**
 * 全局二次确认弹框
 */

export default {
  name: 'commonDialog',
  props: {
    dialogConfig: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    dialog: false
  }),
  computed: {
  },
  methods: {
  },
  watch: {
    dialogConfig: {
      handler () {
        if (this.dialogConfig.status) {
          this.dialog = true
        } else {
          this.dialog = false
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
  #common_dialog{
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>
