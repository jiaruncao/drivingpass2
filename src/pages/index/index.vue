<template>
  <view class="index_main">
    <view class="container">
      <view class="search_main" @click="toSearch">
        <view class="search_icon">
          <!-- <img src="static/index/search.png" alt="" /> -->
          <u-icon name="search" color="#ddd" size="48rpx"></u-icon>
        </view>
        <view class="search_text">Search by keywords</view>
      </view>
      <view class="banner_main">
        <u-swiper :list="bannerList" radius="8" imgMode="cover" height="233rpx"></u-swiper>
      </view>
      <view class="practice_main_top">
        <view class="left_item" @click="modeSelect('MockTest', 7)">
          <view class="item_title">Mock Test</view>
          <view class="item_content">Practice Like the Real Exam</view>
        </view>
        <view class="right_item">
          <view class="right_item_top" @click="modeSelect('TheoryTest', 2)">
            <view class="item_title" style="color: #4379bb">Theory Test</view>
            <view class="item_score" style="color: #4379bb">Score：{{getScore('Theory Test')}}</view>
          </view>
          <view class="right_item_bottom" @click="modeSelect('HazardTest', 3)">
            <view class="item_title" style="color: #b77a2a">Hazard Test</view>
            <view class="item_score" style="color: #b77a2a">Score：{{getScore('Hazard Test')}}</view>
          </view>
        </view>
      </view>
      <view class="practice_main_bottom">
        <view class="left_item" @click="modeSelect('HighwayCode', 5)">
          <view class="item_title" style="color: #4fa62a">Highway Code</view>
          <view class="item_score" style="color: #4fa62a">Score：{{getScore('Highway Code')}}</view>
        </view>
        <view class="right_item">
          <view class="right_item_top" @click="modeSelect('RodeSign', 4)">
            <view class="item_title" style="color: #336cb5">Rode Sign</view>
            <view class="item_score" style="color: #336cb5">Score：{{getScore('Rode Sign')}}</view>
          </view>
        </view>
      </view>
      <view class="prctice_main_end" @click="wrongQuestionBook">
        <view class="end_title">Wrongs Bookmarks</view>
        <view class="end_content">Identify Learning Gaps & Boost Skills Fast</view>
      </view>
    </view>
    
  </view>
</template>

