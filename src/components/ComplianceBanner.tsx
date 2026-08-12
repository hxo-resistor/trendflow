export default function ComplianceBanner() {
  return (
    <div className="fixed bottom-0 left-64 right-0 bg-secondary/90 backdrop-blur border-t border-border px-6 py-3 z-50">
      <p className="text-xs text-muted-foreground text-center">
        本工具仅供合法的市场研究和内容创作使用。所有数据均来自公开信息，生成内容需经人工审核后发布。使用者应遵守所在地区的法律法规及平台内容规范。
      </p>
    </div>
  )
}
