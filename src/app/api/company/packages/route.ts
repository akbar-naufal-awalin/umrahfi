import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET: Fetch all packages for a company
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

    if (session.user.role !== "COMPANY_ADMIN") {
      return NextResponse.json(
        { error: "Permission denied" },
        { status: 403 }
      );
    }

    const userId = session.user.id;

    // Get company ID for the logged-in user
    const company = await prisma.company.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    const companyId = company.id;

    // Get packages for this company
    const packages = await prisma.package.findMany({
      where: { companyId },
      include: {
        images: {
          take: 1,
          orderBy: { position: 'asc' },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the response
    const formattedPackages = packages.map(pkg => {
      // Calculate average rating
      const totalRating = pkg.reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = pkg.reviews.length > 0 ? totalRating / pkg.reviews.length : 0;

      return {
        id: pkg.id,
        title: pkg.title,
        slug: pkg.slug,
        type: pkg.type,
        durationDays: pkg.durationDays,
        basePrice: pkg.basePrice,
        discountPrice: pkg.discountPrice,
        status: pkg.status,
        featured: pkg.featured,
        bestSeller: pkg.bestSeller,
        startDate: pkg.startDate,
        endDate: pkg.endDate,
        availableSeats: pkg.availableSeats,
        bookedSeats: pkg.bookedSeats,
        createdAt: pkg.createdAt,
        primaryImage: pkg.images[0]?.fileUrl || null,
        rating: avgRating,
        reviewCount: pkg.reviews.length,
      };
    });

    return NextResponse.json(formattedPackages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Create a new package
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "COMPANY_ADMIN") {
      return NextResponse.json(
        { error: "Permission denied" },
        { status: 403 }
      );
    }

    const userId = session.user.id;
    const data = await req.json();

    // Get company for the logged-in user
    const company = await prisma.company.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    // Validate required fields
    const requiredFields = ['title', 'type', 'durationDays', 'basePrice'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate slug from title
    const slug = data.slug || data.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Create the package
    const newPackage = await prisma.package.create({
      data: {
        companyId: company.id,
        title: data.title,
        slug,
        description: data.description || null,
        shortDescription: data.shortDescription || null,
        type: data.type,
        durationDays: parseInt(data.durationDays),
        basePrice: parseFloat(data.basePrice),
        discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : null,
        childPrice: data.childPrice ? parseFloat(data.childPrice) : null,
        infantPrice: data.infantPrice ? parseFloat(data.infantPrice) : null,
        status: data.status || "DRAFT",
        featured: data.featured || false,
        bestSeller: data.bestSeller || false,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        availableSeats: data.availableSeats ? parseInt(data.availableSeats) : null,
      },
    });

    // Handle inclusions if provided
    if (data.inclusions && Array.isArray(data.inclusions)) {
      for (const inclusion of data.inclusions) {
        await prisma.packageInclusion.create({
          data: {
            packageId: newPackage.id,
            title: inclusion.title,
            description: inclusion.description || null,
            isIncluded: inclusion.isIncluded || true,
          },
        });
      }
    }

    // Handle destinations if provided
    if (data.destinations && Array.isArray(data.destinations)) {
      for (const destination of data.destinations) {
        await prisma.packageDestination.create({
          data: {
            packageId: newPackage.id,
            cityId: destination.cityId,
            durationDays: destination.durationDays || 1,
            order: destination.order || 1,
          },
        });
      }
    }

    return NextResponse.json(
      { message: "Package created successfully", id: newPackage.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating package:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 