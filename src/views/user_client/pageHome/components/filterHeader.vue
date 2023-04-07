<template>
  <div id="filter">
    <div class="list-filter">
      <template v-for="item in filterConfig.filterList">
        <div :key="item.key" class="filter-search" v-if="item.type === 'text'">
          <v-text-field :label="item.label" outlined dense prepend-icon="mdi-magnify"></v-text-field>
        </div>
        <div :key="item.key" class="filter-date" v-if="item.type === 'dateRange'">
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="item.value"
                :label="item.label"
                outlined
                dense
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="item.value" no-title scrollable range>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">
                确定
              </v-btn>
            </v-date-picker>
          </v-menu>
        </div>
        <div :key="item.key" class="filter-type" v-if="item.type === 'select'">
          <v-select v-model="item.value" :items="item.selectItem" :label="item.label" outlined dense prepend-icon="mdi-format-list-bulleted-type"></v-select>
        </div>
        <div :key="item.key" class="filter-operation" v-if="item.type === 'button'">
          <v-btn v-for="(operation, index) in item.operationList" :key="index" @click="handleClick(operation.event)" class="primary">{{ operation.text }}</v-btn>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
/**
 * 数据过滤与操作组件
 * 支持比赛时间、比赛类型、搜索输入筛选，支持导入导出操作
 */
export default {
  name: 'filterHeader',
  props: {
    // 过滤类型，全部or周
    filterConfig: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    }
  },
  data: () => ({
    menu: false
  }),
  methods: {
    handleClick (eventName) {
      console.log(eventName)
      this.$emit(eventName)
    }
  }
}
</script>

<style scoped lang="scss">
  #filter{
    width: 100%;
    .list-filter{
      width: 100%;
      padding: 10px;
      div{
        float: left;
        margin-right: 15px;
      }
      .filter-operation{
        float: right;
        .v-btn{
          margin-right: 20px;
        }
      }
    }
  }
</style>
