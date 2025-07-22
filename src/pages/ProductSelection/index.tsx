import { useState } from 'react'
import { IPC_CHANNELS } from 'shared/ipcChannels'
import { Title } from '@/components/common/Title'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useCurrentLiveControl } from '@/hooks/useLiveControl'
import { useToast } from '@/hooks/useToast'

export default function ProductSelection() {
  const [productId, setProductId] = useState('')
  const { toast } = useToast()
  const isConnected = useCurrentLiveControl(state => state.isConnected)
  const platform = useCurrentLiveControl(state => state.platform)

  // 定义支持此功能的前端平台列表
  const supportedPlatforms: LiveControlPlatform[] = ['buyin', 'eos']

  const handleAddProduct = async () => {
    if (!productId.trim()) {
      toast.error('请输入商品ID')
      return
    }
    try {
      const result = await window.ipcRenderer.invoke(
        IPC_CHANNELS.tasks.productSelection.open,
        productId.trim(),
      )
      toast.success(result || '操作成功完成')
      setProductId('')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      toast.error(`操作失败: ${errorMessage}`)
    }
  }

  const isButtonDisabled =
    isConnected !== 'connected' || !supportedPlatforms.includes(platform)

  return (
    <div className="container py-8 space-y-4">
      <Title title="商品选择" description="通过商品ID添加要操作的商品" />

      <Card>
        <CardHeader>
          <CardTitle>添加商品</CardTitle>
          <CardDescription>
            请输入您要添加的商品ID，然后点击“添加”按钮。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="商品ID"
              value={productId}
              onChange={e => setProductId(e.target.value)}
            />
            <Button onClick={handleAddProduct} disabled={isButtonDisabled}>
              添加
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
