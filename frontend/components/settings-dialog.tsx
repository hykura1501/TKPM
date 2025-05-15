"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, X, Save, Pencil } from "lucide-react";
import type { Faculty, StudentStatus, Program } from "@/types/student";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

import programService from "@/services/programService";
import statusService from "@/services/statusService";
import facultyService from "@/services/facultyService";

type SettingsDialogProps = {
  faculties: Faculty[];
  statuses: StudentStatus[];
  programs: Program[];
  onSave: (
    faculties: Faculty[],
    statuses: StudentStatus[],
    programs: Program[]
  ) => void;
};

export function SettingsDialog({
  faculties,
  statuses,
  programs,
  onSave,
}: SettingsDialogProps) {
  const [localFaculties, setLocalFaculties] = useState<Faculty[]>(faculties);
  const [localStatuses, setLocalStatuses] = useState<StudentStatus[]>(statuses);
  const [localPrograms, setLocalPrograms] = useState<Program[]>(programs);

  const [editingFaculty, setEditingFaculty] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [editingProgram, setEditingProgram] = useState<string | null>(null);

  const [newFacultyName, setNewFacultyName] = useState("");
  const [newStatusName, setNewStatusName] = useState("");
  const [newStatusColor, setNewStatusColor] = useState("#22c55e"); // Default green
  const [newProgramName, setNewProgramName] = useState("");
  const [newProgramFaculty, setNewProgramFaculty] = useState(
    faculties[0]?.id || ""
  );

  const t = useTranslations("settingsDialog");

  // useEffect(() => {
  //   return () => {
  //     onSave(localFaculties, localStatuses, localPrograms)
  //   }
  // }, [localFaculties, localStatuses, localPrograms])

  // Faculty functions
  const addFaculty = async () => {
    try {
      if (newFacultyName.trim() === "") return;

      const newId = `faculty-${Date.now()}`;
      setLocalFaculties([
        ...localFaculties,
        { id: newId, name: newFacultyName },
      ]);
      // Call API to update faculties
      const data = await facultyService.addFaculty({ name: newFacultyName });
      setLocalFaculties(data.faculties);
    } catch (error) {
      console.error(error);
      toast.error(t("faculties.addError"));
    }
    setNewFacultyName("");
  };

  const updateFaculty = async (id: string, name: string) => {
    try {
      setLocalFaculties(
        localFaculties.map((f) => (f.id === id ? { ...f, name } : f))
      );
      setEditingFaculty(null);
      const data = await facultyService.updateFaculty({ id, name });
      setLocalFaculties(data.faculties);
    } catch (error) {
      console.error(error);
      toast.error(t("faculties.updateError"));
    }
  };

  const deleteFaculty = async (id: string) => {
    // Check if faculty is used by any program
    const isUsed = localPrograms.some((p) => p.faculty === id);

    if (isUsed) {
      toast.error(t("faculties.deleteInUse"));
      return;
    }

    setLocalFaculties(localFaculties.filter((f) => f.id !== id));
    try {
      const data = await facultyService.deleteFaculty(id);
      setLocalFaculties(data.faculties);
    } catch (error) {
      toast.error(t("faculties.deleteError"));
      console.error(error);
    }
  };

  // Status functions
  const addStatus = async () => {
    try {
      if (newStatusName.trim() === "") return;

      const newId = `status-${Date.now()}`;
      setLocalStatuses([
        ...localStatuses,
        {
          id: newId,
          name: newStatusName,
          color: newStatusColor,
        },
      ]);
      setNewStatusName("");
      const data = await statusService.addStatus({
        name: newStatusName,
        color: newStatusColor,
      });
      setLocalStatuses(data.statuses);
    } catch (error) {
      console.error(error);
      toast.error(t("statuses.addError"));
    }
  };

  const updateStatus = async (id: string, name: string, color: string) => {
    try {
      setLocalStatuses(
        localStatuses.map((s) => (s.id === id ? { ...s, name, color } : s))
      );
      setEditingStatus(null);
      const data = await statusService.updateStatus({ id, name, color });
      setLocalStatuses(data.statuses);
    } catch (error) {
      console.error(error);
      toast.error(t("statuses.updateError"));
    }
  };

  const deleteStatus = async (id: string) => {
    try {
      //setLocalStatuses(localStatuses.filter((s) => s.id !== id));
      const data = await statusService.deleteStatus(id);
      setLocalStatuses(data.statuses);
    } catch (error) {
      console.error(error);
      toast.error(t("statuses.deleteError"));
    }
  };

  // Program functions
  const addProgram = async () => {
    try {
      if (newProgramName.trim() === "" || !newProgramFaculty) return;

      const newId = `program-${Date.now()}`;
      setLocalPrograms([
        ...localPrograms,
        {
          id: newId,
          name: newProgramName,
          faculty: newProgramFaculty,
        },
      ]);
      setNewProgramName("");
      const data = await programService.addProgram({
        name: newProgramName,
        faculty: newProgramFaculty,
      });
      setLocalPrograms(data.programs);
    } catch (error) {
      console.error(error);
      toast.error(t("programs.addError"));
    }
  };

  const updateProgram = async (id: string, name: string, faculty: string) => {
    try {
      // setLocalPrograms(
      //   localPrograms.map((p) => (p.id === id ? { ...p, name, faculty } : p))
      // );
      setEditingProgram(null);
      const data = await programService.updateProgram({ id, name, faculty });
      setLocalPrograms(data.programs);
    }
    catch (error) {
      console.error(error);
      toast.error(t("programs.updateError"));
    }
    
  };

  const deleteProgram = async (id: string) => {
    try {
      // setLocalPrograms(localPrograms.filter((p) => p.id !== id));
      const data = await programService.deleteProgram(id);
      setLocalPrograms(data.programs);
    } catch (error) {
      console.error(error);
      toast.error(t("programs.deleteError"));
    }
  };

  // Save all changes
  const handleSave = () => {
    onSave(localFaculties, localStatuses, localPrograms);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t("title")}</DialogTitle>
        <DialogDescription>{t("description")}</DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="faculties" className="mt-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faculties">{t("tabs.faculties")}</TabsTrigger>
          <TabsTrigger value="statuses">{t("tabs.statuses")}</TabsTrigger>
          <TabsTrigger value="programs">{t("tabs.programs")}</TabsTrigger>
        </TabsList>

        {/* Faculties Tab */}
        <TabsContent value="faculties" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("faculties.list")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder={t("faculties.newPlaceholder")}
                  value={newFacultyName}
                  onChange={(e) => setNewFacultyName(e.target.value)}
                />
                <Button onClick={addFaculty}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("faculties.add")}
                </Button>
              </div>

              <div className="space-y-2">
                {localFaculties.map((faculty) => (
                  <div
                    key={faculty.id}
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    {editingFaculty === faculty.id ? (
                      <div className="flex gap-2 flex-1">
                        <Input
                          defaultValue={faculty.name}
                          onChange={(e) => setNewFacultyName(e.target.value)}
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={() =>
                            updateFaculty(
                              faculty.id,
                              newFacultyName || faculty.name
                            )
                          }
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingFaculty(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span>{faculty.name}</span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingFaculty(faculty.id);
                              setNewFacultyName(faculty.name);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteFaculty(faculty.id)}
                          >
                            <X className="h-4 w-4 text-white" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statuses Tab */}
        <TabsContent value="statuses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("statuses.list")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder={t("statuses.newPlaceholder")}
                  value={newStatusName}
                  onChange={(e) => setNewStatusName(e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="color"
                  value={newStatusColor}
                  onChange={(e) => setNewStatusColor(e.target.value)}
                  className="w-16"
                />
                <Button onClick={addStatus}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("statuses.add")}
                </Button>
              </div>

              <div className="space-y-2">
                {localStatuses.map((status) => (
                  <div
                    key={status.id}
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    {editingStatus === status.id ? (
                      <div className="flex gap-2 flex-1">
                        <Input
                          defaultValue={status.name}
                          onChange={(e) => setNewStatusName(e.target.value)}
                          className="flex-1"
                          autoFocus
                        />
                        <Input
                          type="color"
                          defaultValue={status.color}
                          onChange={(e) => setNewStatusColor(e.target.value)}
                          className="w-16"
                        />
                        <Button
                          size="sm"
                          onClick={() =>
                            updateStatus(
                              status.id,
                              newStatusName || status.name,
                              newStatusColor || status.color
                            )
                          }
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingStatus(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: status.color }}
                          />
                          <span>{status.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingStatus(status.id);
                              setNewStatusName(status.name);
                              setNewStatusColor(status.color);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteStatus(status.id)}
                          >
                            <X className="h-4 w-4 text-white" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Programs Tab */}
        <TabsContent value="programs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("programs.list")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder={t("programs.newPlaceholder")}
                  value={newProgramName}
                  onChange={(e) => setNewProgramName(e.target.value)}
                  className="flex-1"
                />
                <select
                  value={newProgramFaculty}
                  onChange={(e) => setNewProgramFaculty(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  {localFaculties.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
                <Button onClick={addProgram}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("programs.add")}
                </Button>
              </div>

              <div className="space-y-2">
                {localPrograms.map((program) => {
                  const faculty = localFaculties.find(
                    (f) => f.id === program.faculty
                  );

                  return (
                    <div
                      key={program.id}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      {editingProgram === program.id ? (
                        <div className="flex gap-2 flex-1">
                          <Input
                            defaultValue={program.name}
                            onChange={(e) => setNewProgramName(e.target.value)}
                            className="flex-1"
                            autoFocus
                          />
                          <select
                            defaultValue={program.faculty}
                            onChange={(e) =>
                              setNewProgramFaculty(e.target.value)
                            }
                            className="px-3 py-2 border rounded-md"
                          >
                            {localFaculties.map((faculty) => (
                              <option key={faculty.id} value={faculty.id}>
                                {faculty.name}
                              </option>
                            ))}
                          </select>
                          <Button
                            size="sm"
                            onClick={() =>
                              updateProgram(
                                program.id,
                                newProgramName || program.name,
                                newProgramFaculty || program.faculty
                              )
                            }
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingProgram(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col">
                            <span>{program.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {faculty?.name || t("programs.unknownFaculty")}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingProgram(program.id);
                                setNewProgramName(program.name);
                                setNewProgramFaculty(program.faculty);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteProgram(program.id)}
                            >
                              <X className="h-4 w-4 text-white" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-6">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          {t("saveChanges")}
        </Button>
      </div>
    </>
  );
}
