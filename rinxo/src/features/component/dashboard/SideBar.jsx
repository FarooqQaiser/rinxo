import { Menu, X, LogOut } from "lucide-react"; // added LogOut icon
import React from "react";
import MenuItem from "./MenuItem";
import { logout } from "../../../utils/auth.utils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SideBar({
  sidebarOpen,
  RissoxLogo,
  isMobile,
  setSidebarOpen,
  menuItems,
  activeMenu,
  setActiveMenu, 
}) {
const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();     
      toast.success("Log Out Successfully");  
      navigate("/login");   // redirect to login
    } catch{
      toast.error("Logout failed"); 
    }
  };
  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Logo + Close button */}
          <div className="flex justify-between items-center mb-8">
            <img src={RissoxLogo} className="w-[70%]" alt="Logo" />
            {isMobile ? (
              <button className="cursor-pointer" onClick={() => setSidebarOpen(false)}>
                <X />
              </button>
            ) : (
              <button className="cursor-pointer" onClick={() => setSidebarOpen(false)}>
                <Menu />
              </button>
            )}
          </div>

          {/* Menu */}
          <div className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <MenuItem
                key={item.id}
                {...item}
                activeMenu={activeMenu}
                setActiveMenu={(id) => {
                  setActiveMenu(id);
                  if (isMobile) setSidebarOpen(false);
                }}
              />
            ))}
          </div>

          {/* Logout Button */}
          <div className="mt-auto">
            <button
              className="flex items-center gap-2 w-full p-2 text-red-600 hover:bg-red-100 rounded-md"
              onClick={handleLogout}
            >
              <LogOut />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
