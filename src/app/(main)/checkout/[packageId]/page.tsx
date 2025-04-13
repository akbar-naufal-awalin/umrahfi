// src/app/(main)/checkout/[packageId]/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { Package, TravelerType } from "@/types";
import { createOrder } from "@/lib/api";
import { useToast } from "@/hooks/useToast";

interface CheckoutPageProps {
  params: {
    packageId: string;
  };
}

const TravelerSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  dateOfBirth: Yup.date().required("Required"),
  gender: Yup.string().required("Required"),
  nationality: Yup.string().required("Required"),
  passportNumber: Yup.string().required("Required"),
  passportExpiry: Yup.date().required("Required"),
});

const CheckoutSchema = Yup.object().shape({
  departureDate: Yup.date().required("Departure date is required"),
  travelers: Yup.array().of(TravelerSchema),
  specialRequests: Yup.string(),
  termsAccepted: Yup.boolean().oneOf([true], "You must accept the terms and conditions"),
});

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { packageId } = params;
  const [packageDetails, setPackageDetails] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const router = useRouter();
  const toast = useToast();

  // Fetch package details
  useState(() => {
    const fetchPackage = async () => {
      try {
        const response = await fetch(`/api/packages/${packageId}`);
        const data = await response.json();
        setPackageDetails(data);
      } catch (error) {
        console.error("Error fetching package:", error);
        toast.error("Failed to load package details");
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  });

  // Calculate total price
  const calculateTotal = () => {
    if (!packageDetails) return 0;
    
    const adultTotal = adultCount * packageDetails.basePrice;
    const childTotal = childCount * (packageDetails.childPrice || packageDetails.basePrice * 0.75);
    const infantTotal = infantCount * (packageDetails.infantPrice || packageDetails.basePrice * 0.1);
    
    return adultTotal + childTotal + infantTotal;
  };

  // Handle submission
  const handleSubmit = async (values: any) => {
    try {
      const orderData = {
        packageId,
        adultCount,
        childCount,
        infantCount,
        departureDate: values.departureDate,
        specialRequests: values.specialRequests,
        travelers: values.travelers,
        totalAmount: calculateTotal()
      };
      
      const order = await createOrder(orderData);
      
      // Redirect to payment page
      router.push(`/checkout/payment/${order.id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!packageDetails) {
    return <div>Package not found</div>;
  }

  // Generate initial travelers array based on counts
  const generateInitialTravelers = () => {
    const travelers = [];
    
    // Adults
    for (let i = 0; i < adultCount; i++) {
      travelers.push({
        type: "ADULT" as TravelerType,
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        nationality: "",
        passportNumber: "",
        passportExpiry: "",
      });
    }
    
    // Children
    for (let i = 0; i < childCount; i++) {
      travelers.push({
        type: "CHILD" as TravelerType,
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        nationality: "",
        passportNumber: "",
        passportExpiry: "",
      });
    }
    
    // Infants
    for (let i = 0; i < infantCount; i++) {
      travelers.push({
        type: "INFANT" as TravelerType,
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        nationality: "",
        passportNumber: "",
        passportExpiry: "",
      });
    }
    
    return travelers;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      {/* Package Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">{packageDetails.title}</h2>
        <div className="flex flex-wrap gap-4">
          <div>
            <p className="text-gray-600">Duration</p>
            <p className="font-medium">{packageDetails.durationDays} Days</p>
          </div>
          <div>
            <p className="text-gray-600">Company</p>
            <p className="font-medium">{packageDetails.company.name}</p>
          </div>
          <div>
            <p className="text-gray-600">Base Price</p>
            <p className="font-medium">SAR {packageDetails.basePrice.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      {/* Multi-step form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Step indicators */}
        <div className="flex mb-8">
          <div className={`flex-1 text-center pb-2 ${step === 1 ? 'border-b-2 border-secondary font-medium text-secondary' : 'border-b border-gray-200'}`}>
            1. Travelers
          </div>
          <div className={`flex-1 text-center pb-2 ${step === 2 ? 'border-b-2 border-secondary font-medium text-secondary' : 'border-b border-gray-200'}`}>
            2. Details
          </div>
          <div className={`flex-1 text-center pb-2 ${step === 3 ? 'border-b-2 border-secondary font-medium text-secondary' : 'border-b border-gray-200'}`}>
            3. Review & Pay
          </div>
        </div>
        
        {/* Step 1: Traveler Count */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-4">How many travelers?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Adults</h3>
                <p className="text-sm text-gray-600 mb-2">Age 12+</p>
                <div className="flex items-center justify-between">
                  <p className="font-medium">SAR {packageDetails.basePrice.toFixed(2)}</p>
                  <div className="flex items-center">
                    <button 
                      className="bg-gray-200 p-2 rounded-l-md" 
                      onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
                    >
                      -
                    </button>
                    <span className="bg-gray-100 py-2 px-4">{adultCount}</span>
                    <button 
                      className="bg-gray-200 p-2 rounded-r-md" 
                      onClick={() => setAdultCount(adultCount + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Children</h3>
                <p className="text-sm text-gray-600 mb-2">Age 2-11</p>
                <div className="flex items-center justify-between">
                  <p className="font-medium">SAR {(packageDetails.childPrice || packageDetails.basePrice * 0.75).toFixed(2)}</p>
                  <div className="flex items-center">
                    <button 
                      className="bg-gray-200 p-2 rounded-l-md" 
                      onClick={() => setChildCount(Math.max(0, childCount - 1))}
                    >
                      -
                    </button>
                    <span className="bg-gray-100 py-2 px-4">{childCount}</span>
                    <button 
                      className="bg-gray-200 p-2 rounded-r-md" 
                      onClick={() => setChildCount(childCount + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Infants</h3>
                <p className="text-sm text-gray-600 mb-2">Under 2 years</p>
                <div className="flex items-center justify-between">
                  <p className="font-medium">SAR {(packageDetails.infantPrice || packageDetails.basePrice * 0.1).toFixed(2)}</p>
                  <div className="flex items-center">
                    <button 
                      className="bg-gray-200 p-2 rounded-l-md" 
                      onClick={() => setInfantCount(Math.max(0, infantCount - 1))}
                    >
                      -
                    </button>
                    <span className="bg-gray-100 py-2 px-4">{infantCount}</span>
                    <button 
                      className="bg-gray-200 p-2 rounded-r-md" 
                      onClick={() => setInfantCount(infantCount + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg mb-6">
              <div>
                <p className="text-gray-600">Total Price</p>
                <p className="text-xl font-bold">SAR {calculateTotal().toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Travelers</p>
                <p className="font-medium">{adultCount + childCount + infantCount} Total</p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                className="bg-secondary text-white px-6 py-2 rounded-md"
                onClick={() => setStep(2)}
              >
                Continue
              </button>
            </div>
          </div>
        )}
        
        {/* Step 2 & 3: Traveler Details and Review */}
        {step > 1 && (
          <Formik
            initialValues={{
              departureDate: "",
              travelers: generateInitialTravelers(),
              specialRequests: "",
              termsAccepted: false
            }}
            validationSchema={CheckoutSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, isSubmitting }) => (
              <Form>
                {/* Step 2: Traveler Details */}
                {step === 2 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Traveler Details</h2>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 mb-2">Departure Date</label>
                      <Field
                        name="departureDate"
                        type="date"
                        className="w-full border-gray-300 rounded-md"
                      />
                      {errors.departureDate && touched.departureDate && (
                        <div className="text-red-500 text-sm mt-1">{errors.departureDate}</div>
                      )}
                    </div>
                    
                    <FieldArray name="travelers">
                      {() => (
                        <>
                          {values.travelers.map((traveler, index) => (
                            <div key={index} className="mb-8 p-4 border rounded-lg">
                              <h3 className="font-medium mb-4">
                                {traveler.type === 'ADULT' ? 'Adult' : traveler.type === 'CHILD' ? 'Child' : 'Infant'} {index + 1}
                              </h3>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-gray-700 mb-2">First Name</label>
                                  <Field
                                    name={`travelers.${index}.firstName`}
                                    className="w-full border-gray-300 rounded-md"
                                  />
                                  {errors.travelers?.[index]?.firstName && touched.travelers?.[index]?.firstName && (
                                    <div className="text-red-500 text-sm mt-1">{errors.travelers[index].firstName}</div>
                                  )}
                                </div>
                                
                                <div>
                                  <label className="block text-gray-700 mb-2">Last Name</label>
                                  <Field
                                    name={`travelers.${index}.lastName`}
                                    className="w-full border-gray-300 rounded-md"
                                  />
                                  {errors.travelers?.[index]?.lastName && touched.travelers?.[index]?.lastName && (
                                    <div className="text-red-500 text-sm mt-1">{errors.travelers[index].lastName}</div>
                                  )}
                                </div>
                                
                                <div>
                                  <label className="block text-gray-700 mb-2">Date of Birth</label>
                                  <Field
                                    name={`travelers.${index}.dateOfBirth`}
                                    type="date"
                                    className="w-full border-gray-300 rounded-md"
                                  />
                                  {errors.travelers?.[index]?.dateOfBirth && touched.travelers?.[index]?.dateOfBirth && (
                                    <div className="text-red-500 text-sm mt-1">{errors.travelers[index].dateOfBirth}</div>
                                  )}
                                </div>
                                
                                <div>
                                  <label className="block text-gray-700 mb-2">Gender</label>
                                  <Field
                                    as="select"
                                    name={`travelers.${index}.gender`}
                                    className="w-full border-gray-300 rounded-md"
                                  >
                                    <option value="">Select Gender</option>
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                  </Field>
                                  {errors.travelers?.[index]?.gender && touched.travelers?.[index]?.gender && (
                                    <div className="text-red-500 text-sm mt-1">{errors.travelers[index].gender}</div>
                                  )}
                                </div>
                                
                                <div>
                                  <label className="block text-gray-700 mb-2">Nationality</label>
                                  <Field
                                    name={`travelers.${index}.nationality`}
                                    className="w-full border-gray-300 rounded-md"
                                  />
                                  {errors.travelers?.[index]?.nationality && touched.travelers?.[index]?.nationality && (
                                    <div className="text-red-500 text-sm mt-1">{errors.travelers[index].nationality}</div>
                                  )}
                                </div>
                                
                                <div>
                                  <label className="block text-gray-700 mb-2">Passport Number</label>
                                  <Field
                                    name={`travelers.${index}.passportNumber`}
                                    className="w-full border-gray-300 rounded-md"
                                  />
                                  {errors.travelers?.[index]?.passportNumber && touched.travelers?.[index]?.passportNumber && (
                                    <div className="text-red-500 text-sm mt-1">{errors.travelers[index].passportNumber}</div>
                                  )}
                                </div>
                                
                                <div>
                                  <label className="block text-gray-700 mb-2">Passport Expiry Date</label>
                                  <Field
                                    name={`travelers.${index}.passportExpiry`}
                                    type="date"
                                    className="w-full border-gray-300 rounded-md"
                                  />
                                  {errors.travelers?.[index]?.passportExpiry && touched.travelers?.[index]?.passportExpiry && (
                                    <div className="text-red-500 text-sm mt-1">{errors.travelers[index].passportExpiry}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </FieldArray>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 mb-2">Special Requests (optional)</label>
                      <Field
                        as="textarea"
                        name="specialRequests"
                        className="w-full border-gray-300 rounded-md"
                        rows={4}
                      />
                    </div>
                    
                    <div className="flex justify-between">
                      <button 
                        type="button"
                        className="border border-gray-300 px-6 py-2 rounded-md"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </button>
                      
                      <button 
                        type="button"
                        className="bg-secondary text-white px-6 py-2 rounded-md"
                        onClick={() => setStep(3)}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Step 3: Review and Pay */}
                {step === 3 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Review Your Booking</h2>
                    
                    {/* Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h3 className="font-medium mb-2">Package Summary</h3>
                      <p>{packageDetails.title}</p>
                      <p>{packageDetails.durationDays} Days</p>
                      <p>Departure: {values.departureDate}</p>
                    </div>
                    
                    {/* Travelers Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h3 className="font-medium mb-2">Travelers</h3>
                      <p>{adultCount} Adults, {childCount} Children, {infantCount} Infants</p>
                    </div>
                    
                    {/* Pricing */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h3 className="font-medium mb-2">Price Details</h3>
                      <div className="flex justify-between mb-2">
                        <p>Adults ({adultCount} x SAR {packageDetails.basePrice.toFixed(2)})</p>
                        <p>SAR {(adultCount * packageDetails.basePrice).toFixed(2)}</p>
                      </div>
                      {childCount > 0 && (
                        <div className="flex justify-between mb-2">
                          <p>Children ({childCount} x SAR {(packageDetails.childPrice || packageDetails.basePrice * 0.75).toFixed(2)})</p>
                          <p>SAR {(childCount * (packageDetails.childPrice || packageDetails.basePrice * 0.75)).toFixed(2)}</p>
                        </div>
                      )}
                      {infantCount > 0 && (
                        <div className="flex justify-between mb-2">
                          <p>Infants ({infantCount} x SAR {(packageDetails.infantPrice || packageDetails.basePrice * 0.1).toFixed(2)})</p>
                          <p>SAR {(infantCount * (packageDetails.infantPrice || packageDetails.basePrice * 0.1)).toFixed(2)}</p>
                        </div>
                      )}
                      <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                        <p>Total</p>
                        <p>SAR {calculateTotal().toFixed(2)}</p>
                      </div>
                    </div>
                    
                    {/* Terms */}
                    <div className="mb-6">
                      <label className="flex items-start">
                        <Field
                          type="checkbox"
                          name="termsAccepted"
                          className="mt-1 mr-2"
                        />
                        <span>
                          I agree to the <a href="#" className="text-secondary">terms and conditions</a> and <a href="#" className="text-secondary">cancellation policy</a>.
                        </span>
                      </label>
                      {errors.termsAccepted && touched.termsAccepted && (
                        <div className="text-red-500 text-sm mt-1">{errors.termsAccepted}</div>
                      )}
                    </div>
                    
                    <div className="flex justify-between">
                      <button 
                        type="button"
                        className="border border-gray-300 px-6 py-2 rounded-md"
                        onClick={() => setStep(2)}
                      >
                        Back
                      </button>
                      
                      <button 
                        type="submit"
                        className="bg-secondary text-white px-8 py-3 rounded-md font-medium"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                      </button>
                    </div>
                  </div>
                )}
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
}