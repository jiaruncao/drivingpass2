<template>
  <view class="app">
    <!-- 渐变背景 -->
    <view class="gradient-bg">
      <view class="gradient-top"></view>
      <view class="gradient-bottom"></view>
    </view>

    <!-- 头部导航 -->
    <view class="header">
      <view class="back-button" @tap="goBack">←</view>
      <text class="page-title">Your Records</text>
    </view>

    <!-- 滚动内容区域 -->
    <scroll-view class="container" scroll-y>
      <!-- 学员信息卡片 -->
      <view class="trainee-card fade-in">
        <view class="trainee-info">
          <view class="trainee-details">
            <text class="trainee-name">{{ info.nickname }}</text>
          </view>
          <view class="registration-date">
            <text class="trainee-label">Joined on: </text>
            <text style="margin-left: 16rpx;">{{ formatUKDate(info.register_time) }}</text>
          </view>
        </view>
        
        <view class="test-date-card">
          <view class="countdown-badge">
            <text class="countdown-text">{{ info.days_left.days }} days left</text>
          </view>
          <text class="test-date-number">{{ formatUKDate(info.test_date) }}</text>
          <text class="test-date-label">Test Date</text>
        </view>
      </view>

      <!-- AI 洞察卡片 -->
      <view class="ai-insight-card fade-in">
        <view class="ai-header">
          <text class="ai-icon">🤖</text>
          <text class="ai-title">AI Insight: <text style="margin-left: 20rpx;">Your Pass Rate</text></text>
          <text class="info-icon" @tap="showAIInfo">ⓘ</text>
        </view>
        
        <view class="pass-rate-container">
          <text class="pass-rate" :class="passRateClass">{{ info.pass_rate }}</text>
          <text class="percent-symbol" :class="passRateClass">%</text>
        </view>
        
        <view class="ai-message">
           Ahead of
          <span class="highlight-text">{{ info.ahead_of }}%</span>
           of learners—pass
          <span class="highlight-text">{{ info.pass_more }}%</span>
           more mocks in a row to reach 90%!
        </view>
      </view>

      <!-- 统计数据卡片 -->
      <view class="stats-grid fade-in">
        <view class="stat-card">
          <text class="stat-number">{{ info.completed }}</text>
          <text class="stat-label">Completed</text>
        </view>
        
        <view class="stat-card">
          <text class="stat-number" style="color: #4CAF50;">{{ info.passed }}</text>
          <text class="stat-label" style="color: #4CAF50;">Passed</text>
        </view>
        
        <view class="stat-card">
          <text class="stat-number">{{ formatScore(info.multiple_choice_score) }}</text>
          <text class="stat-label">Avg Score</text>
          <text class="stat-sublabel">Multiple Choice</text>
        </view>

        <view class="stat-card">
          <text class="stat-number">{{ formatScore(info.hazard_perception_score) }}</text>
          <text class="stat-label">Avg Score</text>
          <text class="stat-sublabel">Hazard Perception</text>
        </view>
      </view>

      <!-- 多选题成绩图表 -->
      <view class="chart-card fade-in">
        <text class="chart-title">Multiple Choice Score</text>
        <view class="chart-container" :style="chartContainerStyle">
          <canvas
            canvas-id="multipleChoiceChart"
            id="multipleChoiceChart"
            class="chart-canvas"
            :style="chartCanvasStyle"
            :width="chartPixelWidth"
            :height="chartPixelHeight">
          </canvas>
        </view>
      </view>

      <!-- 危险感知成绩图表 -->
      <view class="chart-card fade-in">
        <text class="chart-title">Hazard Perception Score</text>
        <view class="chart-container" :style="chartContainerStyle">
          <canvas
            canvas-id="hazardPerceptionChart"
            id="hazardPerceptionChart"
            class="chart-canvas"
            :style="chartCanvasStyle"
            :width="chartPixelWidth"
            :height="chartPixelHeight">
          </canvas>
        </view>
      </view>
    </scroll-view>

    <!-- AI信息模态框 -->
    <view v-if="showModal" class="modal-overlay" @tap="closeModal">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-icon">🤖</text>
          <view>
            <text class="modal-title">AI Insight</text>
          </view>
        </view>
        <text class="modal-body">Our AI-driven model leverages the database of past test results to analyse and predict a data-backed pass rate, so you know exactly where you stand.</text>
        <view class="modal-close" @tap="closeModal">
          <text class="modal-close-text">Got it</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// 引入图表库（如使用u-charts）
