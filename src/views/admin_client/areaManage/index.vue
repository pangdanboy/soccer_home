<template>
  <div id="area_manage">
    <detail :detail-config="detailConfig">
      <template #content>
        <filter-header :filter-config="filterConfig" @getDataList="getAreaList" @addArea="openAddAreaDialog"></filter-header>
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
    <v-dialog v-model="addAreaDialogConfig.status" width="60%">
      <v-card>
        <v-card-title>{{ addAreaDialogConfig.title }}</v-card-title>
        <v-card-subtitle>{{ addAreaDialogConfig.subTitle }}</v-card-subtitle>
        <v-card-text>
          <v-form ref="areaForm">
            <div class="area-name">
              <v-text-field
                v-model="addAreaDialogConfig.data.areaName.value"
                :rules="addAreaDialogConfig.formRules.areaNameRules"
                :label="addAreaDialogConfig.data.areaName.label"
                :counter="16"
                outlined dense
                required
                clearable
                prepend-icon="mdi-application-edit-outline"
              ></v-text-field>
            </div>
            <div class="area-position">
              <v-text-field
                v-model="addAreaDialogConfig.data.areaPosition.value"
                :rules="addAreaDialogConfig.formRules.areaPositionRules"
                :label="addAreaDialogConfig.data.areaPosition.label"
                :counter="64"
                outlined dense
                required
                clearable
                prepend-icon="mdi-application-edit-outline"
              ></v-text-field>
            </div>
            <div class="area-status">
              <v-select
                v-model="addAreaDialogConfig.data.areaStatus.value"
                :rules="addAreaDialogConfig.formRules.areaStatusRules"
                :items="addAreaDialogConfig.data.areaStatus.options"
                :label="addAreaDialogConfig.data.areaStatus.label"
                outlined dense
                clearable
                prepend-icon="mdi-format-list-bulleted-type"
              ></v-select>
            </div>
            <div class="area-cover">
              <v-file-input
                v-model="addAreaDialogConfig.data.areaCover.value"
                :label="addAreaDialogConfig.data.areaCover.label"
                :rules="addAreaDialogConfig.formRules.areaCoverRules"
                @change="upload"
                accept=".jpg,.png,.jpeg"
                outlined
                chips
                dense
                show-size
              ></v-file-input>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions style="padding-top: 0; display: flex; align-items: center; justify-content: flex-end">
          <v-btn @click="addArea">添加</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import detail from '@/components/detail'
import filterHeader from '@/components/filterHeader'
// import { CLASS_TIME_PARAMS_MAP, MATCH_TYPE, MATCH_TYPE_PARAMS, MATCH_TYPE_PARAMS_MAP } from '@/constant'
import commonDialog from '@/components/commonDialog'
import { uploadAreaCover } from '@/http/upload'
import { addArea, queryArea } from '@/http/area'
import { mapMutations } from 'vuex'
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
      { text: '场地状态', value: 'areaStatus' },
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
      subTitle: '场地多多，比赛多多',
      type: 'add',
      // 场地信息
      data: {
        areaName: {
          value: '',
          label: '场地名称'
        },
        areaPosition: {
          value: '',
          label: '场地位置'
        },
        areaStatus: {
          value: '',
          label: '场地状态',
          options: ['可用', '不可用']
        },
        areaCover: {
          value: null,
          uploadUrl: '',
          label: '场地图像'
        }
      },
      // 表单规则
      formRules: {
        areaNameRules: [
          v => !!v || '场地名称不能为空！',
          v => v.length <= 16 || '长度不能超过16！'
        ],
        areaPositionRules: [
          v => !!v || '场地位置不能为空！',
          v => v.length <= 64 || '长度不能超过64！'
        ],
        areaCoverRules: [
          v => !v || v.size < 2000000 || '图片大小不能超过2M'
        ],
        areaStatusRules: [
          v => !!v || '场地状态不能为空！'
        ]
      }
    }
  }),
  mounted () {
    this.getAreaList()
  },
  methods: {
    ...mapMutations(['OPEN_MESSAGE']),
    getAreaList (page) {
      const query = {}
      if (page) {
        query.page = this.areaListOptions.page
      } else {
        query.page = this.areaListOptions.page
      }
      query.limit = this.areaListOptions.itemsPerPage
      this.filterConfig.filterList.forEach((item) => {
        if (item.type !== 'button') query[item.key] = item.value
      })
      queryArea(query).then(res => {
        console.log(res)
        if (res.success) {
          this.areaList = res.data
          this.areaTotalCount = res.count
          this.handlerAreaData()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handlerAreaData () {
      this.areaList.forEach(item => {
        item.areaStatus = item.areaStatus === '1' ? '可用' : '不可用'
      })
    },
    openAddAreaDialog () {
      this.addAreaDialogConfig.status = true
    },
    // 图片上传
    upload () {
      if (!this.$refs.areaForm.validate()) return
      const formData = new FormData()
      formData.append('file', this.addAreaDialogConfig.data.areaCover.value)
      uploadAreaCover(formData).then(res => {
        console.log(res.data)
        // 图片上传成功，保存图片地址
        this.addAreaDialogConfig.data.areaCover.uploadUrl = res.data.imgUrl
      }).catch(err => {
        console.log(err)
      })
    },
    // 添加比赛场地
    addArea () {
      if (!this.$refs.areaForm.validate()) return
      const params = {
        areaName: this.addAreaDialogConfig.data.areaName.value,
        areaPosition: this.addAreaDialogConfig.data.areaPosition.value,
        areaStatus: this.addAreaDialogConfig.data.areaStatus.value === '可用' ? '1' : '0',
        areaCover: this.addAreaDialogConfig.data.areaCover.uploadUrl
      }
      addArea(params).then(res => {
        this.OPEN_MESSAGE({
          content: res.message,
          type: res.success ? 'success' : 'error',
          timeout: 3000
        })
        if (res.success) {
          this.addAreaDialogConfig.status = false
          this.getAreaList(1)
        }
      }).catch(err => {
        console.log(err)
      })
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
  },
  watch: {
    areaListOptions: {
      handler () {
        this.getAreaList()
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
