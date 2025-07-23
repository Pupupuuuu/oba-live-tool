export const login: LoginConstants = {
  loginUrl: 'https://lbs.kuaishou.com/sandslash/login',
  liveControlUrl: 'https://lbs.kuaishou.com/sandslash/live/liveHepler',
  loginUrlRegex: /lbs\.kuaishou\.com\/sandslash\/login/,
  isLoggedInSelector: 'span.nickname',
  isInLiveControlSelector: 'div[class^=live-helper]',
  accountNameSelector: 'span.nickname',
}

export const selectors = {
  GOODS_ITEM: '.good-item',
  GOODS_ITEMS_WRAPPER: '.scroll-wrapper',
  goodsItem: {
    ID: 'input',
    POPUP_BUTTON: 'button.intro-btn',
  },
  CLOSE_VIDEO_BTN: '', // No close button found yet
  VIDEO: 'video.xplayer-video',
  commentInput: {
    TEXTAREA: 'input[placeholder="按回车键可直接发送"]',
    PIN_TOP_LABEL: '', // Feature not available
    SUBMIT_BUTTON: 'button.ant-btn:has(span:has-text("发 送"))',
  },
  overlays: {},
} as const
