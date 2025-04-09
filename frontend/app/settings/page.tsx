"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cài đặt Hệ thống</h1>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Cài đặt chung</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt chung</CardTitle>
              <CardDescription>Quản lý các cài đặt chung của hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="school-name">Tên trường</Label>
                <Input id="school-name" defaultValue="Trường Đại học ABC" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="academic-year">Năm học hiện tại</Label>
                <Input id="academic-year" defaultValue="2023-2024" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Học kỳ hiện tại</Label>
                <select id="semester" className="w-full p-2 border rounded-md">
                  <option value="1">Học kỳ I</option>
                  <option value="2">Học kỳ II</option>
                  <option value="summer">Học kỳ Hè</option>
                </select>
              </div>

              <Button>Lưu thay đổi</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt thông báo</CardTitle>
              <CardDescription>Quản lý cách bạn nhận thông báo từ hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Thông báo qua email</p>
                  <p className="text-sm text-gray-500">Nhận thông báo qua email khi có thay đổi</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Thông báo trong hệ thống</p>
                  <p className="text-sm text-gray-500">Hiển thị thông báo trong hệ thống</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button>Lưu thay đổi</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt bảo mật</CardTitle>
              <CardDescription>Quản lý cài đặt bảo mật của tài khoản</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                <Input id="current-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Mật khẩu mới</Label>
                <Input id="new-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                <Input id="confirm-password" type="password" />
              </div>

              <Button>Đổi mật khẩu</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

