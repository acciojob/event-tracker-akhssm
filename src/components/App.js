import React, { useState } from "react";
import BigCalendar, { momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Popup from "react-popup";

import "react-popup/style.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/App.css";

const localizer = momentLocalizer(moment);
const Calendar = BigCalendar;

const App = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("ALL");

  const isPast = (date) => moment(date).isBefore(moment(), "day");

  const filteredEvents = events.filter(event => {
    if (filter === "PAST") return isPast(event.start);
    if (filter === "UPCOMING") return !isPast(event.start);
    return true;
  });

  const openCreatePopup = (startDate) => {
    Popup.create({
      title: "Create Event",
      content: (
        <div>
          <input placeholder="Event Title" id="event-title" />
          <input placeholder="Event Location" id="event-location" />
        </div>
      ),
      buttons: {
        right: [
          {
            text: "Save",
            className: "mm-popup__btn",
            action: () => {
              const title = document.getElementById("event-title").value;
              const location = document.getElementById("event-location").value;

              if (title) {
                setEvents(prev => [
                  ...prev,
                  {
                    title,
                    location,
                    start: startDate,
                    end: startDate,
                    allDay: true
                  }
                ]);
              }
              Popup.close();
            }
          }
        ]
      }
    });
  };

  const handleSelectSlot = ({ start }) => openCreatePopup(start);

  return (
    <div>
      <Popup />

      <div>
        <div><button className="btn" onClick={() => setFilter("ALL")}>All</button></div>
        <div><button className="btn" onClick={() => setFilter("PAST")}>Past</button></div>
        <div><button className="btn" onClick={() => setFilter("UPCOMING")}>Upcoming</button></div>
        <div><button className="btn" onClick={() => openCreatePopup(new Date())}>Add Event</button></div>
      </div>

      <div style={{ display: "none" }}>
        {filteredEvents.map((event, index) => (
          <button
            key={index}
            style={{
              backgroundColor: isPast(event.start)
                ? "rgb(222, 105, 135)"
                : "rgb(140, 189, 76)"
            }}
          >
            {event.title}
          </button>
        ))}
      </div>

      <Calendar
        selectable
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectSlot={handleSelectSlot}
      />
    </div>
  );
};

export default App;
