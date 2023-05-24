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
                  @click="openEditAreaDialog(item)"
                  style="cursor: pointer; margin-right: 10px;"
                  v-bind="attrs" v-on="on"
                >mdi-square-edit-outline</v-icon>
              </template>
              <span>编辑比赛</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  @click="openChangeStatusDialog(item)"
                  style="cursor: pointer;"
                  v-bind="attrs" v-on="on"
                >{{ item.areaStatus === '可用' ? 'mdi-lock-open-variant-outline' : 'mdi-lock-open-outline' }}</v-icon>
              </template>
              <span>修改场地状态</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </template>
    </detail>
    <!-- 删除场地二次确认弹框 -->
    <common-dialog :dialog-config="deleteDialogConfig" @close="closeDeleteDialog" @delete="deleteArea"></common-dialog>
    <!-- 修改场地状态二次确认弹框 -->
    <common-dialog :dialog-config="changeStatusDialogConfig" @close="closeChangeStatusDialog" @change="changeAreaStatus"></common-dialog>
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
          <v-btn @click="addArea" v-show="addAreaDialogConfig.type ==='add'">添加</v-btn>
          <v-btn @click="editArea" v-show="addAreaDialogConfig.type ==='edit'">修改</v-btn>
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
import { addArea, queryArea, changeStatus, deleteArea, editArea } from '@/http/area'
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
      icon: 'mdi-soccer-field',
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
    // 添加(修改)比赛场地弹框
    addAreaDialogConfig: {
      status: false,
      title: '添加场地',
      subTitle: '场地多多，比赛多多',
      type: 'add',
      // 待编辑场地id
      editAreaId: '',
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
    },
    // 修改比赛状态二次确认弹框配置
    changeStatusDialogConfig: {
      // 弹框打开与否
      status: false,
      // 弹框标题
      title: '修改场地状态',
      // 弹框内容
      content: '',
      // 弹框确认触发事件
      event: 'change',
      // 需要修改成为的状态
      changeStatus: '',
      // 待修改状态的场地id
      changeAreaId: ''
    }
  }),
  mounted () {
    this.getAreaList()
  },
  methods: {
    ...mapMutations(['OPEN_MESSAGE']),
    initFormData () {
      this.addAreaDialogConfig.data.areaName.value = ''
      this.addAreaDialogConfig.data.areaPosition.value = ''
      this.addAreaDialogConfig.data.areaStatus.value = ''
      this.addAreaDialogConfig.data.areaCover.value = null
    },
    // 获取场地列表
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
    // 处理场地列表数据
    handlerAreaData () {
      this.areaList.forEach(item => {
        item.areaStatus = item.areaStatus === '1' ? '可用' : '不可用'
      })
    },
    // 打开添加场地弹框
    openAddAreaDialog () {
      this.addAreaDialogConfig.status = true
      if (this.addAreaDialogConfig.data.areaName.value) {
        this.addAreaDialogConfig.type = 'edit'
        this.addAreaDialogConfig.title = '编辑场地'
      } else {
        this.addAreaDialogConfig.type = 'add'
        this.addAreaDialogConfig.title = '添加场地'
      }
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
          this.initFormData()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 编辑比赛
    editArea () {
      if (!this.$refs.areaForm.validate()) return
      const params = {
        areaId: this.addAreaDialogConfig.editAreaId,
        areaName: this.addAreaDialogConfig.data.areaName.value,
        areaPosition: this.addAreaDialogConfig.data.areaPosition.value,
        areaStatus: this.addAreaDialogConfig.data.areaStatus.value === '可用' ? '1' : '0',
        areaCover: this.addAreaDialogConfig.data.areaCover.uploadUrl
      }
      editArea(params).then(res => {
        this.OPEN_MESSAGE({
          content: res.message,
          type: res.success ? 'success' : 'error',
          timeout: 3000
        })
        if (res.success) {
          this.addAreaDialogConfig.status = false
          this.getAreaList(1)
          this.initFormData()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 打开比赛编辑弹框
    openEditAreaDialog (area) {
      // 填充场地信息
      this.addAreaDialogConfig.data.areaName.value = area.areaName
      this.addAreaDialogConfig.data.areaPosition.value = area.areaPosition
      this.addAreaDialogConfig.data.areaStatus.value = area.areaStatus
      this.addAreaDialogConfig.data.areaCover.uploadUrl = area.areaCover
      this.addAreaDialogConfig.editAreaId = area._id
      // 打开弹框
      this.openAddAreaDialog()
    },
    // 删除比赛
    deleteArea () {
      deleteArea({
        areaId: this.deleteDialogConfig.deleteAreaId
      }).then(res => {
        this.OPEN_MESSAGE({
          content: res.message,
          type: res.success ? 'success' : 'error',
          timeout: 3000
        })
        if (res.success) {
          this.getAreaList()
          this.deleteDialogConfig.status = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 修改比赛状态
    changeAreaStatus () {
      changeStatus({
        areaId: this.changeStatusDialogConfig.changeAreaId,
        areaStatus: this.changeStatusDialogConfig.changeStatus
      }).then(res => {
        this.OPEN_MESSAGE({
          content: res.message,
          type: res.success ? 'success' : 'error',
          timeout: 3000
        })
        if (res.success) {
          this.getAreaList()
          this.changeStatusDialogConfig.status = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 打开删除场地弹框
    openDeleteDialog (area) {
      this.deleteDialogConfig.status = true
      this.deleteDialogConfig.deleteAreaId = area._id
    },
    // 关闭删除场地弹框
    closeDeleteDialog () {
      this.deleteDialogConfig.status = false
    },
    // 打开修改场地状态弹框
    openChangeStatusDialog (area) {
      this.changeStatusDialogConfig.status = true
      // 修改弹框配置
      this.changeStatusDialogConfig.changeAreaId = area._id
      this.changeStatusDialogConfig.content = `当前场地状态为${area.areaStatus}，你确定要修改场地状态为${area.areaStatus === '可用' ? '不可用' : '可用'}吗？`
      this.changeStatusDialogConfig.changeStatus = area.areaStatus === '可用' ? '0' : '1'
    },
    // 关闭修改场地状态弹框
    closeChangeStatusDialog () {
      this.changeStatusDialogConfig.status = false
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

<style scoped lang="scss">
  #area_manage{
    width: 100%;
    height: 100%;
    .area-manage{
      width: 100%;
      height: 100%;
      ::v-deep .v-card{
        width: 100%;
        height: 100%;
        .v-card__title{
          width: 100%;
          height: 10%;
        }
        .v-card__subtitle{
          width: 100%;
          height: 5%;
        }
        .v-card__text{
          width: 100%;
          height: 80%;
          overflow: auto;
        }
        .v-card__actions{
          width: 100%;
          height: 5%;
        }
      }
    }
  }
</style>
