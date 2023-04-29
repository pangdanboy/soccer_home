<template>
  <div id="match">
    <div class="create-match-box">
      <v-card style="background-color: transparent;">
        <v-card-title>
          <v-icon>mdi-soccer</v-icon>
          创建比赛
        </v-card-title>
        <v-card-subtitle>来一场酣畅淋漓的足球比赛</v-card-subtitle>
        <v-card-text>
          <div class="match-info"></div>
          <div class="match-type"></div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'match'
}
</script>

<style scoped lang="scss">
  #match{
    width: 100vw;
    height: 100vh;
    background-image: url('./../../../static/images/match.jpg');
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    .create-match-box{
      width: 85%;
      height: 90%;
      background-color: rgba(255, 255, 255, 0.7);
      border-radius: 5px;
    }
  }
</style>
