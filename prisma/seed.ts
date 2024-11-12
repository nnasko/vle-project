import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  try {
    // Create default admin if doesn't exist
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: "admin@example.com",
      },
    });

    if (!existingAdmin) {
      const hashedAdminPassword = await hash("a", 12);

      const admin = await prisma.user.create({
        data: {
          email: "admin@example.com",
          name: "System Administrator",
          password: hashedAdminPassword,
          role: "ADMIN",
        },
      });

      const department = await prisma.department.create({
        data: {
          name: "Administration",
          code: "ADM", // Added required code field
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
    } else {
      console.log("Default admin account already exists");
    }

    // Create default teacher if doesn't exist
    const existingTeacher = await prisma.user.findUnique({
      where: {
        email: "teacher@example.com",
      },
    });

    if (!existingTeacher) {
      const hashedTeacherPassword = await hash("t", 12);

      const teacher = await prisma.user.create({
        data: {
          email: "teacher@example.com",
          name: "John Smith",
          password: hashedTeacherPassword,
          role: "TEACHER",
        },
      });

      // Create Computer Science department if it doesn't exist
      let csDepartment = await prisma.department.findFirst({
        where: {
          name: "Computer Science",
        },
      });

      if (!csDepartment) {
        csDepartment = await prisma.department.create({
          data: {
            name: "Computer Science",
            code: "CS", // Added required code field
            description:
              "Department of Computer Science and Software Engineering",
            headOfDepartment: teacher.name,
          },
        });
      }

      await prisma.teacher.create({
        data: {
          userId: teacher.id,
          employeeId: "TCH0001",
          position: "Senior Lecturer",
          departmentId: csDepartment.id,
        },
      });

      console.log("Default teacher account created successfully");
    } else {
      console.log("Default teacher account already exists");
    }
  } catch (error) {
    console.error("Error seeding default accounts:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
