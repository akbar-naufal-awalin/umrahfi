// src/lib/api.ts
import { Order } from "@/types";

export async function createOrder(orderData: any): Promise<Order> {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create order');
  }

  return response.json();
}

export async function getPackage(id: string) {
  const response = await fetch(`/api/packages/${id}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch package');
  }
  
  return response.json();
}

export async function updatePackageStatus(id: string, status: string) {
  const response = await fetch(`/api/packages/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update package status');
  }
  
  return response.json();
}

export async function deletePackage(id: string) {
  const response = await fetch(`/api/packages/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete package');
  }
  
  return response.json();
}