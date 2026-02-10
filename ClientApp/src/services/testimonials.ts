import api from "../api";

export interface Testimonial {
  id?: number;
  name?: string;
  title?: string;
  company?: string;
  message?: string;
  avatar?: string;
  rating?: number;
  isPublished?: boolean;
  submittedDate?: string;
}

export async function getPublicTestimonials(): Promise<Testimonial[]> {
  const res = await api.get<Testimonial[]>("/testimonials");
  return res.data;
}

export async function getAllTestimonialsAdmin(): Promise<Testimonial[]> {
  // Requires JWT set via setAuthToken(token)
  const res = await api.get<Testimonial[]>("/testimonials/admin/all");
  return res.data;
}

export async function createTestimonial(payload: Partial<Testimonial>): Promise<Testimonial> {
  const res = await api.post<Testimonial>("/testimonials", payload);
  return res.data;
}

export async function publishTestimonial(id: number): Promise<void> {
  await api.put(`/testimonials/${id}/publish`);
}

export async function unpublishTestimonial(id: number): Promise<void> {
  await api.put(`/testimonials/${id}/unpublish`);
}

export async function deleteTestimonial(id: number): Promise<void> {
  await api.delete(`/testimonials/${id}`);
}

export default {
  getPublicTestimonials,
  getAllTestimonialsAdmin,
  createTestimonial,
  publishTestimonial,
  unpublishTestimonial,
  deleteTestimonial
};