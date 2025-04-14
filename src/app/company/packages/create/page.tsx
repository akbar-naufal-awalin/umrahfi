"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/toast";

// Form validation schema
const packageSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().optional(),
  type: z.string().min(1, "Package type is required"),
  durationDays: z.string().min(1, "Duration is required"),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  basePrice: z.string().min(1, "Base price is required"),
  discountPrice: z.string().optional(),
  childPrice: z.string().optional(),
  infantPrice: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  availableSeats: z.string().optional(),
  status: z.string().default("DRAFT"),
});

type PackageFormData = z.infer<typeof packageSchema>;

export default function CreatePackagePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      status: "DRAFT",
    },
  });

  // Check authentication and role
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (session && session.user.role !== "COMPANY_ADMIN") {
    router.push("/");
    return null;
  }

  const onSubmit = async (data: PackageFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/company/packages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create package");
      }
      
      const result = await response.json();
      
      toast.success("Package created successfully");
      
      // Redirect to the packages list
      setTimeout(() => {
        router.push("/company/packages");
      }, 1500);
    } catch (error) {
      console.error("Error creating package:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create package");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Create New Package</h1>
          <Link 
            href="/company/packages"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Packages
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Package Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Package Title</label>
                  <Input
                    {...register("title")}
                    placeholder="Enter package title"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug (Optional)</label>
                  <Input
                    {...register("slug")}
                    placeholder="custom-url-slug"
                  />
                  <p className="text-xs text-gray-500">
                    Leave empty to generate automatically from title
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Package Type</label>
                  <Select {...register("type")}>
                    <option value="">Select package type</option>
                    <option value="MAKKAH_ONLY">Makkah Only</option>
                    <option value="MADINAH_ONLY">Madinah Only</option>
                    <option value="COMBINED">Combined Package</option>
                    <option value="SPECIAL">Special Package</option>
                    <option value="RAMADAN">Ramadan Package</option>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-red-500">{errors.type.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration (Days)</label>
                  <Input
                    {...register("durationDays")}
                    type="number"
                    min="1"
                    placeholder="Enter duration in days"
                  />
                  {errors.durationDays && (
                    <p className="text-sm text-red-500">{errors.durationDays.message}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Short Description</label>
                <Input
                  {...register("shortDescription")}
                  placeholder="Brief description for listings"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Full Description</label>
                <textarea
                  {...register("description")}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-32"
                  placeholder="Detailed package description"
                />
              </div>

              {/* Pricing */}
              <h3 className="text-lg font-medium pt-4">Pricing</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Base Price (SAR)</label>
                  <Input
                    {...register("basePrice")}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Base price per person"
                  />
                  {errors.basePrice && (
                    <p className="text-sm text-red-500">{errors.basePrice.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Discount Price (SAR)</label>
                  <Input
                    {...register("discountPrice")}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Discounted price (optional)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Child Price (SAR)</label>
                  <Input
                    {...register("childPrice")}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Price for children (optional)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Infant Price (SAR)</label>
                  <Input
                    {...register("infantPrice")}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Price for infants (optional)"
                  />
                </div>
              </div>

              {/* Availability */}
              <h3 className="text-lg font-medium pt-4">Availability</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date (Optional)</label>
                  <Input
                    {...register("startDate")}
                    type="date"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date (Optional)</label>
                  <Input
                    {...register("endDate")}
                    type="date"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Available Seats</label>
                  <Input
                    {...register("availableSeats")}
                    type="number"
                    min="0"
                    placeholder="Number of available seats"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select {...register("status")}>
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </Select>
                <p className="text-xs text-gray-500">
                  You can save as draft and publish later
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href="/company/packages">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-secondary text-white"
              >
                {isSubmitting ? "Creating..." : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Package
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </>
  );
} 