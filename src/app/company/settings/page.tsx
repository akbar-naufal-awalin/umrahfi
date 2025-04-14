"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Upload } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/toast";

// Form validation schema
const companySchema = z.object({
  name: z.string().min(3, "Company name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required"),
  website: z.string().url("Invalid website URL").or(z.string().length(0)),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().min(1, "Country is required"),
});

type CompanyFormData = z.infer<typeof companySchema>;

interface CompanyData extends CompanyFormData {
  id: string;
  logo?: string;
  coverImage?: string;
  verified: boolean;
  status: string;
}

export default function CompanySettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
  });

  // Check authentication and role
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (session && session.user.role !== "COMPANY_ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  // Fetch company data
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await fetch("/api/company/profile");
        if (!response.ok) {
          throw new Error("Failed to fetch company data");
        }
        const data = await response.json();
        setCompany(data);
        setLogoPreview(data.logo || null);
        setCoverPreview(data.coverImage || null);
        
        // Set form values
        reset({
          name: data.name,
          email: data.email,
          phone: data.phone,
          website: data.website || "",
          description: data.description || "",
          shortDescription: data.shortDescription || "",
          address: data.address || "",
          city: data.city || "",
          country: data.country,
        });
      } catch (error) {
        console.error("Error fetching company data:", error);
        toast.error("Failed to load company data");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchCompanyData();
    }
  }, [session, toast, reset]);

  // Handle logo change
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // Handle cover image change
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  // Upload image
  const uploadImage = async (file: File, type: 'logo' | 'cover') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await fetch('/api/company/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload ${type}`);
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      throw error;
    }
  };

  const onSubmit = async (data: CompanyFormData) => {
    if (!company) return;
    
    setIsSubmitting(true);
    
    try {
      let logoUrl = company.logo;
      let coverUrl = company.coverImage;

      // Upload logo if changed
      if (logoFile) {
        logoUrl = await uploadImage(logoFile, 'logo');
      }

      // Upload cover if changed
      if (coverFile) {
        coverUrl = await uploadImage(coverFile, 'cover');
      }

      const response = await fetch("/api/company/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          logo: logoUrl,
          coverImage: coverUrl,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update company profile");
      }
      
      toast.success("Company profile updated successfully");
    } catch (error) {
      console.error("Error updating company profile:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading...</div>;
  }

  if (!company) {
    return <div>Error loading company data</div>;
  }

  return (
    <>
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
      
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Company Settings</h1>
          <p className="text-gray-500 mt-2">
            Manage your company profile and settings
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Company Profile */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company Name</label>
                    <Input
                      {...register("name")}
                      placeholder="Your company name"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <Input
                        {...register("email")}
                        type="email"
                        placeholder="company@example.com"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number</label>
                      <Input
                        {...register("phone")}
                        placeholder="+966 XX XXX XXXX"
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Website (Optional)</label>
                    <Input
                      {...register("website")}
                      placeholder="https://yourcompany.com"
                    />
                    {errors.website && (
                      <p className="text-sm text-red-500">{errors.website.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Short Description</label>
                    <Input
                      {...register("shortDescription")}
                      placeholder="Brief description of your company"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Description</label>
                    <textarea
                      {...register("description")}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-32"
                      placeholder="Detailed description of your company"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Address</label>
                    <Input
                      {...register("address")}
                      placeholder="Street address"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">City</label>
                      <Input
                        {...register("city")}
                        placeholder="City"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Country</label>
                      <Select {...register("country")}>
                        <option value="">Select a country</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="Kuwait">Kuwait</option>
                        <option value="Qatar">Qatar</option>
                        <option value="Bahrain">Bahrain</option>
                        <option value="Oman">Oman</option>
                        <option value="Egypt">Egypt</option>
                        <option value="Jordan">Jordan</option>
                        <option value="Turkey">Turkey</option>
                      </Select>
                      {errors.country && (
                        <p className="text-sm text-red-500">{errors.country.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Media and Status */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company Logo</label>
                    {logoPreview && (
                      <div className="mb-4">
                        <img 
                          src={logoPreview} 
                          alt="Company Logo" 
                          className="w-32 h-32 object-contain border rounded-md"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors rounded-md px-4 py-2 text-sm flex items-center">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Logo
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleLogoChange}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended size: 400x400px. Max 2MB.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cover Image</label>
                    {coverPreview && (
                      <div className="mb-4">
                        <img 
                          src={coverPreview} 
                          alt="Cover Image" 
                          className="w-full h-48 object-cover border rounded-md"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors rounded-md px-4 py-2 text-sm flex items-center">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Cover
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleCoverChange}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended size: 1200x400px. Max 2MB.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Status</p>
                      <p className="text-sm text-gray-500">Your account status</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      company.status === "ACTIVE" 
                        ? "bg-green-100 text-green-800" 
                        : company.status === "PENDING" 
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {company.status.charAt(0) + company.status.slice(1).toLowerCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Verification</p>
                      <p className="text-sm text-gray-500">Account verification status</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      company.verified
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {company.verified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-6">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-secondary text-white"
            >
              {isSubmitting ? "Saving..." : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
} 