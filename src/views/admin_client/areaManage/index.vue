<template>
  <div id="area_manage">
    <detail :detail-config="detailConfig">
      <template #content>
        <filter-header :filter-config="filterConfig" @getDataList="getAreaList" @addArea="addArea"></filter-header>
        <v-data-table
          :headers="areaListHeaders"
          :items="areaList"
          :options.sync="areaListOptions"
          :server-items-length="areaTotalCount"
          :footer-props="{'items-per-page-options':[5, 10]}"
          class="elevation-1"
          disable-sort
          style="box-shadow: none !important;"
        >
          <template v-slot:item.operate="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  @click="checkAreaDetail(item)"
                  style="cursor: pointer; margin-right: 10px;"
                  v-bind="attrs" v-on="on"
                >mdi-text-search-variant</v-icon>
              </template>
              <span>查看详情</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  @click="openDeleteDialog(item)"
                  style="cursor: pointer; margin-right: 10px;"
                  v-bind="attrs" v-on="on"
                >mdi-trash-can-outline</v-icon>
              </template>
              <span>删除比赛</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  @click="editArea(item)"
                  style="cursor: pointer;"
                  v-bind="attrs" v-on="on"
                >mdi-square-edit-outline</v-icon>
              </template>
              <span>编辑比赛</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </template>
    </detail>
    <!-- 删除场地二次确认弹框 -->
    <common-dialog :dialog-config="deleteDialogConfig" @close="closeDeleteDialog" @delete="deleteArea"></common-dialog>
    <!-- 添加场地弹框 -->
    <v-dialog v-model="addAreaDialogConfig.status">
      <v-card>
        <v-card-title>{{ addAreaDialogConfig.title }}</v-card-title>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import detail from '@/components/detail'
import filterHeader from '@/components/filterHeader'
// import { CLASS_TIME_PARAMS_MAP, MATCH_TYPE, MATCH_TYPE_PARAMS, MATCH_TYPE_PARAMS_MAP } from '@/constant'
import commonDialog from '@/components/commonDialog'
// import { mapMutations } from 'vuex'
export default {
  name: 'areaManage',
  components: {
    detail,
    commonDialog,
    filterHeader
  },
  data: () => ({
    // 比赛列表数据
    areaList: [],
    // 比赛总数
    areaTotalCount: 0,
    // 比赛数据表格的头
    areaListHeaders: [
      { text: '场地名称', value: 'areaName' },
      { text: '场地位置', value: 'areaPosition' },
      { text: '场地状态', value: 'areaMatch' },
      { text: '操作', value: 'operate' }
    ],
    // 比赛表格配置信息
    areaListOptions: {},
    detailConfig: {
      className: 'area-manage',
      icon: 'mdi-soccer',
      title: '场地管理',
      subTitle: '系统场地列表中心，可对所有场地进行管理统计'
    },
    // 过滤组件配置，默认显示全部比赛列表
    filterConfig: {
      // 是否查看所有场地列表
      all: true,
      size: 'normal',
      // 过滤条件
      filterList: [
        {
          type: 'text',
          label: '搜索场地',
          key: 'areaSearch',
          value: ''
        },
        {
          type: 'button',
          label: '操作',
          key: 'matchOperation',
          operationList: [
            {
              text: '添加',
              event: 'addArea',
              icon: 'mdi-plus-circle-outline'
            }
          ]
        }
      ]
    },
    // 删除比赛二次确认弹框配置
    deleteDialogConfig: {
      // 弹框打开与否
      status: false,
      // 弹框标题
      title: '删除场地',
      // 弹框内容
      content: '你确定删除该场地吗？比场地删除后不可恢复，请再次确认你的操作！',
      // 弹框确认触发事件
      event: 'delete',
      // 待删除的场地id
      deleteAreaId: ''
    },
    // 添加比赛场地弹框
    addAreaDialogConfig: {
      status: false,
      title: '添加场地',
      type: 'add',
      // 场地信息
      data: {
        areaName: '',
        areaPosition: '',
        areaStatus: '',
        areaCover: ''
      },
      // 表单规则
      formRules: []
    }
  }),
  methods: {
    getAreaList () {},
    addArea () {
      this.addAreaDialogConfig.status = true
    },
    checkAreaDetail () {},
    editArea () {},
    deleteArea () {},
    openDeleteDialog (area) {
      this.deleteDialogConfig.status = true
      this.deleteDialogConfig.deleteAreaId = area._id
    },
    closeDeleteDialog () {
      this.deleteDialogConfig.status = false
    }
  }
}
</script>

<style scoped>

</style>
