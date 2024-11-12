// services/moduleApi.ts

interface CreateModuleRequest {
  name: string;
  code: string;
  description?: string;
  year: number;
  credits: number;
  status?: "ACTIVE" | "REVIEW" | "ARCHIVED";
  learningOutcomes?: string[];
  topics?: string[];
}

export async function getModules(departmentId: string) {
  const response = await fetch(`/api/departments/${departmentId}/modules`);
  if (!response.ok) {
    throw new Error("Failed to fetch modules");
  }
  return response.json();
}

export async function createModule(
  departmentId: string,
  data: CreateModuleRequest
) {
  const response = await fetch(`/api/departments/${departmentId}/modules`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create module");
  }

  return response.json();
}

export async function updateModule(
  departmentId: string,
  moduleId: string,
  data: Partial<CreateModuleRequest>
) {
  const response = await fetch(
    `/api/departments/${departmentId}/modules/${moduleId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update module");
  }

  return response.json();
}

export async function assignTeacherToModule(
  departmentId: string,
  moduleId: string,
  teacherId: string,
  data: {
    startDate: string;
    endDate?: string;
  }
) {
  const response = await fetch(
    `/api/departments/${departmentId}/modules/${moduleId}/teachers`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teacherId,
        ...data,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to assign teacher to module");
  }

  return response.json();
}

export async function removeTeacherFromModule(
  departmentId: string,
  moduleId: string,
  teacherId: string
) {
  const response = await fetch(
    `/api/departments/${departmentId}/modules/${moduleId}/teachers/${teacherId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to remove teacher from module");
  }

  return response.json();
}
