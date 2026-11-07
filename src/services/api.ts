import { Student, UserAccount, AnalyticsOverview, MLModelMetrics, PredictionResult, AcademicRecord, Teacher } from '../types';

const API_BASE = '/api';

export const api = {
  // Auth
  async login(username: string, password: string): Promise<{ user: UserAccount; student?: Student }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Authentication failed');
    }
    const data = await res.json();
    return data;
  },

  async register(studentData: any): Promise<{ student: Student; user: UserAccount }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  // Students
  async getStudents(params?: { search?: string; category?: string; risk?: string; sort?: string }): Promise<{ total: number; students: Student[] }> {
    try {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.category) query.append('category', params.category);
      if (params?.risk) query.append('risk', params.risk);
      if (params?.sort) query.append('sort', params.sort);

      const res = await fetch(`${API_BASE}/students?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to load students');
      const data = await res.json();

      // Cache for offline PWA usage
      try {
        localStorage.setItem('cached_students', JSON.stringify(data.students));
      } catch (e) {
        // quota ignore
      }

      return data;
    } catch (err) {
      // Offline fallback
      const cached = localStorage.getItem('cached_students');
      if (cached) {
        const students = JSON.parse(cached);
        return { total: students.length, students };
      }
      throw err;
    }
  },

  async getStudentById(id: string): Promise<Student> {
    const res = await fetch(`${API_BASE}/students/${id}`);
    if (!res.ok) throw new Error('Student not found');
    return res.json();
  },

  async createStudent(payload: Partial<Student>): Promise<Student> {
    const res = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create student record');
    }
    return res.json();
  },

  async updateStudent(id: string, payload: Partial<Student>): Promise<Student> {
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update student record');
    }
    return res.json();
  },

  async deleteStudent(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete student');
    return true;
  },

  async updateSubjectAttendance(
    studentId: string,
    subjects: { code: string; totalClasses: number; attendedClasses: number }[]
  ): Promise<Student> {
    const res = await fetch(`${API_BASE}/students/${studentId}/attendance`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subjects })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update subject attendance');
    }
    return res.json();
  },

  // Faculty / Teacher Directory
  async getTeachers(params?: { search?: string; subject?: string }): Promise<{ total: number; teachers: Teacher[] }> {
    try {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.subject) query.append('subject', params.subject);

      const res = await fetch(`${API_BASE}/teachers?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to load faculty directory');
      const data = await res.json();

      try {
        localStorage.setItem('cached_teachers', JSON.stringify(data.teachers));
      } catch (e) {
        // quota ignore
      }

      return data;
    } catch (err) {
      const cached = localStorage.getItem('cached_teachers');
      if (cached) {
        const teachers = JSON.parse(cached);
        return { total: teachers.length, teachers };
      }
      throw err;
    }
  },

  async getTeacherById(id: string): Promise<Teacher> {
    const res = await fetch(`${API_BASE}/teachers/${id}`);
    if (!res.ok) throw new Error('Teacher record not found');
    return res.json();
  },

  async createTeacher(payload: Partial<Teacher>): Promise<Teacher> {
    const res = await fetch(`${API_BASE}/teachers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create teacher record');
    }
    return res.json();
  },

  async updateTeacher(id: string, payload: Partial<Teacher>): Promise<Teacher> {
    const res = await fetch(`${API_BASE}/teachers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update teacher record');
    }
    return res.json();
  },

  async deleteTeacher(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/teachers/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete teacher record');
    return true;
  },

  // Prediction & ML
  async predictStudent(id: string): Promise<{ success: boolean; prediction: PredictionResult; student: Student }> {
    const res = await fetch(`${API_BASE}/students/${id}/predict`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Prediction run failed');
    return res.json();
  },

  async simulateWhatIf(academic: Partial<AcademicRecord>): Promise<{ simulation: PredictionResult }> {
    const res = await fetch(`${API_BASE}/predict/what-if`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(academic)
    });
    if (!res.ok) throw new Error('Simulation failed');
    return res.json();
  },

  // Analytics & Metadata
  async getAnalytics(): Promise<AnalyticsOverview> {
    const res = await fetch(`${API_BASE}/analytics/overview`);
    if (!res.ok) throw new Error('Failed to load analytics');
    return res.json();
  },

  async getModelInfo(): Promise<MLModelMetrics> {
    const res = await fetch(`${API_BASE}/model/info`);
    if (!res.ok) throw new Error('Failed to load model info');
    return res.json();
  },

  async resetData(): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/seed/reset`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to reset dataset');
    return res.json();
  }
};
