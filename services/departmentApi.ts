// services/departmentApi.ts
import { Department, CreateTeacherRequest } from "@/types/department";

interface CreateCohortRequest {
  name: string;
  teacherId: string;
  startDate: string;
  endDate: string;
  maxStudents: number;
}

export async function getDepartment(id: string): Promise<Department> {
  const response = await fetch(`/api/departments/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch department");
  }
  return response.json();
}

export async function createTeacher(
  departmentId: string,
  data: CreateTeacherRequest
) { 
  const response = await fetch(`/api/departments/${departmentId}/teachers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create teacher");
  }

  return response.json();
}

export async function createCohort(
  departmentId: string,
  data: CreateCohortRequest
) {
  const response = await fetch(`/api/departments/${departmentId}/cohorts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create cohort");
  }

  return response.json();
}

export async function getAllDepartments() {
  const response = await fetch("/api/departments");
  if (!response.ok) {
    throw new Error("Failed to fetch departments");
  }
  return response.json();
}

export async function getDepartmentCohorts(departmentId: string) {
  const response = await fetch(`/api/departments/${departmentId}/cohorts`);
  if (!response.ok) {
    throw new Error("Failed to fetch cohorts");
  }
  return response.json();
}

export async function getDepartmentTeachers(departmentId: string) {
  const response = await fetch(`/api/departments/${departmentId}/teachers`);
  if (!response.ok) {
    throw new Error("Failed to fetch teachers");
  }
  return response.json();
}

export async function updateCohort(
  departmentId: string,
  cohortId: string,
  data: Partial<CreateCohortRequest>
) {
  const response = await fetch(
    `/api/departments/${departmentId}/cohorts/${cohortId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update cohort");
  }

  return response.json();
}
