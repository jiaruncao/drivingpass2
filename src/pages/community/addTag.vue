<template>
	<view class="container">
		<u-navbar leftText="Link test center" :safeAreaInsetTop="true" :autoBack="true">
			<view class="u-nav-slot" slot="right" @click="completeAddTag()">
				<text>Completed</text>
			</view>
		</u-navbar>

		<view class="content" :style="{ paddingTop: safeAreaTop + 'rpx' }">
			<!-- 已选标签 -->
			<view class="section tn-padding-sm">
				<text class="section-title">Selected Tags</text>
				<view class="selected-tags">
					<view class="tag-item selected" v-for="(item, index) in selectedTags" :key="item.id">
						<text class="tag-text">#{{ item.tag }}</text>
						<u-icon name="close" size="14" color="#999" class="tag-close"
							@click="removeTag(index)"></u-icon>
					</view>
					<view class="add-tag-btn tn-flex tn-flex-col-center tn-flex-row-center"
						@click="showTagDialog = true">
						+ Add
					</view>
				</view>
			</view>

			<!-- 热门标签 -->
			<view class="section tn-padding-sm">
				<text class="section-title">Trending Tags</text>
				<view class="tag-list">
					<view class="tag-item" v-for="(item, index) in trendingTags" :key="item.id"
						:class="{ active: isTagSelected(item.id) }" @click="toggleTag(item.id)">
						<text class="tag-text">{{ item.tag }}</text>
					</view>
				</view>
			</view>

			<!-- 添加标签弹窗 -->
                        <u-popup
                                :show="showTagDialog"
                                mode="center"
                                width="80%"
                                :customStyle="{ backgroundColor: 'transparent' }"
                        >
                                <view class="tag-dialog">
                                        <view class="dialog-header">
                                                <text class="dialog-title">Add New Tag</text>
                                                <text class="dialog-subtitle">Organise your posts with a custom label</text>
                                        </view>
                                        <u-input
                                                v-model="newTag"
                                                placeholder="Enter tag name"
                                                class="tag-input"
                                        ></u-input>
                                        <view class="dialog-actions">
                                                <view class="dialog-btn ghost" @click="showTagDialog = false">Cancel</view>
                                                <view class="dialog-btn primary" @click="addNewTag">Confirm</view>
                                        </view>
                                </view>
                        </u-popup>
                </view>

        </view>
</template>

