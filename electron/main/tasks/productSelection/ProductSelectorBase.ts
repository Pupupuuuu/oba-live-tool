import type { BrowserContext, Page } from 'playwright'
import { createLogger } from '#/logger'

export abstract class ProductSelectorBase {
  protected logger: ReturnType<typeof createLogger>

  constructor(
    protected browserContext: BrowserContext,
    protected mainPage: Page,
    protected platform: LiveControlPlatform,
  ) {
    this.logger = createLogger(`ProductSelector:${platform}`)
  }

  /**
   * 抽象方法，用于选择和搜索商品。
   * @param productId 要搜索的商品ID。
   * @returns 操作结果的描述字符串。
   */
  public abstract selectAndSearch(productId: string): Promise<string>
}
