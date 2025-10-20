<template>
  <view class="app">
    <!-- 渐变背景 -->
    <view class="gradient-bg">
      <view class="gradient-top"></view>
      <view class="gradient-bottom"></view>
    </view>

    <!-- Header导航栏 -->
    <view class="header">
      <view class="header-left">
        <view class="back-button" @tap="goBack">←</view>
        <text class="header-title">Create Post</text>
      </view>
      <view class="header-right">
        <view class="post-button" :class="{active: canPost}" @tap="publishPost">
          Post
        </view>
      </view>
    </view>

    <!-- 主内容容器 -->
    <view class="container">
      <!-- 媒体上传区域 -->
      <view class="media-section">
        <view class="media-grid">
          <!-- 已上传的图片 -->
          <view v-for="(image, index) in uploadedImages" :key="'img-' + index" class="media-item">
            <image :src="image" class="uploaded-image" mode="aspectFill"></image>
            <view class="remove-button" @tap="removeImage(index)">×</view>
          </view>

          <!-- 添加照片按钮 -->
          <view v-if="uploadedImages.length < maxImages" class="media-item add-media" @tap="triggerPhotoUpload">
            <view class="add-icon">📷</view>
            <text class="add-label">Add Photo</text>
          </view>

          <!-- 添加视频按钮 -->
          <view v-if="!uploadedVideo && uploadedImages.length === 0" class="media-item add-media"
            @tap="triggerVideoUpload">
            <view class="add-icon">📹</view>
            <text class="add-label">Add Video</text>
          </view>
        </view>

        <!-- 已上传的视频 -->
        <view v-if="uploadedVideo" class="video-preview">
          <video :src="uploadedVideo" class="uploaded-video" controls></video>
          <view class="remove-button" @tap="removeVideo">×</view>
        </view>
      </view>

      <!-- 内容输入区域 -->
      <view class="content-section">
        <textarea class="content-input" v-model="postContent"
          placeholder="Share your driving tips & experiences!&#10;Posts with 50+ words get priority recommendation!"
          @input="onContentInput" :maxlength="maxContentLength"></textarea>
        <view class="word-count">
          <text :class="{highlight: wordCount >= 50}">{{ wordCount }} words</text>
          <text class="count-divider">/</text>
          <text>{{ characterCount }}/{{ maxContentLength }}</text>
        </view>
      </view>

      <!-- 选项卡片 -->
      <view class="options-card">
        <!-- 选择分类 -->
        <view class="option-item" @tap="selectCategory">
          <view class="option-left">
            <view class="option-icon">🏷️</view>
            <text class="option-label">Category <text style="color: #FF6B6B;">*</text></text>
          </view>
          <view class="option-right">
            <text class="option-value" :style="{color: selectedCategories.length === 0 ? '#FF6B6B' : '#666'}">
              {{ selectedCategoryNames }}
            </text>
            <text class="arrow">›</text>
          </view>
        </view>

        <!-- 添加标签 -->
        <view class="option-item" @tap="addTags">
          <view class="option-left">
            <text class="option-icon icon-text">#</text>
            <text class="option-label">Add tags</text>
          </view>
          <view class="option-right">
            <view v-if="selectedTags.length > 0" class="tags-preview">
              <text v-for="(tag, index) in selectedTags.slice(0, 2)" :key="index" class="tag-preview">
                #{{ tag }}
              </text>
              <text v-if="selectedTags.length > 2" class="more-tags">+{{ selectedTags.length - 2 }}</text>
            </view>
            <text v-else class="option-value">Optional</text>
            <text class="arrow">›</text>
          </view>
        </view>

        <!-- 选择考试中心 -->
        <view class="option-item" @tap="selectTestCentre">
          <view class="option-left">
            <view class="option-icon">📍</view>
            <text class="option-label">Test Centre</text>
          </view>
          <view class="option-right">
            <text class="option-value">{{ selectedTestCentreName || 'Optional' }}</text>
            <text class="arrow">›</text>
          </view>
        </view>
      </view>

      <!-- 发布提示 -->
      <view class="tips-section">
        <view class="tips-title">Posting Tips:</view>
        <view class="tips-list">
          <view class="tip-item">
            <text class="tip-dot">•</text>
            <text class="tip-text">Share genuine experiences and helpful tips</text>
          </view>
          <view class="tip-item">
            <text class="tip-dot">•</text>
            <text class="tip-text">Posts with 50+ words get better visibility</text>
          </view>
          <view class="tip-item">
            <text class="tip-dot">•</text>
            <text class="tip-text">Add relevant tags to reach more learners</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 分类选择弹窗 -->
    <view v-if="showCategoryPicker" class="modal-backdrop" @tap="closeCategoryPicker">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">Select Categories (Required)</text>
          <view class="close-button" @tap="closeCategoryPicker">×</view>
        </view>
        <scroll-view class="category-list" scroll-y>
          <view v-for="category in categories" :key="category.id" class="category-option"
            :class="{selected: selectedCategories.includes(category.id)}" @tap="toggleCategory(category.id)">
            <!-- <text class="category-icon">{{ category.icon }}</text> -->
            <text class="category-name">{{ category.category }}</text>
            <text v-if="selectedCategories.includes(category.id)" class="check-icon">✓</text>
          </view>
        </scroll-view>
        <view class="modal-footer">
          <view class="confirm-button" @tap="confirmCategories" :class="{disabled: selectedCategories.length === 0}">
            Select {{ selectedCategories.length > 0 ? `(${selectedCategories.length})` : '' }}
          </view>
        </view>
      </view>
    </view>

    <!-- 标签选择弹窗 -->
    <view v-if="showTagPicker" class="modal-backdrop" @tap="closeTagPicker">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">Add Tags</text>
          <view class="close-button" @tap="closeTagPicker">×</view>
        </view>

        <!-- 自定义标签输入 -->
        <view class="custom-tag-input">
          <input type="text" v-model="customTag" placeholder="Create custom tag" class="tag-input"
            @confirm="addCustomTag" />
          <view class="add-tag-button" @tap="addCustomTag">Add</view>
        </view>

        <!-- 已选标签 -->
        <view v-if="selectedTags.length > 0" class="selected-tags">
          <view v-for="(tag, index) in selectedTags" :key="index" class="selected-tag" @tap="removeTag(index)">
            <text>#{{ tag }}</text>
            <text class="remove-tag">×</text>
          </view>
        </view>

        <!-- 热门标签 -->
        <view class="popular-tags" v-if="popularTags.length">
          <text class="section-title">Popular Tags</text>
          <view class="tags-grid">
            <view v-for="(item, index) in popularTags" :key="index" class="popular-tag"
              :class="{selected: selectedTags.includes(item.tag)}" @tap="toggleTag(item)">
              #{{ item.tag }}
            </view>
          </view>
        </view>

        <view class="modal-footer">
          <view class="confirm-button" @tap="confirmTags">Done</view>
        </view>
      </view>
    </view>

    <!-- 考试中心选择弹窗 -->
    <view v-if="showTestCentrePicker" class="modal-backdrop" @tap="closeTestCentrePicker">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">Select Test Centre</text>
          <view class="close-button" @tap="closeTestCentrePicker">×</view>
        </view>
        <scroll-view class="category-list" scroll-y>
          <view class="category-option" @tap="clearTestCentre">
            <text class="category-name">None (Clear selection)</text>
            <text v-if="!selectedTestCentre" class="check-icon">✓</text>
          </view>
          <view v-for="(centre, index) in testCentres" :key="index" class="category-option"
            :class="{selected: selectedTestCentre === centre.id}" @tap="chooseTestCentre(centre)">
            <text class="category-name">{{ centre.name }}</text>
            <text v-if="selectedTestCentre === centre.id" class="check-icon">✓</text>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    addTag,
    queryTags,
    getCenterIndex,
    createPost,
    queryPostCategory
  } from '@/http/api/community.js'
  import {
    upload
  } from '@/utils/index'
  export default {
    data() {
      return {
        // 帖子内容
        postContent: '',
        wordCount: 0,
        characterCount: 0,
        maxContentLength: 1000,

        // 媒体文件
        uploadedImages: [],
        uploadedVideo: '',
        maxImages: 9,

        // 选项
        selectedCategories: [], // 支持多选
        selectedTags: [],
        selectedTagsIds: [],
        selectedTestCentre: null, // 可选项
        selectedTestCentreName: '',
        customTag: '',

        // UI状态
        showCategoryPicker: false,
        showTagPicker: false,
        showTestCentrePicker: false,

        // 分类数据
        categories: [],

        // 热门标签
        popularTags: [],

        // 考试中心列表
        testCentres: []
      }
    },
    computed: {
      // 是否可以发布
      canPost() {
        // 必须有内容或媒体，且必须选择至少一个分类
        return (this.postContent.trim().length > 0 ||
            this.uploadedImages.length > 0 ||
            this.uploadedVideo) &&
          this.selectedCategories.length > 0;
      },

      // 获取选中的分类名称
      selectedCategoryNames() {
        if (this.selectedCategories.length === 0) {
          return 'Select (Required)';
        }
        const names = this.selectedCategories.map(id => {
          const category = this.categories.find(c => c.id === id);
          return category ? category.category : '';
        }).filter(name => name);

        if (names.length <= 2) {
          return names.join(', ');
        } else {
          return `${names.slice(0, 2).join(', ')} +${names.length - 2}`;
        }
      }
    },
    methods: {
      // 返回上一页
      goBack() {
        if (this.canPost) {
          uni.showModal({
            title: 'Discard post?',
            content: 'Your post will not be saved.',
            success: (res) => {
              if (res.confirm) {
                uni.navigateBack();
              }
            }
          });
        } else {
          uni.navigateBack();
        }
      },

      // 发布帖子
      publishPost() {
        if (!this.canPost) {
          if (this.selectedCategories.length === 0) {
            uni.showToast({
              title: 'Please select category',
              icon: 'none'
            });
          } else {
            uni.showToast({
              title: 'Please add content',
              icon: 'none'
            });
          }
          return;
        }
        // 构建帖子数据
        // 处理this.uploadedImages，this.uploadedVideo
        const uploadedImages = this.uploadedImages.length ? this.uploadedImages.join(',') : null
        const postData = {
          content: this.postContent,
          "photo_url": uploadedImages,
          "video_url": this.uploadedVideo,
          category_id: this.selectedCategories.join(','),
          tag_ids: this.selectedTagsIds.join(','),
          room_id: this.selectedTestCentre,
          ip: ''
        };
        
        console.log(postData)
        
        // return false
        createPost(postData).then(res => {
          if (res.code == 1) {
            // 模拟发布成功
            uni.showToast({
              title: 'Posted successfully!',
              icon: 'success'
            });
            
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          }
        })
      },

      // 内容输入处理
      onContentInput(e) {
        const content = e.detail.value;
        this.postContent = content;
        this.characterCount = content.length;
        // 计算单词数
        this.wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
      },

      // 触发照片上传
      triggerPhotoUpload() {
        const remainingSlots = this.maxImages - this.uploadedImages.length;
        uni.chooseImage({
          count: remainingSlots,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success: async (res) => {
            const filePath = res.tempFilePaths[0]
            const urlRes = await this.$utils.upload(filePath)
            if (urlRes.code == 1) {
              this.uploadedImages.push(urlRes.data.fullurl)
            }
            console.log(this.uploadedImages)
            // this.uploadedImages = [...this.uploadedImages, ...res.tempFilePaths];
          }
        });
      },

      // 触发视频上传
      triggerVideoUpload() {
        uni.chooseVideo({
          sourceType: ['album', 'camera'],
          maxDuration: 60,
          camera: 'back',
          success: async (res) => {
            // this.uploadedVideo = res.tempFilePath;
            const filePath = res.tempFilePath
            const urlRes = await this.$utils.upload(filePath)
            if (urlRes.code == 1) {
              this.uploadedVideo = urlRes.data.fullurl
            }
          }
        });
      },

      // 移除图片
      removeImage(index) {
        this.uploadedImages.splice(index, 1);
      },

      // 移除视频
      removeVideo() {
        this.uploadedVideo = '';
      },

      // 选择分类
      selectCategory() {
        this.showCategoryPicker = true;
      },

      // 切换分类选择（多选）
      toggleCategory(categoryId) {
        const index = this.selectedCategories.indexOf(categoryId);
        if (index > -1) {
          this.selectedCategories.splice(index, 1);
        } else {
          this.selectedCategories.push(categoryId);
        }
      },

      // 确认分类选择
      confirmCategories() {
        if (this.selectedCategories.length === 0) {
          uni.showToast({
            title: 'Select at least one',
            icon: 'none'
          });
          return;
        }
        this.showCategoryPicker = false;
      },

      // 关闭分类选择器
      closeCategoryPicker() {
        this.showCategoryPicker = false;
      },

      // 添加标签
      addTags() {
        this.showTagPicker = true;
      },

      // 添加自定义标签
      addCustomTag() {
        if (this.customTag.trim() && !this.selectedTags.includes(this.customTag.trim())) {
          addTag({
            tag: this.customTag.trim()
          }).then(res => {
            if (res.code == 1) {
              this.customTag = '';
              this.queryTags()
            }
          })
        }
      },

      // 切换标签选择
      toggleTag(item) {
        const index = this.selectedTags.indexOf(item.tag);
        const idIndex = this.selectedTagsIds.indexOf(item.id)
        if (index > -1) {
          this.selectedTags.splice(index, 1);
          this.selectedTagsIds.splice(index, 1);
        } else {
          if (this.selectedTags.length < 5) {
            this.selectedTags.push(item.tag);
            this.selectedTagsIds.push(item.id);
          } else {
            uni.showToast({
              title: 'Maximum 5 tags',
              icon: 'none'
            });
          }
        }
      },

      // 移除标签
      removeTag(index) {
        this.selectedTags.splice(index, 1);
        this.selectedTagsIds.splice(index, 1);
      },

      // 确认标签
      confirmTags() {
        this.showTagPicker = false;
      },

      // 关闭标签选择器
      closeTagPicker() {
        this.showTagPicker = false;
      },

      // 选择考试中心
      selectTestCentre() {
        this.showTestCentrePicker = true;
      },

      // 选择具体考试中心
      chooseTestCentre(centre) {
        this.selectedTestCentre = centre.id;
        this.selectedTestCentreName = centre.name;
        this.showTestCentrePicker = false;
      },

      // 清除考试中心选择
      clearTestCentre() {
        this.selectedTestCentre = null;
        this.selectedTestCentreName = '';
        this.showTestCentrePicker = false;
      },

      // 关闭考试中心选择器
      closeTestCentrePicker() {
        this.showTestCentrePicker = false;
      },

      // 查询标签
      queryTags() {
        queryTags().then(res => {
          console.log(res)
          this.popularTags = res.data.list
        })
      },

      // 查询考场
      getCenterIndex() {
        getCenterIndex().then(res => {
          console.log(res)
          if (res.code == 1) {
            this.testCentres = res.data.list
          }
        })
      },
      // 查询分类
      queryPostCategory () {
        queryPostCategory().then(res => {
          console.log(res)
          if (res.code == 1) {
            this.categories = res.data.list
          }
        })
      }
    },
    onLoad() {
      console.log('Create post page loaded');
      this.queryTags()
      this.getCenterIndex()
      this.queryPostCategory()
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

  /* Header样式 */
  .header {
    padding: 30rpx 40rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: transparent;
    position: relative;
    z-index: 10;
    min-height: 120rpx;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 30rpx;
  }

  .back-button {
    width: 80rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 40rpx;
    background: none;
    border: none;
  }

  .back-button:active {
    background: #F0F0F0;
    border-radius: 50%;
  }

  .header-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
  }

  .header-right {
    display: flex;
    align-items: center;
  }

  .post-button {
    padding: 16rpx 40rpx;
    background: #E0E0E0;
    border: none;
    border-radius: 50rpx;
    color: #999;
    font-size: 30rpx;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .post-button.active {
    background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
    color: white;
    box-shadow: 0 8rpx 24rpx rgba(74, 158, 255, 0.3);
  }

  .post-button:active {
    transform: scale(0.95);
  }

  /* 主容器 */
  .container {
    flex: 1;
    padding: 0 40rpx 40rpx;
    position: relative;
    z-index: 10;
    overflow-y: auto;
  }

  /* 媒体上传区域 */
  .media-section {
    margin-bottom: 30rpx;
  }

  .media-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;
  }

  .media-item {
    aspect-ratio: 1;
    position: relative;
  }

  .add-media {
    background: white;
    border-radius: 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
  }

  .add-media:active {
    transform: scale(0.95);
    background: #F8F9FA;
  }

  .add-icon {
    font-size: 50rpx;
    margin-bottom: 10rpx;
  }

  .add-label {
    font-size: 24rpx;
    color: #666;
  }

  .uploaded-image {
    width: 100%;
    height: 100%;
    border-radius: 20rpx;
    background: #F0F0F0;
  }

  .remove-button {
    position: absolute;
    top: 10rpx;
    right: 10rpx;
    width: 40rpx;
    height: 40rpx;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    color: white;
    font-size: 24rpx;
    font-weight: bold;
  }

  .video-preview {
    width: 100%;
    margin-top: 20rpx;
    position: relative;
  }

  .uploaded-video {
    width: 100%;
    height: 400rpx;
    border-radius: 20rpx;
    background: #000;
  }

  /* 内容输入区域 */
  .content-section {
    background: white;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  }

  .content-input {
    width: 100%;
    min-height: 200rpx;
    font-size: 30rpx;
    line-height: 1.6;
    color: #333;
    border: none;
    outline: none;
    resize: none;
    font-family: inherit;
  }

  .word-count {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10rpx;
    margin-top: 20rpx;
    font-size: 24rpx;
    color: #999;
  }

  .word-count .highlight {
    color: #4CAF50;
    font-weight: 600;
  }

  .count-divider {
    color: #E0E0E0;
    margin: 0 10rpx;
  }

  /* 选项卡片 */
  .options-card {
    background: white;
    border-radius: 20rpx;
    padding: 10rpx 30rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  }

  .option-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx 0;
    border-bottom: 1rpx solid #F5F5F5;
  }

  .option-item:last-child {
    border-bottom: none;
  }

  .option-item:active {
    background: #F8F9FA;
    margin: 0 -30rpx;
    padding-left: 30rpx;
    padding-right: 30rpx;
  }

  .option-left {
    display: flex;
    align-items: center;
    gap: 24rpx;
  }

  .option-icon {
    font-size: 40rpx;
  }

  .icon-text {
    font-size: 36rpx;
    color: #666;
    font-weight: bold;
  }

  .option-label {
    font-size: 30rpx;
    color: #333;
    font-weight: 500;
  }

  .option-right {
    display: flex;
    align-items: center;
    gap: 16rpx;
  }

  .option-value {
    font-size: 28rpx;
    color: #666;
  }

  .tags-preview {
    display: flex;
    align-items: center;
    gap: 10rpx;
  }

  .tag-preview {
    font-size: 26rpx;
    color: #4A9EFF;
  }

  .more-tags {
    font-size: 26rpx;
    color: #999;
  }

  .arrow {
    font-size: 32rpx;
    color: #C0C0C0;
  }

  /* 提示区域 */
  .tips-section {
    background: #F8F9FA;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
  }

  .tips-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 20rpx;
  }

  .tips-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }

  .tip-item {
    display: flex;
    align-items: flex-start;
    gap: 12rpx;
  }

  .tip-dot {
    color: #4A9EFF;
    font-size: 24rpx;
    line-height: 1.4;
  }

  .tip-text {
    flex: 1;
    font-size: 26rpx;
    color: #666;
    line-height: 1.4;
  }

  /* 模态框样式 */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
    display: flex;
    align-items: flex-end;
  }

  .modal-content {
    background: white;
    border-radius: 40rpx 40rpx 0 0;
    padding: 40rpx;
    width: 100%;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }

    to {
      transform: translateY(0);
    }
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40rpx;
  }

  .modal-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
  }

  .close-button {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48rpx;
    color: #666;
    background: none;
    border: none;
  }

  /* 分类列表 */
  .category-list {
    max-height: 600rpx;
    overflow-y: auto;
  }

  .category-option {
    display: flex;
    align-items: center;
    padding: 30rpx 0;
    border-bottom: 1rpx solid #F5F5F5;
  }

  .category-option:active {
    background: #F8F9FA;
  }

  .category-option.selected {
    background: #F8FBFF;
  }

  .category-icon {
    font-size: 40rpx;
    margin-right: 24rpx;
  }

  .category-name {
    flex: 1;
    font-size: 32rpx;
    color: #333;
  }

  .check-icon {
    color: #4A9EFF;
    font-size: 32rpx;
    font-weight: bold;
  }

  /* 标签选择器 */
  .custom-tag-input {
    display: flex;
    align-items: center;
    gap: 20rpx;
    margin-bottom: 30rpx;
  }

  .tag-input {
    flex: 1;
    height: 100%;
    padding: 20rpx 30rpx;
    background: #F8F9FA;
    border: none;
    border-radius: 50rpx;
    font-size: 28rpx;
    outline: none;
  }

  .add-tag-button {
    padding: 20rpx 40rpx;
    background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
    color: white;
    border: none;
    border-radius: 50rpx;
    font-size: 28rpx;
    font-weight: 600;
  }

  .add-tag-button:active {
    transform: scale(0.95);
  }

  .selected-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    margin-bottom: 30rpx;
    padding-bottom: 30rpx;
    border-bottom: 1rpx solid #F5F5F5;
  }

  .selected-tag {
    display: flex;
    align-items: center;
    gap: 10rpx;
    padding: 12rpx 24rpx;
    background: #E3F2FD;
    border-radius: 30rpx;
    font-size: 26rpx;
    color: #4A9EFF;
  }

  .remove-tag {
    font-size: 24rpx;
    font-weight: bold;
  }

  .popular-tags {
    margin-bottom: 30rpx;
  }

  .section-title {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 20rpx;
  }

  .tags-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
  }

  .popular-tag {
    padding: 16rpx 32rpx;
    background: white;
    border: 2rpx solid #E0E0E0;
    border-radius: 30rpx;
    font-size: 28rpx;
    color: #666;
    transition: all 0.3s ease;
  }

  .popular-tag:active {
    transform: scale(0.95);
  }

  .popular-tag.selected {
    background: #E3F2FD;
    border-color: #4A9EFF;
    color: #4A9EFF;
  }

  .modal-footer {
    padding-top: 30rpx;
  }

  .confirm-button {
    width: 100%;
    padding: 30rpx;
    background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
    color: white;
    border: none;
    border-radius: 50rpx;
    text-align: center;
    font-size: 32rpx;
    font-weight: 600;
    box-shadow: 0 8rpx 24rpx rgba(74, 158, 255, 0.3);
  }

  .confirm-button:active:not(.disabled) {
    transform: scale(0.98);
  }

  .confirm-button.disabled {
    background: #E0E0E0;
    color: #999;
    box-shadow: none;
  }
</style>