<script>
	export default {
		data() {
			return {
				selectedTags: [{
					"id": 4,
					"tag": "License Reveal"
				}],
				trendingTags: [{
						"id": 4,
						"tag": "License Reveal"
					},
					{
						"id": 3,
						"tag": "Driving Journal"
					},
					{
						"id": 2,
						"tag": "Theory Test"
					}
				],
				newTag: '',
				showTagDialog: false
			};
		},
		onLoad(options){
			this.selectedTags = JSON.parse(decodeURIComponent(options.tags));
			this.queryTags();
		},
		methods: {
			// 检查标签是否被选中
			isTagSelected(tagId) {
				return this.selectedTags.some(tag => tag.id === tagId);
			},

			// 移除已选标签
			removeTag(index) {
				this.selectedTags.splice(index, 1);
			},
			
			

			// 切换热门标签选中状态
			toggleTag(tagId) {
				const isSelected = this.isTagSelected(tagId);

				if (isSelected) {
					// 移除已选中的标签
					this.selectedTags = this.selectedTags.filter(tag => tag.id !== tagId);
				} else {
					// 添加未选中的标签
					const tagToAdd = this.trendingTags.find(tag => tag.id === tagId);
					if (tagToAdd) {
						this.selectedTags.push(tagToAdd);
					}
				}
			},

			completeAddTag() {
				uni.$emit('communityTagSelectBack',{data: this.selectedTags});
				uni.navigateBack();
			},
			
			async queryTags(){
				try {
					const params = {
						
					};
					const res = await this.$http.addTags(params);
					// 处理返回结果
					if (res.code === this.$http.STATUS_OK) {
						console.log('成功', res.data.list);
						this.trendingTags = res.data.list;
					} else {
						// 登录失败（业务错误）
						console.log('操作失败', res.msg);
						uni.showToast({
							title: res.msg || '登录失败',
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('登录请求异常', error);
					uni.showToast({
						title: '网络异常，请稍后再试',
						icon: 'none'
					});
				}
			},
			
			async addNewTag() {
				const tagName = this.newTag.trim();
				if (!tagName) return;
				
				// 检查标签是否已存在
				const tagExists = this.selectedTags.some(tag => tag.tag === tagName);
				if (tagExists) {
					uni.showToast({
						title: 'Tag already exists',
						icon: 'none'
					});
					return;
				}
				
				
				const allTags = [...this.selectedTags, ...this.trendingTags];
				const maxId = allTags.length > 0 ?
					Math.max(...allTags.map(tag => tag.id)) :
					0;
				
				// 添加新标签
				this.selectedTags.push({
					id: maxId + 1,
					tag: tagName
				});
				
				this.newTag = '';
				this.showTagDialog = false;
				
				
				try {
					const params = {
						tag: tagName,
					};
					const res = await this.$http.addTags(params);
					// 处理返回结果
					if (res.code === this.$http.STATUS_OK) {
						console.log('登录成功', res.data);
						
					} else {
						// 登录失败（业务错误）
						console.log('操作失败', res.msg);
						uni.showToast({
							title: res.msg || '登录失败',
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('登录请求异常', error);
					uni.showToast({
						title: '网络异常，请稍后再试',
						icon: 'none'
					});
				}
			}
			
		}
	};
</script>

<style>
        .container {
                flex: 1;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                background-color: #fff;
                padding-bottom: calc(env(safe-area-inset-bottom) + 40rpx);
        }

        .content {
                padding-top: calc(env(safe-area-inset-top) + 64rpx);
                display: flex;
                flex-direction: column;
                gap: 32rpx;
        }

	.section {
		margin-bottom: 30rpx;
	}

        .section-title {
                font-size: 28rpx;
                color: #999;
                margin-bottom: 16rpx;
                display: block;
                line-height: 1.4;
                word-break: break-word;
        }

	/* 已选标签样式 */
	.selected-tags {
		display: flex;
		flex-wrap: wrap;
	}

        .tag-item {
                display: flex;
                align-items: center;
                background-color: #fff;
                border: 2rpx solid #ddd;
                border-radius: 30rpx;
                padding: 8rpx 16rpx;
                margin-right: 16rpx;
                margin-bottom: 16rpx;
        }

	.tag-item.selected {
		background-color: #e6f7ff;
		border-color: #91d5ff;
	}

	.tag-text {
		font-size: 24rpx;
		margin-right: 8rpx;
	}

	.tag-close {
		margin-left: 8rpx;
	}

        .add-tag-btn {
                width: 124rpx;
                height: 60rpx;
                background: #FFFFFF;
                color: #419FFF;
                border-radius: 48rpx;
                border: 2rpx solid #419FFF;
                padding: 0 20rpx;
                margin-bottom: 16rpx;
        }

	/* 热门标签样式 */
	.tag-list {
		display: flex;
		flex-wrap: wrap;
	}

	.tag-item.active {
		background-color: #e6f7ff;
		border-color: #91d5ff;
	}

	/* 弹窗样式 */
        .tag-dialog {
                background: linear-gradient(160deg, rgba(74, 158, 255, 0.18), rgba(33, 150, 243, 0.05));
                border-radius: 32rpx;
                padding: 40rpx 34rpx;
                box-shadow: 0 30rpx 60rpx rgba(31, 71, 168, 0.18);
        }

        .dialog-header {
                margin-bottom: 30rpx;
        }

        .dialog-title {
                font-size: 34rpx;
                font-weight: 700;
                color: #0f172a;
                display: block;
        }

        .dialog-subtitle {
                font-size: 24rpx;
                color: #475569;
                margin-top: 10rpx;
                display: block;
        }

        .tag-input {
                margin-bottom: 30rpx;
        }

        .dialog-actions {
                display: flex;
                gap: 20rpx;
        }

        .dialog-btn {
                flex: 1;
                height: 88rpx;
                border-radius: 999rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 28rpx;
                font-weight: 600;
        }

        .dialog-btn.ghost {
                background: rgba(148, 163, 184, 0.12);
                color: #475569;
                box-shadow: inset 0 0 0 2rpx rgba(148, 163, 184, 0.35);
        }

        .dialog-btn.primary {
                background: linear-gradient(135deg, #2563eb, #1d4ed8);
                color: #fff;
                box-shadow: 0 18rpx 36rpx rgba(37, 99, 235, 0.32);
        }
</style>