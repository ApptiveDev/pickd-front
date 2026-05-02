import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <Sidebar
        open={open}
        onClose={() => setOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}