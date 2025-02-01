"use client";

import { FiPlus } from "react-icons/fi";
import { useStore } from "./lib/store";
import Layout from "./layout/Layout";
import { ClientLayout } from "./layout/ClientLayout";
import EventModal from "./components/calendar/EventModal/EventModal";
import CalendarView from "@/app/components/calendar/CalendarView";

const HomePage = () => {
  const { selectedEvent, setSelectedEvent } = useStore();

  return (
    <ClientLayout>
      <Layout>
        <div className="container">
          <div className="flexColumn">
            <h1>Calendar</h1>
            <div>
              <button
                className="primaryButton flex"
                onClick={() =>
                  setSelectedEvent({
                    id: "",
                    title: "",
                    start: new Date(),
                    end: new Date(),
                    reminders: [],
                  })
                }
              >
                <FiPlus />
                New Event
              </button>
            </div>
          </div>

          <div>
            <CalendarView />
          </div>

          {selectedEvent && <EventModal />}
        </div>
      </Layout>
    </ClientLayout>
  );
};

export default HomePage;
