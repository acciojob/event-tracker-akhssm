import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Popup from "react-popup";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/App.css";

const localizer = momentLocalizer(moment);

const App = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleSelectSlot = ({ start }) => {
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
                setEvents([
                  ...events,
                  {
                    title,
                    location,
                    start,
                    end: start,
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

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);

    Popup.create({
      title: "Edit / Delete Event",
      buttons: {
        left: [
          {
            text: "Delete",
            className: "mm-popup__btn mm-popup__btn--danger",
            action: () => {
              setEvents(events.filter(e => e !== event));
              Popup.close();
            }
          }
        ],
        right: [
          {
            text: "Edit",
            className: "mm-popup__btn mm-popup__btn--info",
            action: () => {
              const newTitle = prompt("Edit title", event.title);
              if (newTitle) {
                setEvents(
                  events.map(e =>
                    e === event ? { ...e, title: newTitle } : e
                  )
                );
              }
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
      <Calendar
        selectable
        localizer={localizer}
        events={events}
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
