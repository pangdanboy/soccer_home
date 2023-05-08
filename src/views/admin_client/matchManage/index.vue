<template>
  <div id="match_manage">
  </div>
</template>

<script>
import { matchExport } from '@/utils/excel'
export default {
  name: 'matchMange',
  data: () => ({
    matchList: []
  }),
  methods: {
    exportMatch () {
      matchExport('比赛列表', this.matchList)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
