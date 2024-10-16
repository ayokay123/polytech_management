import UserCard from "@/components/UserCard";

const AdminPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row ">
      {/* Left */}
      <div className="w-full lg:w-2/3">
        {/* User Cards */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="students" />
          <UserCard type="teachers" />
          <UserCard type="parents" />
          <UserCard type="staffs" />
        </div>
      </div>
      {/* RIght */}
      <div className="w-full lg:w-1/3">right</div>
    </div>
  );
};

export default AdminPage;
