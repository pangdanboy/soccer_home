<template>
  <div id="chat_home">
    <v-row>
      <v-col cols="7">
        <v-card v-for="item in memberData" :key="item.id" style="margin-bottom: 20px;">
          <v-card-title>
            <v-avatar style="margin-right: 5px;" size="70">
              <v-img :src="item.sonPhoto" :lazy-src="item.sonPhoto"></v-img>
            </v-avatar>
            {{item.name}}
          </v-card-title>
          <v-card-text>
            <span class="member-info">年龄:{{item.age}}</span>
            <span class="member-info">身高:{{item.height}}</span>
            <span class="member-info">体重:{{item.weight}}</span>
            <span class="member-info">出生地:{{item.birthPlace}}</span>
            <span class="member-info">队内定位:{{item.position}}</span>
            <span class="member-info">粉丝称呼:{{item.nickname}}</span>
          </v-card-text>
          <v-img :lazy-src="item.photo" :src="item.photo"></v-img>
        </v-card>
      </v-col>
      <v-col cols="5">
        <v-card style="padding: 15px;">
          <v-card-title>编年史</v-card-title>
          <v-card-text>团体出道以来重要时间节点</v-card-text>
          <v-timeline v-for="(item, index) in chronicleData" :key="item.id" align-top>
            <v-timeline-item icon color="#995fce" :left="(index + 1) % 2 === 0 ? true : false">
              <v-card>
                <v-card-title>{{item.title}}</v-card-title>
                <v-card-subtitle>{{item.date}}</v-card-subtitle>
                <v-card-text>{{item.content}}</v-card-text>
                <v-img :lazy-src="item.cover" :src="item.cover"></v-img>
              </v-card>
              <template v-slot:icon>
                <v-avatar>
                  <v-img src="./../../public/images/point.jpg"></v-img>
                </v-avatar>
              </template>
            </v-timeline-item>
          </v-timeline>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'pageHome',
  data: () => ({
    // 成员信息
    memberData: [
      {
        id: 1,
        name: '金硕珍',
        age: '28',
        height: '188',
        weight: '58',
        birthPlace: '韩国',
        position: '门面,主唱',
        nickname: '车门男神',
        photo: require('./../../public/images/jin.jpg'),
        sonPhoto: require('./../../public/images/jin-son.jpg')
      },
      {
        id: 2,
        name: '闵玧其',
        age: '25',
        height: '182',
        weight: '52',
        birthPlace: '韩国',
        position: 'rap，制作',
        nickname: '中国女婿',
        photo: require('./../../public/images/jin.jpg'),
        sonPhoto: require('./../../public/images/jin-son.jpg')
      },
      {
        id: 3,
        name: '闵玧其',
        age: '25',
        height: '182',
        weight: '52',
        birthPlace: '韩国',
        position: 'rap，制作',
        nickname: '中国女婿',
        photo: require('./../../public/images/jin.jpg'),
        sonPhoto: require('./../../public/images/jin-son.jpg')
      },
      {
        id: 4,
        name: '闵玧其',
        age: '25',
        height: '182',
        weight: '52',
        birthPlace: '韩国',
        position: 'rap，制作',
        nickname: '中国女婿',
        photo: require('./../../public/images/jin.jpg'),
        sonPhoto: require('./../../public/images/jin-son.jpg')
      },
      {
        id: 5,
        name: '闵玧其',
        age: '25',
        height: '182',
        weight: '52',
        birthPlace: '韩国',
        position: 'rap，制作',
        nickname: '中国女婿',
        photo: require('./../../public/images/jin.jpg'),
        sonPhoto: require('./../../public/images/jin-son.jpg')
      },
      {
        id: 6,
        name: '闵玧其',
        age: '25',
        height: '182',
        weight: '52',
        birthPlace: '韩国',
        position: 'rap，制作',
        nickname: '中国女婿',
        photo: require('./../../public/images/jin.jpg'),
        sonPhoto: require('./../../public/images/jin-son.jpg')
      },
      {
        id: 7,
        name: '闵玧其',
        age: '25',
        height: '182',
        weight: '52',
        birthPlace: '韩国',
        position: 'rap，制作',
        nickname: '中国女婿',
        photo: require('./../../public/images/jin.jpg'),
        sonPhoto: require('./../../public/images/jin-son.jpg')
      }
    ],
    // 编年史数据
    chronicleData: [
      {
        id: 1,
        title: '组合出道',
        date: '2013-6-13',
        content: '发行专辑"no more dream"正式出道',
        cover: require('./../../public/images/2013-6-13.jpg')
      },
      {
        id: 2,
        title: '组合出道',
        date: '2013-6-13',
        content: '发行专辑"no more dream"正式出道',
        cover: require('./../../public/images/2013-6-13.jpg')
      }
    ]
  })
}
</script>

<style scoped lang="scss">
  #chat_home{
    width: 100%;
  }
  .member-info{
    margin-right: 10px;
  }
</style>
