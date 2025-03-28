import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Plus, X, Save, Pencil, Check, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "react-toastify";
import type { SystemConfig, PhoneFormat, StudentStatus } from "@/types/student"

type ConfigDialogProps = {
  config: SystemConfig
  statuses: StudentStatus[]
  onSave: (config: SystemConfig) => void
}

export function ConfigDialog({ config, statuses, onSave }: ConfigDialogProps) {
  const [localConfig, setLocalConfig] = useState<SystemConfig>({
    allowedEmailDomains: [...(config.allowedEmailDomains ?? [])],
    phoneFormats: [...(config.phoneFormats ?? [])],
    statusTransitionRules: [...(config.statusTransitionRules ?? [])],
  });

  // State cho form thêm mới
  const [newEmailDomain, setNewEmailDomain] = useState("")
  const [editingPhoneFormat, setEditingPhoneFormat] = useState<PhoneFormat | null>(null)
  const [newPhoneFormat, setNewPhoneFormat] = useState<PhoneFormat>({
    countryCode: "",
    countryName: "",
    pattern: "",
    example: "",
    prefix: "",
  })

  // Email domains
  const addEmailDomain = () => {
    if (!newEmailDomain.trim()) {
      toast.success("Tên miền không được để trống")
      return
    }

    if (localConfig?.allowedEmailDomains?.includes(newEmailDomain)) {
      toast.success("Tên miền không được để trống")
      return
    }

    setLocalConfig({
      ...localConfig,
      allowedEmailDomains: [...(localConfig.allowedEmailDomains ?? []), newEmailDomain],
    })

    setNewEmailDomain("")

    toast.success("Tên miền không được để trống")
  }

  const removeEmailDomain = (domain: string) => {
    setLocalConfig({
      ...localConfig,
      allowedEmailDomains: localConfig?.allowedEmailDomains?.filter((d: any) => d !== domain),
    })

    toast.success("Tên miền không được để trống")
  }

  // Phone formats
  const addPhoneFormat = () => {
    if (
      !newPhoneFormat.countryCode ||
      !newPhoneFormat.countryName ||
      !newPhoneFormat.pattern ||
      !newPhoneFormat.example ||
      !newPhoneFormat.prefix
    ) {
      toast.success("Tên miền không được để trống")
      return
    }

    if (localConfig?.phoneFormats?.some((p: any) => p.countryCode === newPhoneFormat.countryCode)) {
      toast.success("Tên miền không được để trống")
      return
    }

    setLocalConfig({
      ...localConfig,
      phoneFormats: [...(localConfig.phoneFormats ?? []), { ...newPhoneFormat }],
    })

    setNewPhoneFormat({
      countryCode: "",
      countryName: "",
      pattern: "",
      example: "",
      prefix: "",
    })

    toast.success("Tên miền không được để trống")
  }

  const updatePhoneFormat = () => {
    if (!editingPhoneFormat) return

    setLocalConfig({
      ...localConfig,
      phoneFormats: localConfig?.phoneFormats?.map((p: any) =>
        p.countryCode === editingPhoneFormat.countryCode ? editingPhoneFormat : p,
      ),
    })

    setEditingPhoneFormat(null)

    toast.success("Tên miền không được để trống")
  }

  const removePhoneFormat = (countryCode: string) => {
    setLocalConfig({
      ...localConfig,
      phoneFormats: localConfig?.phoneFormats?.filter((p: any) => p.countryCode !== countryCode),
    })

    toast.success("Tên miền không được để trống")
  }

  // Status transitions
  const toggleStatusTransition = (fromStatus: string, toStatus: string) => {
    setFlag("status")
    const existingRule = localConfig?.statusTransitionRules?.find((rule: any) => rule.fromStatus === fromStatus)

    if (existingRule) {
      // Nếu đã có quy tắc cho trạng thái nguồn
      if (existingRule.toStatus.includes(toStatus)) {
        // Nếu đã có quy tắc chuyển đổi, xóa nó
        setLocalConfig({
          ...localConfig,
          statusTransitionRules: localConfig?.statusTransitionRules?.map((rule: any) =>
            rule.fromStatus === fromStatus ? { ...rule, toStatus: rule.toStatus.filter((s: any) => s !== toStatus) } : rule,
          ),
        })

      } else {
        // Nếu chưa có quy tắc chuyển đổi, thêm nó
        setLocalConfig({
          ...localConfig,
          statusTransitionRules: localConfig?.statusTransitionRules?.map((rule: any) =>
            rule.fromStatus === fromStatus ? { ...rule, toStatus: [...rule.toStatus, toStatus] } : rule,
          ),
        })

      }
    } else {
      // Nếu chưa có quy tắc cho trạng thái nguồn, tạo mới
      setLocalConfig({
        ...localConfig,
        statusTransitionRules: [...(localConfig.statusTransitionRules ?? []), { fromStatus, toStatus: [toStatus] }],
      })

    }
  }

  // Lấy tên trạng thái từ ID
  const getStatusName = (statusId: string) => {
    return statuses.find((s: any) => s.id === statusId)?.name || statusId
  }

  // Kiểm tra xem có thể chuyển từ trạng thái A sang B không
  const canTransition = (fromStatus: string, toStatus: string) => {
    const rule = localConfig?.statusTransitionRules?.find((r: any) => r.fromStatus === fromStatus)
    return rule ? rule.toStatus.includes(toStatus) : false
  }

  // Lưu cấu hình
  const handleSave = () => {
    onSave(localConfig, flag)

    toast.success("Tên miền không được để trống")
  }

  const [flag, setFlag] = useState("")

  return (
    <>
      <DialogHeader>
        <DialogTitle>Cấu hình Hệ thống</DialogTitle>
        <DialogDescription>Quản lý các quy tắc kiểm tra dữ liệu trong hệ thống.</DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="email" className="mt-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="email">Tên miền Email</TabsTrigger>
          <TabsTrigger value="phone">Định dạng Số điện thoại</TabsTrigger>
          <TabsTrigger value="status">Quy tắc Chuyển đổi Trạng thái</TabsTrigger>
        </TabsList>

        {/* Email Domains Tab */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tên miền Email được phép</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập tên miền (vd: gmail.com)"
                  value={newEmailDomain}
                  onChange={(e) => {
                    setNewEmailDomain(e.target.value)
                    setFlag("domains")
                  }}
                />
                <Button onClick={addEmailDomain}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {localConfig?.allowedEmailDomains?.map((domain: any) => (
                  <Badge key={domain} className="flex items-center gap-1 px-3 py-1">
                    {domain}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 p-0 text-primary-foreground hover:bg-transparent hover:text-destructive"
                      onClick={() => {
                        removeEmailDomain(domain)
                        setFlag("domains")
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Phone Formats Tab */}
        <TabsContent value="phone" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Định dạng Số điện thoại theo Quốc gia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingPhoneFormat ? (
                <div className="space-y-4 border p-4 rounded-md">
                  <h3 className="font-medium">Chỉnh sửa định dạng số điện thoại</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Mã quốc gia</label>
                      <Input
                        value={editingPhoneFormat.countryCode}
                        onChange={(e) => setEditingPhoneFormat({ ...editingPhoneFormat, countryCode: e.target.value })}
                        placeholder="VN"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tên quốc gia</label>
                      <Input
                        value={editingPhoneFormat.countryName}
                        onChange={(e) => setEditingPhoneFormat({ ...editingPhoneFormat, countryName: e.target.value })}
                        placeholder="Việt Nam"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tiền tố</label>
                      <Input
                        value={editingPhoneFormat.prefix}
                        onChange={(e) => setEditingPhoneFormat({ ...editingPhoneFormat, prefix: e.target.value })}
                        placeholder="+84"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Mẫu Regex</label>
                      <Input
                        value={editingPhoneFormat.pattern}
                        onChange={(e) => setEditingPhoneFormat({ ...editingPhoneFormat, pattern: e.target.value })}
                        placeholder="^(0|\+84)[3|5|7|8|9][0-9]{8}$"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium">Ví dụ</label>
                      <Input
                        value={editingPhoneFormat.example}
                        onChange={(e) => setEditingPhoneFormat({ ...editingPhoneFormat, example: e.target.value })}
                        placeholder="0901234567 hoặc +84901234567"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setEditingPhoneFormat(null)}>
                      Hủy
                    </Button>
                    <Button onClick={updatePhoneFormat}>
                      <Save className="h-4 w-4 mr-2" />
                      Lưu
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 border p-4 rounded-md">
                  <h3 className="font-medium">Thêm định dạng số điện thoại mới</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Mã quốc gia</label>
                      <Input
                        value={newPhoneFormat.countryCode}
                        onChange={(e) => setNewPhoneFormat({ ...newPhoneFormat, countryCode: e.target.value })}
                        placeholder="VN"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tên quốc gia</label>
                      <Input
                        value={newPhoneFormat.countryName}
                        onChange={(e) => setNewPhoneFormat({ ...newPhoneFormat, countryName: e.target.value })}
                        placeholder="Việt Nam"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tiền tố</label>
                      <Input
                        value={newPhoneFormat.prefix}
                        onChange={(e) => setNewPhoneFormat({ ...newPhoneFormat, prefix: e.target.value })}
                        placeholder="+84"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Mẫu Regex</label>
                      <Input
                        value={newPhoneFormat.pattern}
                        onChange={(e) => setNewPhoneFormat({ ...newPhoneFormat, pattern: e.target.value })}
                        placeholder="^(0|\+84)[3|5|7|8|9][0-9]{8}$"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium">Ví dụ</label>
                      <Input
                        value={newPhoneFormat.example}
                        onChange={(e) => setNewPhoneFormat({ ...newPhoneFormat, example: e.target.value })}
                        placeholder="0901234567 hoặc +84901234567"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={addPhoneFormat}>
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm
                    </Button>
                  </div>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã quốc gia</TableHead>
                    <TableHead>Tên quốc gia</TableHead>
                    <TableHead>Tiền tố</TableHead>
                    <TableHead>Ví dụ</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {localConfig?.phoneFormats?.map((format: any) => (
                    <TableRow key={format.countryCode}>
                      <TableCell className="font-medium">{format.countryCode}</TableCell>
                      <TableCell>{format.countryName}</TableCell>
                      <TableCell>{format.prefix}</TableCell>
                      <TableCell>{format.example}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setEditingPhoneFormat(format)}
                            className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removePhoneFormat(format.countryCode)}
                            className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Status Transitions Tab */}
        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quy tắc Chuyển đổi Trạng thái</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Chọn các trạng thái mà sinh viên có thể chuyển đổi. Ô được đánh dấu nghĩa là có thể chuyển từ trạng thái
                ở hàng sang trạng thái ở cột.
              </p>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Từ \ Đến</TableHead>
                    {statuses.map((status) => (
                      <TableHead key={status.id} className="text-center">
                        <div className="flex flex-col items-center">
                          <span className="whitespace-nowrap">{status.name}</span>
                          <div className="w-3 h-3 rounded-full mt-1" style={{ backgroundColor: status.color }}></div>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statuses.map((fromStatus) => (
                    <TableRow key={fromStatus.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: fromStatus.color }}></div>
                          {fromStatus.name}
                        </div>
                      </TableCell>
                      {statuses.map((toStatus) => (
                        <TableCell key={toStatus.id} className="text-center">
                          {fromStatus.id !== toStatus.id ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 ${canTransition(fromStatus.id, toStatus.id) ? "text-green-600 bg-green-50" : "text-gray-300"}`}
                              onClick={() => toggleStatusTransition(fromStatus.id, toStatus.id)}
                            >
                              {canTransition(fromStatus.id, toStatus.id) ? (
                                <Check className="h-5 w-5" />
                              ) : (
                                <ArrowRight className="h-5 w-5" />
                              )}
                            </Button>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-6">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Lưu cấu hình
        </Button>
      </div>
    </>
  )
}

