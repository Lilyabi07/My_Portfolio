import api from "../api";

export interface Education {
  id?: number;
  institution?: string;
  degree?: string;
  startDate?: string;
  endDate?: string | null;
  isCurrent?: boolean;
  description?: string;
  displayOrder?: number;
}

export async function getAllEducation(): Promise<Education[]> {
  const res = await api.get<Education[]>("/education");
  return res.data;
}

export async function createEducation(payload: Partial<Education>): Promise<Education> {
  const res = await api.post<Education>("/education", payload);
  return res.data;
}

export async function updateEducation(id: number, payload: Partial<Education>): Promise<void> {
  await api.put(`/education/${id}`, payload);
}

export async function deleteEducation(id: number): Promise<void> {
  await api.delete(`/education/${id}`);
}

export default {
  getAllEducation,
  createEducation,
  updateEducation,
  deleteEducation
};