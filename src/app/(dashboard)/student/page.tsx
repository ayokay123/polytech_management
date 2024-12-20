import Performance from "@/components/Performance";
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
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule (4A)</h1>
          <ScheduleContainer type="classId" id={classItem[0].id} />
        </div>
      </div>
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Performance userId={userId!} />
      </div>
    </div>
  );
};

export default StudentPage;