// import uCharts from '@/components/u-charts/u-charts.js';
import {getTestStatistics} from '@/http/api/testQuestions.js'
import {formatScore as formatScoreToOneDecimal} from '@/utils/number'
export default {
  data() {
    return {
      info: {
        days_left: {
          days: 0
        }
      },
      // 学员信息
      traineeInfo: {
        name: 'StormChaser',
        registrationDate: '2025-06-18'
      },
      // 考试日期
      testDate: {
        month: '06',
        day: '28'
      },
      daysLeft: 10,
      // AI洞察数据
      passRate: 79,
      comparisonPercent: 'XX',
      morePercent: 'XX',
      // 统计数据
      stats: {
        completed: 17,
        passed: 9,
        avgMultipleChoice: 71,
        avgHazardPerception: 82
      },
      // 模态框显示状态
      showModal: false,
      // 图表宽度
      chartWidth: 0,
      chartHeight: 0,
      chartPixelWidth: 0,
      chartPixelHeight: 0,
      devicePixelRatio: 1,
      chartScale: 1,
      // 图表数据
      multipleChoiceChartData: null,
      hazardPerceptionChartData: null,
      resizeListener: null
    }
  },
  computed: {
    // 根据pass rate计算颜色类
    passRateClass() {
      const rate = this.passRate;
      if (rate >= 90) return 'excellent';  // 绿色
      if (rate >= 75) return 'good';       // 浅绿色
      if (rate >= 60) return 'average';    // 黄色
      if (rate >= 50) return 'poor';       // 橙色
      return 'failing';                     // 红色
    },
    chartHeightUnit () {
      const fallbackHeight = 220;
      const effectiveHeight = this.chartHeight || fallbackHeight;
      return `${effectiveHeight}px`;
    },
    chartContainerStyle () {
      return {
        height: this.chartHeightUnit,
        minHeight: this.chartHeightUnit
      };
    },
    chartCanvasStyle () {
      return {
        width: '100%',
        height: '100%'
      };
    }
  },
  onLoad() {
    this.getTestStatistics()
    // 页面加载时初始化
    this.getSystemInfo();
    this.registerResizeListener();
    // #ifdef APP-PLUS
    plus.screen.lockOrientation('portrait-primary');
    // #endif
  },
  onUnload() {
    this.unregisterResizeListener();
  },
  onReady() {
    // 页面渲染完成后初始化图表
    this.$nextTick(() => {
      // this.initCharts();
    });
  },
  methods: {
    // 获取系统信息，设置图表尺寸
    getSystemInfo() {
      if (typeof uni.getSystemInfoSync !== 'function') {
        this.setChartDimensions(375, this.devicePixelRatio);
        return;
      }
      const systemInfo = uni.getSystemInfoSync();
      const pixelRatio = systemInfo.pixelRatio && systemInfo.pixelRatio > 0 ? systemInfo.pixelRatio : 1;
      this.setChartDimensions(systemInfo.windowWidth, pixelRatio);
    },

    setChartDimensions(windowWidth, pixelRatio = 1) {
      const parsedWidth = typeof windowWidth === 'number' ? windowWidth : parseFloat(windowWidth) || 0;
      const baseWidth = parsedWidth > 0 ? parsedWidth : 375;
      const cappedWidth = Math.min(baseWidth, 720);
      const sidePadding = Math.min(20, Math.max(12, baseWidth * 0.05));
      const horizontalPadding = sidePadding * 2;
      const rawWidth = cappedWidth - horizontalPadding;
      let availableWidth = rawWidth > 0 ? rawWidth : cappedWidth;
      const minWidth = Math.min(Math.max(rawWidth, 0), Math.min(cappedWidth, 140));
      if (availableWidth < minWidth) {
        availableWidth = minWidth;
      }
      availableWidth = Math.max(Math.min(availableWidth, cappedWidth), 1);

      const scale = Math.min(Math.max(baseWidth / 375, 0.65), 1.4);
      const minHeight = 160;
      const maxHeight = 320;
      const calculatedHeight = Math.min(Math.max(Math.round(220 * scale), minHeight), maxHeight);
      const effectiveRatio = pixelRatio > 0 ? pixelRatio : 1;

      this.chartScale = scale;
      this.chartWidth = Math.round(availableWidth);
      this.chartHeight = calculatedHeight;
      this.devicePixelRatio = effectiveRatio;
      this.chartPixelWidth = Math.max(Math.round(this.chartWidth * effectiveRatio), 1);
      this.chartPixelHeight = Math.max(Math.round(calculatedHeight * effectiveRatio), 1);
    },

    registerResizeListener() {
      if (typeof uni.onWindowResize !== 'function') {
        return;
      }
      this.resizeListener = res => {
        const nextWidth = res && res.size ? res.size.windowWidth : this.chartWidth;
        let nextPixelRatio = this.devicePixelRatio;
        if (typeof uni.getSystemInfoSync === 'function') {
          try {
            const latestInfo = uni.getSystemInfoSync();
            if (latestInfo && latestInfo.pixelRatio) {
              nextPixelRatio = latestInfo.pixelRatio;
            }
          } catch (error) {
            nextPixelRatio = this.devicePixelRatio;
          }
        }
        this.setChartDimensions(nextWidth, nextPixelRatio);
        this.redrawCharts();
      };
      uni.onWindowResize(this.resizeListener);
    },

    unregisterResizeListener() {
      if (typeof uni.offWindowResize !== 'function') {
        this.resizeListener = null;
        return;
      }
      if (this.resizeListener) {
        uni.offWindowResize(this.resizeListener);
        this.resizeListener = null;
      }
    },
    
    // 格式化为英国日期格式
    formatUKDate(dateString) {
      return this.$utils.formatDateToDDMMYYYY(dateString);
    },
    
    // 返回上一页
    goBack() {
      uni.navigateBack({
        delta: 1,
        fail: () => {
          // 如果没有上级页面，返回首页
          uni.switchTab({
            url: '/pages/index/index'
          });
        }
      });
    },
    
    // 显示AI信息模态框
    showAIInfo() {
      this.showModal = true;
    },
    
    // 关闭模态框
    closeModal() {
      this.showModal = false;
    },
    
    // 初始化图表
    initCharts() {
      
      
      // 初始化危险感知图表
      // this.drawLineChart('hazardPerceptionChart', {
      //   labels: ['09/05', '10/05', '11/05', '12/05', '13/05', '14/05', '15/05', '16/05', '17/05', '18/05'],
      //   data: [20, 95, 30, 20, 25, 10, 40, 48, 8, 50]
      // });
    },
    
    // 绘制折线图（简化版本，实际项目中应使用u-charts或其他图表库）
    drawLineChart(canvasId, chartData) {
      if (!chartData || !Array.isArray(chartData.data) || chartData.data.length === 0) {
        return;
      }

      const ctx = uni.createCanvasContext(canvasId, this);
      const ratio = this.devicePixelRatio > 0 ? this.devicePixelRatio : 1;
      const width = this.chartWidth || Math.round((this.chartPixelWidth || 0) / ratio);
      const fallbackHeight = this.chartHeight || Math.round((this.chartPixelHeight || 0) / ratio) || 220;
      const scaledWidth = Math.max(Math.round(width * ratio), 1);
      const scaledHeight = Math.max(Math.round(fallbackHeight * ratio), 1);
      ctx.clearRect(0, 0, scaledWidth, scaledHeight);

      const scaleFactor = this.chartScale || 1;
      const basePadding = Math.max(Math.round(28 * scaleFactor), 20);
      const paddingX = Math.min(basePadding, width / 2);
      const paddingY = Math.min(basePadding, fallbackHeight / 2);
      const graphWidth = width - paddingX * 2;
      const graphHeight = fallbackHeight - paddingY * 2;

      if (graphWidth <= 0 || graphHeight <= 0) {
        ctx.draw();
        return;
      }

      ctx.save();
      if (ratio !== 1) {
        ctx.scale(ratio, ratio);
      }

      const gridLineWidth = Math.max(scaleFactor, 0.5);
      ctx.setStrokeStyle('#E0E0E0');
      ctx.setLineWidth(gridLineWidth);

      for (let i = 0; i <= 5; i++) {
        const y = paddingY + (graphHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(paddingX, y);
        ctx.lineTo(width - paddingX, y);
        ctx.stroke();
      }

      const maxValue = 100;
      const minValue = 0;
      const range = maxValue - minValue;
      const dataLength = chartData.data.length;
      const xStep = dataLength > 1 ? graphWidth / (dataLength - 1) : 0;

      const dataLineWidth = Math.max(Math.round(2 * scaleFactor), 1);
      ctx.setStrokeStyle('#4A9EFF');
      ctx.setLineWidth(dataLineWidth);
      ctx.setFillStyle('rgba(74, 158, 255, 0.1)');

      ctx.beginPath();
      chartData.data.forEach((value, index) => {
        const x = paddingX + xStep * index;
        const y = paddingY + graphHeight - ((value - minValue) / range) * graphHeight;
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      ctx.lineTo(width - paddingX, fallbackHeight - paddingY);
      ctx.lineTo(paddingX, fallbackHeight - paddingY);
      ctx.closePath();
      ctx.fill();

      const pointRadius = Math.max(Math.round(4 * scaleFactor), 3);
      const pointBorder = Math.max(Math.round(2 * scaleFactor), 1);
      ctx.setFillStyle('#4A9EFF');
      chartData.data.forEach((value, index) => {
        const x = paddingX + xStep * index;
        const y = paddingY + graphHeight - ((value - minValue) / range) * graphHeight;

        ctx.beginPath();
        ctx.arc(x, y, pointRadius, 0, 2 * Math.PI);
        ctx.fill();

        ctx.setStrokeStyle('#FFFFFF');
        ctx.setLineWidth(pointBorder);
        ctx.stroke();

        ctx.setStrokeStyle('#4A9EFF');
        ctx.setLineWidth(dataLineWidth);
      });

      const axisFontSize = Math.max(Math.round(11 * scaleFactor), 10);
      const axisLabelOffset = Math.max(Math.round(6 * scaleFactor), 4);
      const xLabelBaseline = Math.max(Math.round(8 * scaleFactor), 6);

      ctx.setFillStyle('#999');
      ctx.setFontSize(axisFontSize);
      ctx.setTextAlign('center');

      const labelStep = Math.ceil(chartData.labels.length / 5) || 1;
      chartData.labels.forEach((label, index) => {
        if (index % labelStep === 0 || index === chartData.labels.length - 1) {
          const x = paddingX + xStep * index;
          const labelBaseline = fallbackHeight - Math.max(xLabelBaseline, paddingY * 0.4);
          ctx.fillText(label, x, labelBaseline);
        }
      });

      ctx.setTextAlign('right');
      for (let i = 0; i <= 5; i++) {
        const value = (maxValue / 5) * (5 - i);
        const y = paddingY + (graphHeight / 5) * i + axisLabelOffset;
        ctx.fillText(value.toString(), paddingX - axisLabelOffset, y);
      }

      ctx.restore();
      ctx.draw();
    },
    redrawCharts () {
      this.$nextTick(() => {
        if (this.multipleChoiceChartData) {
          this.drawLineChart('multipleChoiceChart', this.multipleChoiceChartData);
        }
        if (this.hazardPerceptionChartData) {
          this.drawLineChart('hazardPerceptionChart', this.hazardPerceptionChartData);
        }
      });
    },
    formatChartLabel (label) {
      if (!label) return '';
      const normalized = label.toString().replace(/[.]/g, '-').replace(/[\/]/g, '-');
      const segments = normalized.split('-').filter(Boolean);

      if (segments.length === 3) {
        if (segments[0].length === 4) {
          const [year, month, day] = segments;
          return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
        }
        if (segments[2].length === 4) {
          const [day, month, year] = segments;
          return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
        }
      }

      if (segments.length === 2) {
        const [day, month] = segments;
        const year = new Date().getFullYear().toString();
        return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
      }

      return label;
    },
    getTestStatistics () {
      getTestStatistics().then(res => {
        if (res.code == 1) {
          this.info = res.data.list
          const multipleChoiceLabels = Array.isArray(this.info.labels)
            ? this.info.labels.map(this.formatChartLabel)
            : []
          this.info.labels = multipleChoiceLabels

          this.multipleChoiceChartData = {
            labels: multipleChoiceLabels,
            data: Array.isArray(this.info.data) ? this.info.data : []
          }

          const hazardLabelsSource = Array.isArray(this.info.hazard_labels) && this.info.hazard_labels.length
            ? this.info.hazard_labels
            : ['09/05', '10/05', '11/05', '12/05', '13/05', '14/05', '15/05', '16/05', '17/05', '18/05']
          const hazardDataSource = Array.isArray(this.info.hazard_data) && this.info.hazard_data.length
            ? this.info.hazard_data
            : [20, 95, 30, 20, 25, 10, 40, 48, 8, 50]

          this.hazardPerceptionChartData = {
            labels: hazardLabelsSource.map(this.formatChartLabel),
            data: hazardDataSource
          }

          this.redrawCharts()
        }
      })
    },
    formatScore (score) {
      return formatScoreToOneDecimal(score)
    }

  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
/* 全局样式 */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  color: #333;
  background: #F8F9FA;
}

/* 渐变背景 */
.gradient-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 300px;
  z-index: 0;
}

.gradient-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(180deg, #E3F2FD 0%, #FFFFFF 100%);
}

.gradient-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%);
}

/* 头部导航 */
.header {
  padding: 15px 20px;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 10;
  background: transparent;
}

.back-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #666;
}

