"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, X, Save, Pencil, Globe } from "lucide-react";
import type { Faculty, StudentStatus, Program } from "@/types/student";
import { toast } from "react-toastify";

import programService from "@/services/programService";
import statusService from "@/services/statusService";
import facultyService from "@/services/facultyService";
import { useLocale, useTranslations } from "next-intl";
import { Translation } from "@/types";
import { TranslationManager } from "@/components/translation-manager";
import { mockInitialTranslationsFaculty } from "@/data/initial-data";

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

  // Translation states
  const [translationOpen, setTranslationOpen] = useState(false);
  const [translationEntityType, setTranslationEntityType] = useState<
    "faculty" | "status" | "program" | null
  >(null);
  const [translationEntityId, setTranslationEntityId] = useState<string | null>(
    null
  );
  const [translations, setTranslations] = useState<Translation | null>(mockInitialTranslationsFaculty);

  const t = useTranslations("settingsDialog");
  const locale = useLocale();

  // Translation fields for each entity type
  const facultyTranslationFields = [
    {
      key: "facultyName",
      label: t("facultyName"),
      type: "input" as const,
      required: true,
    },
  ];

  const statusTranslationFields = [
    {
      key: "statusName",
      label: t("statusName"),
      type: "input" as const,
      required: true,
    },
  ];

  const programTranslationFields = [
    {
      key: "programName",
      label: t("programName"),
      type: "input" as const,
      required: true,
    },
  ];

  // Faculty functions
  const addFaculty = async () => {
    try {
      if (newFacultyName.trim() === "") return;

      const newId = `faculty-${Date.now()}`;
      setLocalFaculties([
        ...localFaculties,
        { id: newId, name: newFacultyName },
      ]);
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
      setEditingProgram(null);
      const data = await programService.updateProgram({ id, name, faculty });
      setLocalPrograms(data.programs);
    } catch (error) {
      console.error(error);
      toast.error(t("programs.updateError"));
    }
  };

  const deleteProgram = async (id: string) => {
    try {
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

  // Translation handlers
  const handleTranslateButtonClick = async (
    entityType: "faculty" | "status" | "program",
    entityId: string
  ) => {
    try {
      let data: Translation | null = null;
      if (entityType === "faculty") {
        data = await facultyService.getTranslationFacultyById(entityId);
      } else if (entityType === "status") {
        data = await statusService.getTranslationStatusById(entityId);
      } else if (entityType === "program") {
        data = await programService.getTranslationProgramById(entityId);
      }
      setTranslations(data);
      setTranslationEntityType(entityType);
      setTranslationEntityId(entityId);
    } catch (error: any) {
      toast.error(error || t("translation.loadError"));
    }
  };

  const handleUpdateTranslations = async (
    updatedTranslations: Translation | null
  ) => {
    if (!translationEntityType || !translationEntityId) return;

    try {
      if (translationEntityType === "faculty") {
        const data = await facultyService.updateTranslationFaculty(
          translationEntityId,
          updatedTranslations
        );
        setLocalFaculties((prevFaculties) =>
          prevFaculties.map((faculty) =>
            faculty.id === translationEntityId
              ? {
                  ...faculty,
                  name:
                    updatedTranslations?.[locale]?.facultyName || faculty.name,
                }
              : faculty
          )
        );
      } else if (translationEntityType === "status") {
        const data = await statusService.updateTranslationStatus(
          translationEntityId,
          updatedTranslations
        );
        setLocalStatuses((prevStatuses) =>
          prevStatuses.map((status) =>
            status.id === translationEntityId
              ? {
                  ...status,
                  name:
                    updatedTranslations?.[locale]?.statusName || status.name,
                }
              : status
          )
        );
      } else if (translationEntityType === "program") {
        const data = await programService.updateTranslationProgram(
          translationEntityId,
          updatedTranslations
        );
        setLocalPrograms((prevPrograms) =>
          prevPrograms.map((program) =>
            program.id === translationEntityId
              ? {
                  ...program,
                  name:
                    updatedTranslations?.[locale]?.programName || program.name,
                }
              : program
          )
        );
      }
      setTranslationOpen(false);
      setTranslations(mockInitialTranslationsFaculty);
      setTranslationEntityType(null);
      setTranslationEntityId(null);
      toast.success(t("translation.updateSuccess"));
    } catch (error: any) {
      toast.error(error || t("translation.updateError"));
    }
  };

  useEffect(() => {
    if (translations && translationEntityType && translationEntityId) {
      setTranslationOpen(true);
    }
  }, [translations, translationEntityType, translationEntityId]);

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
                            onClick={() =>
                              handleTranslateButtonClick("faculty", faculty.id)
                            }
                          >
                            <Globe className="h-4 w-4" />
                          </Button>
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
                            onClick={() =>
                              handleTranslateButtonClick("status", status.id)
                            }
                          >
                            <Globe className="h-4 w-4" />
                          </Button>
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
                              onClick={() =>
                                handleTranslateButtonClick("program", program.id)
                              }
                            >
                              <Globe className="h-4 w-4" />
                            </Button>
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
          < Save className="h-4 w-4 mr-2" />
          {t("saveChanges")}
        </Button>
      </div>

      <TranslationManager
        open={translationOpen}
        onOpenChange={setTranslationOpen}
        entityType={translationEntityType || "faculty"}
        entityId={translationEntityId || ""}
        fields={
          translationEntityType === "faculty"
            ? facultyTranslationFields
            : translationEntityType === "status"
            ? statusTranslationFields
            : programTranslationFields
        }
        initialTranslations={translations}
        onSave={handleUpdateTranslations}
      />
    </>
  );
}