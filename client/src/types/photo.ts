export interface Photo {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  cloudinaryId: string;
  uploadedBy: string;
  category: "event" | "program" | "beneficiary" | "facility" | "other";
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PhotoUploadData {
  title: string;
  description?: string;
  category: string;
  tags?: string;
}
