<template>
  <view class="app">
    <view class="gradient-bg">
      <view class="gradient-top"></view>
      <view class="gradient-bottom"></view>
    </view>

    <!-- 头部导航 -->
    <view class="header">
      <view class="back-button" @tap="goBack">
        <text class="back-arrow">←</text>
      </view>
      <text class="page-title">Choose Your Plan</text>
    </view>

    <!-- 主要内容 -->
    <view class="container">
      <!-- 当前计划状态 -->
      <view class="current-plan-card">
        <view class="current-plan-badge" :class="currentPlan.toLowerCase()">
          <text class="badge-text">
            {{ currentPlan === 'Free' ? 'FREE USER' : currentPlan.toUpperCase() + ' MEMBER' }}
          </text>
        </view>
        <text class="current-plan-name">{{ getCurrentPlanText() }}</text>
        <view class="current-plan-expiry" v-if="currentPlan !== 'Free'">
          <text v-if="priceType === 'lifetime'" class="expiry-text">
            Lifetime Access • Never Expires
          </text>
          <text v-else class="expiry-text">
            {{ currentPlanExpiry ? `Expires: ${currentPlanExpiry}` : 'Monthly Subscription' }}
          </text>
        </view>
        <view class="current-plan-expiry" v-else>
          <text class="limited-text">Limited access • Upgrade for full features</text>
        </view>
      </view>

      <!-- 价格卡片 -->
      <view class="pricing-cards">
        <view v-for="(item, index) in subscriptions" :key="index" class="pricing-card" :class="{
          'free': item.name == 'Free',
          'silver': item.name == 'Silver',
          'gold': item.name == 'Gold'
        }" @tap="doSelectedPlan(item)">
          <text class="pricing-plan-icon">
            {{item.icon}}
          </text>
          <text class="pricing-plan-name">
            {{item.name}}
          </text>
          <text class="pricing-plan-price" :class="{
            'gold-price': item.name == 'Gold'
          }">
            £{{item.price}}
          </text>
          <text class="pricing-plan-period">{{item.period}}</text>
        </view>

        <!-- <view class="pricing-card silver" @tap="selectedPlan = 'silver'">
          <text class="pricing-plan-icon">🥈</text>
          <text class="pricing-plan-name">Silver</text>
          <text class="pricing-plan-price">
            {{ priceType === 'monthly' ? '£7.99' : '£14.99' }}
          </text>
          <text class="pricing-plan-period">
            {{ priceType === 'monthly' ? 'per month' : 'lifetime' }}
          </text>
        </view>
        <view class="pricing-card gold recommended" @tap="selectedPlan = 'gold'">
          <text class="popular-badge">POPULAR</text>
          <text class="pricing-plan-icon">🏆</text>
          <text class="pricing-plan-name">Gold</text>
          <text class="pricing-plan-price gold-price">
            {{ priceType === 'monthly' ? '£9.99' : '£19.99' }}
          </text>
          <text class="pricing-plan-period">
            {{ priceType === 'monthly' ? 'per month' : 'lifetime' }}
          </text>
        </view> -->
      </view>

      <!-- 价格类型切换 -->
      <view class="price-toggle">
        <text class="price-toggle-label" :class="{active: priceType === 'monthly'}">Monthly</text>
        <view class="toggle-switch-wrapper" :class="priceType" @tap="togglePriceType">
          <view class="toggle-switch-bg"></view>
          <view class="toggle-switch-handle"></view>
        </view>
        <view class="price-toggle-label" :class="{active: priceType === 'lifetime'}">
          <text>Lifetime</text>
          <text class="save-badge">SAVE 80%</text>
        </view>
      </view>

      <!-- 全功能对比表 -->
      <view class="comparison-section">
        <text class="section-title">Complete Features Comparison</text>
        <view class="comparison-table">
          <view class="comparison-header">
            <text class="comparison-header-cell">Features</text>
            <text class="comparison-header-cell free">Free</text>
            <text class="comparison-header-cell silver">Silver</text>
            <text class="comparison-header-cell gold">Gold</text>
          </view>

          <!-- Theory Test 组 -->
          <view class="comparison-group" v-for="(item, index) in features_list_result" :key="index">
            <text class="comparison-group-title">📚 {{item.title}}</text>
            <view class="comparison-row" v-for="(jtem, idx) in item.features" :key="idx">
              <text class="comparison-feature">{{jtem.title}}</text>
              <text v-for="(otem, i) in jtem.value" :key="i" class="comparison-value" :class="{
                'comparison-check': otem == 'true',
                'comparison-cross': otem == 'false',
                'comparison-limited': otem != 'false' && otem != 'true',
              }">{{otem == 'true' ? '✓' : otem == 'false' ? '✗' : otem}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 固定底部按钮 -->
    <view class="subscribe-buttons">
      <!-- Silver用户显示升级到Gold的选项 -->
      <!-- <button 
        v-if="currentPlan === 'Silver'"
        class="subscribe-button gold primary"
        @tap="subscribeToPlan('gold')">
        Upgrade to Gold - {{ priceType === 'monthly' ? '£2/month extra' : '£5 one-time' }}
      </button> -->
      <!-- 其他用户显示两个选项 v-else-->
      <template>
        <button v-for="(plan, index) in showPayConfig" :key="index" class="subscribe-button"
          :class="[plan.features, {primary: selectedPlan === plan.features, current: currentPlan.toLowerCase() === plan.features}]"
          @tap="subscribeToPlan(plan)" :disabled="currentPlan.toLowerCase() === plan">
          {{ getButtonText(plan.features) }}
        </button>
      </template>
    </view>
  </view>
