<template>
  <div id="user_manage">
    <detail :detail-config="detailConfig">
      <template #content>
        <filter-header :filter-config="filterConfig" @getDataList="getUserList"></filter-header>
        <v-data-table
          :headers="userListHeaders"
          :items="userList"
          :options.sync="userListOptions"
          :server-items-length="userTotalCount"
          :footer-props="{'items-per-page-options':[5, 10]}"
          class="elevation-1"
          disable-sort
          style="box-shadow: none !important;"
        >
          <template v-slot:item.operate="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-show="item._id !== $store.state.UserInfo.id"
                  @click="openEditUserPermissionsDialog(item)"
                  style="cursor: pointer; margin-right: 10px;"
                  v-bind="attrs" v-on="on"
                >mdi-shield-edit-outline</v-icon>
              </template>
              <span>修改用户权限</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  @click="openResetPasswordDialog(item)"
                  style="cursor: pointer; margin-right: 10px;"
                  v-bind="attrs" v-on="on"
                >mdi-lock-reset</v-icon>
              </template>
              <span>重置用户密码</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </template>
    </detail>
    <!--重置用户密码二次确认弹框 -->
    <common-dialog :dialog-config="resetPasswordDialogConfig" @close="closeResetPasswordDialog" @reset="resetUserPassword"></common-dialog>
    <!-- 修改用户权限二次选择确认框 -->
    <v-dialog v-model="editUserPermissionsDialog" width="40%">
      <v-card>
        <v-card-title>修改用户权限</v-card-title>
        <v-card-subtitle>选择将要修改的用户权限角色</v-card-subtitle>
        <v-card-text>
          <v-radio-group v-model="userPermissions" row>
            <v-radio value="0" label="普通用户"></v-radio>
            <v-radio value="1" label="管理员"></v-radio>
            <v-radio value="2" label="超级管理员"></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-card-actions style="padding-top: 0; display: flex; align-items: center; justify-content: flex-end">
          <v-btn @click="() => this.editUserPermissionsDialog = false">取消</v-btn>
          <v-btn @click="changeUserPermissions" color="primary">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import detail from '@/components/detail'
import filterHeader from '@/components/filterHeader.vue'
import commonDialog from '@/components/commonDialog'
import { USER_LEVEL_PARAMS_MAP, USER_PERMISSIONS_TEXT, USER_LEVEL } from '@/constant'
import { queryUser, resetPassword, changeUserAuth } from '@/http/user'
import { mapMutations } from 'vuex'

export default {
  name: 'userManage',
  components: {
    detail,
    filterHeader,
    commonDialog
  },
  data: () => ({
    detailConfig: {
      className: 'user-manage',
      icon: 'mdi-account-group-outline',
      title: '用户管理',
      subTitle: '系统用户列表中心，可对所有用户的信息进行管理'
    },
    // 用户列表数据
    userList: [],
    // 用户总数
    userTotalCount: 0,
    // 用户数据表格的头
    userListHeaders: [
      { text: '用户名', value: 'username' },
      { text: '用户邮箱', value: 'email' },
      { text: '用户级别', value: 'role' },
      { text: '个性签名', value: 'signature' },
      { text: '操作', value: 'operate' }
    ],
    // 用户表格配置信息
    userListOptions: {},
    // 过滤组件配置，默认显示全部比赛列表
    filterConfig: {
      // 是否查看所有比赛列表
      all: true,
      size: 'small',
      // 过滤条件
      filterList: [
        {
          type: 'text',
          label: '搜索用户',
          key: 'matchSearch',
          value: ''
        },
        {
          type: 'select',
          label: '用户级别',
          key: 'userRole',
          value: '',
          selectItem: [USER_PERMISSIONS_TEXT.COMMON_USER, USER_PERMISSIONS_TEXT.ADMIN, USER_PERMISSIONS_TEXT.SUPER_ADMIN]
        }
      ]
    },
    // 重置密码二次确认弹框配置
    resetPasswordDialogConfig: {
      // 弹框打开与否
      status: false,
      // 弹框标题
      title: '重置用户密码',
      // 弹框内容
      content: '你确定重置用户密码为系统默认密码吗？重置后用户密码将变为"123456"，请再次确认你的操作！',
      // 弹框确认触发事件
      event: 'reset',
      // 待重置密码用户的id
      userId: ''
    },
    // 修改用户权限弹框
    editUserPermissionsDialog: false,
    // 将要修改权限的用户id
    editPermissionsUserId: '',
    // 当前修改的用户权限，默认为修改之前的用户权限
    userPermissions: ''
  }),
  mounted () {
    this.getUserList()
  },
  methods: {
    ...mapMutations(['OPEN_MESSAGE']),
    getUserList () {
      const query = {}
      query.page = this.userListOptions.page
      query.limit = this.userListOptions.itemsPerPage
      this.filterConfig.filterList.forEach((item) => {
        if (item.type !== 'button') query[item.key] = item.value
      })
      // 处理比赛类型参数
      query.userRole = USER_LEVEL_PARAMS_MAP[query.userRole]
      queryUser(query).then(res => {
        console.log(res)
        this.userList = res.data
        this.userTotalCount = res.count
        this.handlerMatchData()
      }).catch(err => {
        console.log(err)
      })
    },
    handlerMatchData () {
      this.userList.forEach(item => {
        item.role = USER_LEVEL[item.role]
      })
    },
    openResetPasswordDialog (user) {
      this.resetPasswordDialogConfig.status = true
      this.resetPasswordDialogConfig.userId = user._id
    },
    closeResetPasswordDialog () {
      this.resetPasswordDialogConfig.status = false
    },
    openEditUserPermissionsDialog (user) {
      this.editUserPermissionsDialog = true
      // 存储修改用户权限的用户id和用户当前权限
      this.editPermissionsUserId = user._id
      this.userPermissions = USER_LEVEL_PARAMS_MAP[user.role]
    },
    // 修改用户权限
    changeUserPermissions () {
      changeUserAuth({
        userId: this.editPermissionsUserId,
        role: this.userPermissions
      }).then(res => {
        this.OPEN_MESSAGE({
          content: res.message,
          type: res.success ? 'success' : 'error',
          timeout: 3000
        })
        if (res.success) this.editUserPermissionsDialog = false
      }).catch(err => {
        console.log(err)
      })
    },
    // 重置用户密码
    resetUserPassword () {
      resetPassword().then(res => {
        this.OPEN_MESSAGE({
          content: res.message,
          type: res.success ? 'success' : 'error',
          timeout: 3000
        })
        if (res.success) this.closeResetPasswordDialog()
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped lang="scss">
  #user_manage{
    width: 100%;
    height: 100%;
    .user-manage{
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
