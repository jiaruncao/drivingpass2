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
  font-size: clamp(0.875rem, 2.2vw, 1rem);
  --safe-area-top: env(safe-area-inset-top, 0);
  --safe-area-right: env(safe-area-inset-right, 0);
  --safe-area-bottom: env(safe-area-inset-bottom, 0);
  --safe-area-left: env(safe-area-inset-left, 0);
}

html,
body,
#app {
  width: 100%;
  min-height: 100vh;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  text-size-adjust: 100%;
  background-color: #f8f9fa;
}

* {
  box-sizing: border-box;
  min-width: 0;
}

img,
video {
  max-width: 100%;
  height: auto;
  display: block;
}

.uni-page-body {
  min-height: calc(100vh - var(--safe-area-top) - var(--safe-area-bottom));
  padding: var(--safe-area-top) var(--safe-area-right) var(--safe-area-bottom) var(--safe-area-left);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow-x: hidden;
  word-break: break-word;
}
</style>
