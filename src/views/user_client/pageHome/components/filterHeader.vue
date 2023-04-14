<template>
  <div id="filter">
    <v-container class="list-filter">
      <v-row>
        <template v-for="item in filterConfig.filterList">
          <v-col :key="item.key" class="filter-search" v-if="item.type === 'text'" cols="3">
            <v-text-field
              :label="item.label"
              outlined
              dense
              prepend-icon="mdi-magnify"
              v-model="item.value"
              clearable
              @keydown.enter="() => $emit('getDataList')"
            ></v-text-field>
          </v-col>
          <v-col :key="item.key" class="filter-date" v-if="item.type === 'dateRange'" cols="3">
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
                <v-btn text color="primary" @click="queryDataList">
                  确定
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col :key="item.key" class="filter-type" v-if="item.type === 'select'" cols="3">
            <v-select
              v-model="item.value"
              :items="item.selectItem"
              :label="item.label"
              outlined dense
              prepend-icon="mdi-format-list-bulleted-type"
              clearable @change="() => $emit('getDataList')"
            ></v-select>
          </v-col>
          <v-col :key="item.key" class="filter-operation" v-if="item.type === 'button'" :cols="filterConfig.all ? 2:8">
            <v-btn
              v-for="(operation, index) in item.operationList"
              :key="index" @click="handleClick(operation.event, operation.type)"
              class="primary"
            >{{ operation.text }}</v-btn>
          </v-col>
        </template>
      </v-row>
    </v-container>
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
    handleClick (eventName, type) {
      console.log(eventName)
      this.$emit(eventName, type)
    },
    queryDataList () {
      this.menu = false
      this.$emit('getDataList')
    }
  }
}
</script>

<style scoped lang="scss">
  #filter{
    width: 100%;
    .list-filter{
      width: 100%;
      margin: 0;
      .filter-operation{
        .v-btn{
          margin-right: 20px;
        }
      }
      .col{
        padding: 10px 5px 0px 5px;
      }
    }
  }
</style>
