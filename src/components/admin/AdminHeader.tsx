
interface AdminHeaderProps {
  userRole: string;
}

export const AdminHeader = ({ userRole }: AdminHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
      <p className="text-blue-200">
        Welcome to the admin panel. Your role: <span className="font-semibold capitalize">{userRole}</span>
      </p>
    </div>
  );
};
