<template>
  <view class="app">
    <!-- 渐变背景 -->
    <view class="gradient-bg">
      <view class="gradient-top"></view>
      <view class="gradient-bottom"></view>
    </view>

    <!-- 搜索头部 -->
    <view class="search-header">
      <view class="search-bar-container">
        <view class="back-button" @tap="goBack">←</view>
        <view class="search-input-wrapper">
          <view class="search-icon">
            <u-icon name="search" size="40rpx"></u-icon>
          </view>
          <input 
            type="text" 
            class="search-input"
            v-model="searchQuery"
            @input="handleSearch"
            placeholder="Search questions..."
            focus
          />
          <button 
            class="clear-button"
            :class="{ show: searchQuery }"
            @tap="clearSearch"
          >
            ×
          </button>
        </view>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view class="search-container">
      <!-- 有搜索结果时显示 -->
      <view v-if="searchQuery && filteredResults.length > 0">
        <view class="results-title">
          Search Results
          <view v-if="isSearching" class="loading-spinner"></view>
        </view>
        
        <view class="results-list">
          <view 
            v-for="(result, index) in filteredResults" 
            :key="index"
            class="result-item fade-in"
            @tap="openQuestion(result)"
          >
            <view class="scq-badge">{{ result.kind }}</view>
            <view class="result-text" v-html="highlightText(result.title)"></view>
          </view>
        </view>
      </view>

      <!-- 无搜索结果时显示 -->
      <view v-else-if="searchQuery && filteredResults.length === 0 && !isSearching">
        <view class="empty-state">
          <view class="empty-icon">🔍</view>
          <view class="empty-title">No Results Found</view>
          <view class="empty-subtitle">Try searching with different keywords</view>
        </view>
      </view>

      <!-- 初始状态 -->
      <view v-else>
        <view class="empty-state">
          <view class="empty-icon">🔍</view>
          <view class="empty-title">Start Searching</view>
          <view class="empty-subtitle">Type keywords to search questions</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {searchApi} from '@/http/api/testQuestions.js'
