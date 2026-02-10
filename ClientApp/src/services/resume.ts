import api, { setAuthToken } from "../api";

export interface Resume {
  id?: number;
  fileUrl?: string;
  notes?: string;
  updatedAt?: string;
}

// Upload a PDF. `file` must be a File object from an <input type="file" />
export async function uploadResume(file: File): Promise<Resume> {
  const form = new FormData();
  form.append("file", file);

  const res = await api.post<Resume>("/resume/upload", form, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
}

export async function getAllResumes(): Promise<Resume[]> {
  const res = await api.get<Resume[]>("/resume");
  return res.data;
}

export async function deleteResume(id: number): Promise<void> {
  await api.delete(`/resume/${id}`);
}

export default {
  uploadResume,
  getAllResumes,
  deleteResume
};