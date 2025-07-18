import { useState } from 'react'
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
import { useToast } from '@/hooks/useToast'

export default function ProductSelection() {
  const [productId, setProductId] = useState('')
  const { toast } = useToast()

  const handleAddProduct = () => {
    if (!productId.trim()) {
      toast.error('请输入商品ID')
      return
    }
    toast.success(`已添加商品ID: ${productId}`)
    setProductId('')
  }

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
            <Button onClick={handleAddProduct}>添加</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
