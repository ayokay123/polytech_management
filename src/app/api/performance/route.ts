import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type PerformanceData = {
  studentId: string;
  attendanceRate: number;
  averageScore: number;
  totalExams: number;
  totalAssignments: number;
};

export async function GET() {
  const students = await prisma.student.findMany({
    include: {
      attendances: true,
      results: true,
    },
  });

  const data: PerformanceData[] = students.map((student) => {
    const totalExams = student.results.filter((r) => r.examId).length;
    const totalAssignments = student.results.filter(
      (r) => r.assignmentId
    ).length;
    const averageScore =
      student.results.reduce((acc, r) => acc + r.score, 0) /
        student.results.length || 0;

    const attendanceRate =
      student.attendances.filter((a) => a.present).length /
        student.attendances.length || 0;

    return {
      studentId: student.id,
      attendanceRate,
      averageScore,
      totalExams,
      totalAssignments,
    };
  });

  return NextResponse.json(data);
}