</template>

<script>
  import {
    getMemberOpenConfig,
    createMemberOrder,
    queryMemberInfo
  } from '@/http/api/login.js'
  export default {
    data() {
      return {
        userInfo: {},
        planList: {},
        // 当前用户的订阅计划
        currentPlan: 'Free',
        currentPlanExpiry: null,
        features_list_result: [],
        // 选中的计划和价格类型
        selectedPlan: 'silver',
        priceType: 'monthly', // monthly or lifetime

        // 计划信息
        plans: {
          free: {
            name: 'Free',
            icon: '🆓'
          },
          silver: {
            name: 'Silver',
            icon: '🥈',
            monthlyPrice: '£7.99',
            lifetimePrice: '£14.99'
          },
          gold: {
            name: 'Gold',
            icon: '🏆',
            monthlyPrice: '£9.99',
            lifetimePrice: '£19.99'
          }
        }
      }
    },
    computed: {
      // 计算到期文本
      expiryText() {
        if (this.currentPlanExpiry) {
          return `Expires: ${this.currentPlanExpiry}`;
        }
        return this.priceType === 'lifetime' ? 'Lifetime access' : '';
      },
      subscriptions () {
        if (this.priceType == 'lifetime') {
          return this.planList['lifetime']
        } else if (this.priceType == 'monthly') {
          return this.planList['monthly']
        }
        return []
      },
      showPayConfig () {
        if (this.subscriptions && this.subscriptions.length) {
          return this.subscriptions.filter(item => item.name != 'Free')
        }
        return []
      }
    },
    methods: {
      // 返回上一页
      goBack() {
        console.log('Navigate back');
        // 实际应用中调用导航API
        uni.navigateBack();
      },

      // 获取当前计划文本
      getCurrentPlanText() {
        if (this.currentPlan === 'Free') {
          return 'Upgrade to unlock all features';
        }
        return `You're on ${this.currentPlan} Plan`;
      },

      // 切换价格类型
      togglePriceType() {
        this.priceType = this.priceType === 'monthly' ? 'lifetime' : 'monthly';
      },

      // 获取按钮文本
      getButtonText(plan) {
        if (this.currentPlan.toLowerCase() === plan) {
          return 'Current Plan';
        }

        const textInfo = this.showPayConfig.filter(item => item.name.toLowerCase() == plan)[0]
        const planName = textInfo.name;
        const price = textInfo.price
        return `Get ${planName} - ${price}`;

      },

      // 订阅计划
      subscribeToPlan(plan) {
        console.log(plan)
        if (this.currentPlan.toLowerCase() === plan.features) {
          return;
        }

        this.selectedPlan = plan.features;

        console.log(`Subscribing to ${plan} plan`);
        console.log(`Price type: ${this.priceType}`);

        // 实际应用中调用支付API
        // this.initiatePayment(plan);

        this.createMemberOrder(plan.id)
      },

      // 初始化支付
      initiatePayment(plan) {
        let price;

        // 如果是Silver升级到Gold，显示差价
        if (this.currentPlan === 'Silver' && plan === 'gold') {
          price = this.priceType === 'monthly' ? '£2.00' : '£5.00';
          console.log(`Processing upgrade payment: ${price}`);
        } else {
          price = this.priceType === 'monthly' ?
            this.plans[plan].monthlyPrice :
            this.plans[plan].lifetimePrice;
          console.log(`Processing payment: ${price}`);
        }

        // 显示加载提示
        uni.showLoading({
          title: 'Processing...'
        });

        // 模拟支付成功
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({
            title: `Welcome to ${this.plans[plan].name} Plan! 🎉`,
            icon: 'success',
            duration: 2000
          });

          this.currentPlan = plan.charAt(0).toUpperCase() + plan.slice(1);

          if (this.priceType === 'monthly') {
            // 设置到期日期（30天后）
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 30);
            this.currentPlanExpiry = expiryDate.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });
          } else {
            this.currentPlanExpiry = null; // 终身版
          }
        }, 1000);
      },
      // 获取用户信息
      getUserInfo() {
        queryMemberInfo().then(res => {
          console.log(res)
          this.currentPlan = res.data.type
          this.currentPlanExpiry = res.data.expire_time
        })
      },
      // 获取会员开通配置
      getMemberOpenConfig() {
        // this.showPayConfig = []
        getMemberOpenConfig().then(res => {
          if (res.code == 1) {
            let data = []

            this.planList = this.processPlans(res.data)
            console.log(this.planList)
            // 处理features_list
            let features_list = []
            const free_features_list = res.data.filter(item => item.name == "Free" && item.days == 0)[0]
              .features_list
            features_list[0] = free_features_list
            const silver_features_list = res.data.filter(item => item.name == "Silver" && item.days == 0)[0]
              .features_list
            features_list[1] = silver_features_list
            const gold_features_list = res.data.filter(item => item.name == "Gold" && item.days == 0)[0]
              .features_list
            features_list[2] = gold_features_list

            this.features_list_result = this.transformFeatures(features_list);

          }
        })
      },
      // 选择会员
      doSelectedPlan(item) {
        this.selectedPlan = item.features
      },
      // 购买会员
      createMemberOrder(member_config_id) {
        createMemberOrder({
          member_config_id: member_config_id
        }).then(res => {
          console.log(res)
          // 拉起支付
          // #ifdef APP
          // 安卓
          if  (uni.getSystemInfoSync().platform == 'android') {
            uni.requestPayment({
              provider: 'google-pay',
              orderInfo: res.data, //微信、支付宝订单数据
              success: (res) => {
                console.log('success:' + JSON.stringify(res));
                // 支付成功后，更新用户状态
                this.getUserInfo()
              },
              fail: (err) => {
                console.log('fail:' + JSON.stringify(err));
              }
            });
          } else {
            // 苹果
            uni.requestPayment({
              provider: 'appleiap',
              orderInfo: {
                productid: member_config_id,
                username: '',
                quantity: 1
              }, //苹果订单数据
              success: (res) => {
                console.log('success:' + JSON.stringify(res));
                // 支付成功后，更新用户状态
                this.getUserInfo()
              },
              fail: (err) => {
                console.log('fail:' + JSON.stringify(err));
              }
            });
          }
          // #endif
        })
      },
      transformFeatures(arrays) {
        const result = [];

        // 获取所有类别
        const categories = arrays[0];

        // 遍历每个类别
        for (let category of categories) {
          const transformedCategory = {
            title: category.title.trim(), // 去除多余空格
            features: []
          };

          // 获取该类别中的所有特征键
          const featureKeys = Object.keys(category.features);

          // 为每个特征创建对象
          for (let key of featureKeys) {
            const featureValues = arrays.map(array => {
              // 找到对应的类别
              const foundCategory = array.find(item => item.title.trim() === category.title.trim());
              if (foundCategory && foundCategory.features.hasOwnProperty(key)) {
                const value = foundCategory.features[key];
                // 转换字符串为适当类型
                // if (value === "true") return true;
                // if (value === "false") return false;
                // if (!isNaN(value)) return Number(value); // 转换为数字
                return value; // 保持字符串
              }
              return null; // 如果没有找到，返回null
            });

            transformedCategory.features.push({
              title: key,
              value: featureValues
            });
          }

          result.push(transformedCategory);
        }

        return result;
      },
      processPlans(data) {
        const result = {
          monthly: [], // 包月计划 (days !== 0)
          lifetime: [] // 长期计划 (days === 0)
        };

        // 定义图标映射
        const icons = {
          'Free': '🆓',
          'Silver': '🥈',
          'Gold': '🏆'
        };

        // 先找到Free计划
        let freePlan = null;

        // 遍历所有计划
        data.forEach(plan => {
          // 提取除了 features_list 之外的所有字段
          const {
            features_list,
            ...planData
          } = plan;

          // 添加icon字段
          planData.icon = icons[plan.name] || '';

          // 如果是Free计划，保存一份副本
          if (plan.name === "Free") {
            freePlan = {
              ...planData
            };
          }

          // 根据 days 的值分类
          if (plan.days === 0) {
            result.lifetime.push(planData);
          } else {
            result.monthly.push(planData);
          }
        });

        // 如果找到了Free计划，复制一份到monthly数组中
        if (freePlan) {
          // 创建一个新的Free计划副本，保持days为0（因为是免费版）
          const freeCopy = {
            ...freePlan
          };
          result.monthly.push(freeCopy);
        }
        const order = { 'Free': 1, 'Silver': 2, 'Gold': 3 };
        // 对monthly数组按照指定顺序排序：Free → Silver → Gold
        result.monthly.sort((a, b) => {
          return order[a.name] - order[b.name];
        });
        result.lifetime.sort((a, b) => {
          return order[a.name] - order[b.name];
        });
        return result;
      }
    },
    onLoad() {
      this.getUserInfo()
      this.getMemberOpenConfig()
    }
  }
