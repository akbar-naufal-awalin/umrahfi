import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Helper function to check if company has access to this order
async function hasAccessToOrder(userId: string, orderId: string) {
  const company = await prisma.company.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!company) return false;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      package: {
        select: { companyId: true },
      },
    },
  });

  return order?.package?.companyId === company.id;
}

// PATCH: Update order status
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

    // Company admins can only update their own packages' orders
    if (session.user.role === "COMPANY_ADMIN") {
      const hasAccess = await hasAccessToOrder(session.user.id, id);
      if (!hasAccess) {
        return NextResponse.json(
          { error: "Permission denied" },
          { status: 403 }
        );
      }
    }

    // Validate status
    const validStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(data.status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: data.status,
      },
    });

    // If the order is completed or cancelled, we may need to update package availability
    if (data.status === "COMPLETED" || data.status === "CANCELLED") {
      const order = await prisma.order.findUnique({
        where: { id },
        select: {
          packageId: true,
          travelers: {
            select: {
              id: true,
            },
          },
        },
      });

      if (order && order.packageId) {
        // If cancelled, increase available seats
        if (data.status === "CANCELLED") {
          await prisma.package.update({
            where: { id: order.packageId },
            data: {
              bookedSeats: {
                decrement: order.travelers.length,
              },
            },
          });
        }
      }
    }

    // Add a note about the status change
    await prisma.orderNote.create({
      data: {
        orderId: id,
        type: "STATUS_CHANGE",
        note: `Order status changed to ${data.status}`,
        createdBy: session.user.name || "System",
      },
    });

    return NextResponse.json({
      message: "Order status updated successfully",
      id: updatedOrder.id,
      status: updatedOrder.status,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 