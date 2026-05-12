export interface Client {
  id: string;
  name: string;
  cin?: string;
  pan?: string;
  gst?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  entityType: string;
  status: string;
  assignedManagerId?: string;
  assignedManagerName?: string;
  clientCode?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ClientRequest {
  name: string;
  cin?: string;
  pan?: string;
  gst?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  entityType: string;
  status?: string;
  assignedManagerId?: string;
}
