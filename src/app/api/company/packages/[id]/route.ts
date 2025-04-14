import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Helper function to check if user has access to this package
async function hasAccessToPackage(userId: string, packageId: string) {
  const company = await prisma.company.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!company) return false;

  const pkg = await prisma.package.findUnique({
    where: { id: packageId },
    select: { companyId: true },
  });

  return pkg?.companyId === company.id;
}

// GET: Fetch a single package by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Company admins can view their own packages
    if (session.user.role === "COMPANY_ADMIN") {
      const hasAccess = await hasAccessToPackage(session.user.id, id);
      if (!hasAccess) {
        return NextResponse.json(
          { error: "Permission denied" },
          { status: 403 }
        );
      }
    }
    // Regular users can view any published package
    else if (session.user.role === "USER") {
      const pkg = await prisma.package.findUnique({
        where: { id },
        select: { status: true },
      });
      
      if (pkg?.status !== "PUBLISHED") {
        return NextResponse.json(
          { error: "Package not available" },
          { status: 404 }
        );
      }
    }
    // Admins can view all packages
    else if (!["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "Permission denied" },
        { status: 403 }
      );
    }

    // Fetch the package with all its related data
    const packageData = await prisma.package.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            rating: true,
            verified: true,
          },
        },
        images: {
          orderBy: { position: 'asc' },
        },
        inclusions: true,
        itinerary: {
          orderBy: { day: 'asc' },
        },
        accommodations: true,
        destinations: {
          include: {
            city: {
              include: {
                country: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!packageData) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(packageData);
  } catch (error) {
    console.error("Error fetching package:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH: Update a package
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "COMPANY_ADMIN" && 
        session.user.role !== "ADMIN" && 
        session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Permission denied" },
        { status: 403 }
      );
    }

    const { id } = params;
    const data = await req.json();

    // Company admins can only update their own packages
    if (session.user.role === "COMPANY_ADMIN") {
      const hasAccess = await hasAccessToPackage(session.user.id, id);
      if (!hasAccess) {
        return NextResponse.json(
          { error: "Permission denied" },
          { status: 403 }
        );
      }
    }

    // Update the basic package information
    const updatedPackage = await prisma.package.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription,
        type: data.type,
        durationDays: data.durationDays !== undefined ? parseInt(data.durationDays) : undefined,
        basePrice: data.basePrice !== undefined ? parseFloat(data.basePrice) : undefined,
        discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : null,
        childPrice: data.childPrice ? parseFloat(data.childPrice) : null,
        infantPrice: data.infantPrice ? parseFloat(data.infantPrice) : null,
        status: data.status,
        featured: data.featured,
        bestSeller: data.bestSeller,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        availableSeats: data.availableSeats ? parseInt(data.availableSeats) : null,
      },
    });

    return NextResponse.json({
      message: "Package updated successfully",
      id: updatedPackage.id,
    });
  } catch (error) {
    console.error("Error updating package:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a package
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "COMPANY_ADMIN" && 
        session.user.role !== "ADMIN" && 
        session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Permission denied" },
        { status: 403 }
      );
    }

    const { id } = params;

    // Company admins can only delete their own packages
    if (session.user.role === "COMPANY_ADMIN") {
      const hasAccess = await hasAccessToPackage(session.user.id, id);
      if (!hasAccess) {
        return NextResponse.json(
          { error: "Permission denied" },
          { status: 403 }
        );
      }
    }

    // Check if the package has any active orders
    const activeOrders = await prisma.order.count({
      where: {
        packageId: id,
        status: {
          in: ["PENDING", "CONFIRMED", "PROCESSING"],
        },
      },
    });

    if (activeOrders > 0) {
      return NextResponse.json(
        { error: "Cannot delete package with active orders" },
        { status: 400 }
      );
    }

    // Delete the package
    await prisma.package.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Package deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting package:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 