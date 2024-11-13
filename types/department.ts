// types/department.ts
export enum UserRole {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
}

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  LATE = "LATE",
  ABSENT = "ABSENT",
  AUTHORIZED = "AUTHORIZED",
}

export enum GradeLevel {
  FIRST_YEAR = "FIRST_YEAR",
  SECOND_YEAR = "SECOND_YEAR",
}

export enum CourseDuration {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
}

export enum ModuleStatus {
  ACTIVE = "ACTIVE",
  REVIEW = "REVIEW",
  ARCHIVED = "ARCHIVED",
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  joinDate: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface EnrollmentTrend {
  id: string;
  departmentId: string;
  month: Date;
  studentCount: number;
}

export interface AttendanceRate {
  id: string;
  departmentId: string;
  week: Date;
  rate: number;
}

export interface LearningOutcome {
  id: string;
  description: string;
  moduleId: string;
}

export interface Assessment {
  id: string;
  type: string;
  weight: number;
  description: string;
  moduleId: string;
}

export interface Topic {
  id: string;
  name: string;
  moduleId: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  headOfDepartment: string;
  duration: CourseDuration;
  staffCount: number;
  studentCount: number;
  status: string;
  isActive: boolean;
  teachers: Teacher[];
  modules: Module[];
  cohorts: Cohort[];
  enrollmentTrends: {
    month: string;
    studentCount: number;
  }[];
  attendanceRates: {
    week: string;
    rate: number;
  }[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  departmentId: string;
  duration: CourseDuration;
  cohorts: Cohort[];
  modules: Module[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Module {
  id: string;
  name: string;
  code: string;
  description?: string;
  year: number;
  credits: number;
  status: ModuleStatus;
}

export interface ModulePrerequisite {
  id: string;
  moduleId: string;
  prerequisiteId: string;
  prerequisite: {
    code: string;
  };
}

export interface TeacherModule {
  id: string;
  teacherId: string;
  moduleId: string;
  module: {
    code: string;
    name: string;
  };
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

export interface TimetableEvent {
  id: string;
  title: string;
  instructor: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  color: string;
  moduleId: string;
  cohortId?: string;
  studentId?: string;
  attendance?: {
    status: AttendanceStatus;
    minutes?: number;
  };
}

export interface AttendanceStats {
  total: number;
  present: number;
  late: number;
  authorizedAbsence: number;
  unauthorizedAbsence: number;
  averageLateness: number;
}

export interface NewLessonRequest {
  moduleId?: string;
  cohortId?: string;
  topic: string;
  description?: string;
  teacherId: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  materials?: string[];
}

export interface TimetableUser {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  departmentId?: string;
  courseId?: string;
  cohort: Cohort;
  attendance: AttendanceStats;
}

export interface Teacher {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  employeeId: string;
  position: string;
  specializations: string[];
  biography?: string;
  officeHours?: string;
  qualifications: string[];
  departmentId: string;
  teachingModules: TeacherModule[];
  cohorts: Cohort[];
  department: {
    name: string;
  };
  isActive: boolean;
}

export interface Admin {
  id: string;
  userId: string;
  user: User;
  employeeId: string;
  departmentId: string;
  role: string;
  responsibilities: string[];
}

export interface Cohort {
  id: string;
  name: string;
  teacher: {
    user: {
      name: string;
      id: string;
    };
  };
  startDate: string;
  endDate: string;
  maxStudents: number;
  currentStudents: number;
  isActive: boolean;
  students: Student[];
}

export interface Student {
  id: string;
  userId: string;
  user: User;
  studentId: string;
  cohortId?: string;
  expectedGraduation: Date;
  currentGrade: GradeLevel;
  overallGrade?: number;
  courseProgress?: number;
  enrollmentDate: Date;
  academicStanding?: string;
  specialNeeds?: string;
  notes?: string;
  emergencyContact?: string;
  previousEducation?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Lesson {
  id: string;
  topic: string;
  description?: string;
  moduleId: string;
  cohortId: string;
  teacherId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  room: string;
  materials: string[];
  attendance: Attendance[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Attendance {
  id: string;
  lessonId: string;
  studentId: string;
  status: AttendanceStatus;
  minutesLate?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Request/Response Types for API Endpoints
export interface CreateTeacherRequest {
  email: string;
  name: string;
  phone?: string;
  position: string;
  specializations?: string[];
  qualifications?: string[];
  biography?: string;
  officeHours?: string;
}

export interface CreateCohortRequest {
  name: string;
  courseId: string;
  teacherId: string;
  startDate: string;
  endDate: string;
}

export interface CreateTeacherResponse {
  teacher: Teacher;
}

export interface CreateCohortResponse {
  cohort: Cohort;
}

export interface DepartmentResponse {
  department: Department;
}
