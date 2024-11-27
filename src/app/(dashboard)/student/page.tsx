import ScheduleContainer from "@/components/ScheduleContainer";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const StudentPage = async () => {
  const { userId } = await auth();

  console.log({ userId });

  const classItem = await prisma.class.findMany({
    where: {
      students: { some: { id: userId! } },
    },
  });

  console.log(classItem);
  return (
    <div className="p-4 flex gap-4">
      <div className="w-full">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule (4A)</h1>
          <ScheduleContainer type="classId" id={classItem[0].id} />
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
