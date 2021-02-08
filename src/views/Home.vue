<template>
  <div class="content">
    <div class="left">
      <div class="search">
        <label class="s-logo"></label>
        <input
          type="text"
          class="s-input"
          placeholder="搜索"
          @focus="clearContent()"
          v-model.lazy="keyword"
        />
      </div>
      <div class="c-l-header">
        <div
          class="time btn-iconfont"
          :class="{ active: timeOrder }"
          @click="selectOrder('updatetime')"
        >
          <i class="iconfont el-icon-time"></i>时间
        </div>
        <div
          class="answercount btn-iconfont"
          :class="{ active: answerCountOrder }"
          @click="selectOrder('answercount')"
        >
          <i class="iconfont el-icon-chat-line-square"></i>回答数
        </div>
        <div
          class="view btn-iconfont"
          :class="{ active: viewOrder }"
          @click="selectOrder('viewcount')"
        >
          <i class="iconfont el-icon-view"></i>浏览数
        </div>

        <button class="btn-publish" @click="goPublish">发布问题</button>
      </div>
      <ul class="c-l-list">
        <li class="c-l-item" v-for="q in questionList" :key="q.id">
          <div class="l-container" @click="goDetail(q.id)">
            <div class="data-info fr">
              <span class="view-info"
                ><i class="iconfont el-icon-view"></i>{{ q.viewCount }}</span
              >
              <span class="answercount-info"
                ><i class="iconfont el-icon-chat-line-square"></i
                >{{ q.answerCount }}</span
              >
            </div>
            <h4 class="question-title">{{ q.title }}</h4>

            <div class="bestanswer-info" v-if="q.bestAnswer.id != 0">
              <div class="user-info fl">
                <a href="javascript:;" :title="q.bestAnswer.creator.nickname">
                  <img :src="q.bestAnswer.creator.avatarUrl" />
                  {{ q.bestAnswer.creator.nickname }}
                </a>
                <span class="time-info" :title="q.creator.updateAt">{{
                  q.creator.updateAt
                }}</span>
              </div>
            </div>
            <div class="answer-info" v-if="q.bestAnswer.id != 0">
              <p>{{ q.bestAnswer.content | content_ellipsis }}</p>
            </div>
            <div class="answer-info" v-if="q.bestAnswer.id == 0">
              <p>暂无回答</p>
            </div>
          </div>
        </li>
      </ul>
      <el-button
        type="primary"
        class="more"
        :loading="isloading"
        @click="more"
        v-if="hasmore"
        plain
        >加载更多</el-button
      >
    </div>
    <div class="right">
      <div class="SocialIndexHot bgWhite" id="SocialIndexHot">
        <div class="MoudleHd">热门问题</div>
        <div class="HotList clearfix">
          <ul>
            <li v-for="(q, idx) in hotList" :key="q.id">
              <div @click="goDetail(q.id)">
                <i class="fl">{{ idx + 1 }}</i>
                <span class="fl" :title="q.title">{{
                  q.title | title_ellipsis
                }}</span>
                <b class="fr"
                  ><i class="iconfont icon-hot"></i
                  >{{ ((q.score % 1000000) / 100).toFixed(1) }}</b
                >
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {},
  data() {
    return {
      order: 'updatetime',
      pagenum: 1,
      pagesize: 5,
      questionList: [],
      hotList: [],
      keyword: '',
      isloading: false,
      hasmore: true,
      total: 0,
    }
  },
  watch: {
    keyword: function () {
      this.getQuestionListByKeyword()
    },
  },
  filters: {
    content_ellipsis(value) {
      if (!value) return ''
      if (value.length > 99) {
        return value.slice(0, 99) + '...'
      }
      return value
    },
    title_ellipsis(value) {
      if (!value) return ''
      if (value.length > 15) {
        return value.slice(0, 15) + '...'
      }
      return value
    },
  },
  methods: {
    more() {
      this.pagenum = this.pagenum + 1
      this.isloading = true
      this.hasmore = false
      this.getMoreQuestion()
    },
    clearContent() {
      this.keyword = null
    },
    selectOrder(order) {
      this.order = order
      this.pagenum = 1
      this.hasmore = false
      this.getQuestionListByKeyword()
    },
    goPublish() {
      this.$router.push({ name: 'PublishQuestion' })
    },
    goDetail(id) {
      this.$router.push({ name: 'Content', params: { id: id } })
    },
    getMoreQuestion() {
      this.$axios({
        method: 'get',
        url: '/question/queryAllByTitle',
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          order: this.order,
          title: this.keyword,
        },
      })
        .then((res) => {
          if (res.code == 200) {
            this.hasmore = true
            this.questionList = this.questionList.concat(res.data.questionList)
            if (this.questionList.length >= this.total) {
              this.hasmore = false
            }
            this.isloading = false
          } else {
            this.hasmore = false
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          this.hasmore = false
          this.$message.error(err)
        })
    },
    getQuestionListByKeyword() {
      this.$axios({
        method: 'get',
        url: '/question/queryAllByTitle',
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          order: this.order,
          title: this.keyword,
        },
      })
        .then((res) => {
          if (res.code == 200) {
            this.hasmore = true
            this.questionList = res.data.questionList
            this.total = res.data.total
            if (this.questionList.length >= this.total) {
              this.hasmore = false
            }
          } else {
            this.hasmore = false
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          this.hasmore = false
          this.$message.error(err)
        })
    },
    getHotList() {
      this.$axios({
        method: 'get',
        url: '/question/queryHotList',
      })
        .then((res) => {
          if (res.code == 200) {
            this.hotList = res.data
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          this.$message.error(err)
        })
    },
  },
  mounted: function () {
    this.getQuestionListByKeyword()
    this.getHotList()
  },
  computed: {
    timeOrder() {
      return this.order == 'updatetime'
    },
    viewOrder() {
      return this.order == 'viewcount'
    },
    answerCountOrder() {
      return this.order == 'answercount'
    },
  },
}
</script>