export default {
  data() {
    return {
      // 搜索查询
      searchQuery: '',
      // 是否正在搜索
      isSearching: false,
      // 所有问题库
      allQuestions: [
        {
          type: 'SCQ',
          question: 'When the light switch is rotated to this position, all exterior lights activate',
          category: 'lights'
        },
        {
          type: 'SCQ',
          question: 'What lights should you use when driving on a sharp curve?',
          category: 'lights'
        },
        {
          type: 'SCQ',
          question: 'When should you use hazard warning lights?',
          category: 'lights'
        },
        {
          type: 'SCQ',
          question: 'What do amber traffic lights mean?',
          category: 'lights'
        },
        {
          type: 'SCQ',
          question: 'When must you use dipped headlights?',
          category: 'lights'
        },
        {
          type: 'SCQ',
          question: 'What should you do when you see flashing amber lights?',
          category: 'lights'
        },
        {
          type: 'MCQ',
          question: 'Which lights are required when parking at night?',
          category: 'lights'
        },
        {
          type: 'SCQ',
          question: 'How should you use fog lights?',
          category: 'lights'
        },
        {
          type: 'SCQ',
          question: 'What is the speed limit in a built-up area?',
          category: 'speed'
        },
        {
          type: 'SCQ',
          question: 'When should you signal before turning?',
          category: 'signals'
        }
      ],
      // 过滤后的结果
      filteredResults: [],
      // 防抖定时器
      searchTimer: null,
      // 搜索模块（用于匹配首页的几个主要功能入口）
      moduleEntries: [
        {
          id: 'module-theory-test',
          title: 'Theory Test',
          kind: 'Module',
          type: 'module',
          route: '/pages/modeSelect/index',
          params: {id: 2, title: 'TheoryTest'},
          keywords: ['theory test', 'theory', 'theorytest']
        },
        {
          id: 'module-hazard-test',
          title: 'Hazard Perception',
          kind: 'Module',
          type: 'module',
          route: '/pages/modeSelect/index',
          params: {id: 3, title: 'HazardTest'},
          keywords: ['hazard perception', 'hazard test', 'hazard', 'hazardperception']
        },
        {
          id: 'module-road-sign',
          title: 'Road Sign',
          kind: 'Module',
          type: 'module',
          route: '/pages/roadSign/roadSign',
          params: {id: 4},
          keywords: ['road sign', 'road signs', 'roadsign', 'roadsigns', 'signs']
        },
        {
          id: 'module-highway-code',
          title: 'Highway Code',
          kind: 'Module',
          type: 'module',
          route: '/pages/modeSelect/index',
          params: {id: 5, title: 'HighwayCode'},
          keywords: ['highway code', 'highway', 'code', 'highwaycode']
        }
      ]
    }
  },
  methods: {
    // 返回上一页
    goBack() {
      console.log('Going back to previous page');
      uni.navigateBack();
    },
    // 处理搜索输入
    handleSearch() {
      // 清除之前的定时器
      clearTimeout(this.searchTimer);
      
      // 如果搜索框为空，立即清空结果
      if (!this.searchQuery.trim()) {
        this.filteredResults = [];
        this.isSearching = false;
        return;
      }
      
      // 显示加载状态
      this.isSearching = true;
      
      // 防抖处理，300ms后执行搜索
      this.searchTimer = setTimeout(() => {
        this.performSearch();
      }, 300);
    },
    // 执行搜索
    performSearch() {
      const query = this.searchQuery.toLowerCase().trim();

      if (!query) {
        this.filteredResults = [];
        this.isSearching = false;
        return;
      }

      const moduleMatches = this.getModuleMatches(query);
      // 先展示本地匹配的模块结果
      this.filteredResults = moduleMatches;

      // 模拟搜索延迟
      searchApi({
        keyword: query
      }).then(res => {
        console.log(res)
        if (res.code == 1) {
          const listData = res && res.data && res.data.list && res.data.list.data;
          const remoteResults = Array.isArray(listData) ? listData : [];
          this.filteredResults = moduleMatches.concat(remoteResults);
        } else {
          this.filteredResults = moduleMatches;
        }
      }).catch(() => {
        this.filteredResults = moduleMatches;
      }).finally(() => {
        this.isSearching = false;
      })
    },
    // 清除搜索
    clearSearch() {
      this.searchQuery = '';
      this.filteredResults = [];
      this.isSearching = false;
    },
    // 高亮文本
    highlightText(text) {
      if (!text) return '';
      if (!this.searchQuery) return text;

      const query = this.escapeRegExp(this.searchQuery.trim());
      if (!query) return text;

      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, '<span class="highlight">$1</span>');
    },
    // 打开问题详情
    openQuestion(result) {
      console.log('Opening search result:', result);
      // 实际应用中导航到问题详情页
      // 可以传递问题ID或完整问题对象
      // uni.showToast({
      //   title: '打开问题详情',
      //   icon: 'none'
      // });

      if (result.type === 'module') {
        if (!result.route) return;

        let url = result.route;
        if (result.params && Object.keys(result.params).length > 0) {
          const queryString = Object.entries(result.params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
          url += (url.includes('?') ? '&' : '?') + queryString;
        }
        uni.navigateTo({url});
        return;
      }

      uni.navigateTo({
        url: '/pages/learnQuestion/detail?question_id=' + result.id
      })
    },
    getModuleMatches(query) {
      const normalizedQuery = query.toLowerCase();
      const condensedQuery = normalizedQuery.replace(/\s+/g, '');

      return this.moduleEntries.filter(entry => {
        const keywords = entry.keywords || [];
        return keywords.some(keyword => {
          const normalizedKeyword = keyword.toLowerCase();
          const condensedKeyword = normalizedKeyword.replace(/\s+/g, '');
          return (
            normalizedKeyword.includes(normalizedQuery) ||
            normalizedQuery.includes(normalizedKeyword) ||
            condensedKeyword.includes(condensedQuery) ||
            condensedQuery.includes(condensedKeyword)
          );
        }) || (entry.title && entry.title.toLowerCase().includes(normalizedQuery));
      }).map(entry => ({
        ...entry
      }));
    },
    escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
  },
  onLoad() {
    // 页面加载完成
    console.log('Search page loaded');
  }
}
</script>

