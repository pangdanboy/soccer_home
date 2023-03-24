<template>
  <div id="message">
    <v-snackbar v-model="MESSAGE_STATUS" :timeout="MESSAGE_TIMEOUT" :color="messageType[MESSAGE_TYPE]" rounded top>
      {{ MESSAGE_CONTENT }}
      <template v-slot:action="{ attrs }">
        <v-icon v-bind="attrs" @click="CLOSE_MESSAGE">mdi-close-circle</v-icon>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'message',
  data: () => ({
    messageType: {
      success: '#259745',
      warning: '#fbc320',
      error: '#e84134'
    }
  }),
  computed: {
    ...mapGetters(['MESSAGE_CONTENT', 'MESSAGE_TYPE', 'MESSAGE_TIMEOUT', 'MESSAGE_STATUS'])
  },
  methods: {
    ...mapMutations(['CLOSE_MESSAGE'])
  }
}
</script>

<style scoped>

</style>
