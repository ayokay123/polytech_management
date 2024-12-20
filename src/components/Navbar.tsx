import { getUserRole } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

const Navbar = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;
  const name = ((user?.firstName as string) + " " + user?.lastName) as string;

  return (
    <div className="flex items-center justify-between p-4">
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src="/search.png" alt="search" width={14} height={14} />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] p-2 bg-transparent outline-none"
        />
      </div>
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center">
          <Image src="/message.png" alt="messages" width={20} height={20} />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center">
          <Image
            src="/announcement.png"
            alt="announcements"
            width={20}
            height={20}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm leading-3 font-medium">{name}</span>
          <span className="text-[10px] text-gray-500 text-right">{role}</span>
        </div>
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
