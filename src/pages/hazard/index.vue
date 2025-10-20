<template>
  <div class="hazard_main">
    <div class="top_nav">
      <div class="go_back" @click="goBack">
        <u-icon name="arrow-leftward" size="20"></u-icon>
      </div>
      <div class="head_name">Hazard</div>
      <div class="header_sum">Completed：21%</div>
    </div>
    <div class="hazard_list">
      <div
        class="list_item"
        v-for="(item, i) in hazardList"
        :key="i"
        :style="{ backgroundImage: 'url(' + item.img + ')' }"
      >
        <div class="item_progress">{{ item.progress }}%</div>
        <div class="item_name">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hazardList: [
        {
          name: "Category 1",
          progress: 20,
          img: "https://pic.rmb.bdstatic.com/bjh/bb83f4539e9/250121/c562345a7bb86f7d9d2d73714949c856.jpeg",
        },
        {
          name: "Category 2",
          progress: 30,
          img: "https://pic.rmb.bdstatic.com/bjh/bb83f4539e9/250121/c562345a7bb86f7d9d2d73714949c856.jpeg",
        },
        {
          name: "Category 3",
          progress: 40,
          img: "https://pic.rmb.bdstatic.com/bjh/bb83f4539e9/250121/c562345a7bb86f7d9d2d73714949c856.jpeg",
        },
        {
          name: "Category 4",
          progress: 50,
          img: "https://pic.rmb.bdstatic.com/bjh/bb83f4539e9/250121/c562345a7bb86f7d9d2d73714949c856.jpeg",
        },
      ],
    };
  },
  methods: {
    goBack() {
      uni.navigateBack({ delta: 1 });
    },
  },
};
</script>

<style lang="scss" scoped>
.hazard_main {
  .hazard_list {
    .list_item {
      width: calc(100% - 60rpx);
      margin: 30rpx;
      height: 293rpx;
      border-radius: 16rpx;
      background-size: 100% 100%;
      display: flex;
      .item_name {
        font-weight: bold;
        font-size: 28rpx;
        color: #ffffff;
        margin-top: 50rpx;
      }
      .item_progress {
        margin: 26rpx;
        width: 80rpx;
        height: 80rpx;
        background: #419fff;
        box-shadow: 0rpx 3rpx 9rpx 1rpx rgba(207, 207, 207, 0.99);
        border-radius: 50%;
        font-weight: 400;
        font-size: 28rpx;
        color: #ffffff;
        text-align: center;
        line-height: 80rpx;
      }
    }
  }
  .top_nav {
    padding: 60rpx 30rpx;
    display: flex;
    .header_sum {
      margin-left: auto;
    }
    .head_name {
      margin-top: -5rpx;
      margin-left: 28rpx;
      font-weight: 400;
      font-size: 28rpx;
      color: #333333;
    }
  }
}
</style>
