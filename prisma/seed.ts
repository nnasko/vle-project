import {
  PrismaClient,
  GradeLevel,
  UserRole,
  AttendanceStatus,
} from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  try {
    // Create default admin if doesn't exist
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@example.com" },
    });

    if (!existingAdmin) {
      const hashedAdminPassword = await hash("a", 12);
      const admin = await prisma.user.create({
        data: {
          email: "admin@example.com",
          name: "System Administrator",
          password: hashedAdminPassword,
          role: UserRole.ADMIN,
        },
      });

      const department = await prisma.department.create({
        data: {
          name: "Administration",
          code: "ADM",
          description: "System Administration Department",
          headOfDepartment: admin.name,
        },
      });

      await prisma.admin.create({
        data: {
          userId: admin.id,
          employeeId: "ADM0001",
          role: "System Administrator",
          departmentId: department.id,
        },
      });

      console.log("Default admin account created successfully");
    }

    // Create Software Development Department
    const sdDepartment = await prisma.department.create({
      data: {
        name: "Software Development",
        code: "SD",
        description: "Department of Software Development and Engineering",
        headOfDepartment: "Dr. Sarah Johnson",
        duration: "FULL_TIME",
      },
    });

    // Create E-Sports Department
    const esDepartment = await prisma.department.create({
      data: {
        name: "E-Sports",
        code: "ES",
        description: "Department of E-Sports and Competitive Gaming",
        headOfDepartment: "Prof. Michael Chen",
        duration: "FULL_TIME",
      },
    });

    // Create teachers for Software Development
    const sdTeachers = await Promise.all([
      // Lead Teacher
      createTeacher({
        email: "sarah.johnson@example.com",
        name: "Dr. Sarah Johnson",
        position: "Head of Department",
        departmentId: sdDepartment.id,
        employeeId: "SD001",
      }),
      // Regular Teacher
      createTeacher({
        email: "david.wilson@example.com",
        name: "David Wilson",
        position: "Senior Lecturer",
        departmentId: sdDepartment.id,
        employeeId: "SD002",
      }),
    ]);

    // Create teachers for E-Sports
    const esTeachers = await Promise.all([
      // Lead Teacher
      createTeacher({
        email: "michael.chen@example.com",
        name: "Prof. Michael Chen",
        position: "Head of Department",
        departmentId: esDepartment.id,
        employeeId: "ES001",
      }),
      // Regular Teacher
      createTeacher({
        email: "anna.smith@example.com",
        name: "Anna Smith",
        position: "Senior Lecturer",
        departmentId: esDepartment.id,
        employeeId: "ES002",
      }),
    ]);

    // Create cohorts
    const sdCohort = await prisma.cohort.create({
      data: {
        name: "SD2024A",
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-12-20"),
        maxStudents: 25,
        currentStudents: 20,
        departmentId: sdDepartment.id,
        teacherId: sdTeachers[1].id, // Assign to regular teacher
      },
    });

    const esCohort = await prisma.cohort.create({
      data: {
        name: "ES2024A",
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-12-20"),
        maxStudents: 25,
        currentStudents: 20,
        departmentId: esDepartment.id,
        teacherId: esTeachers[1].id, // Assign to regular teacher
      },
    });

    // Create students and their attendance records
    const createStudentsWithAttendance = async (
      cohort: any,
      prefix: string
    ) => {
      for (let i = 0; i < 20; i++) {
        const student = await createStudent({
          email: `${prefix}.student${i + 1}@example.com`,
          name: `${prefix} Student ${i + 1}`,
          cohortId: cohort.id,
          studentId: `${prefix}24${String(i + 1).padStart(3, "0")}`,
        });
      }
    };

    await Promise.all([
      createStudentsWithAttendance(sdCohort, "SD"),
      createStudentsWithAttendance(esCohort, "ES"),
    ]);

    // Create timetable events for both cohorts
    const days = ["MON", "TUE", "WED"];
    const timeSlots = [
      { start: "09:00", end: "10:30" },
      { start: "11:00", end: "12:30" },
      { start: "13:30", end: "15:00" },
      { start: "15:30", end: "17:00" },
    ];

    const sdSubjects = [
      { title: "Programming Fundamentals", room: "Lab 101" },
      { title: "Web Development", room: "Lab 102" },
      { title: "Database Design", room: "Lab 103" },
      { title: "Software Engineering", room: "Lab 104" },
    ];

    const esSubjects = [
      { title: "Game Strategy", room: "ESports Arena 1" },
      { title: "Team Management", room: "ESports Arena 2" },
      { title: "Competition Analysis", room: "ESports Arena 3" },
      { title: "Professional Gaming", room: "ESports Arena 4" },
    ];

    // Create lessons and attendance records for each cohort
    await createLessonsWithAttendance(
      sdCohort.id,
      sdTeachers[1].id,
      days,
      timeSlots,
      sdSubjects
    );
    await createLessonsWithAttendance(
      esCohort.id,
      esTeachers[1].id,
      days,
      timeSlots,
      esSubjects
    );

    console.log("Seed completed successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function createTeacher({
  email,
  name,
  position,
  departmentId,
  employeeId,
}: {
  email: string;
  name: string;
  position: string;
  departmentId: string;
  employeeId: string;
}) {
  const hashedPassword = await hash("password123", 12);
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: UserRole.TEACHER,
    },
  });

  return prisma.teacher.create({
    data: {
      userId: user.id,
      employeeId,
      position,
      departmentId,
      specializations: [],
      qualifications: [],
    },
  });
}

async function createStudent({
  email,
  name,
  cohortId,
  studentId,
}: {
  email: string;
  name: string;
  cohortId: string;
  studentId: string;
}) {
  const hashedPassword = await hash("password123", 12);
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: UserRole.STUDENT,
    },
  });

  return prisma.student.create({
    data: {
      userId: user.id,
      studentId,
      currentGrade: GradeLevel.FIRST_YEAR,
      cohortId,
      expectedGraduation: new Date("2026-07-01"),
    },
  });
}

async function createLessonsWithAttendance(
  cohortId: string,
  teacherId: string,
  days: string[],
  timeSlots: { start: string; end: string }[],
  subjects: { title: string; room: string }[]
) {
  const lessonDate = new Date("2024-11-06");

  for (const day of days) {
    for (let slotIndex = 0; slotIndex < timeSlots.length; slotIndex++) {
      const subject = subjects[slotIndex % subjects.length];
      const slot = timeSlots[slotIndex];

      const startTime = new Date(lessonDate);
      startTime.setHours(
        parseInt(slot.start.split(":")[0]),
        parseInt(slot.start.split(":")[1])
      );

      const endTime = new Date(lessonDate);
      endTime.setHours(
        parseInt(slot.end.split(":")[0]),
        parseInt(slot.end.split(":")[1])
      );

      await prisma.lesson.create({
        data: {
          topic: subject.title,
          cohortId,
          teacherId,
          date: lessonDate,
          startTime,
          endTime,
          room: subject.room,
          materials: ["Slides", "Code Examples"],
        },
      });
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
