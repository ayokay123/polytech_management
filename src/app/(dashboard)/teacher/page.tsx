import ScheduleContainer from "@/components/ScheduleContainer";
import { auth } from "@clerk/nextjs/server";

const TeacherPage = async () => {
  const { userId } = await auth();
  console.log(userId);
  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      <div className="w-full">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule</h1>
          <ScheduleContainer type="teacherId" id={userId!} />
        </div>
      </div>
    </div>
  );
};

export default TeacherPage;