<style scoped lang="less">
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
.clearfix:before,
.clearfix:after {
  content: '';
  display: table;
  height: 0;
  visibility: hidden;
  clear: both;
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
  margin: 48px auto 0;
  padding: 20px 24px;

  .left {
    width: 640px;
    padding-bottom: 10px;
    .search {
      flex-grow: 1;
      margin: 0 auto;
      max-width: 690px;

      position: relative;
      display: flex;
      display: -webkit-flex;
      .s-logo {
        width: 18px;
        height: 18px;
        background: url('../assets/images/search.png') no-repeat;
        background-size: cover;
        display: inline-block;
        position: absolute;
        top: 50%;
        margin-top: -9px;
        left: 15px;
      }
      .s-input {
        flex-grow: 1;
        -webkit-appearance: none;
        appearance: none;
        background-color: white;
        border-radius: 4px;
        border: 1px solid #edeff1;
        box-shadow: none;
        color: #c1c1c1;
        display: block;
        height: 36px;
        outline: none;
        padding: 0 16px 0 40px;
        width: 100%;
      }
    }

    .c-l-header {
      align-items: center;
      background-color: #ffffff;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-flow: row nowrap;
      flex-flow: row nowrap;
      height: 56px;
      -ms-flex-pack: start;
      justify-content: flex-start;
      margin-bottom: 16px;
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
      .answercount {
        font-size: 14px;
        margin-right: 18px;
      }
      .view {
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
    .c-l-list {
      .c-l-item {
        list-style: none;
        border-radius: 4px;
        cursor: pointer;
        border: 1px solid #ccc;
        margin-bottom: 10px;
        background-color: rgba(255, 255, 255, 0.8);
        color: #878a8c;
        position: relative;

        .l-container {
          padding: 15px;

          .data-info {
            display: inline-block;
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            color: #a7a7a7;
            margin-top: 4px;
            span {
              margin-right: 20px;
              img {
                margin-right: 5px;
              }
            }
          }

          .question-title {
            color: #000000;
            font-size: 18px;
            font-weight: 500;
            line-height: 22px;
            text-decoration: none;
            word-break: break-word;
          }

          .bestanswer-info {
            width: 100%;
            height: 25px;
            .user-info {
              min-width: 160px;
              max-width: 400px;
              a {
                display: inline-block;
                position: relative;
                text-decoration: none;
                line-height: 20px;
                font-size: 12px;
                color: #666666;
              }
              img {
                position: relative;
                top: 4px;
                display: inline;
                width: 25px;
                height: 25px;
                border-radius: 50%;
              }
              .time-info {
                font-size: 12px;
                color: #a7a7a7;
                border-left: 1px solid #eeeeee;
                margin-left: 5px;
                padding-left: 10px;
              }
            }
          }

          .answer-info {
            font-size: 12px;
            margin-top: 10px;
          }
        }
      }
    }
  }
  .right {
    width: 312px;
    margin-left: 24px;
    margin-top: 38px;
    /* line 1, ../sass/SocialIndexHot.scss */
    .SocialIndexHot {
      padding: 15px 19px;
      margin-bottom: 20px;
      width: 260px;
    }
    /* line 5, ../sass/SocialIndexHot.scss */
    .SocialIndexHot .HotList {
      width: 100%;
      height: auto;
      padding-top: 20px;
    }
    /* line 9, ../sass/SocialIndexHot.scss */
    .SocialIndexHot .HotList ul {
      width: 100%;
      height: auto;
      list-style: none;
    }
    /* line 12, ../sass/SocialIndexHot.scss */
    .SocialIndexHot .HotList ul li {
      width: 100%;
      height: 20px;
      line-height: 20px;
      margin-bottom: 20px;
      cursor: pointer;
    }
    /* line 17, ../sass/SocialIndexHot.scss */
    .SocialIndexHot .HotList ul li:last-child {
      margin-bottom: 0;
    }
    /* line 20, ../sass/SocialIndexHot.scss */
    .SocialIndexHot .HotList ul li:first-child i {
      background-color: #ff5c26;
    }
    /* line 23, ../sass/SocialIndexHot.scss */
    .SocialIndexHot .HotList ul li:nth-child(2) i {
      background-color: #fd9100;
    }
    /* line 26, ../sass/SocialIndexHot.scss */
    .SocialIndexHot .HotList ul li:nth-child(3) i {
      background-color: #f8c127;
    }
    /* line 30, ../sass/SocialIndexHot.scss */
    .SocialIndexHot .HotList ul a {
      width: 100%;
      font-size: 14px;
    }
    /* line 34, ../sass/SocialIndexHot.scss */
    .SocialIndexHot .HotList ul i {
      display: inline-block;
      width: 16px;
      height: 16px;
      line-height: 16px;
      border-radius: 50%;
      font-size: 12px;
      color: #fff;
      text-align: center;
      background: #cdcdcd;
      margin: 2px 5px 0 0;
      font-style: normal;
    }
    /* line 47, ../sass/SocialIndexHot.scss */
    .SocialIndexHot .HotList ul span {
      color: #585858;
      display: inline-block;
      width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
    }
    /* line 55, ../sass/SocialIndexHot.scss */
    .SocialIndexHot .HotList ul span:hover {
      color: #00aaff;
    }
    /* line 59, ../sass/SocialIndexHot.scss */
    .SocialIndexHot .HotList ul b {
      color: #a7a7a7;
      font-style: normal;
      font-weight: normal;
    }
  }
}
</style>
