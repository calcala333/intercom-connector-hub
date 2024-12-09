import { Department, Person } from '../types/directory';
import { Building2, Shield, Wrench, GraduationCap, Trees, Flame } from 'lucide-react';

export const departments: Department[] = [
  {
    id: '1',
    name: 'Police Department',
    description: 'Law enforcement and emergency services',
    icon: 'Shield',
  },
  {
    id: '2',
    name: 'Public Works',
    description: 'Infrastructure maintenance and development',
    icon: 'Wrench',
  },
  {
    id: '3',
    name: 'Village Hall',
    description: 'Administrative services and governance',
    icon: 'Building2',
  },
  {
    id: '4',
    name: 'Community Development',
    description: 'Planning and development services',
    icon: 'GraduationCap',
  },
  {
    id: '5',
    name: 'Parks and Recreation',
    description: 'Parks maintenance and recreational programs',
    icon: 'Trees',
  },
  {
    id: '6',
    name: 'Fire',
    description: 'Fire prevention and emergency response',
    icon: 'Flame',
  },
];

export const personnel: Person[] = [
  {
    id: '1',
    name: 'John Smith',
    role: 'Chief of Police',
    extension: '101',
    email: 'john.smith@police.gov',
    department: '1',
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Doe',
    role: 'Public Works Director',
    extension: '201',
    email: 'jane.doe@publicworks.gov',
    department: '2',
    status: 'active',
  },
  // Add more mock data as needed
];

export const getIconComponent = (iconName: string) => {
  const icons = {
    Shield,
    Wrench,
    Building2,
    GraduationCap,
    Trees,
    Flame,
  };
  return icons[iconName as keyof typeof icons];
};