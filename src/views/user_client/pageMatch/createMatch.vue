<template>
  <div id="create-match">
    <detail :detail-config="detailConfig">
      <template #content>
        <v-form ref="matchForm">
          <div class="match-info">
            <div class="match-name">
              <v-text-field
                v-model="editMatchData.matchName"
                :rules="formRules.matchNameRules"
                label="比赛名称"
                :counter="16"
                outlined dense
                required
                clearable
                prepend-icon="mdi-application-edit-outline"
              ></v-text-field>
            </div>
            <div class="match-date">
              <v-menu
                v-model="matchDatePicker"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="editMatchData.matchDate"
                    :rules="formRules.matchDateRules"
                    label="比赛日期"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    autofocus
                    clearable
                    outlined dense
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="editMatchData.matchDate"
                  @input="matchDatePicker = false"
                  locale="zh-cn"
                  :min="minDate"
                ></v-date-picker>
              </v-menu>
            </div>
            <div class="match-time">
              <v-select
                v-model="editMatchData.matchClassTime"
                :rules="formRules.matchClassTimeRules"
                label="比赛时间"
                :items="matchTimeSelectList"
                outlined dense
                clearable
                prepend-icon="mdi-book-open-blank-variant"
              ></v-select>
            </div>
            <div class="match-area">
              <v-select
                v-model="editMatchData.matchAreaId"
                :rules="formRules.matchAreaRules"
                :items="areaList"
                item-value="_id"
                item-text="areaName"
                label="比赛场地"
                outlined dense
                clearable
                prepend-icon="mdi-soccer-field"
              ></v-select>
            </div>
            <div class="match-type">
              <p style="font-size: 16px; font-weight: bolder;">
                比赛类型
              </p>
              <v-radio-group v-model="editMatchData.matchType" row>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-radio
                      :label="MATCH_TYPE.FREE_MATCH"
                      :value="MATCH_TYPE_PARAMS[MATCH_TYPE.FREE_MATCH]"
                      v-bind="attrs"
                      v-on="on"
                    ></v-radio>
                  </template>
                  <span>自由比赛任何人可以参加，无需指定参赛队员</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-radio
                      :label="MATCH_TYPE.CLASS_MATCH"
                      :value="MATCH_TYPE_PARAMS[MATCH_TYPE.CLASS_MATCH]"
                      v-bind="attrs"
                      v-on="on"
                      v-show="USER_ROLE === USER_PERMISSIONS.ADMIN || USER_ROLE === USER_PERMISSIONS.SUPER_ADMIN"
                    ></v-radio>
                  </template>
                  <span>课程比赛由课程老师或者俱乐部组织比赛，需要指定参赛队员</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-radio
                      :label="MATCH_TYPE.LEAGUE_MATCH"
                      :value="MATCH_TYPE_PARAMS[MATCH_TYPE.LEAGUE_MATCH]"
                      v-bind="attrs"
                      v-on="on"
                      v-show="USER_ROLE === USER_PERMISSIONS.SUPER_ADMIN"
                    ></v-radio>
                  </template>
                  <span>联盟比赛由官方联盟组织比赛，需要指定参赛队员</span>
                </v-tooltip>
              </v-radio-group>
              <div class="match-gamer" v-show="editMatchData.matchType !== MATCH_TYPE_PARAMS[MATCH_TYPE.FREE_MATCH]">
                <v-autocomplete
                  v-model="editMatchData.matchGamerListGreen"
                  :items="searchGamerListGreen"
                  item-text="username"
                  item-value="_id"
                  @update:search-input="searchGamersGreen"
                  deletable-chips
                  outlined
                  dense
                  chips
                  small-chips
                  label="指定参赛队员(绿色方)"
                  multiple
                  cache-items
                  counter="5"
                ></v-autocomplete>
                <v-autocomplete
                  v-model="editMatchData.matchGamerListOrange"
                  :items="searchGamerListOrange"
                  item-text="username"
                  item-value="_id"
                  @update:search-input="searchGamersOrange"
                  deletable-chips
                  outlined
                  dense
                  chips
                  small-chips
                  label="指定参赛队员(橙色方)"
                  multiple
                  cache-items
                  counter="5"
                ></v-autocomplete>
              </div>
            </div>
            <div class="match-description">
              <v-textarea
                v-model="editMatchData.matchDescription"
                :rules="formRules.matchDescriptionRules"
                outlined dense
                label="比赛描述"
                no-resize
                clearable
                counter="100"
                rows="3"
              ></v-textarea>
            </div>
          </div>
        </v-form>
      </template>
      <template #operate>
        <v-btn
          color="primary"
          style="width: 80px; height: 40px;"
          @click="createOrEditMatch"
          v-show="formStatus === 'create'"
        >发布</v-btn>
        <v-btn
          color="primary"
          style="width: 80px; height: 40px;"
          @click="createOrEditMatch"
          v-show="formStatus === 'edit'"
        >修改并发布</v-btn>
      </template>
    </detail>
  </div>