.page-title {
  flex: 1;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-right: 40px;
}

/* 滚动容器 */
.container {
  flex: 1;
  padding: 0 clamp(12px, 5vw, 20px) clamp(16px, 5vw, 24px);
  position: relative;
  z-index: 5;
  overflow-x: hidden;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  box-sizing: border-box;
}

/* 学员信息卡片 */
.trainee-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}

.trainee-info {
  flex: 1;
}

.trainee-details {
  display: flex;
  align-items: baseline;
  margin-bottom: 8px;
}

.trainee-label {
  font-size: 16px;
  color: #666;
}

.trainee-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.registration-date {
  font-size: 14px;
  color: #999;
}

.test-date-card {
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  border-radius: 16px;
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-width: 100px;
  box-sizing: border-box;
}

.countdown-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #FF6B6B;
  border-radius: 12px;
  padding: 4px 10px;
}

.countdown-text {
  color: white;
  font-size: 11px;
  font-weight: 600;
}

.test-date-number {
  color: white;
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 4px;
}

.test-date-label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
}

/* AI洞察卡片 */
.ai-insight-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

.ai-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.ai-icon {
  font-size: 20px;
  margin-right: 8px;
}

.ai-title {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.info-icon {
  font-size: 16px;
  color: #999;
}

.pass-rate-container {
  display: flex;
  align-items: baseline;
  margin-bottom: 15px;
}

.pass-rate {
  font-size: clamp(38px, 12vw, 48px);
  font-weight: 700;
}

/* Pass rate颜色根据分数动态改变 */
.pass-rate.excellent {
  color: #4CAF50;
}

.pass-rate.good {
  color: #8BC34A;
}

.pass-rate.average {
  color: #FFC107;
}

.pass-rate.poor {
  color: #FF9800;
}

.pass-rate.failing {
  color: #FF6B6B;
}

.percent-symbol {
  font-size: clamp(22px, 8vw, 30px);
  font-weight: 600;
  margin-left: 2px;
}

.percent-symbol.excellent {
  color: #4CAF50;
}

.percent-symbol.good {
  color: #8BC34A;
}

.percent-symbol.average {
  color: #FFC107;
}

.percent-symbol.poor {
  color: #FF9800;
}

.percent-symbol.failing {
  color: #FF6B6B;
}

.ai-message {
  font-size: 15px;
  color: #666;
  line-height: 1.5;
  // display: flex;
  // flex-wrap: wrap;
}

.highlight-text {
  font-weight: 600;
  color: #FF6B6B;
  padding: 0 10rpx;
  box-sizing: border-box;
}

/* 统计数据网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: clamp(16px, 4vw, 22px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}
.stat-number {
  display: block;
  font-size: clamp(24px, 5.5vw, 32px);
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  display: block;
  font-size: clamp(12px, 3.5vw, 14px);
  color: #666;
  margin-bottom: 2px;
}

.stat-sublabel {
  display: block;
  font-size: clamp(10px, 3vw, 12px);
  color: #999;
}

/* 图表卡片 */
.chart-card {
  background: white;
  border-radius: 20px;
  padding: clamp(18px, 4.5vw, 24px);
  margin-bottom: clamp(16px, 4vw, 24px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  box-sizing: border-box;
}

.chart-title {
  display: block;
  font-size: clamp(15px, 4vw, 18px);
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.chart-container {
  position: relative;
  width: 100%;
  min-height: 160px;
  margin-bottom: clamp(8px, 2vw, 16px);
  overflow: hidden;
}

.chart-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 25px;
  max-width: 380px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  animation: modalSlideIn 0.3s ease;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.modal-icon {
  font-size: 24px;
  margin-right: 12px;
  margin-top: 2px;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.modal-body {
  font-size: 15px;
  color: #666;
  line-height: 1.6;
}

.modal-close {
  margin-top: 25px;
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close-text {
  color: white;
  font-size: 16px;
  font-weight: 600;
}

/* 响应式优化 */
@media screen and (max-width: 375px) {
  .trainee-card {
    flex-direction: column;
    align-items: stretch;
  }
  
  .test-date-card {
    margin-top: 15px;
    align-self: center;
  }
  
  .pass-rate {
    font-size: 42px;
  }
  
  .stat-number {
    font-size: 28px;
  }
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.fade-in {
  animation: fadeIn 0.6s ease;
}
</style>