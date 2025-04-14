import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

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
    const timeRange = req.nextUrl.searchParams.get("timeRange") || "month";

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

    // Get current date
    const now = new Date();
    
    // Calculate date range based on timeRange
    let startDate = new Date();
    if (timeRange === "week") {
      startDate.setDate(now.getDate() - 7);
    } else if (timeRange === "month") {
      startDate.setMonth(now.getMonth() - 1);
    } else if (timeRange === "year") {
      startDate.setFullYear(now.getFullYear() - 1);
    }

    // Get orders
    const orders = await prisma.order.findMany({
      where: {
        package: { companyId },
        createdAt: { gte: startDate },
      },
      include: {
        payment: true,
        travelers: true,
      },
    });

    // Get packages
    const packages = await prisma.package.count({
      where: { 
        companyId,
        status: "ACTIVE",
      },
    });

    // Get reviews
    const reviews = await prisma.review.findMany({
      where: {
        companyId,
      },
    });

    // Calculate statistics
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === "PENDING").length;
    const completedOrders = orders.filter(order => order.status === "COMPLETED").length;
    
    const totalRevenue = orders.reduce((sum, order) => {
      const payment = order.payment?.find(p => p.status === "SUCCESSFUL");
      return sum + (payment ? Number(payment.amount) : 0);
    }, 0);

    // Calculate revenue change
    // For this, we'd ideally compare with previous period
    // This is a simplified implementation
    const revenueChange = 12.5; // Mock value, would be calculated from real data

    // Prepare chart data based on timeRange
    let chartData = [];
    
    if (timeRange === "week") {
      // Group by day of week
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      chartData = days.map(day => ({
        name: day,
        revenue: 0,
        orders: 0,
      }));
      
      for (const order of orders) {
        const dayIndex = order.createdAt.getDay();
        const payment = order.payment?.find(p => p.status === "SUCCESSFUL");
        
        if (payment) {
          chartData[dayIndex].revenue += Number(payment.amount);
          chartData[dayIndex].orders += 1;
        }
      }
    } else if (timeRange === "month") {
      // Group by day of month
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      chartData = Array.from({ length: daysInMonth }, (_, i) => ({
        name: `${i + 1}`,
        revenue: 0,
        orders: 0,
      }));
      
      for (const order of orders) {
        const dayIndex = order.createdAt.getDate() - 1;
        const payment = order.payment?.find(p => p.status === "SUCCESSFUL");
        
        if (payment && dayIndex >= 0 && dayIndex < daysInMonth) {
          chartData[dayIndex].revenue += Number(payment.amount);
          chartData[dayIndex].orders += 1;
        }
      }
    } else if (timeRange === "year") {
      // Group by month
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      chartData = months.map(month => ({
        name: month,
        revenue: 0,
        orders: 0,
      }));
      
      for (const order of orders) {
        const monthIndex = order.createdAt.getMonth();
        const payment = order.payment?.find(p => p.status === "SUCCESSFUL");
        
        if (payment) {
          chartData[monthIndex].revenue += Number(payment.amount);
          chartData[monthIndex].orders += 1;
        }
      }
    }

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    // Get recent orders
    const recentOrders = orders
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)
      .map(order => ({
        id: order.id,
        packageName: order.packageName,
        customerName: order.customerName,
        amount: order.totalAmount,
        status: order.status,
        date: order.createdAt,
      }));

    return NextResponse.json({
      totalRevenue,
      monthlyRevenue: totalRevenue, // This would normally be filtered by month
      revenueChange,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalPackages: packages,
      totalReviews: reviews.length,
      averageRating,
      recentOrders,
      chartData,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 