</template>

<script>
import { MATCH_TYPE, MATCH_TYPE_PARAMS, CLASS_TIME, CLASS_TIME_PARAMS_MAP, USER_PERMISSIONS } from '@/constant'
import { mapGetters, mapMutations } from 'vuex'
import { createMatch, editMatch, getMatchById, getFreeArea } from '@/http/match'
import { getUserByIds, getUserByInput } from '@/http/user'
import detail from '@/components/detail'
import moment from 'moment'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'match',
  components: {
    detail
  },
  data: () => ({
    detailConfig: {
      className: 'create-match',
      icon: 'mdi-soccer',
      title: '创建比赛',
      subTitle: '来一场酣畅淋漓的足球比赛吧！'
    },
    // 表单状态，新建(create)或者编辑(edit)
    formStatus: 'create',
    // 待编辑比赛信息，用户新建或者修改比赛信息时使用
    editMatchData: {
      // 比赛名称
      matchName: '',
      // 比赛日期
      matchDate: '',
      // 比赛时间
      matchClassTime: '',
      // 比赛场地
      matchAreaId: '',
      // 比赛描述
      matchDescription: '',
      // 比赛类型
      matchType: MATCH_TYPE_PARAMS[MATCH_TYPE.FREE_MATCH],
      // 参赛者列表(绿色方)
      matchGamerListGreen: [],
      // 参赛者列表(橙色方)
      matchGamerListOrange: []
    },
    // 比赛日期选择器
    matchDatePicker: false,
    // 根据用户输入搜索的参赛人员列表(绿色方)
    searchGamerListGreen: [],
    // 根据用户输入搜索的参赛人员列表(橙色方)
    searchGamerListOrange: [],
    // 比赛场地待选项，查询获取
    areaList: [],
    // 当前编辑比赛的场地信息
    currentMatchArea: {},
    // 比赛课程时间待选项
    matchTimeSelectList: ['第一讲', '第二讲', '第三讲', '第四讲', '第五讲', '第六讲'],
    formRules: {
      matchNameRules: [
        v => !!v || '比赛名称不能为空！',
        v => v.length <= 16 || '长度不能超过16！'
      ],
      matchDateRules: [
        v => !!v || '比赛日期不能为空！'
      ],
      matchClassTimeRules: [
        v => !!v || '比赛时间不能为空！'
      ],
      matchAreaRules: [
        v => !!v || '比赛场地不能为空！'
      ],
      matchDescriptionRules: [
        v => !!v || '比赛描述不能为空！'
      ]
    },
    timeIdGreen: null,
    timeIdOrange: null,
    minDate: moment(Date.now()).format('YYYY-MM-DD'),
    MATCH_TYPE,
    MATCH_TYPE_PARAMS,
    USER_PERMISSIONS
  }),
  mounted () {
    console.log(this.$route)
    if (this.$route.query.matchId) {
      this.formStatus = 'edit'
      this.detailConfig.title = '编辑比赛'
      this.getMatchData()
    }
  },
  computed: {
    ...mapGetters(['USER_ROLE'])
  },
  methods: {
    ...mapMutations(['OPEN_MESSAGE']),
    getFreeAreaList () {
      if (this.$route.query.matchId) {
        // 将当前编辑比赛的场地信息保存在空闲场地列表中
        this.areaList.push(this.currentMatchArea)
      }
      getFreeArea({
        matchDate: this.editMatchData.matchDate,
        matchClassTime: CLASS_TIME[this.editMatchData.matchClassTime]
      }).then(res => {
        console.log(res)
        if (res.success) {
          res.data.forEach(area => {
            const areaListItem = {}
            areaListItem._id = area._id
            areaListItem.areaName = area.areaName
            this.areaList.push(areaListItem)
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    createOrEditMatch () {
      // 表单校验
      if (!this.$refs.matchForm.validate()) return
      if (this.editMatchData.matchType === MATCH_TYPE_PARAMS[MATCH_TYPE.LEAGUE_MATCH]) {
        if (this.editMatchData.matchGamerList.length === 0) {
          this.OPEN_MESSAGE({
            content: '请指定参赛人员！',
            type: 'error',
            timeout: 3000
          })
          return
        }
        if (this.editMatchData.matchGamerListGreen.length > 5 || this.editMatchData.matchGamerListOrange.length > 5) {
          this.OPEN_MESSAGE({
            content: '每一队的参赛人员不能超过5个！',
            type: 'error',
            timeout: 3000
          })
          return
        }
      }
      // 处理数据
      const newMatchData = JSON.parse(JSON.stringify(this.editMatchData))
      newMatchData.matchClassTime = CLASS_TIME[this.editMatchData.matchClassTime]
      newMatchData.matchDate = new Date(this.editMatchData.matchDate)
      newMatchData.userId = this.$store.state.UserInfo.id
      if (this.formStatus === 'create') {
        // 创建比赛
        createMatch(newMatchData).then(res => {
          console.log(res)
          this.OPEN_MESSAGE({
            content: res.message,
            type: res.success ? 'success' : 'error',
            timeout: 3000
          })
          if (res.success) this.$router.push('/pageHome')
        }).catch(err => {
          console.log(err)
        })
      } else {
        // 添加matchId
        newMatchData.matchId = this.$route.query.matchId
        // 编辑比赛
        editMatch(newMatchData).then(res => {
          console.log(res)
          this.OPEN_MESSAGE({
            content: res.message,
            type: res.success ? 'success' : 'error',
            timeout: 3000
          })
          if (res.success) this.$router.push('/pageHome')
        })
      }
    },
    // 搜索用户(绿色方)
    searchGamersGreen (value) {
      if (!value) return
      console.log('用户输入搜索', value)
      this.timeIdGreen && clearTimeout(this.timeIdGreen)
      this.timeIdGreen = setTimeout(() => {
        getUserByInput({ userInput: value }).then(res => {
          console.log(res)
          if (res.success) this.searchGamerListGreen = res.data
        }).catch(err => {
          console.log(err)
        })
      }, 1000)
    },
    // 搜索用户(橙色方)
    searchGamersOrange (value) {
      if (!value) return
      console.log('用户输入搜索', value)
      this.timeIdOrange && clearTimeout(this.timeIdOrange)
      this.timeIdOrange = setTimeout(() => {
        getUserByInput({ userInput: value }).then(res => {
          console.log(res)
          if (res.success) this.searchGamerListOrange = res.data
        }).catch(err => {
          console.log(err)
        })
      }, 1000)
    },
    // 查询比赛信息
    getMatchData () {
      const { matchId } = this.$route.query
      // 查询赛事信息
      getMatchById({ matchId: matchId }).then(res => {
        if (res.success) {
          console.log(res)
          // 保存当前编辑比赛场地信息
          this.currentMatchArea = res.data.area
          // 初始化表单编辑比赛信息
          this.editMatchData.matchName = res.data.match.matchName
          this.editMatchData.matchDate = res.data.match.matchDate.split('T')[0]
          this.editMatchData.matchClassTime = CLASS_TIME_PARAMS_MAP[res.data.match.matchClassTime].name
          this.editMatchData.matchAreaId = res.data.match.matchAreaId
          this.editMatchData.matchType = res.data.match.matchType
          this.editMatchData.matchGamerListGreen = res.data.match.matchGamerListGreen
          this.editMatchData.matchGamerListOrange = res.data.match.matchGamerListOrange
          this.editMatchData.matchDescription = res.data.match.matchDescription
          if (res.data.match.matchGamerListGreen.length !== 0) this.getUserByIdsGreen(this.editMatchData.matchGamerListGreen)
          if (res.data.match.matchGamerListOrange.length !== 0) this.getUserByIdsOrange(this.editMatchData.matchGamerListOrange)
        } else {
          this.OPEN_MESSAGE({
            content: res.message,
            type: 'error',
            timeout: 3000
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getUserByIdsGreen (matchGamerList) {
      // 查询所有参赛者信息，初始化下拉框数据
      getUserByIds({ userIds: matchGamerList }).then(userInfoList => {
        this.searchGamerListGreen = userInfoList.data
      }).catch(err => {
        console.log(err)
      })
    },
    getUserByIdsOrange (matchGamerList) {
      // 查询所有参赛者信息，初始化下拉框数据
      getUserByIds({ userIds: matchGamerList }).then(userInfoList => {
        this.searchGamerListOrange = userInfoList.data
      }).catch(err => {
        console.log(err)
      })
    }
  },
  watch: {
    'editMatchData.matchDate': function () {
      if (this.editMatchData.matchClassTime) {
        this.areaList = []
        this.getFreeAreaList()
      }
    },
    'editMatchData.matchClassTime': function () {
      if (this.editMatchData.matchDate) {
        this.areaList = []
        this.getFreeAreaList()
      }
    }
  }
}
</script>

<style scoped lang="scss">
  #create-match{
    width: 100vw;
    height: 100vh;
    background-image: url('./../../../static/images/match.jpg');
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    .create-match{
      width: 85%;
      height: 90%;
      background-color: rgba(255, 255, 255, 0.7);
      border-radius: 5px;
      .match-info{
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding-top: 10px;
        .match-name, .match-date, .match-time, .match-area{
          width: 45%;
          margin-bottom: 15px;
        }
        .match-type{
          margin-bottom: 10px;
        }
        .match-description, .match-type{
          width: 100%;
        }
      }
      ::v-deep .v-card{
        width: 100%;
        height: 100%;
        .v-card__title{
          width: 100%;
          height: 11%;
        }
        .v-card__subtitle{
          width: 100%;
          height: 4%;
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
