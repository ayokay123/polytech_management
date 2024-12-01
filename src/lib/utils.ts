import { auth, currentUser } from "@clerk/nextjs/server";

const getLatestMonday = (): Date => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  // If it's Sunday (0), calculate next Monday
  const daysUntilNextMonday = dayOfWeek === 0 ? 1 : 0; // If it's Sunday, add 1 to get next Monday, otherwise do nothing
  const latestMonday = new Date(today);

  latestMonday.setDate(
    today.getDate() + ((daysUntilNextMonday + (7 - dayOfWeek)) % 7)
  );

  // Reset time to midnight (optional, for better consistency)
  latestMonday.setHours(0, 0, 0, 0);

  return latestMonday;
};

export const adjustScheduleToCurrentWeek = (
  lessons: { title: string; start: Date; end: Date }[]
): { title: string; start: Date; end: Date }[] => {
  const latestMonday = getLatestMonday();

  return lessons.map((lesson) => {
    const lessonDayOfWeek = lesson.start.getDay();

    const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1;

    const adjustedStartDate = new Date(latestMonday);

    adjustedStartDate.setDate(latestMonday.getDate() + daysFromMonday);
    adjustedStartDate.setHours(
      lesson.start.getHours(),
      lesson.start.getMinutes(),
      lesson.start.getSeconds()
    );
    const adjustedEndDate = new Date(adjustedStartDate);
    adjustedEndDate.setHours(
      lesson.end.getHours(),
      lesson.end.getMinutes(),
      lesson.end.getSeconds()
    );

    return {
      title: lesson.title,
      start: adjustedStartDate,
      end: adjustedEndDate,
    };
  });
};

export const getUserRole = async (): Promise<string | null> => {
  const user = await currentUser();
  return user?.publicMetadata.role as string;
};
