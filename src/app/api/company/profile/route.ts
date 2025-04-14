import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET: Fetch company profile
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

    // Get company for the logged-in user
    const company = await prisma.company.findUnique({
      where: { userId },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error("Error fetching company profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH: Update company profile
export async function PATCH(req: NextRequest) {
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
    const requiredFields = ['name', 'email', 'phone', 'country'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Update company
    const updatedCompany = await prisma.company.update({
      where: { id: company.id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        website: data.website,
        description: data.description,
        shortDescription: data.shortDescription,
        address: data.address,
        city: data.city,
        country: data.country,
        logo: data.logo,
        coverImage: data.coverImage,
      },
    });

    return NextResponse.json({
      message: "Company profile updated successfully",
      id: updatedCompany.id,
    });
  } catch (error) {
    console.error("Error updating company profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 