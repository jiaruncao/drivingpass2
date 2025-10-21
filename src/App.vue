<script>
export default {
  onLaunch: function () {
    // this.$voice.init()
    console.log("App Launch");
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style lang="scss">
/*每个页面公共css */
@import "uview-ui/index.scss";
@import "../public/tuniao-ui.css";

:root {
  font-size: clamp(90%, calc(100vw / 7.5), 125%);
  /* 750 设计宽度下，100vw / 7.5 ≈ 100，对应 1rem ≈ 100 设计单位 */
  --app-safe-area-top: env(safe-area-inset-top, 0rem);
  --app-safe-area-right: env(safe-area-inset-right, 0rem);
  --app-safe-area-bottom: env(safe-area-inset-bottom, 0rem);
  --app-safe-area-left: env(safe-area-inset-left, 0rem);
  --app-safe-area-vertical: calc(
    var(--app-safe-area-top) + var(--app-safe-area-bottom)
  );
  --app-safe-area-horizontal: calc(
    var(--app-safe-area-left) + var(--app-safe-area-right)
  );
  --app-container-max-width: min(12.8rem, 100vw);
  --app-container-padding-inline: clamp(0.24rem, 4vw, 0.6rem);
  --app-container-padding-block: clamp(0.24rem, 4vw, 0.72rem);
}

body,
page {
  margin: 0;
  min-height: 100vh;
  font-size: 0.14rem;
  background-color: var(--app-page-background, #ffffff);
  color: var(--app-page-color, #333333);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
}

#app {
  min-height: 100%;
}

.app-container {
  width: min(var(--app-container-max-width), 100%);
  margin-left: auto;
  margin-right: auto;
  padding-top: var(--app-container-padding-block);
  padding-bottom: calc(
    var(--app-container-padding-block) + var(--app-safe-area-bottom)
  );
  padding-left: calc(
    var(--app-container-padding-inline) + var(--app-safe-area-left)
  );
  padding-right: calc(
    var(--app-container-padding-inline) + var(--app-safe-area-right)
  );
  box-sizing: border-box;
}

.safe-area-inset {
  padding-top: var(--app-safe-area-top);
  padding-right: var(--app-safe-area-right);
  padding-bottom: var(--app-safe-area-bottom);
  padding-left: var(--app-safe-area-left);
}

.safe-area-inset-y {
  padding-top: var(--app-safe-area-top);
  padding-bottom: var(--app-safe-area-bottom);
}

.safe-area-inset-b {
  padding-bottom: var(--app-safe-area-bottom);
}
</style>