</script>

<style lang="scss">
  /* 全局重置样式 */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
    color: #333;
  }

  /* 渐变背景 */
  .gradient-bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
  }

  .gradient-top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 45%;
    background: linear-gradient(180deg, #E3F2FD 0%, #FFFFFF 100%);
  }

  .gradient-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 55%;
    background: linear-gradient(180deg, #FFFFFF 0%, #FFF4F4 100%);
  }

  /* Header 样式 */
  .header {
    padding: 30rpx 40rpx;
    display: flex;
    align-items: center;
    background: transparent;
    position: relative;
    z-index: 10;
    min-height: 120rpx;
  }

  .back-button {
    background: none;
    border: none;
    padding: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80rpx;
    height: 80rpx;
  }

  .back-arrow {
    color: #666;
    font-size: 40rpx;
  }

  .page-title {
    font-size: 48rpx;
    font-weight: 600;
    color: #333;
    flex: 1;
    text-align: center;
    margin-right: 80rpx;
  }

  /* 容器 */
  .container {
    flex: 1;
    padding: 40rpx;
    position: relative;
    z-index: 10;
    padding-bottom: 200rpx;
  }

  /* 当前计划卡片 */
  .current-plan-card {
    background: white;
    border-radius: 40rpx;
    padding: 40rpx;
    margin-bottom: 50rpx;
    box-shadow: 0 16rpx 50rpx rgba(0, 0, 0, 0.08);
    text-align: center;
  }

  .current-plan-badge {
    display: inline-block;
    padding: 12rpx 24rpx;
    border-radius: 24rpx;
    margin-bottom: 20rpx;
  }

  .badge-text {
    font-size: 24rpx;
    color: #666;
  }

  .current-plan-badge.free {
    background: #F5F5F5;
  }

  .current-plan-badge.free .badge-text {
    color: #999;
  }

  .current-plan-badge.silver {
    background: linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%);
  }

  .current-plan-badge.silver .badge-text {
    color: white;
  }

  .current-plan-badge.gold {
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  }

  .current-plan-badge.gold .badge-text {
    color: white;
  }

  .current-plan-name {
    font-size: 44rpx;
    font-weight: 600;
    margin-bottom: 16rpx;
    display: block;
  }

  .current-plan-expiry {
    display: block;
  }

  .expiry-text {
    font-size: 28rpx;
    color: #666;
  }

  .limited-text {
    font-size: 28rpx;
    color: #FF6B6B;
  }

  /* 价格卡片组 */
  .pricing-cards {
    display: flex;
    gap: 24rpx;
    margin-bottom: 50rpx;
    overflow-x: auto;
    padding-bottom: 10rpx;
  }

  .pricing-card {
    flex: 1;
    min-width: 200rpx;
    background: white;
    border-radius: 32rpx;
    padding: 32rpx 24rpx;
    text-align: center;
    box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.06);
    position: relative;
    overflow: hidden;
  }

  .pricing-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6rpx;
  }

  .pricing-card.free::before {
    background: #E0E0E0;
  }

  .pricing-card.silver::before {
    background: linear-gradient(90deg, #C0C0C0 0%, #A8A8A8 100%);
  }

  .pricing-card.gold::before {
    background: linear-gradient(90deg, #FFD700 0%, #FFA500 100%);
  }

  .pricing-card.recommended {
    transform: scale(1.05);
    box-shadow: 0 16rpx 50rpx rgba(74, 158, 255, 0.2);
    animation: pulse 2s infinite;
  }

  .popular-badge {
    position: absolute;
    top: 16rpx;
    right: -40rpx;
    background: #FF6B6B;
    color: white;
    font-size: 18rpx;
    padding: 4rpx 40rpx;
    transform: rotate(45deg);
    font-weight: 600;
  }

  .pricing-plan-icon {
    font-size: 48rpx;
    margin-bottom: 16rpx;
    display: block;
  }

  .pricing-plan-name {
    font-size: 32rpx;
    font-weight: 600;
    margin-bottom: 8rpx;
    display: block;
  }

  .pricing-plan-price {
    font-size: 36rpx;
    font-weight: 700;
    color: #4A9EFF;
    margin-bottom: 4rpx;
    display: block;
  }

  .pricing-card.free .pricing-plan-price {
    color: #999;
  }

  .pricing-card.silver .pricing-plan-price {
    color: #808080;
  }

  .pricing-plan-price.gold-price {
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .pricing-plan-period {
    font-size: 20rpx;
    color: #999;
    display: block;
  }

  /* 价格切换 */
  .price-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24rpx;
    margin-bottom: 40rpx;
    padding: 24rpx;
    background: white;
    border-radius: 32rpx;
    box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.06);
  }

  .price-toggle-label {
    font-size: 28rpx;
    color: #666;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10rpx;
  }

  .price-toggle-label.active {
    color: #4A9EFF;
    font-weight: 600;
  }

  .toggle-switch-wrapper {
    position: relative;
    width: 112rpx;
    height: 60rpx;
  }

  .toggle-switch-bg {
    width: 100%;
    height: 100%;
    background: #4A9EFF;
    border-radius: 30rpx;
  }

  .toggle-switch-handle {
    position: absolute;
    width: 48rpx;
    height: 48rpx;
    background: white;
    border-radius: 50%;
    top: 6rpx;
    left: 6rpx;
    transition: transform 0.3s;
    box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.2);
  }

  .toggle-switch-wrapper.lifetime .toggle-switch-handle {
    transform: translateX(52rpx);
  }

  .save-badge {
    display: inline-block;
    padding: 6rpx 16rpx;
    background: #4CAF50;
    color: white;
    border-radius: 16rpx;
    font-size: 20rpx;
    font-weight: 600;
    margin-left: 10rpx;
  }

  /* 对比表格 - 增强对比度 */
  .comparison-section {
    background: white;
    border-radius: 40rpx;
    padding: 40rpx 30rpx;
    box-shadow: 0 16rpx 50rpx rgba(0, 0, 0, 0.08);
    margin-bottom: 40rpx;
  }

  .section-title {
    font-size: 36rpx;
    font-weight: 600;
    margin-bottom: 40rpx;
    text-align: center;
    color: #333;
    display: block;
  }

  .comparison-table {
    width: 100%;
  }

  .comparison-header {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
    gap: 16rpx;
    padding-bottom: 30rpx;
    border-bottom: 4rpx solid #F0F0F0;
    margin-bottom: 16rpx;
    position: sticky;
    top: 0;
    background: white;
    z-index: 5;
  }

  .comparison-header-cell {
    font-size: 26rpx;
    font-weight: 700;
    text-align: center;
    padding: 10rpx;
  }

  .comparison-header-cell:first-child {
    text-align: left;
    font-weight: 600;
    color: #666;
  }

  /* 增强对比度的标题颜色 */
  .comparison-header-cell.free {
    color: #999;
  }

  .comparison-header-cell.silver {
    color: #606060;
    font-weight: 800;
  }

  .comparison-header-cell.gold {
    color: #FF8C00;
    font-weight: 800;
  }

  .comparison-group {
    margin-bottom: 30rpx;
  }

  .comparison-group-title {
    font-size: 24rpx;
    font-weight: 600;
    color: #4A9EFF;
    text-transform: uppercase;
    letter-spacing: 1rpx;
    padding: 16rpx 0;
    margin-top: 20rpx;
    border-bottom: 2rpx solid #E8F2FF;
    display: block;
  }

  .comparison-row {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
    gap: 16rpx;
    padding: 20rpx 0;
    border-bottom: 2rpx solid #F8F8F8;
    align-items: center;
  }

  .comparison-row:last-child {
    border-bottom: none;
  }

  .comparison-feature {
    font-size: 26rpx;
    color: #333;
    font-weight: 500;
    padding-right: 10rpx;
  }

  .comparison-value {
    text-align: center;
    font-size: 24rpx;
    color: #666;
    padding: 8rpx;
  }

  /* 增强对比度的值样式 */
  .comparison-check {
    color: #4CAF50;
    font-size: 36rpx;
    font-weight: bold;
  }

  .comparison-cross {
    color: #E0E0E0;
    font-size: 36rpx;
  }

  .comparison-limited {
    color: #999;
    font-size: 22rpx;
    font-weight: 500;
  }

  .comparison-unlimited {
    color: #4CAF50;
    font-size: 22rpx;
    font-weight: 600;
  }

  .comparison-exclusive {
    color: #FF8C00;
    font-size: 22rpx;
    font-weight: 700;
  }

  /* Free列特殊样式 - 更淡的显示 */
  .comparison-row>.comparison-value:nth-child(2) {
    opacity: 0.6;
  }

  /* Gold列特殊样式 - 更强的显示 */
  .comparison-row>.comparison-value:nth-child(4) {
    font-weight: 600;
  }

  /* 订阅按钮组 */
  .subscribe-buttons {
    display: flex;
    gap: 20rpx;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 30rpx 40rpx 50rpx;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 20%, white 100%);
    z-index: 20;
  }

  .subscribe-button {
    flex: 1;
    padding: 28rpx;
    background: white;
    color: #333;
    border: 4rpx solid #E0E0E0;
    border-radius: 40rpx;
    font-size: 28rpx;
    font-weight: 600;
    text-align: center;
  }

  .subscribe-button.primary {
    background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
    color: white;
    border: none;
    box-shadow: 0 12rpx 40rpx rgba(74, 158, 255, 0.35);
  }

  .subscribe-button.silver.primary {
    background: linear-gradient(135deg, #808080 0%, #606060 100%);
    box-shadow: 0 12rpx 40rpx rgba(128, 128, 128, 0.35);
  }

  .subscribe-button.gold.primary {
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    box-shadow: 0 12rpx 40rpx rgba(255, 215, 0, 0.35);
  }

  .subscribe-button.current {
    background: #F5F5F5;
    color: #999;
    border-color: #F0F0F0;
  }

  .subscribe-button:active:not(.current) {
    transform: scale(0.98);
  }

  /* 响应式设计 */
  @media screen and (max-width: 375px) {
    .container {
      padding: 30rpx;
    }

    .comparison-header,
    .comparison-row {
      font-size: 22rpx;
    }

    .comparison-feature {
      font-size: 24rpx;
    }

    .pricing-card {
      min-width: 180rpx;
    }
  }

  /* 动画效果 */
  @keyframes pulse {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.05);
    }

    100% {
      transform: scale(1);
    }
  }
</style>