<style lang="scss" scoped>
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
  overflow-x: hidden;
  background: #F8F9FA;
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

/* 搜索头部 */
.search-header {
  background: white;
  padding: 24rpx 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
  position: relative;
  z-index: 10;
}

.search-bar-container {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.back-button {
  background: none;
  border: none;
  color: #666;
  font-size: 40rpx;
  padding: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 80rpx;
}

.back-button:active {
  transform: scale(0.95);
}

.search-input-wrapper {
  flex: 1;
  position: relative;
}

.search-input {
  width: 100%;
  height: 100%;
  padding: 20rpx 80rpx 20rpx 70rpx;
  background: #F0F0F0;
  border: none;
  border-radius: 40rpx;
  font-size: 32rpx;
  color: #333;
  outline: none;
}

.search-input:focus {
  background: #E8E8E8;
}

.search-icon {
  position: absolute;
  left: 24rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 36rpx;
  height: 36rpx;
  color: #666;
  pointer-events: none;
}

.icon-search {
  width: 36rpx;
  height: 36rpx;
  border: 3rpx solid #666;
  border-radius: 50%;
  position: relative;
}

.icon-search::after {
  content: '';
  position: absolute;
  width: 12rpx;
  height: 3rpx;
  background: #666;
  transform: rotate(45deg);
  right: -8rpx;
  bottom: -8rpx;
}

.clear-button {
  position: absolute;
  right: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  background: #999;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.clear-button.show {
  opacity: 1;
  pointer-events: auto;
}

.clear-button:active {
  background: #666;
  transform: translateY(-50%) scale(0.9);
}

/* 搜索结果容器 */
.search-container {
  flex: 1;
  padding: 40rpx;
  position: relative;
  z-index: 10;
}

/* 搜索结果标题 */
.results-title {
  font-size: 40rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 40rpx;
  display: flex;
  align-items: center;
}

/* 搜索结果列表 */
.results-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

/* 搜索结果项 */
.result-item {
  background: white;
  border-radius: 24rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  gap: 24rpx;
}

.result-item:active {
  transform: scale(0.98);
  background: #F8F9FA;
}

/* SCQ标签 */
.scq-badge {
  padding: 8rpx 20rpx;
  background: #4A9EFF;
  color: white;
  border-radius: 12rpx;
  font-size: 24rpx;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 4rpx;
}

/* 结果文本 */
.result-text {
  flex: 1;
  font-size: 30rpx;
  line-height: 1.5;
  color: #333;
}

/* 高亮关键词 */

::v-deep .highlight {
  color: #FF6B6B;
  font-weight: 500;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 120rpx 40rpx;
}

.empty-icon {
  width: 160rpx;
  height: 160rpx;
  margin: 0 auto 40rpx;
  background: #F5F5F5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 72rpx;
}

.empty-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
}

.empty-subtitle {
  font-size: 28rpx;
  color: #999;
}

/* 加载状态 */
.loading-spinner {
  display: inline-block;
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid #F0F0F0;
  border-top-color: #4A9EFF;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-left: 20rpx;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 响应式优化 */
@media screen and (max-width: 375px) {
  .search-container {
    padding: 30rpx;
  }

  .result-item {
    padding: 24rpx;
  }

  .result-text {
    font-size: 28rpx;
  }
}

/* 淡入动画 */
.fade-in {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>