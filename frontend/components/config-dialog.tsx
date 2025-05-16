"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Plus, X, Save, Pencil, Check, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "react-toastify"
import { useTranslations } from "next-intl"
import type { SystemConfig, PhoneFormat, StudentStatus } from "@/types/student"

type ConfigDialogProps = {
  config: SystemConfig
  statuses: StudentStatus[]
  onSave: (config: SystemConfig, flag: string) => void
}

export function ConfigDialog({ config, statuses, onSave }: ConfigDialogProps) {
  const t = useTranslations("config")

  const [localConfig, setLocalConfig] = useState<SystemConfig>({
    allowedEmailDomains: [...(config.allowedEmailDomains ?? [])],
    phoneFormats: [...(config.phoneFormats ?? [])],
    statusTransitionRules: [...(config.statusTransitionRules ?? [])],
  })

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
      return
    }

    if (localConfig?.allowedEmailDomains?.includes(newEmailDomain)) {
      return
    }

    setLocalConfig({
      ...localConfig,
      allowedEmailDomains: [...(localConfig.allowedEmailDomains ?? []), newEmailDomain],
    })

    setNewEmailDomain("")
    setFlag("domains")
  }

  const removeEmailDomain = (domain: string) => {
    setLocalConfig({
      ...localConfig,
      allowedEmailDomains: localConfig?.allowedEmailDomains?.filter((d: any) => d !== domain),
    })
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
      toast.error(t("phone.errors.incomplete"))
      return
    }

    setFlag("phone")

    if (localConfig?.phoneFormats?.some((p: any) => p.countryCode === newPhoneFormat.countryCode)) {
      toast.warning(t("phone.errors.exists"))
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

    toast.success(t("phone.errors.success"))
  }

  const updatePhoneFormat = () => {
    if (!editingPhoneFormat) return
    setFlag("phone")
    setLocalConfig({
      ...localConfig,
      phoneFormats: localConfig?.phoneFormats?.map((p: any) =>
        p.countryCode === editingPhoneFormat.countryCode ? editingPhoneFormat : p,
      ),
    })

    setEditingPhoneFormat(null)
    toast.success(t("phone.errors.updateSuccess"))
  }

  const removePhoneFormat = (countryCode: string) => {
    setLocalConfig({
      ...localConfig,
      phoneFormats: localConfig?.phoneFormats?.filter((p: any) => p.countryCode !== countryCode),
    })
    setFlag("phone")
    toast.success(t("phone.errors.removeSuccess"))
  }

  // Status transitions
  const toggleStatusTransition = (fromStatus: string, toStatus: string) => {
    setFlag("status")
    const existingRule = localConfig?.statusTransitionRules?.find((rule: any) => rule.fromStatus === fromStatus)

    if (existingRule) {
      if (existingRule.toStatus.includes(toStatus)) {
        setLocalConfig({
          ...localConfig,
          statusTransitionRules: localConfig?.statusTransitionRules?.map((rule: any) =>
            rule.fromStatus === fromStatus ? { ...rule, toStatus: rule.toStatus.filter((s: any) => s !== toStatus) } : rule,
          ),
        })
      } else {
        setLocalConfig({
          ...localConfig,
          statusTransitionRules: localConfig?.statusTransitionRules?.map((rule: any) =>
            rule.fromStatus === fromStatus ? { ...rule, toStatus: [...rule.toStatus, toStatus] } : rule,
          ),
        })
      }
    } else {
      setLocalConfig({
        ...localConfig,
        statusTransitionRules: [...(localConfig.statusTransitionRules ?? []), { fromStatus, toStatus: [toStatus] }],
      })
    }
  }

  const canTransition = (fromStatus: string, toStatus: string) => {
    const rule = localConfig?.statusTransitionRules?.find((r: any) => r.fromStatus === fromStatus)
    return rule ? rule.toStatus.includes(toStatus) : false
  }

  const handleSave = () => {
    onSave(localConfig, flag)
  }

  const [flag, setFlag] = useState("")

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t("title")}</DialogTitle>
        <DialogDescription>{t("description")}</DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="email" className="mt-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="email">{t("tabs.email")}</TabsTrigger>
          <TabsTrigger value="phone">{t("tabs.phone")}</TabsTrigger>
          <TabsTrigger value="status">{t("tabs.status")}</TabsTrigger>
        </TabsList>

        {/* Email Domains Tab */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("email.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder={t("email.placeholder")}
                  value={newEmailDomain}
                  onChange={(e) => {
                    setNewEmailDomain(e.target.value)
                    setFlag("domains")
                  }}
                />
                <Button onClick={addEmailDomain}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("email.add")}
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
              <CardTitle>{t("phone.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingPhoneFormat ? (
                <div className="space-y-4 border p-4 rounded-md">
                  <h3 className="font-medium">{t("phone.editTitle")}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">{t("phone.countryCode")}</label>
                      <Input
                        value={editingPhoneFormat.countryCode}
                        onChange={(e) => setEditingPhoneFormat({ ...editingPhoneFormat, countryCode: e.target.value })}
                        placeholder="VN"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">{t("phone.countryName")}</label>
                      <Input
                        value={editingPhoneFormat.countryName}
                        onChange={(e) => setEditingPhoneFormat({ ...editingPhoneFormat, countryName: e.target.value })}
                        placeholder="Việt Nam"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">{t("phone.prefix")}</label>
                      <Input
                        value={editingPhoneFormat.prefix}
                        onChange={(e) => setEditingPhoneFormat({ ...editingPhoneFormat, prefix: e.target.value })}
                        placeholder="+84"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">{t("phone.pattern")}</label>
                      <Input
                        value={editingPhoneFormat.pattern}
                        onChange={(e) => setEditingPhoneFormat({ ...editingPhoneFormat, pattern: e.target.value })}
                        placeholder="^(0|\+84)[3|5|7|8|9][0-9]{8}$"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium">{t("phone.example")}</label>
                      <Input
                        value={editingPhoneFormat.example}
                        onChange={(e) => setEditingPhoneFormat({ ...editingPhoneFormat, example: e.target.value })}
                        placeholder="0901234567 hoặc +84901234567"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setEditingPhoneFormat(null)}>
                      {t("phone.cancel")}
                    </Button>
                    <Button onClick={updatePhoneFormat}>
                      <Save className="h-4 w-4 mr-2" />
                      {t("phone.save")}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 border p-4 rounded-md">
                  <h3 className="font-medium">{t("phone.addTitle")}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">{t("phone.countryCode")}</label>
                      <Input
                        value={newPhoneFormat.countryCode}
                        onChange={(e) => setNewPhoneFormat({ ...newPhoneFormat, countryCode: e.target.value })}
                        placeholder="VN"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">{t("phone.countryName")}</label>
                      <Input
                        value={newPhoneFormat.countryName}
                        onChange={(e) => setNewPhoneFormat({ ...newPhoneFormat, countryName: e.target.value })}
                        placeholder="Việt Nam"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">{t("phone.prefix")}</label>
                      <Input
                        value={newPhoneFormat.prefix}
                        onChange={(e) => setNewPhoneFormat({ ...newPhoneFormat, prefix: e.target.value })}
                        placeholder="+84"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">{t("phone.pattern")}</label>
                      <Input
                        value={newPhoneFormat.pattern}
                        onChange={(e) => setNewPhoneFormat({ ...newPhoneFormat, pattern: e.target.value })}
                        placeholder="^(0|\+84)[3|5|7|8|9][0-9]{8}$"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium">{t("phone.example")}</label>
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
                      {t("phone.add")}
                    </Button>
                  </div>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("phone.table.countryCode")}</TableHead>
                    <TableHead>{t("phone.table.countryName")}</TableHead>
                    <TableHead>{t("phone.table.prefix")}</TableHead>
                    <TableHead>{t("phone.table.example")}</TableHead>
                    <TableHead className="text-right">{t("phone.table.actions")}</TableHead>
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
              <CardTitle>{t("status.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{t("status.description")}</p>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">{t("status.fromTo")}</TableHead>
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
          {t("save")}
        </Button>
      </div>
    </>
  )
}

