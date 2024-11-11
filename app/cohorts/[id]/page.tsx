// app/cohorts/[id]/page.tsx
"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { CohortDetail } from "@/app/components/CohortDetail";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Cohort } from "@/types/Cohort";

export default function CohortDetailPage() {
  const params = useParams();
  const [cohort, setCohort] = useState<Cohort | null>(null);

  // This would normally be an API call - for now we'll use mock data
  useEffect(() => {
    // Mock fetch cohort data
    setCohort({
      id: 1,
      name: "Software Development 2024A",
      course: "Software Development",
      year: "Year 2",
      startDate: "2024-01-15",
      endDate: "2024-12-20",
      students: [
        {
          id: 1,
          name: "John Doe",
          email: "john.d@example.com",
          status: "present",
          avatar: "/api/placeholder/32/32",
          overallGrade: "A",
          attendance: 95,
        },
        // ... other students
      ],
      lessons: [
        {
          id: 1,
          date: "2024-11-06",
          topic: "Introduction to React",
          description: "Fundamentals of React and component-based architecture",
          materials: ["Slides", "Code Examples"],
          attendance: { present: 18, absent: 2, late: 1 },
        },
        // ... other lessons
      ],
      stats: {
        averageAttendance: 92,
        averageGrade: 85,
        completedLessons: 24,
        upcomingLessons: 12,
      },
    });
  }, [params.id]);

  if (!cohort) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/cohorts">Cohorts</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{cohort.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/cohorts">
            <Button variant="outline" className="mb-4">
              ← Back to Cohorts
            </Button>
          </Link>
          <CohortDetail cohort={cohort} />
        </div>
      </div>
    </div>
  );
}
