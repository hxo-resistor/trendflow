import { NextResponse } from "next/server"
import { PRODUCT_LIBRARY } from "@/lib/affiliate-types"

/**
 * Affiliate Product Management API
 */

// In-memory storage (would use database in production)
const productStore = [...PRODUCT_LIBRARY]

export async function GET() {
  return NextResponse.json({
    success: true,
    products: productStore,
    count: productStore.length,
    categories: Array.from(new Set(productStore.map(p => p.category)))
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, product } = body

    if (action === "add") {
      const newProduct = {
        id: Date.now().toString(),
        ...product,
      }
      productStore.push(newProduct)
      return NextResponse.json({ success: true, product: newProduct })
    }

    if (action === "update") {
      const index = productStore.findIndex(p => p.id === product.id)
      if (index !== -1) {
        productStore[index] = { ...productStore[index], ...product }
        return NextResponse.json({ success: true, product: productStore[index] })
      }
      return NextResponse.json({ error: "商品不存在" }, { status: 404 })
    }

    if (action === "delete") {
      const index = productStore.findIndex(p => p.id === product.id)
      if (index !== -1) {
        productStore.splice(index, 1)
        return NextResponse.json({ success: true })
      }
      return NextResponse.json({ error: "商品不存在" }, { status: 404 })
    }

    return NextResponse.json({ error: "未知操作" }, { status: 400 })
  } catch (error) {
    console.error("Product API error:", error)
    return NextResponse.json({ error: "操作失败" }, { status: 500 })
  }
}
