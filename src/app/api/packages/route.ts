// src/app/api/packages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    
    // Parse query parameters
    const type = searchParams.get("type");
    const travelDate = searchParams.get("travelDate");
    const duration = searchParams.get("duration");
    const budget = searchParams.get("budget");
    const hotelRating = searchParams.get("hotelRating");
    const destination = searchParams.get("destination");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";
    
    // Build filters
    const filters: any = {
      status: "PUBLISHED",
    };
    
    if (type) {
      filters.type = type;
    }
    
    if (travelDate) {
      const date = new Date(travelDate);
      filters.startDate = {
        lte: date,
      };
      filters.endDate = {
        gte: date,
      };
    }
    
    if (duration) {
      const [min, max] = duration.split("-").map(Number);
      filters.durationDays = {
        gte: min,
        lte: max || 100,
      };
    }
    
    if (budget) {
      const [min, max] = budget.split("-").map(Number);
      filters.OR = [
        {
          basePrice: {
            gte: min,
            lte: max || 1000000,
          }
        },
        {
          discountPrice: {
            gte: min,
            lte: max || 1000000,
          }
        }
      ];
    }
    
    if (destination) {
      filters.destinations = {
        some: {
          cityId: destination
        }
      };
    }
    
    // Count total packages matching the filters
    const total = await db.package.count({
      where: filters
    });
    
    // Get packages with pagination and sorting
    const packages = await db.package.findMany({
      where: filters,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            verified: true,
          }
        },
        images: {
          where: { isPrimary: true },
          take: 1
        },
        destinations: {
          include: {
            city: {
              include: {
                country: true
              }
            }
          }
        },
        inclusions: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        [sort]: order
      }
    });
    
    // Format the results
    const formattedPackages = packages.map(pkg => ({
      id: pkg.id,
      title: pkg.title,
      slug: pkg.slug,
      type: pkg.type,
      durationDays: pkg.durationDays,
      basePrice: pkg.basePrice.toNumber(),
      discountPrice: pkg.discountPrice?.toNumber(),
      childPrice: pkg.childPrice?.toNumber(),
      infantPrice: pkg.infantPrice?.toNumber(),
      featured: pkg.featured,
      bestSeller: pkg.bestSeller,
      rating: pkg.rating,
      reviewCount: pkg.reviewCount,
      company: pkg.company,
      primaryImage: pkg.images.length > 0 ? pkg.images[0].url : null,
      inclusions: pkg.inclusions,
      destinations: pkg.destinations,
    }));
    
    return NextResponse.json({
      packages: formattedPackages,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      }
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    if (session.user.role !== "COMPANY_ADMIN" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }
    
    // Get company ID for the current user
    const company = await db.company.findUnique({
      where: { userId: session.user.id }
    });
    
    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }
    
    // Parse request body
    const data = await req.json();
    
    // Create slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
    
    // Check if slug exists
    const existingPackage = await db.package.findUnique({
      where: { slug }
    });
    
    const finalSlug = existingPackage 
      ? `${slug}-${Math.floor(Math.random() * 1000)}`
      : slug;
    
    // Create the package
    const newPackage = await db.package.create({
      data: {
        companyId: company.id,
        title: data.title,
        slug: finalSlug,
        description: data.description,
        shortDescription: data.shortDescription,
        type: data.type,
        durationDays: data.durationDays,
        basePrice: data.basePrice,
        discountPrice: data.discountPrice,
        childPrice: data.childPrice,
        infantPrice: data.infantPrice,
        status: data.status || "DRAFT",
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        availableSeats: data.availableSeats,
      }
    });
    
    // Create destinations
    if (data.destinations && data.destinations.length > 0) {
      await db.packageDestination.createMany({
        data: data.destinations.map((dest: any) => ({
          packageId: newPackage.id,
          cityId: dest.cityId,
          nights: dest.nights
        }))
      });
    }
    
    // Create inclusions
    if (data.inclusions && data.inclusions.length > 0) {
      await db.packageInclusion.createMany({
        data: data.inclusions.map((inc: any) => ({
          packageId: newPackage.id,
          name: inc.name,
          icon: inc.icon,
          included: inc.included ?? true
        }))
      });
    }
    
    // Create itinerary
    if (data.itinerary && data.itinerary.length > 0) {
      await db.itineraryItem.createMany({
        data: data.itinerary.map((item: any) => ({
          packageId: newPackage.id,
          day: item.day,
          title: item.title,
          description: item.description
        }))
      });
    }
    
    // Create accommodations
    if (data.accommodations && data.accommodations.length > 0) {
      await db.accommodation.createMany({
        data: data.accommodations.map((acc: any) => ({
          packageId: newPackage.id,
          name: acc.name,
          location: acc.location,
          stars: acc.stars,
          description: acc.description,
          nights: acc.nights,
          roomType: acc.roomType,
          distanceToHaram: acc.distanceToHaram
        }))
      });
    }
    
    return NextResponse.json({
      id: newPackage.id,
      slug: newPackage.slug,
      message: "Package created successfully"
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating package:", error);
    return NextResponse.json(
      { error: "Failed to create package" },
      { status: 500 }
    );
  }
}

