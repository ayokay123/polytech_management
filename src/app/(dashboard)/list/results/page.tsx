import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { resultsData, role } from "@/lib/data";
import prisma from "@/lib/prisma";
import {
  Class,
  Prisma,
  Result,
  Student,
  Subject,
  Teacher,
} from "@prisma/client";
import Image from "next/image";

const columns = [
  {
    header: "Subject Name",
    accessor: "name",
  },
  {
    header: "Student",
    accessor: "student",
  },
  {
    header: "Score",
    accessor: "score",
    className: "hidden md:table-cell",
  },
  {
    header: "Teacher",
    accessor: "teacher",
    className: "hidden md:table-cell",
  },
  {
    header: "Class",
    accessor: "class",
    className: "hidden md:table-cell",
  },
  {
    header: "Date",
    accessor: "date",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const renderRow = (
  item: Result & { student: Student } & {
    exam: {
      lesson: {
        class: Class;
        teacher: Teacher;
      };
    };
  } & {
    assignment: {
      lesson: {
        class: Class;
        teacher: Teacher;
      };
    };
  }
) => {
  const assessment = item.exam || item.assignment;
  const isExam = "startTime" in assessment;

  return (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        {assessment.lesson.class.name}
      </td>
      <td>{item.student.name + " " + item.student.surname}</td>
      <td className="hidden md:table-cell">{item.score}</td>
      <td className="hidden md:table-cell">
        {assessment.lesson.teacher.name +
          " " +
          assessment.lesson.teacher.surname}
      </td>
      <td className="hidden md:table-cell">{assessment.lesson.class.name}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(
          isExam ? assessment.startTime : assessment.startDate
        )}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {role === "admin" ||
            (role === "teacher" && (
              <>
                <FormModal table="result" type="update" data={item} />
                <FormModal table="result" type="delete" id={item.id} />
              </>
            ))}
        </div>
      </td>
    </tr>
  );
};

const ResultListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  const query: Prisma.ResultWhereInput = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "studentId":
            query.studentId = value;
            break;
          case "search":
            query.OR = [
              { exam: { title: { contains: value, mode: "insensitive" } } },
              { student: { name: { contains: value, mode: "insensitive" } } },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  const [results, count] = await prisma.$transaction([
    prisma.result.findMany({
      where: query,
      include: {
        student: { select: { name: true, surname: true } },
        exam: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
        assignment: {
          include: {
            lesson: {
              select: {
                class: { select: { name: true } },
                teacher: { select: { name: true, surname: true } },
              },
            },
          },
        },
      },
      take: 10,
      skip: 10 * (p - 1),
    }),
    prisma.result.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Results</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" ||
              (role === "teacher" && (
                <FormModal table="result" type="create" />
              ))}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={results} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ResultListPage;
