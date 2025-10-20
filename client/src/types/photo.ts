export interface Photo {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  cloudinaryId: string;
  uploadedBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PhotoUploadData {
  title: string;
  description?: string;
}