// src/app/api/packages/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    
    // Find package by ID or slug
    const where = id.length === 24 // Assuming cuid length
      ? { id }
      : { slug: id };
    
    const packageData = await db.package.findUnique({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            verified: true,
            email: true,
            phone: true,
            description: true,
          }
        },
        images: {
          orderBy: {
            order: 'asc'
          }
        },
        destinations: {
          include: {
            city: {
              include: {
                country: true
              }
            }
          }
        },
        inclusions: true,
        itinerary: {
          orderBy: {
            day: 'asc'
          }
        },
        accommodations: true,
      }
    });
    
    if (!packageData) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }
    
    // Format the response
    const formattedPackage = {
      id: packageData.id,
      title: packageData.title,
      slug: packageData.slug,
      description: packageData.description,
      shortDescription: packageData.shortDescription,
      type: packageData.type,
      durationDays: packageData.durationDays,
      basePrice: packageData.basePrice.toNumber(),
      discountPrice: packageData.discountPrice?.toNumber(),
      childPrice: packageData.childPrice?.toNumber(),
      infantPrice: packageData.infantPrice?.toNumber(),
      status: packageData.status,
      featured: packageData.featured,
      bestSeller: packageData.bestSeller,
      startDate: packageData.startDate,
      endDate: packageData.endDate,
      availableSeats: packageData.availableSeats,
      bookedSeats: packageData.bookedSeats,
      rating: packageData.rating,
      reviewCount: packageData.reviewCount,
      company: packageData.company,
      images: packageData.images,
      destinations: packageData.destinations,
      inclusions: packageData.inclusions,
      itinerary: packageData.itinerary,
      accommodations: packageData.accommodations,
      createdAt: packageData.createdAt,
      updatedAt: packageData.updatedAt,
    };
    
    return NextResponse.json(formattedPackage);
  } catch (error) {
    console.error("Error fetching package:", error);
    return NextResponse.json(
      { error: "Failed to fetch package" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get the package
    const packageData = await db.package.findUnique({
      where: { id },
      include: { company: true }
    });
    
    if (!packageData) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }
    
    // Check if user can edit this package
    const userCompany = await db.company.findUnique({
      where: { userId: session.user.id }
    });
    
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";
    const isOwner = userCompany && userCompany.id === packageData.companyId;
    
    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }
    
    // Parse request body
    const data = await req.json();
    
    // Update slug if title changed
    let slug = packageData.slug;
    if (data.title && data.title !== packageData.title) {
      slug = data.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-");
      
      // Check if slug exists
      const existingPackage = await db.package.findFirst({
        where: { 
          slug,
          id: { not: id }
        }
      });
      
      if (existingPackage) {
        slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
      }
    }
    
    // Update the package
    const updatedPackage = await db.package.update({
      where: { id },
      data: {
        title: data.title,
        slug,
        description: data.description,
        shortDescription: data.shortDescription,
        type: data.type,
        durationDays: data.durationDays,
        basePrice: data.basePrice,
        discountPrice: data.discountPrice,
        childPrice: data.childPrice,
        infantPrice: data.infantPrice,
        status: data.status,
        startDate: data.startDate ? new Date(data.startDate) : packageData.startDate,
        endDate: data.endDate ? new Date(data.endDate) : packageData.endDate,
        availableSeats: data.availableSeats,
      }
    });
    
    // Update destinations if provided
    if (data.destinations) {
      // Delete existing destinations
      await db.packageDestination.deleteMany({
        where: { packageId: id }
      });
      
      // Create new destinations
      if (data.destinations.length > 0) {
        await db.packageDestination.createMany({
          data: data.destinations.map((dest: any) => ({
            packageId: id,
            cityId: dest.cityId,
            nights: dest.nights
          }))
        });
      }
    }
    
    // Update inclusions if provided
    if (data.inclusions) {
      // Delete existing inclusions
      await db.packageInclusion.deleteMany({
        where: { packageId: id }
      });
      
      // Create new inclusions
      if (data.inclusions.length > 0) {
        await db.packageInclusion.createMany({
          data: data.inclusions.map((inc: any) => ({
            packageId: id,
            name: inc.name,
            icon: inc.icon,
            included: inc.included ?? true
          }))
        });
      }
    }
    
    // Update itinerary if provided
    if (data.itinerary) {
      // Delete existing itinerary
      await db.itineraryItem.deleteMany({
        where: { packageId: id }
      });
      
      // Create new itinerary
      if (data.itinerary.length > 0) {
        await db.itineraryItem.createMany({
          data: data.itinerary.map((item: any) => ({
            packageId: id,
            day: item.day,
            title: item.title,
            description: item.description
          }))
        });
      }
    }
    
    // Update accommodations if provided
    if (data.accommodations) {
      // Delete existing accommodations
      await db.accommodation.deleteMany({
        where: { packageId: id }
      });
      
      // Create new accommodations
      if (data.accommodations.length > 0) {
        await db.accommodation.createMany({
          data: data.accommodations.map((acc: any) => ({
            packageId: id,
            name: acc.name,
            location: acc.location,
            stars: acc.stars,
            description: acc.description,
            nights: acc.nights,
            roomType: acc.roomType,
            distanceToHaram: acc.distanceToHaram
          }))
        });
      }
    }
    
    return NextResponse.json({
      id: updatedPackage.id,
      slug: updatedPackage.slug,
      message: "Package updated successfully"
    });
  } catch (error) {
    console.error("Error updating package:", error);
    return NextResponse.json(
      { error: "Failed to update package" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get the package
    const packageData = await db.package.findUnique({
      where: { id },
      include: { 
        company: true,
        orders: {
          where: {
            status: {
              notIn: ['CANCELLED', 'REFUNDED']
            }
          }
        }
      }
    });
    
    if (!packageData) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }
    
    // Check if user can delete this package
    const userCompany = await db.company.findUnique({
      where: { userId: session.user.id }
    });
    
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";
    const isOwner = userCompany && userCompany.id === packageData.companyId;
    
    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }
    
    // Check if package has active orders
    if (packageData.orders.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete package with active orders" },
        { status: 400 }
      );
    }
    
    // Delete related records
    await db.$transaction([
      db.packageDestination.deleteMany({ where: { packageId: id } }),
      db.packageInclusion.deleteMany({ where: { packageId: id } }),
      db.itineraryItem.deleteMany({ where: { packageId: id } }),
      db.accommodation.deleteMany({ where: { packageId: id } }),
      db.packageImage.deleteMany({ where: { packageId: id } }),
      db.wishlistItem.deleteMany({ where: { packageId: id } }),
      db.package.delete({ where: { id } })
    ]);
    
    return NextResponse.json({
      message: "Package deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting package:", error);
    return NextResponse.json(
      { error: "Failed to delete package" },
      { status: 500 }
    );
  }
}

// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    
    // Parse query parameters
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    
    // Build filters
    const filters: any = {};
    
    // For regular users, only show their own orders
    if (session.user.role === "USER") {
      filters.userId = session.user.id;
    }
    
    // For company admins, only show orders for their packages
    if (session.user.role === "COMPANY_ADMIN") {
      const company = await db.company.findUnique({
        where: { userId: session.user.id }
      });
      
      if (!company) {
        return NextResponse.json(
          { error: "Company not found" },
          { status: 404 }
        );
      }
      
      filters.package = {
        companyId: company.id
      };
    }
    
    // Add status filter if provided
    if (status) {
      filters.status = status;
    }
    
    // Count total orders matching the filters
    const total = await db.order.count({
      where: filters
    });
    
    // Get orders with pagination
    const orders = await db.order.findMany({
      where: filters,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        },
        package: {
          select: {
            id: true,
            title: true,
            slug: true,
            durationDays: true,
            company: {
              select: {
                id: true,
                name: true,
                slug: true,
              }
            },
            images: {
              where: { isPrimary: true },
              take: 1,
              select: {
                url: true
              }
            }
          }
        },
        travelers: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            type: true,
          }
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            method: true,
            createdAt: true,
          }
        }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Format the results
    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      totalAmount: order.totalAmount.toNumber(),
      adultCount: order.adultCount,
      childCount: order.childCount,
      infantCount: order.infantCount,
      departureDate: order.departureDate,
      createdAt: order.createdAt,
      user: order.user,
      package: {
        ...order.package,
        primaryImage: order.package.images.length > 0 ? order.package.images[0].url : null,
      },
      travelers: order.travelers,
      paymentStatus: getPaymentStatus(order.payments),
      lastPayment: order.payments.length > 0 
        ? order.payments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]
        : null,
    }));
    
    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      }
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// Helper function to determine overall payment status
function getPaymentStatus(payments: any[]) {
  if (payments.length === 0) return "PENDING";
  
  const hasCompleted = payments.some(p => p.status === "COMPLETED");
  const hasFailed = payments.some(p => p.status === "FAILED");
  const hasRefunded = payments.some(p => p.status === "REFUNDED");
  
  if (hasRefunded) return "REFUNDED";
  if (hasCompleted) return "PAID";
  if (hasFailed) return "FAILED";
  return "PENDING";
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Parse request body
    const data = await req.json();
    
    // Validate required fields
    if (!data.packageId || !data.departureDate || !data.travelers || !data.totalAmount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Verify package exists and is available
    const packageData = await db.package.findUnique({
      where: { id: data.packageId },
      select: {
        id: true,
        title: true,
        status: true,
        availableSeats: true,
        bookedSeats: true,
        companyId: true,
      }
    });
    
    if (!packageData) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }
    
    if (packageData.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "Package is not available for booking" },
        { status: 400 }
      );
    }
    
    // Check if there are enough seats available
    const totalTravelers = (data.adultCount || 1) + (data.childCount || 0) + (data.infantCount || 0);
    
    if (packageData.availableSeats && packageData.bookedSeats + totalTravelers > packageData.availableSeats) {
      return NextResponse.json(
        { error: "Not enough seats available" },
        { status: 400 }
      );
    }
    
    // Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 1000)}`;
    
    // Create order
    const order = await db.order.create({
      data: {
        userId: session.user.id,
        packageId: data.packageId,
        orderNumber,
        status: "PENDING",
        totalAmount: data.totalAmount,
        adultCount: data.adultCount || 1,
        childCount: data.childCount || 0,
        infantCount: data.infantCount || 0,
        departureDate: new Date(data.departureDate),
        specialRequests: data.specialRequests,
      }
    });
    
    // Create travelers
    const travelers = await Promise.all(
      data.travelers.map((traveler: any) =>
        db.traveler.create({
          data: {
            orderId: order.id,
            userId: session.user.id, // All travelers belong to the logged-in user
            firstName: traveler.firstName,
            lastName: traveler.lastName,
            type: traveler.type,
            dateOfBirth: traveler.dateOfBirth ? new Date(traveler.dateOfBirth) : null,
            gender: traveler.gender,
            nationality: traveler.nationality,
            passportNumber: traveler.passportNumber,
            passportExpiry: traveler.passportExpiry ? new Date(traveler.passportExpiry) : null,
          }
        })
      )
    );
    
    // Update package booked seats
    await db.package.update({
      where: { id: data.packageId },
      data: {
        bookedSeats: packageData.bookedSeats + totalTravelers
      }
    });
    
    // Create a notification for the company
    await db.notification.create({
      data: {
        userId: session.user.id, // User who made the booking
        title: "New Order Received",
        message: `Your order ${orderNumber} for ${packageData.title} has been placed successfully and is awaiting confirmation.`,
        type: "order",
        link: `/orders/${order.id}`,
      }
    });
    
    // Find company owner and create notification
    const company = await db.company.findUnique({
      where: { id: packageData.companyId },
      select: { userId: true }
    });
    
    if (company) {
      await db.notification.create({
        data: {
          userId: company.userId, // Company owner
          title: "New Booking Received",
          message: `New booking (${orderNumber}) has been received for ${packageData.title}. Please review and confirm.`,
          type: "order",
          link: `/company/orders/${order.id}`,
        }
      });
    }
    
    return NextResponse.json({
      id: order.id,
      orderNumber,
      message: "Order created successfully"
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}