"use client";

import React, { useEffect, useState } from "react";

interface CourseFormData {
  course_id?: number;
  name: string;
  join_code: string;
  geolocation_latitude: number | null;
  geolocation_longitude: number | null;
  present_threshold_minutes: number;
  late_threshold_minutes: number;
}

interface CourseFormProps {
  onClose: () => void;
  onUpdate?: (courseId: number, updatedData: CourseFormData) => void;
  onCreate?: (newData: CourseFormData) => void;
  onDelete?: (courseId: number) => void;
  initialCourseData?: CourseFormData;
}

const emptyCourseForm = (): CourseFormData => ({
  name: "",
  join_code: "",
  geolocation_latitude: null,
  geolocation_longitude: null,
  present_threshold_minutes: 0,
  late_threshold_minutes: 0,
});

const CourseForm: React.FC<CourseFormProps> = ({
  onClose,
  onUpdate,
  onCreate,
  onDelete,
  initialCourseData,
}) => {
  const [formData, setFormData] = useState<CourseFormData>(
    initialCourseData
      ? {
          ...initialCourseData,
          geolocation_latitude: initialCourseData.geolocation_latitude ?? null,
          geolocation_longitude:
            initialCourseData.geolocation_longitude ?? null,
          present_threshold_minutes:
            initialCourseData.present_threshold_minutes ?? 0,
          late_threshold_minutes:
            initialCourseData.late_threshold_minutes ?? 0,
        }
      : emptyCourseForm(),
  );

  useEffect(() => {
    if (initialCourseData) {
      setFormData({
        ...initialCourseData,
        geolocation_latitude: initialCourseData.geolocation_latitude ?? null,
        geolocation_longitude: initialCourseData.geolocation_longitude ?? null,
        present_threshold_minutes:
          initialCourseData.present_threshold_minutes ?? 0,
        late_threshold_minutes:
          initialCourseData.late_threshold_minutes ?? 0,
      });
      return;
    }

    setFormData(emptyCourseForm());
  }, [initialCourseData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const isNumberField =
      id.includes("threshold") || id.includes("geolocation");

    setFormData((prevData) => ({
      ...prevData,
      [id]: isNumberField ? (value === "" ? null : Number(value)) : value,
    }));
  };

  const handleAction = (actionType: "update" | "create") => {
    if (!formData.name.trim() || !formData.join_code.trim()) {
      alert("Course Name and Join Code cannot be empty.");
      return;
    }

    if (
      formData.present_threshold_minutes < 0 ||
      formData.late_threshold_minutes < 0
    ) {
      alert("Thresholds cannot be negative.");
      return;
    }

    const dataToSubmit: CourseFormData = {
      ...formData,
      geolocation_latitude:
        formData.geolocation_latitude === null
          ? null
          : Number(formData.geolocation_latitude),
      geolocation_longitude:
        formData.geolocation_longitude === null
          ? null
          : Number(formData.geolocation_longitude),
    };

    if (
      actionType === "update" &&
      onUpdate &&
      formData.course_id !== undefined
    ) {
      onUpdate(formData.course_id, dataToSubmit);
    } else if (actionType === "create" && onCreate) {
      onCreate(dataToSubmit);
    }

    onClose();
  };

  const handleDelete = () => {
    if (
      onDelete &&
      formData.course_id !== undefined &&
      window.confirm(
        "Are you sure you want to delete this course? This action cannot be undone.",
      )
    ) {
      onDelete(formData.course_id);
      onClose();
    }
  };

  const isUpdateMode =
    initialCourseData && initialCourseData.course_id !== undefined;

  return (
    <div className="modal-overlay">
      <div className="modal-card max-w-2xl p-5 sm:p-6">
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#221515]">
            {isUpdateMode ? "Edit Course" : "Create New Course"}
          </h2>
          <p className="text-sm leading-6 text-[#6a5555]">
            Review the course details and thresholds before saving changes.
          </p>
        </div>

        <div className="mt-6 space-y-5">
          <section className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-[#3b2323]"
                >
                  Course Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="h-13 w-full rounded-2xl border border-black/10 bg-[#faf5f2] px-4 text-sm text-[#221515] outline-none transition focus:border-[#890000]/25 focus:ring-4 focus:ring-[#890000]/10"
                  placeholder="e.g., Introduction to Python"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="join_code"
                  className="mb-2 block text-sm font-medium text-[#3b2323]"
                >
                  Join Code
                </label>
                <input
                  id="join_code"
                  type="text"
                  className="h-13 w-full rounded-2xl border border-black/10 bg-[#faf5f2] px-4 text-sm text-[#221515] outline-none transition focus:border-[#890000]/25 focus:ring-4 focus:ring-[#890000]/10"
                  placeholder="e.g., PYTHON101"
                  value={formData.join_code}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#3b2323]">
                Attendance thresholds
              </p>
              <div className="h-px w-full bg-[#e6d6d1]" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="present_threshold_minutes"
                  className="mb-2 block text-sm font-medium text-[#3b2323]"
                >
                  Present Threshold
                </label>
                <p className="mb-2 text-xs leading-5 text-[#7a6363]">
                  Students arriving within this window are still marked
                  present.
                </p>
                <div className="relative">
                  <input
                    id="present_threshold_minutes"
                    type="number"
                    className="h-13 w-full rounded-2xl border border-black/10 bg-[#faf5f2] px-4 pr-14 text-sm text-[#221515] outline-none transition focus:border-[#890000]/25 focus:ring-4 focus:ring-[#890000]/10"
                    value={formData.present_threshold_minutes}
                    onChange={handleChange}
                    min="0"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b6d6d]">
                    Min
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="late_threshold_minutes"
                  className="mb-2 block text-sm font-medium text-[#3b2323]"
                >
                  Late Threshold
                </label>
                <p className="mb-2 text-xs leading-5 text-[#7a6363]">
                  Students arriving after this limit are marked late.
                </p>
                <div className="relative">
                  <input
                    id="late_threshold_minutes"
                    type="number"
                    className="h-13 w-full rounded-2xl border border-black/10 bg-[#faf5f2] px-4 pr-14 text-sm text-[#221515] outline-none transition focus:border-[#890000]/25 focus:ring-4 focus:ring-[#890000]/10"
                    value={formData.late_threshold_minutes}
                    onChange={handleChange}
                    min="0"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b6d6d]">
                    Min
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-[#3b2323]">
                Attendance location
              </p>
              <p className="text-xs leading-5 text-[#7a6363]">
                Update the coordinates used to validate the class area.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="geolocation_latitude"
                  className="mb-2 block text-sm font-medium text-[#3b2323]"
                >
                  Latitude
                </label>
                <input
                  id="geolocation_latitude"
                  type="number"
                  step="0.0001"
                  className="h-13 w-full rounded-2xl border border-black/10 bg-[#faf5f2] px-4 text-sm text-[#221515] outline-none transition focus:border-[#890000]/25 focus:ring-4 focus:ring-[#890000]/10"
                  placeholder="e.g., 10.3157"
                  value={formData.geolocation_latitude ?? ""}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="geolocation_longitude"
                  className="mb-2 block text-sm font-medium text-[#3b2323]"
                >
                  Longitude
                </label>
                <input
                  id="geolocation_longitude"
                  type="number"
                  step="0.0001"
                  className="h-13 w-full rounded-2xl border border-black/10 bg-[#faf5f2] px-4 text-sm text-[#221515] outline-none transition focus:border-[#890000]/25 focus:ring-4 focus:ring-[#890000]/10"
                  placeholder="e.g., 123.8854"
                  value={formData.geolocation_longitude ?? ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-2xl bg-[#f0e6e3] px-5 text-sm font-medium text-[#3a2626] transition hover:bg-[#e8dbd6]"
          >
            Cancel
          </button>

          <div className="flex gap-3">
            {isUpdateMode && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="h-11 rounded-2xl bg-red-600 px-5 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={() => handleAction(isUpdateMode ? "update" : "create")}
              className="h-11 rounded-2xl bg-myred px-5 text-sm font-medium text-white shadow-[0_14px_28px_rgba(45,3,3,0.18)] transition hover:bg-[#740000]"
            >
              {isUpdateMode ? "Update Course" : "Create Course"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
