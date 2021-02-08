
<template>
  <div class="content">
    <div class="left">
      <div class="container" style="overflow: hidden">
        <div class="l-container">
          <h4 class="con-title">{{ title }}</h4>
          <el-button type="primary" style="width: 100%" @click="addAnswer"
            >写回答</el-button
          >
          <div class="user-btn" @click="back()">
            <span class="btn-item">
              <b>{{ answerCount }}个回答 ></b>
            </span>
          </div>
        </div>
      </div>
      <ul class="c-l-list">
        <li class="c-l-item">
          <div class="l-container">
            <div class="answer-info">
              <div class="user-info fl">
                <a href="javascript:;" :title="answerData.creator.nickname">
                  <img :src="answerData.creator.avatarUrl" />
                  {{ answerData.creator.nickname }}
                </a>
                <span class="time-info" :title="answerData.updateAt"
                  >更新于:{{ answerData.updateAt }}</span
                >
                <span class="time-info" :title="answerData.createAt"
                  >创建于:{{ answerData.createAt }}</span
                >
              </div>
            </div>
            <div class="answer-content">
              <p>{{ answerData.content }}</p>
            </div>

            <el-button-group class="buttongroup">
              <el-button
                v-if="direction == 0"
                class="iconfont icon-up"
                type="primary"
                @click="up"
                >赞同</el-button
              >
              <el-button
                v-if="direction == 1"
                plain
                class="iconfont icon-up"
                type="primary"
                @click="unup"
                >已赞同</el-button
              >
              <el-button
                v-if="direction == 0"
                class="iconfont icon-down"
                type="primary"
                @click="down"
                >反对</el-button
              >
              <el-button
                v-if="direction == -1"
                class="iconfont icon-down"
                type="primary"
                plain
                @click="undown"
                >已反对</el-button
              >
            </el-button-group>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnswerDetail',
  data() {
    return {
      title: null,
      aid: null,
      qid: null,
      answerCount: null,
      answerData: null,
      direction: 0,
    }
  },
  mounted: function () {
    this.aid = this.$route.params.aid
    this.qid = this.$route.params.qid
    this.answerCount = this.$route.params.answerCount
    this.title = this.$route.params.title
    this.getAnswer()
    this.getVoteInfo()
  },
  methods: {
    up() {
      this.direction = 1
      this.$message.success('投票成功')
      this.vote()
    },
    unup() {
      this.direction = 0
      this.$message.success('取消成功')
      this.vote()
    },
    down() {
      this.direction = -1
      this.$message.success('投票成功')
      this.vote()
    },
    undown() {
      this.direction = 0
      this.$message.success('取消成功')
      this.vote()
    },
    addAnswer() {
      this.$router.push({
        name: 'PublishAnswer',
        params: { id: this.qid, title: this.title },
      })
    },
    back() {
      this.$router.go(-1) //返回上一层
    },
    vote() {
      this.$axios({
        method: 'post',
        url: '/vote/update',
        data: {
          questionId: this.qid,
          answerId: this.aid,
          direction: this.direction,
        },
      })
        .then((res) => {
          if (res.code == 200) {
            //pass
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((error) => {
          this.$message.error(error)
        })
    },
    getAnswer() {
      this.$axios({
        method: 'get',
        url: '/answer/' + this.aid,
      })
        .then((res) => {
          if (res.code == 200) {
            this.answerData = res.data
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((error) => {
          this.$message.error(error)
        })
    },
    getVoteInfo() {
      this.$axios({
        method: 'get',
        url: '/question/queryVoteInfo',
        params: {
          answerId: this.aid,
        },
      })
        .then((res) => {
          if (res.code == 200) {
            this.direction = res.data
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((error) => {
          this.$message.error(error)
        })
    },
  },
}
</script>
<style lang="less" scoped>
.content {
  max-width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 0 auto;
  padding: 20px 24px;
  margin-top: 48px;
  .left {
    flex-grow: 1;
    max-width: 740px;
    border-radius: 4px;
    word-break: break-word;
    background: #ffffff;
    border: #edeff1;
    flex: 1;
    margin: 32px;
    margin-right: 12px;
    position: relative;
    .container {
      width: 100%;
      .l-container {
        padding: 15px;
        .con-title {
          color: #000000;
          font-size: 28px;
          font-weight: bold;
          line-height: 28px;
          text-decoration: none;
          word-break: break-word;
          padding: 15px 0;
        }

        .user-btn {
          cursor: pointer;
          font-size: 15px;
          float: left;
          display: flex;
          display: -webkit-flex;
          margin-top: 20px;
          margin-bottom: 20px;
          .btn-item {
            display: flex;
            display: -webkit-flex;
            align-items: center;
            margin-right: 10px;
            .iconfont {
              margin-right: 4px;
            }
          }
        }
      }
    }

    .c-l-list {
      .c-l-item {
        list-style: none;
        //border-radius: 4px;
        border-top: 1px solid #ccc;

        margin-bottom: 10px;
        background-color: rgba(255, 255, 255, 0.8);
        color: #878a8c;
        position: relative;

        .l-container {
          padding: 15px;
          height: 275px;
          position: relative;
          .answer-info {
            width: 100%;
            .user-info {
              min-width: 160px;

              a {
                display: inline-block;
                position: relative;
                text-decoration: none;
                line-height: 20px;
                font-size: 15px;
                color: #666666;
              }
              img {
                position: relative;
                top: 4px;
                display: inline;
                width: 30px;
                height: 30px;
                border-radius: 50%;
              }
              .time-info {
                font-size: 15px;
                color: #a7a7a7;
                border-left: 1px solid #eeeeee;
                margin-left: 5px;
                padding-left: 10px;
              }
            }
          }

          .answer-content {
            font-size: 20px;
            margin-top: 30px;
          }

          .buttongroup {
            position: absolute;
            right: 15px;
            bottom: 15px;
          }
        }
      }
    }
  }
}
</style>