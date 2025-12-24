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

  const filteredEvents = events.filter(event => {
    const isPast = moment(event.start).isBefore(moment(), "day");
    if (filter === "PAST") return isPast;
    if (filter === "UPCOMING") return !isPast;
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

  const handleSelectSlot = ({ start }) => {
    openCreatePopup(start);
  };

  const handleSelectEvent = (event) => {
    Popup.create({
      title: "Edit / Delete Event",
      content: (
        <div>
          <input
            placeholder="Event Title"
            id="edit-title"
            defaultValue={event.title}
          />
        </div>
      ),
      buttons: {
        left: [
          {
            text: "Delete",
            className: "mm-popup__btn mm-popup__btn--danger",
            action: () => {
              setEvents(prev => prev.filter(e => e !== event));
              Popup.close();
            }
          }
        ],
        right: [
          {
            text: "Save",
            className: "mm-popup__btn mm-popup__btn--info",
            action: () => {
              const newTitle = document.getElementById("edit-title").value;
              setEvents(prev =>
                prev.map(e =>
                  e === event ? { ...e, title: newTitle } : e
                )
              );
              Popup.close();
            }
          }
        ]
      }
    });
  };

  const eventStyleGetter = (event) => {
    const isPast = moment(event.start).isBefore(moment(), "day");
    return {
      style: {
        backgroundColor: isPast
          ? "rgb(222, 105, 135)"   
          : "rgb(140, 189, 76)"   
      }
    };
  };

  return (
    <div>
      <Popup />

      <div>
        <div>
          <button className="btn" onClick={() => setFilter("ALL")}>
            All
          </button>
        </div>

        <div>
          <button className="btn" onClick={() => setFilter("PAST")}>
            Past
          </button>
        </div>

        <div>
          <button className="btn" onClick={() => setFilter("UPCOMING")}>
            Upcoming
          </button>
        </div>

        <div>
          <button
            className="btn"
            onClick={() => openCreatePopup(new Date())}
          >
            Add Event
          </button>
        </div>
      </div>

      <Calendar
        selectable
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
};

export default App;
