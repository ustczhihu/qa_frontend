<template>
  <div class="content">
    <div class="left">
      <div class="container" style="overflow: hidden">
        <div class="l-container">
          <h4 class="con-title">{{ title }}</h4>
          <div class="con-info">问题描述:{{ content }}</div>
          <el-button type="primary" style="width: 100%" @click="addAnswer"
            >写回答</el-button
          >
          <div class="user-btn">
            <span class="btn-item">
              <i class="el-icon-view"></i><b>{{ viewCount }}</b
              >浏览
            </span>
            <span class="btn-item">
              <i class="el-icon-chat-line-square"></i><b>{{ answerCount }}</b
              >回答
            </span>
          </div>

          <div class="c-l-header">
            <div
              class="time btn-iconfont"
              :class="{ active: timeOrder }"
              @click="selectOrder('time')"
            >
              <i class="el-icon-time"></i>时间
            </div>
            <div
              class="count btn-iconfont"
              :class="{ active: countOrder }"
              @click="selectOrder('count')"
            >
              <i class="el-icon-s-data"></i>分数
            </div>
          </div>
        </div>
      </div>
      <ul class="c-l-list">
        <li class="c-l-item" v-for="a in answerList" :key="a.id">
          <div class="l-container" @click="goDetail(a.id)">
            <div class="answer-info">
              <div class="user-info fl">
                <a href="javascript:;" :title="a.creator.nickname">
                  <img :src="a.creator.avatarUrl" />
                  {{ a.creator.nickname }}
                </a>
                <span class="time-info" :title="a.updateAt">{{
                  a.updateAt
                }}</span>
              </div>
            </div>
            <div class="answer-content">
              <p>{{ a.content | content_ellipsis }}</p>
            </div>
          </div>
        </li>
      </ul>
      <el-button
        type="primary"
        style="width: 100%"
        :loading="isloading"
        @click="more"
        v-if="hasmore"
        plain
        >加载更多</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'Content',
  data() {
    return {
      id: null,
      title: null,
      content: null,
      pagenum: 1,
      pagesize: 5,
      viewCount: 0,
      answerCount: 0,
      answerList: [],
      order: 'time',
      isloading: false,
      hasmore: true,
      total: 0,
    }
  },
  filters: {
    content_ellipsis(value) {
      if (!value) return ''
      if (value.length > 90) {
        return value.slice(0, 90) + '...'
      }
      return value
    },
  },
  methods: {
    goDetail(id) {
      this.$router.push({
        name: 'AnswerDetail',
        params: {
          aid: id,
          qid: this.id,
          title: this.title,
          answerCount: this.answerCount,
        },
      })
    },
    addAnswer() {
      this.$router.push({
        name: 'PublishAnswer',
        params: { id: this.id, title: this.title },
      })
    },
    more() {
      this.pagenum = this.pagenum + 1
      this.isloading = true
      this.hasmore = false
      if (this.order == 'time') {
        this.getAnswerList()
      } else {
        this.getAnswerListByScore()
      }
    },
    selectOrder(order) {
      this.order = order
      this.pagenum = 1
      this.hasmore = false
      this.answerList = []
      if (this.order == 'time') {
        this.getAnswerList()
      } else {
        this.getAnswerListByScore()
      }
    },

    getQuestionDetail() {
      this.$axios({
        method: 'get',
        url: '/question/get',
        params: {
          id: this.id,
        },
      })
        .then((res) => {
          if (res.code == 200) {
            this.title = res.data.title
            this.content = res.data.content
            this.viewCount = res.data.viewCount
            this.answerCount = res.data.answerCount
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((error) => {
          this.$message.error(error)
        })
    },
    getAnswerListByScore() {
      this.$axios({
        method: 'get',
        url: '/question/queryAnswerListByScore',
        params: {
          question_id: this.id,
          pagenum: this.pagenum,
          pagesize: this.pagesize,
        },
      })
        .then((res) => {
          if (res.code == 200) {
            this.hasmore = true
            this.answerList = this.answerList.concat(res.data.answerList)
            if (this.answerList.length >= this.total) {
              this.hasmore = false
            }
            this.isloading = false
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((error) => {
          this.$message.error(error)
        })
    },
    getAnswerList() {
      this.$axios({
        method: 'get',
        url: '/answer',
        params: {
          question_id: this.id,
          pagenum: this.pagenum,
          pagesize: this.pagesize,
        },
      })
        .then((res) => {
          if (res.code == 200) {
            this.hasmore = true
            this.answerList = this.answerList.concat(res.data.answerList)
            this.total = res.data.total
            if (this.answerList.length >= this.total) {
              this.hasmore = false
            }
            this.isloading = false
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((error) => {
          this.$message.error(error)
        })
    },
  },
  mounted: function () {
    this.id = this.$route.params.id
    this.getQuestionDetail()
    this.getAnswerList()
  },
  computed: {
    timeOrder() {
      return this.order == 'time'
    },
    countOrder() {
      return this.order == 'count'
    },
  },
}
</script>

<style lang="less" scoped>
.fr {
  float: right;
}
.fl {
  float: left;
}
.bgWhite {
  border: 1px solid #e6e7eb;
  background: #fff;
}

.MoudleHd {
  width: 100%;
  height: 32px;
  font-size: 16px;
  color: #404040;
  border-bottom: 1px solid #eef0f1;
}
.more {
  width: 100%;
}

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
        }
        .con-info {
          font-size: 20px;
          padding: 15px 0;
        }
        .user-btn {
          font-size: 15px;
          float: left;
          display: flex;
          display: -webkit-flex;
          margin-top: 20px;
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
        .c-l-header {
          align-items: center;
          background-color: #ffffff;
          float: right;
          border-radius: 4px;
          box-sizing: border-box;
          display: -ms-flexbox;
          display: flex;
          -ms-flex-flow: row nowrap;
          flex-flow: row nowrap;
          height: 56px;
          -ms-flex-pack: start;
          justify-content: flex-start;

          padding: 0 12px;

          .iconfont {
            margin-right: 4px;
          }
          .btn-iconfont {
            display: flex;
            display: -webkit-flex;
            cursor: pointer;
          }
          .active {
            background: #f6f7f8;
            color: #0079d3;
            fill: #0079d3;
            border-radius: 20px;
            height: 32px;
            line-height: 32px;
            margin-right: 8px;
            padding: 0 10px;
          }
          .time {
            font-size: 14px;
            margin-right: 18px;
          }
          .count {
            font-size: 14px;
          }
          .btn-publish {
            width: 70px;
            height: 35px;
            line-height: 35px;
            background-color: #0079d3;
            color: #ffffff;
            border: 1px solid transparent;
            border-radius: 4px;
            box-sizing: border-box;
            text-align: center;
            margin-left: auto;
            cursor: pointer;
          }
          .sort {
            margin-left: 300px;
            display: flex;
            color: #0079d3;
            display: -webkit-flex;
            align-items: center;
            .sort-triangle {
              width: 0;
              height: 0;
              border-top: 5px solid #0079d3;
              border-right: 5px solid transparent;
              border-bottom: 5px solid transparent;
              border-left: 5px solid transparent;
              margin-top: 5px;
              margin-left: 10px;
            }
          }
        }
      }
    }

    .c-l-list {
      .c-l-item {
        list-style: none;
        //border-radius: 4px;
        cursor: pointer;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        margin-bottom: 10px;
        background-color: rgba(255, 255, 255, 0.8);
        color: #878a8c;
        position: relative;

        .l-container {
          padding: 15px;

          .answer-info {
            width: 100%;
            height: 25px;
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
            font-size: 15px;
            margin-top: 15px;
          }
        }
      }
    }
  }
}
</style>