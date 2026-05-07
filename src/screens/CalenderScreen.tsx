// src/pages/CalendarScreen.tsx
import React from 'react';
import MainCalendar from '../components/dashboard/calender/MainCalender';
import Schedulebar from '../components/dashboard/calender/Schedulebar';
import Deadlinebar from '../components/dashboard/calender/Deadlinebar';

const CalendarScreen = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Schedulebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <MainCalendar />
        </div>
      </main>

      <Deadlinebar />
    </div>
  );
};

export default CalendarScreen;