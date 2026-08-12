import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: "Hello World",
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error" },
      { status: 500 }
    )
  }
}
