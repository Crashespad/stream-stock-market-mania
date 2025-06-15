
import { useState } from "react";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminTabContent } from "@/components/admin/AdminTabContent";
import { AdminSessionManager } from "@/components/admin/AdminSessionManager";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <AdminSessionManager>
      {(session, userRole) => (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <div className="container mx-auto px-4 py-8">
            <AdminHeader userRole={userRole} />

            <AdminNavigation 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              userRole={userRole} 
            />

            <div className="mt-8">
              <AdminTabContent activeTab={activeTab} userRole={userRole} />
            </div>
          </div>
        </div>
      )}
    </AdminSessionManager>
  );
};

export default Admin;
