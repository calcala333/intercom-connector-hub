export interface Person {
  id: string;
  name: string;
  role: string;
  extension: string;
  email?: string;
  department: string;
  status: 'active' | 'inactive';
}

export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
}