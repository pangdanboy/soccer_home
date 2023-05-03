<template>
  <div id="match_item">
    <v-container fluid>
      <div class="match-cover">
        <v-img v-show="matchData.matchType === '1'" src="./../../../../static/images/freeMatch.jpg"></v-img>
        <v-img v-show="matchData.matchType === '2'" src="./../../../../static/images/classMatch.jpg"></v-img>
        <v-img v-show="matchData.matchType === '3'" src="./../../../../static/images/leagueMatch.jpg"></v-img>
      </div>
      <div class="match-type">
        <div class="match-type-title">
          <h3>{{ matchData.matchName }}</h3>
          <p v-show="matchData.matchType === '1'">自由比赛</p>
          <p v-show="matchData.matchType === '2'">课程比赛</p>
          <p v-show="matchData.matchType === '3'">联盟比赛</p>
        </div>
        <span
          class="match-type-tips"
          v-show="matchData.matchType === '1'"
        >自由比赛为用户自发组织，所有人均可参加</span>
        <span
          class="match-type-tips"
          v-show="matchData.matchType === '2'"
        >课程比赛由课程老师或者俱乐部组织比赛，所有人均可参加</span>
        <span
          class="match-type-tips"
          v-show="matchData.matchType === '3'"
        >联盟比赛由官方联盟组织比赛，参赛队员已指定</span>
      </div>
      <div class="match-info">
        <h3 class="match-name">{{ matchData.matchName }}</h3>
        <p class="match-date">
          比赛时间：{{ matchData.matchDate.split('T')[0] + '-' + CLASS_TIME_PARAMS_MAP[matchData.matchClassTime].name + '-' + CLASS_TIME_PARAMS_MAP[matchData.matchClassTime].time}}
        </p>
        <p class="match-place">比赛地点：{{ matchData.matchArea }}</p>
        <p class="match-participants">
          当前参与人数：{{ matchData.matchGamerList.length }}
          <span>(剩余{{ 10 - matchData.matchGamerList.length }}个位置)</span>
        </p>
        <v-btn class="match-operation primary" @click="checkDetail(matchData._id)">查看详情</v-btn>
      </div>
    </v-container>
  </div>
</template>

<script>
import { CLASS_TIME_PARAMS_MAP } from '@/constant'

export default {
  name: 'matchItem',
  props: {
    matchData: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  data: () => ({
    CLASS_TIME_PARAMS_MAP
  }),
  methods: {
    // 查看比赛详细信息
    checkDetail (matchId) {
      console.log(matchId)
      // 跳转到比赛详情页，传递matchId
      this.$router.push('/pageMatchDetail?matchId=' + matchId)
    }
  }
}
</script>

<style scoped lang="scss">
  #match_item{
    width: 32%;
    height: 280px;
    border-radius: 5px;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
    overflow: hidden;
    margin-bottom: 20px;
    margin-right: 2%;
    position: relative;
    .container{
      padding: 0;
    }
    &:hover{
      .match-info{
        display: flex;
      }
      .match-cover{
        .v-image{
          transform: scale(1.2);
        }
      }
    }
    .match-cover{
      height: 220px;
      overflow: hidden;
      .v-image{
        height: 100%;
        transition: all, 1s linear 0s;
      }
    }
    .match-type{
      height: 60px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      padding-left: 15px;
      padding-right: 15px;
      .match-type-title{
        width: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        p{
          margin: 0;
          font-weight: bold;
        }
      }
      .match-type-tips{
        font-size: 12px;
      }
    }
    .match-info{
      padding: 10px;
      width: 100%;
      height: 220px;
      position: absolute;
      display: none;
      left: 0;
      top: 0;
      background-color: rgba(255, 255, 255, 0.7);
      transition: all, 2s linear 0s;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      .match-operation{
        align-self: flex-end;
      }
    }
  }
  @media screen and (min-width: 1411px){
    #match_item{
      height: 360px;
      .match-cover{
        height: 300px;
      }
      .match-info{
        height: 300px;
      }
    }
  }
</style>
