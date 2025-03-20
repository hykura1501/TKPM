"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Search, Download, AlertCircle, Info, Check, X, FileDown, FileUp, User } from "lucide-react"
import type { LogEntry } from "@/types/student"

type LogsDialogProps = {
  logs: LogEntry[]
}

export function LogsDialog({ logs }: LogsDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAction, setFilterAction] = useState<string | null>(null)
  const [filterEntity, setFilterEntity] = useState<string | null>(null)

  // Filter logs based on search term and filters
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.metadata.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.metadata.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.metadata.entityId && log.metadata.entityId.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesAction = !filterAction || log.metadata.action === filterAction
    const matchesEntity = !filterEntity || log.metadata.entity === filterEntity

    return matchesSearch && matchesAction && matchesEntity
  })

  // Get unique actions and entities for filters
  const uniqueActions = Array.from(new Set(logs.map((log) => log.metadata.action)))
  const uniqueEntities = Array.from(new Set(logs.map((log) => log.metadata.entity)))

  // Get icon for action
  const getActionIcon = (action: string) => {
    switch (action) {
      case "create":
        return <Check className="h-4 w-4 text-green-500" />
      case "update":
        return <Info className="h-4 w-4 text-blue-500" />
      case "delete":
        return <X className="h-4 w-4 text-red-500" />
      case "import":
        return <FileUp className="h-4 w-4 text-purple-500" />
      case "export":
        return <FileDown className="h-4 w-4 text-indigo-500" />
      case "login":
        return <User className="h-4 w-4 text-green-500" />
      case "logout":
        return <User className="h-4 w-4 text-gray-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Nhật ký Hệ thống</DialogTitle>
        <DialogDescription>Xem lịch sử hoạt động và sự kiện trong hệ thống.</DialogDescription>
      </DialogHeader>

      <div className="mt-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-3 py-2 border rounded-md"
            value={filterAction || ""}
            onChange={(e) => setFilterAction(e.target.value || null)}
          >
            <option value="">Tất cả hành động</option>
            {uniqueActions.map((action) => (
              <option key={action} value={action}>
                {action.charAt(0).toUpperCase() + action.slice(1)}
              </option>
            ))}
          </select>

          <select
            className="px-3 py-2 border rounded-md"
            value={filterEntity || ""}
            onChange={(e) => setFilterEntity(e.target.value || null)}
          >
            <option value="">Tất cả đối tượng</option>
            {uniqueEntities.map((entity) => (
              <option key={entity} value={entity}>
                {entity.charAt(0).toUpperCase() + entity.slice(1)}
              </option>
            ))}
          </select>

          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất nhật ký
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Nhật ký hoạt động ({filteredLogs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <div key={log._id} className="flex items-start p-3 border rounded-md">
                    <div className="mr-3 mt-1">{getActionIcon(log.metadata.action)}</div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {log.metadata.action.charAt(0).toUpperCase() + log.metadata.action.slice(1)} {log.metadata.entity}
                          {log.metadata.entityId && <span className="text-muted-foreground"> #{log.metadata.entityId}</span>}
                        </span>
                        <span className="text-sm text-muted-foreground">{formatTimestamp(log.timestamp)}</span>
                      </div>
                      <p className="text-sm mt-1">{log.metadata.details}</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-muted-foreground">Người dùng: {log.metadata.user}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">Không tìm thấy nhật ký nào</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

