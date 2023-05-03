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
                prepend-icon="mdi-calendar"
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
                prepend-icon="mdi-format-list-bulleted-type"
              ></v-select>
            </div>
            <div class="match-area">
              <v-select
                v-model="editMatchData.matchArea"
                :rules="formRules.matchAreaRules"
                :items="areaList"
                label="比赛场地"
                outlined dense
                clearable
                prepend-icon="mdi-format-list-bulleted-type"
              ></v-select>
            </div>
            <div class="match-type">
              <p style="font-size: 16px; font-weight: bolder;">比赛类型</p>
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
                    ></v-radio>
                  </template>
                  <span>联盟比赛由官方联盟组织比赛，需要指定参赛队员</span>
                </v-tooltip>
              </v-radio-group>
              <div class="match-gamer" v-show="editMatchData.matchType !== MATCH_TYPE_PARAMS[MATCH_TYPE.FREE_MATCH]">
                <v-autocomplete
                  v-model="editMatchData.matchGamerList"
                  :items="searchGamerList"
                  item-text="username"
                  item-value="_id"
                  @update:search-input="searchGamers"
                  deletable-chips
                  outlined
                  dense
                  chips
                  small-chips
                  label="指定参赛队员"
                  multiple
                  cache-items
                  counter="10"
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
        <v-btn color="primary" style="width: 80px; height: 40px;" @click="createMatch">发布</v-btn>
      </template>
    </detail>
  </div>
</template>

<script>
import { MATCH_TYPE, MATCH_TYPE_PARAMS, CLASS_TIME } from '@/constant'
import { mapMutations } from 'vuex'
import { createMatch } from '@/http/match'
import { getUserByInput } from '@/http/user'
import detail from '@/components/detail'

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
    // 待编辑比赛信息，用户新建或者修改比赛信息时使用
    editMatchData: {
      // 比赛名称
      matchName: '',
      // 比赛日期
      matchDate: '',
      // 比赛时间
      matchClassTime: '',
      // 比赛场地
      matchArea: '',
      // 比赛描述
      matchDescription: '',
      // 比赛类型
      matchType: MATCH_TYPE_PARAMS[MATCH_TYPE.FREE_MATCH],
      // 参赛者列表
      matchGamerList: []
    },
    // 比赛日期选择器
    matchDatePicker: false,
    // 根据用户输入搜索的参赛人员列表
    searchGamerList: [],
    // 比赛场地待选项，查询获取
    areaList: ['中区足球场1', '中区足球场2', '中区足球场3'],
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
    timeId: null,
    MATCH_TYPE,
    MATCH_TYPE_PARAMS
  }),
  mounted () {
    console.log(this.$route)
  },
  methods: {
    ...mapMutations(['OPEN_MESSAGE']),
    createMatch () {
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
        if (this.editMatchData.matchGamerList.length > 10) {
          this.OPEN_MESSAGE({
            content: '参赛人员不能超过10个！',
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
      // // 创建比赛
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
    },
    // 搜索用户
    searchGamers (value) {
      if (!value) return
      console.log('用户输入搜索', value)
      this.timerId && clearTimeout(this.timerId)
      this.timerId = setTimeout(() => {
        getUserByInput({ userInput: value }).then(res => {
          console.log(res)
          if (res.success) this.searchGamerList = res.data
        }).catch(err => {
          console.log(err)
        })
      }, 1000)
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
    }
  }
</style>
