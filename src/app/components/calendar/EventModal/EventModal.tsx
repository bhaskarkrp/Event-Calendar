"use client";

import { useState, useEffect } from "react";
import { FiX, FiClock, FiTag, FiBell, FiSave } from "react-icons/fi";
import { formatISO } from "date-fns";
import styles from "./EventModal.module.css";
import "../../../global.css";
import { useStore } from "@/app/lib/store";

const EventModal = () => {
  const { selectedEvent, categories, addEvent, updateEvent, setSelectedEvent } =
    useStore();
  const [formData, setFormData] = useState(selectedEvent);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    setFormData(selectedEvent);
  }, [selectedEvent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const eventData = {
      ...formData,
      start: new Date(formData.start),
      end: new Date(formData.end),
    };

    if (formData.id) {
      updateEvent(formData.id, eventData);
    } else {
      addEvent(eventData);
    }
    setSelectedEvent(null);
  };

  if (!formData) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>{formData.id ? "Edit Event" : "New Event"}</h2>
          <button
            onClick={() => setSelectedEvent(null)}
            className={"primaryButton"}
          >
            <FiX size={24} />
          </button>
        </div>

        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={"label"}>Event Title</label>
              <input
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Meeting with team"
                className={"inputTag"}
              />
            </div>

            <div className={styles.timeGrid}>
              <div className={styles.formGroup}>
                <label className={"label"}>
                  <FiClock /> Start Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formatISO(formData.start).slice(0, 16)}
                  className={"inputTag"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      start: new Date(e.target.value),
                      end:
                        new Date(e.target.value) > formData.end
                          ? new Date(e.target.value)
                          : formData.end,
                    })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label className={"label"}>
                  <FiClock /> End Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formatISO(formData.end).slice(0, 16)}
                  className={"inputTag"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      end: new Date(e.target.value),
                      start:
                        new Date(e.target.value) < formData.start
                          ? new Date(e.target.value)
                          : formData.start,
                    })
                  }
                />
              </div>
            </div>

            {categories.length && (
              <div className={styles.formGroup}>
                <label className={"label"}>
                  <FiTag /> Category
                </label>
                <div className={styles.categoryGrid}>
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flexColumn"
                      onClick={() =>
                        setFormData({ ...formData, categoryId: category.id })
                      }
                    >
                      <div
                        key={category.id}
                        className={`${styles.categoryOption} ${
                          formData.categoryId === category.id
                            ? styles.selected
                            : ""
                        }`}
                        style={{ backgroundColor: category.color }}
                        title={category.name}
                      />
                      {category.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={"label"}>
                <FiBell /> Reminders
              </label>
              <div className={styles.reminderGrid}>
                {[15, 30, 60, 1440].map((minutes) => (
                  <button
                    type="button"
                    key={minutes}
                    className={`${styles.reminderOption} ${
                      formData.reminders.includes(minutes)
                        ? styles.selected
                        : ""
                    }`}
                    onClick={() => {
                      const newReminders = formData.reminders.includes(minutes)
                        ? formData.reminders.filter((m) => m !== minutes)
                        : [...formData.reminders, minutes];
                      setFormData({ ...formData, reminders: newReminders });
                    }}
                  >
                    {minutes < 60
                      ? `${minutes} mins before`
                      : `${Math.floor(minutes / 60)} hour${
                          minutes > 60 ? "s" : ""
                        } before`}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={"primaryButton flex"}
                onClick={() => setSelectedEvent(null)}
              >
                Cancel
              </button>
              <button type="submit" className={"primaryButton flex"}>
                <FiSave /> {formData.id ? "Save Changes" : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