<script>
  import {
    getTypeFind,
    queryAllQuestion
  } from '@/http/api/index.js'
  import {formatScore} from '@/utils/number'
  export default {
    data() {
      return {
        bannerList: [
          require("static/index/banner.png"),
          require("static/index/banner1.png"),
        ],
        drivingTest: [] // 测试模块
      };
    },
    onLoad () {
      const subjects = uni.getStorageSync('subjects')
      if (!subjects) {
        this.queryAllQuestion()
      }
    },
    onShow() {
      this.doGetTypeFind()
    },
    methods: {
      toSearch() {
        uni.navigateTo({
          url: "/pages/index/search",
        });
      },
      wrongQuestionBook() {
        uni.navigateTo({
          url: "/pages/my/mySaved",
        });
      },
      modeSelect(title, id) {
        /*
         * author：Gengbaodada
         * create by date：2025/07/27
         * content：mock : 模拟考试  theory:理论考试  Hazard Test: 危险测试  Highway Code:公用通道法规   Rode Sign: 道路标识
         */
        // const id = this.drivingTest.find(item => item.name === title) ? this.drivingTest.find(item => item.name === title).id : null
        switch (title) {
          case 'MockTest':
            uni.navigateTo({
              url: "/pages/mockTest/mockTest"
            });
            break;
            // case 'RodeSign':
            //   uni.navigateTo({
            //     url: "/pages/roadSign/roadSign?id=" + id
            //   });
            //   break;
          default:
            uni.navigateTo({
              url: "/pages/modeSelect/index?id=" + id + "&title=" + title
            });
            break;
        }
      },
      doGetTypeFind() {
        getTypeFind().then((res) => {
          this.drivingTest = res.data[0].children
        });
      },
      getScore(name) {
        const scoreInfo = this.drivingTest.find(item => item.name === name)
        return formatScore(scoreInfo ? scoreInfo.score : 0)
      },
      // 第一次进入，获取题库
      queryAllQuestion () {
        queryAllQuestion().then(res => {
          console.log(res)
          if (res.code == 1) {
            // 缓存题目
            uni.setStorageSync('subjects', res.data.subjects)
          }
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
  .index_main {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding-top: calc(env(safe-area-inset-top) + 40rpx);
    padding-bottom: calc(env(safe-area-inset-bottom) + 140rpx);
    background: linear-gradient(180deg, rgba(227, 242, 253, 0.8) 0%, #ffffff 55%, #fff5f5 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
    color: #333;
  }

  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 32rpx;
    padding: 0 5vw 5vh;
  }

  image {
    max-width: 100%;
    height: auto;
  }

  .search_main {
    width: 100%;
    min-height: 100rpx;
    background: #ffffff;
    border-radius: 50rpx;
    display: flex;
    align-items: center;
    padding: 0 32rpx;
    box-shadow: 0 12rpx 30rpx rgba(15, 23, 42, 0.08);
  }

  .search_icon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 24rpx;
  }

  .search_text {
    flex: 1;
    font-weight: 500;
    font-size: 28rpx;
    color: #64748b;
    word-break: break-word;
  }

  .banner_main {
    width: 100%;
    border-radius: 24rpx;
    overflow: hidden;
    box-shadow: 0 20rpx 40rpx rgba(59, 130, 246, 0.16);
  }

  .practice_main_top,
  .practice_main_bottom {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 30rpx;
  }

  .practice_main_top .left_item,
  .practice_main_bottom .left_item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 32rpx;
    border-radius: 32rpx;
    background-size: cover;
    background-position: center;
    min-height: 220rpx;
  }

  .practice_main_top .right_item,
  .practice_main_bottom .right_item {
    display: flex;
    flex-direction: column;
    gap: 30rpx;
  }

  .practice_main_top .right_item_top,
  .practice_main_top .right_item_bottom,
  .practice_main_bottom .right_item_top,
  .practice_main_bottom .right_item_bottom {
    width: 100%;
    min-height: 164rpx;
    border-radius: 32rpx;
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 32rpx;
  }

  .prctice_main_end {
    width: 100%;
    min-height: 180rpx;
    border-radius: 32rpx;
    background-image: url(static/index/wrongs.png);
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12rpx;
    padding: 40rpx 32rpx;
  }

  .item_title {
    font-weight: 700;
    font-size: 32rpx;
    word-break: break-word;
  }

  .item_content,
  .item_score,
  .end_content {
    font-size: 24rpx;
    line-height: 1.4;
    word-break: break-word;
  }

  .end_title {
    font-weight: 700;
    font-size: 32rpx;
    word-break: break-word;
  }

  .practice_main_top .left_item {
    background-image: url(static/index/mock.png);
  }

  .practice_main_top .right_item_top {
    background-image: url(static/index/theory.png);
  }

  .practice_main_top .right_item_bottom {
    background-image: url(static/index/hazard.png);
  }

  .practice_main_bottom .left_item {
    background-image: url(static/index/highway.png);
  }

  .practice_main_bottom .right_item_top {
    background-image: url(static/index/theory.png);
  }

  .practice_main_bottom .right_item_bottom {
    background-image: url(static/index/hazard.png);
  }

  .practice_main_top .left_item {
    min-height: 360rpx;
  }

  .practice_main_bottom .left_item {
    min-height: 200rpx;
  }

  @media (min-width: 768px) {
    .container {
      padding: 0 12vw 6vh;
    }

    .practice_main_top,
    .practice_main_bottom {
      gap: 40rpx;
    }
  }
</style>
