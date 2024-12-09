import { Department, Person } from '../types/directory';
import { Shield, Wrench, Building2, Users, Trees, Flame } from 'lucide-react';

export const departments: Department[] = [
  {
    id: '1',
    name: 'Police',
    description: 'Emergency services and public safety',
    icon: 'Shield',
  },
  {
    id: '2',
    name: 'Fire Department',
    description: 'Fire prevention and emergency response',
    icon: 'Flame',
  },
  {
    id: '3',
    name: 'Public Works',
    description: 'Infrastructure and maintenance services',
    icon: 'Wrench',
  },
  {
    id: '4',
    name: 'Village Hall',
    description: 'Administrative services and community management',
    icon: 'Building2',
  },
  {
    id: '5',
    name: 'Community Development',
    description: 'Planning and development services',
    icon: 'Users',
  },
  {
    id: '6',
    name: 'Parks & Recreation',
    description: 'Recreational facilities and programs',
    icon: 'Trees',
  },
];

export const personnel: Person[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'Police Chief',
    extension: '123-456-7890',
    email: 'john.doe@police.gov',
    department: 'Police',
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'Public Works Director',
    extension: '123-456-7891',
    email: 'jane.smith@publicworks.gov',
    department: 'Public Works',
    status: 'active',
  },
];

export const getIconComponent = (iconName: string) => {
  const icons = {
    Shield,
    Wrench,
    Building2,
    Users,
    Trees,
    Flame,
  };
  return icons[iconName as keyof typeof icons];
};