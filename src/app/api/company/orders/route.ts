import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// GET: Fetch all orders for a company
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

    // Get orders for this company
    const orders = await prisma.order.findMany({
      where: {
        package: {
          companyId,
        },
      },
      include: {
        package: {
          select: {
            title: true,
          },
        },
        payment: true,
        travelers: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the response
    const formattedOrders = orders.map(order => {
      // Get the latest payment
      const latestPayment = order.payment.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];

      return {
        id: order.id,
        createdAt: order.createdAt,
        customerName: order.customerName,
        packageName: order.packageName || order.package.title,
        totalAmount: Number(order.totalAmount),
        status: order.status,
        paymentStatus: latestPayment?.status || "PENDING",
        travelersCount: order.travelers.length,
      };
    });

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 