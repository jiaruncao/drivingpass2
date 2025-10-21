<template>
	<u-popup
		mode="center"
		:zoom="zoom"
		:show="show"
                :customStyle="{
                        borderRadius: '16rpx',
                        overflow: 'hidden',
                        marginTop: `-${$u.addUnit(negativeTop)}`
                }"
		:closeOnClickOverlay="closeOnClickOverlay"
		:safeAreaInsetBottom="false"
		:duration="duration"
		@click="clickHandler"
	>
		<view
			class="u-modal"
			:style="{
				width: $u.addUnit(width),
			}"
		>
			<text
				class="u-modal__title"
				v-if="title"
			>{{ title }}</text>
			<view
				class="u-modal__content"
                                :style="{
                                        paddingTop: `${title ? 12 : 25}rpx`
                                }"
			>
				<slot>
					<text class="u-modal__content__text">{{ content }}</text>
				</slot>
			</view>
			<view
				class="u-modal__button-group--confirm-button"
				v-if="$slots.confirmButton"
			>
				<slot name="confirmButton"></slot>
			</view>
			<template v-else>
				<!-- <view class="u-modal__divider"></view> -->
				<view
					class="u-modal__button-group"
					:style="{
						flexDirection: buttonReverse ? 'row-reverse' : 'row'
					}"
				>
					<view
						class="u-modal__button-group__wrapper u-modal__button-group__wrapper--cancel"
						:hover-stay-time="150"
						hover-class="u-modal__button-group__wrapper--hover"
						:class="[showCancelButton && !showConfirmButton && 'u-modal__button-group__wrapper--only-cancel']"
						v-if="showCancelButton"
						@tap="cancelHandler"
					>
						<text
							class="u-modal__button-group__wrapper__text u-modal__button-group__wrapper__text--cancel"
						>{{ cancelText }}</text>
					</view>
					<view class="u-modal__button-gap" v-if="showConfirmButton && showCancelButton"></view>
					<view
						class="u-modal__button-group__wrapper u-modal__button-group__wrapper--confirm"
						:hover-stay-time="150"
						hover-class="u-modal__button-group__wrapper--hover"
						:class="[!showCancelButton && showConfirmButton && 'u-modal__button-group__wrapper--only-confirm']"
						v-if="showConfirmButton"
						@tap="confirmHandler"
					>
						<u-loading-icon v-if="loading"></u-loading-icon>
						<text
							v-else
							class="u-modal__button-group__wrapper__text u-modal__button-group__wrapper__text--confirm"
						>{{ confirmText }}</text>
					</view>
				</view>
			</template>
		</view>
	</u-popup>
</template>

<script>
	import props from './props.js';
	export default {
		name: 'u-modal',
		mixins: [uni.$u.mpMixin, uni.$u.mixin, props],
		data() {
			return {
				loading: false
			}
		},
		watch: {
			show(n) {
				if (n && this.loading) this.loading = false
			}
		},
		methods: {
			confirmHandler() {
				if (this.asyncClose) {
					this.loading = true;
				}
				this.$emit('confirm')
			},
			cancelHandler() {
				this.$emit('cancel')
			},
			clickHandler() {
				if (this.closeOnClickOverlay) {
					this.$emit('close')
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../libs/css/components.scss";
        $u-modal-border-radius: 16rpx;

	.u-modal {
		width: 650rpx;
		border-radius: $u-modal-border-radius;
		overflow: hidden;
		background-color: #fff;
                padding-bottom: 20rpx;

                &__title {
                        font-size: 18rpx;
                        font-weight: 600;
                        color: #333;
                        text-align: center;
                        padding-top: 30rpx;
                        line-height: 1.4;
                }

                &__content {
                        padding: 20rpx 25rpx 30rpx 25rpx;
                        @include flex;
                        justify-content: center;

                        &__text {
                                font-size: 16rpx;
                                color: #666;
                                line-height: 1.5;
                                text-align: center;
                                flex: 1;
                        }
                }

                &__divider {
                        height: 1rpx;
                        background-color: #f0f0f0;
                        margin: 0 0 20rpx 0;
                }

                &__button-group {
                        @include flex;
                        padding: 0 25rpx;
                        gap: 12rpx;

                        &--confirm-button {
                                flex-direction: column;
                                padding: 0 25rpx 15rpx 25rpx;
                        }

                        &__wrapper {
                                flex: 1;
                                @include flex;
                                justify-content: center;
                                align-items: center;
                                height: 44rpx;
                                border-radius: 22rpx;
                                transition: all 0.3s ease;

                                &--cancel {
          background: white;
          border: 1rpx solid #4A9EFF;
          color: #4A9EFF;
                                }

                                &--confirm {
                                        background: linear-gradient(135deg, #4A9EFF 0%, #2196F3 100%);
                                        box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.3);
                                }

				&--only-cancel {
					width: 100%;
				}

				&--only-confirm {
					width: 100%;
				}

				&--hover {
					transform: scale(0.98);
					opacity: 0.9;
				}

                                &__text {
                                        font-size: 16rpx;
                                        font-weight: 500;
                                        text-align: center;

					&--cancel {
						color: #4A9EFF;
					}

					&--confirm {
						color: #fff;
					}
				}
			}
		}

                &__button-gap {
                        width: 12rpx;
                }
        }
</style>
