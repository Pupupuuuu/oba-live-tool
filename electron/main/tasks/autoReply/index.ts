import type { StringFilterConfig } from '@/utils/filter'

export interface AutoReplyConfig {
  source: 'compass' | 'control'
  ws?: {
    enable: boolean
    port: number
  }
  hideUsername: boolean
  comment: {
    keywordReply: {
      enable: boolean
      rules: {
        keywords: string[]
        contents: string[]
      }[]
    }
    aiReply: {
      enable: boolean
      prompt: string
      autoSend: boolean
    }
  }
  room_enter: SimpleEventReply
  room_like: SimpleEventReply
  room_follow: SimpleEventReply
  subscribe_merchant_brand_vip: SimpleEventReply
  live_order: SimpleEventReply
  ecom_fansclub_participate: SimpleEventReply
  blockList: string[]
}

export type SimpleEventReplyMessage =
  | string
  | { content: string; filter: StringFilterConfig }

export interface SimpleEventReply {
  enable: boolean
  messages: SimpleEventReplyMessage[]
  options?: Record<string, boolean>
}
