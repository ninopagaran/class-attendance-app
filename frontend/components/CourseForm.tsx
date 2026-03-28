"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const courseFormSchema = z.object({
  name: z.string().min(3, "Course title must be at least 3 characters."),
  join_code: z.string().min(3, "Join code is required."),
  late_threshold_minutes: z.coerce
    .number()
    .min(1, "Must be at least 1 minute."),
  present_threshold_minutes: z.coerce
    .number()
    .min(1, "Must be at least 1 minute."),
  geolocation_latitude: z.coerce
    .number()
    .min(-90, "Invalid latitude")
    .max(90, "Invalid latitude"),
  geolocation_longitude: z.coerce
    .number()
    .min(-180, "Invalid longitude")
    .max(180, "Invalid longitude"),
});

type CourseFormProps = {
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCreate: (course: any) => void;
};

const CourseForm = ({ onClose, onCreate }: CourseFormProps) => {
  const { user, isLoggedIn } = useAuth();

  const form = useForm<z.infer<typeof courseFormSchema>>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: "",
      join_code: "",
      late_threshold_minutes: 15,
      present_threshold_minutes: 5,
      geolocation_latitude: 0.0,
      geolocation_longitude: 0.0,
    },
  });

  // 📍 Auto-detect location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue("geolocation_latitude", position.coords.latitude);
          form.setValue("geolocation_longitude", position.coords.longitude);
          toast.success("Location detected successfully.");
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            toast.error("Location access denied. Please enter it manually.");
          } else {
            toast.error("Could not detect location.");
          }
          console.error("Geolocation error:", error);
        },
      );
    } else {
      toast.error("Geolocation not supported by this browser.");
    }
  }, [form]);

  const onSubmit = async (values: z.infer<typeof courseFormSchema>) => {
    if (!isLoggedIn || !user) {
      toast.error("You must be logged in to create a course.");
      return;
    }

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Course created successfully!");
        onCreate(data.course);
        onClose();
      } else {
        toast.error(data.error || "Failed to create course.");
        console.error("Course creation error:", data.error);
      }
    } catch (error) {
      console.error("Network or unexpected error:", error);
      toast.error(
        `There was an error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card max-w-2xl p-5 sm:p-6">
        <div className="mb-5 space-y-1 text-center">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#221515]">
            New Course
          </h2>
          <p className="text-sm leading-6 text-[#6a5555]">
            Set up the course details and attendance location before inviting
            students.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <section className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <label className="mb-2 block text-sm font-medium text-[#3b2323]">
                        Course Name
                      </label>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Course name"
                          className="h-13 rounded-2xl border-black/10 bg-[#faf5f2] px-4 text-sm text-[#221515]"
                        />
                      </FormControl>
                      <FormMessage className="min-h-[16px] text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="join_code"
                  render={({ field }) => (
                    <FormItem>
                      <label className="mb-2 block text-sm font-medium text-[#3b2323]">
                        Join Code
                      </label>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Join code"
                          className="h-13 rounded-2xl border-black/10 bg-[#faf5f2] px-4 text-sm text-[#221515]"
                        />
                      </FormControl>
                      <FormMessage className="min-h-[16px] text-xs" />
                    </FormItem>
                  )}
                />
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
                <FormField
                  control={form.control}
                  name="present_threshold_minutes"
                  render={({ field }) => (
                    <FormItem>
                      <label className="mb-2 block text-sm font-medium text-[#3b2323]">
                        Present Threshold
                      </label>
                      <p className="mb-2 text-xs leading-5 text-[#7a6363]">
                        Students arriving within this window are still marked
                        present.
                      </p>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type="number"
                            placeholder="5"
                            className="h-13 rounded-2xl border-black/10 bg-[#faf5f2] px-4 pr-14 text-sm text-[#221515]"
                          />
                          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b6d6d]">
                            Min
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage className="min-h-[16px] pt-1.5 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="late_threshold_minutes"
                  render={({ field }) => (
                    <FormItem>
                      <label className="mb-2 block text-sm font-medium text-[#3b2323]">
                        Late Threshold
                      </label>
                      <p className="mb-2 text-xs leading-5 text-[#7a6363]">
                        Students arriving after this limit are marked late.
                      </p>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type="number"
                            placeholder="15"
                            className="h-13 rounded-2xl border-black/10 bg-[#faf5f2] px-4 pr-14 text-sm text-[#221515]"
                          />
                          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8b6d6d]">
                            Min
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage className="min-h-[16px] pt-1.5 text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <section className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#3b2323]">
                  Attendance location
                </p>
                <p className="text-xs leading-5 text-[#7a6363]">
                  Use the detected coordinates or adjust them manually for the
                  class area.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="geolocation_latitude"
                  render={({ field }) => (
                    <FormItem>
                      <label className="mb-2 block text-sm font-medium text-[#3b2323]">
                        Latitude
                      </label>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Latitude"
                          className="h-13 rounded-2xl border-black/10 bg-[#faf5f2] px-4 text-sm text-[#221515]"
                        />
                      </FormControl>
                      <FormMessage className="min-h-[16px] pt-1.5 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="geolocation_longitude"
                  render={({ field }) => (
                    <FormItem>
                      <label className="mb-2 block text-sm font-medium text-[#3b2323]">
                        Longitude
                      </label>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Longitude"
                          className="h-13 rounded-2xl border-black/10 bg-[#faf5f2] px-4 text-sm text-[#221515]"
                        />
                      </FormControl>
                      <FormMessage className="min-h-[16px] pt-1.5 text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <div className="flex justify-end gap-3 border-t border-black/8 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-11 rounded-2xl border-black/10 bg-[#f0e6e3] px-5 text-[#3a2626] hover:bg-[#e8dbd6]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-11 rounded-2xl bg-myred px-5 text-white hover:bg-[#740000]"
              >
                Create
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CourseForm;
