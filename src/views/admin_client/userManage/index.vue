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
                  @click="changeUserAuth(item)"
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
  </div>
</template>

<script>
import detail from '@/components/detail'
import filterHeader from '@/components/filterHeader.vue'
import commonDialog from '@/components/commonDialog'
import { USER_LEVEL_PARAMS_MAP, USER_PERMISSIONS_TEXT, USER_LEVEL } from '@/constant'
import { queryUser } from '@/http/user'

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
    }
  }),
  mounted () {
    this.getUserList()
  },
  methods: {
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
    changeUserAuth () {
    },
    resetUserPassword () {
      this.closeResetPasswordDialog()
    }
  }
}
</script>

<style scoped lang="scss">

</style>
