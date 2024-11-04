"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  GraduationCap,
  User,
  School,
  Clock,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ProfileProps {
  userRole?: "admin" | "teacher" | "student";
}

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  joinDate: string;
  studentInfo?: {
    course: string;
    year: string;
    studentId: string;
    expectedGraduation: string;
  };
  teacherInfo?: {
    department: string;
    subjects: string[];
    employeeId: string;
    position: string;
  };
  adminInfo?: {
    department: string;
    role: string;
    employeeId: string;
    responsibility: string;
  };
}

const Profile: React.FC<ProfileProps> = ({ userRole = "student" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    avatar: "/api/placeholder/96/96",
    joinDate: "September 2023",
    studentInfo: {
      course: "Software Development",
      year: "2nd Year",
      studentId: "SD2024001",
      expectedGraduation: "2025",
    },
    teacherInfo: {
      department: "Computer Science",
      subjects: ["Web Development", "Python Programming", "Database Design"],
      employeeId: "TCH2024001",
      position: "Senior Lecturer",
    },
    adminInfo: {
      department: "Academic Affairs",
      role: "Academic Coordinator",
      employeeId: "ADM2024001",
      responsibility: "Student Records Management",
    },
  });

  const [editForm, setEditForm] = useState({
    email: profileData.email,
    phone: profileData.phone,
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(profileData.avatar);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setProfileData((prev) => ({
      ...prev,
      email: editForm.email,
      phone: editForm.phone,
      avatar: avatarPreview,
    }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      email: profileData.email,
      phone: profileData.phone,
    });
    setAvatarPreview(profileData.avatar);
    setAvatarFile(null);
    setIsEditing(false);
  };

  const getRoleSpecificInfo = () => {
    switch (userRole) {
      case "student":
        return (
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Course:</span>
              {profileData.studentInfo?.course}
            </div>
            <div className="flex items-center gap-2">
              <School className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Year:</span>
              {profileData.studentInfo?.year}
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Student ID:</span>
              {profileData.studentInfo?.studentId}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Expected Graduation:</span>
              {profileData.studentInfo?.expectedGraduation}
            </div>
          </div>
        );

      case "teacher":
        return (
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <School className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Department:</span>
              {profileData.teacherInfo?.department}
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Position:</span>
              {profileData.teacherInfo?.position}
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Teaching:</span>
              {profileData.teacherInfo?.subjects.join(", ")}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Employee ID:</span>
              {profileData.teacherInfo?.employeeId}
            </div>
          </div>
        );

      case "admin":
        return (
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <School className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Department:</span>
              {profileData.adminInfo?.department}
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Role:</span>
              {profileData.adminInfo?.role}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Employee ID:</span>
              {profileData.adminInfo?.employeeId}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">PROFILE</h1>
          {!isEditing && (
            <Button
              variant="outline"
              className="bg-main hover:bg-second text-white"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        <Card className="bg-neutral-800">
          <CardContent className="p-6">
            {/* Personal Information */}
            <div className="flex items-start gap-6 mb-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarPreview} alt={profileData.name} />
                  <AvatarFallback>
                    {profileData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="mt-2">
                    <Label
                      htmlFor="avatar"
                      className="text-sm text-gray-400 block mb-1"
                    >
                      Change Photo
                    </Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="text-sm w-full"
                    />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {profileData.name}
                </h2>
                <p className="text-gray-400">
                  {userRole &&
                    userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </p>
                <div className="flex items-center gap-2 mt-2 text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>Joined {profileData.joinDate}</span>
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Contact Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-white">
                Contact Information
              </h3>
              <div className="grid gap-4 text-gray-400">
                <div>
                  <Label className="text-gray-400">Email</Label>
                  {isEditing ? (
                    <Input
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="mt-1"
                    />
                  ) : (
                    <div className="mt-1">{profileData.email}</div>
                  )}
                </div>
                <div>
                  <Label className="text-gray-400">Phone</Label>
                  {isEditing ? (
                    <Input
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="mt-1"
                    />
                  ) : (
                    <div className="mt-1">{profileData.phone}</div>
                  )}
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Role Specific Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">
                {userRole === "student"
                  ? "Academic Information"
                  : "Employment Information"}
              </h3>
              <div className="text-gray-300">{getRoleSpecificInfo()}</div>
            </div>

            {/* Edit Mode Buttons */}
            {isEditing && (
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="bg-gray-700 hover:bg-gray-600"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-main hover:bg-second"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
