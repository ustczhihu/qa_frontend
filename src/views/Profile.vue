
<template>
  <div class="content">
    <div class="left">
      <div class="post-content">
        <el-dialog title="编辑资料" :visible.sync="editflag" width="50%">
          <el-form
            :ref="userInfo"
            :model="userInfo"
            label-width="75px"
            label-position="left"
          >
            <el-form-item label="昵称">
              <el-input v-model="userInfo.nickname"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-radio-group v-model="userInfo.gender">
                <el-radio-button label="0">男</el-radio-button>
                <el-radio-button label="1">女</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="个人简介">
              <el-input
                type="textarea"
                :rows="2"
                v-model="userInfo.desc"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="editflag = false">取 消</el-button>
              <el-button type="primary" @click="save">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <div class="PeoInfo bgWhite" id="PeoInfo" style="">
          <div class="PeoInfo-Hd">
            <el-upload
              action="/profile/uploadAvatarUrl/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img :src="userInfo.avatarUrl" />
            </el-upload>
          </div>
          <a
            href="javascript:;"
            class="PeoInfo-Name"
            :title="userInfo.nickname"
            >{{ userInfo.nickname }}</a
          >
          <h6 :title="userInfo.desc">{{ userInfo.desc }}</h6>
          <el-button
            class="updateinfo"
            type="primary"
            icon="el-icon-edit"
            @click="updateInfo()"
            >编辑资料</el-button
          >
        </div>
        <ul class="cat">
          <li
            class="cat-item"
            :class="{ active: myQuestion }"
            @click="selectSection('question')"
          >
            我的问题
          </li>
          <li
            class="cat-item"
            :class="{ active: myAnswer }"
            @click="selectSection('answer')"
          >
            我的回答
          </li>
        </ul>
        <ul class="c-l-list" v-if="myQuestion">
          <li class="c-l-item" v-for="q in questionList" :key="q.id">
            <div class="l-container">
              <div class="data-info fr">
                <span class="view-info"
                  ><i class="el-icon-view"></i>{{ q.viewCount }}</span
                >
                <span class="answercount-info"
                  ><i class="el-icon-chat-line-square"></i
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

              <el-button-group class="questiongroup">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editQuestion(q.id)"
                ></el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="delQuestion(q.id)"
                ></el-button>
              </el-button-group>
            </div>
          </li>
        </ul>
        <ul class="c-l-list" v-if="myAnswer">
          <li class="c-l-item" v-for="a in answerList" :key="a.id">
            <div class="l-container">
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

              <el-button-group class="answergroup">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editAnswer(a.id, a.questionId)"
                ></el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="delAnswer(a.id)"
                ></el-button>
              </el-button-group>
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
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      pagenum: 1,
      pagesize: 5,
      total: 0,
      hasmore: null,
      isloading: false,
      section: 'question',
      questionList: [],
      answerList: [],
      userInfo: null,
      editflag: false,
    }
  },

  mounted: function () {
    this.getQuestionListByUserId()
    this.getUserInfo()
  },
  filters: {
    content_ellipsis(value) {
      if (!value) return ''
      if (value.length > 99) {
        return value.slice(0, 99) + '...'
      }
      return value
    },
  },
  methods: {
    delAnswer(aid) {
      this.$confirm('此操作将永久删除该问题, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
      })
        .then(() => {
          this.$axios({
            method: 'delete',
            url: '/answer/' + aid,
            data: {
              userId: this.$store.getters.userID,
            },
          })
            .then((res) => {
              if (res.code == 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功!',
                })
                this.selectSection(this.section)
              } else {
                this.$message.error(res.message)
              }
            })
            .catch((err) => {
              this.$message.error(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    delQuestion(qid) {
      this.$confirm('此操作将永久删除该问题, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
      })
        .then(() => {
          this.$axios({
            method: 'post',
            url: '/question/delete',
            data: {
              id: qid,
              userId: this.$store.getters.userID,
            },
          })
            .then((res) => {
              if (res.code == 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功!',
                })
                this.selectSection(this.section)
              } else {
                this.$message.error(res.message)
              }
            })
            .catch((err) => {
              this.$message.error(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    editAnswer(aid, qid) {
      this.$router.push({
        name: 'EditAnswer',
        params: { id: aid, qid: qid },
      })
    },
    editQuestion(qid) {
      this.$router.push({ name: 'EditQuestion', params: { id: qid } })
    },
    more() {
      this.pagenum = this.pagenum + 1
      this.isloading = true
      this.hasmore = false
      switch (this.section) {
        case 'question':
          this.getQuestionListByUserId()
          break
        case 'answer':
          this.getAnswerListByUserId()
          break
      }
    },
    selectSection(section) {
      this.total = 0
      this.pagenum = 0
      this.questionList = []
      this.answerList = []
      this.section = section
      this.more()
    },
    getQuestionListByUserId() {
      this.$axios({
        method: 'get',
        url: '/question/queryAllByUserId',
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          userId: this.$store.getters.userID,
        },
      })
        .then((res) => {
          if (res.code == 200) {
            this.hasmore = true
            this.questionList = this.questionList.concat(res.data.questionList)
            this.total = res.data.total
            if (this.questionList.length >= this.total) {
              this.hasmore = false
            }
            this.isloading = false
          } else {
            this.hasmore = false
            this.isloading = false
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          this.hasmore = false
          this.isloading = false
          this.$message.error(err)
        })
    },
    getAnswerListByUserId() {
      this.$axios({
        method: 'get',
        url: '/question/queryAnswerListByUserId',
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          userId: this.$store.getters.userID,
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
            this.hasmore = false
            this.isloading = false
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          this.hasmore = false
          this.isloading = false
          this.$message.error(err)
        })
    },
    getUserInfo() {
      this.$axios({
        method: 'get',
        url: '/profile/getByUserID/' + this.$store.getters.userID,
      })
        .then((res) => {
          if (res.code == 200) {
            this.userInfo = res.data
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          this.$message.error(err)
        })
    },
    updateInfo() {
      this.editflag = true
    },
    save() {
      this.editflag = false
      this.$axios({
        method: 'post',
        url: '/profile/updateProfile',
        data: this.userInfo,
      })
        .then((res) => {
          if (res.code == 200) {
            this.$message.success('更新成功')
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          this.$message.error(err)
        })
    },
    handleAvatarSuccess(res) {
      this.userInfo.avatarUrl = res.url
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
  },
  computed: {
    myQuestion() {
      return this.section == 'question'
    },
    myAnswer() {
      return this.section == 'answer'
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
    word-break: break-word;
    flex: 1;
    margin: 32px;
    margin-right: 12px;
    padding-bottom: 30px;
    position: relative;
    .post-content {
      background-color: #ffffff;
      margin: 10px 0;
      padding-bottom: 15px;
      border-radius: 5px;
      /* line 8, ../sass/SocialPeoInfo.scss */
      .PeoInfo {
        top: 0;
        width: 100%px;
        min-height: 252px;
        background: #fff url(http://www.iplaystone.com/circle/img/peobg.png)
          repeat-x center top;
        position: relative;
        .updateinfo {
          position: absolute;
          right: 20px;
          top: 100px;
        }
        .PeoInfo-Hd {
          width: 100px;
          height: 100px;
          border: 2px solid #fff;
          border-radius: 50%;
          overflow: hidden;
          margin: 35px auto 15px;
        }

        /* line 16, ../sass/SocialPeoInfo.scss */
        .PeoInfo-Hd img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          cursor: pointer;
        }

        /* line 21, ../sass/SocialPeoInfo.scss */
        .PeoInfo-Name {
          display: inline-block;
          width: 100%;
          height: 20px;
          line-height: 20px;
          font-size: 20px;
          font-family: 'Microsoft YaHei';
          color: #404040;
          font-weight: bold;
          text-align: center;
          margin: 0 auto;
          text-decoration: none;
        }

        /* line 33, ../sass/SocialPeoInfo.scss */
        .PeoInfo-Name:hover {
          color: #0099e5;
        }

        /* line 43, ../sass/SocialPeoInfo.scss */
        h6 {
          font-size: 15px;
          font-family: 'Microsoft YaHei';
          color: gray;
          height: 20px;
          overflow: hidden;
          width: 100%;
          margin: 0 auto;
          text-align: center;
          margin-top: 20px;
          line-height: 1.3;
          margin-bottom: 10px;
        }
      }

      .cat {
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 53px;
        .cat-item {
          cursor: pointer;
          padding: 10px 0;
          width: 100%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          list-style: none;
          border-bottom: 1px solid #edeff1;
          color: #878a8c;
          .iconfont {
            margin-right: 4px;
          }
        }
        .active {
          color: #0079d3;
          font-weight: bolder;
          background: none;
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
            position:relative .data-info {
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
              width: 100%;
              font-size: 12px;
              margin-top: 10px;
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

            .questiongroup {
              position: absolute;
              right: 10px;
              bottom: 10px;
            }

            .answergroup {
              position: absolute;
              right: 10px;
              bottom: 10px;
            }
          }
        }
      }
    }
  }
}
</style>