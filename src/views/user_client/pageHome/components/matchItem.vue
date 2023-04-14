<template>
  <div id="match_item">
    <v-container fluid>
      <div class="match-cover">
        <v-img src="./../../../../static/images/freeMatch.jpg"></v-img>
      </div>
      <div class="match-type">
        <p class="match-type-title">自由比赛</p>
        <span class="match-type-tips">自由比赛为用户自发组织，所有人均可参加</span>
      </div>
      <div class="match-info">
        <h3 class="match-name">随便玩玩</h3>
        <p class="match-date">比赛时间：2023-4-12 15:30</p>
        <p class="match-place">比赛地点：中区足球场-1</p>
        <p class="match-participants">
          当前参与人数：5
          <span>(剩余5个位置)</span>
        </p>
        <v-btn class="match-operation primary">查看详情</v-btn>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'matchItem'
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
      .match-type-title{
        margin: 0;
        font-weight: bold;
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
  @media screen and (min-width: 1281px){
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
