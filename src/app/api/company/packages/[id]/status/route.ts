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

// PATCH: Update package status
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

    if (!data.status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

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

    // Validate status
    const validStatuses = ["DRAFT", "PUBLISHED", "INACTIVE"];
    if (!validStatuses.includes(data.status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Update the package status
    const updatedPackage = await prisma.package.update({
      where: { id },
      data: {
        status: data.status,
      },
    });

    return NextResponse.json({
      message: "Package status updated successfully",
      id: updatedPackage.id,
      status: updatedPackage.status,
    });
  } catch (error) {
    console.error("Error updating package status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 