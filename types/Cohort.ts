export type AttendanceStatus = "present" | "absent" | "late" | "not-marked";

export interface Student {
  id: number;
  name: string;
  email: string;
  status: AttendanceStatus;
  avatar: string;
  overallGrade: string;
  attendance: number;
}

export interface Lesson {
  id: number;
  date: string;
  topic: string;
  description: string;
  materials: string[];
  attendance: {
    present: number;
    absent: number;
    late: number;
  };
}

export interface Cohort {
  id: number;
  name: string;
  course: string;
  year: string;
  startDate: string;
  endDate: string;
  students: Student[];
  lessons: Lesson[];
  stats: {
    averageAttendance: number;
    averageGrade: number;
    completedLessons: number;
    upcomingLessons: number;
  };
}
