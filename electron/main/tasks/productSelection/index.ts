import type { BrowserContext, Page } from 'playwright'
import { BuyinProductSelector } from './BuyinProductSelector'
import { EosProductSelector } from './EosProductSelector'
import type { ProductSelectorBase } from './ProductSelectorBase'

export function getProductSelector(
  platform: LiveControlPlatform,
  browserContext: BrowserContext,
  mainPage: Page,
): ProductSelectorBase {
  switch (platform) {
    case 'buyin':
      return new BuyinProductSelector(browserContext, mainPage, platform)
    case 'eos':
      return new EosProductSelector(browserContext, mainPage, platform)
    // case 'douyin':
    //   return new DouyinProductSelector(browserContext, mainPage, platform) // 示例
    default:
      throw new Error(`“商品选择”功能不支持当前平台: ${platform}`)
  }
}
