import { Department } from '../types/directory';
import { getIconComponent } from '../data/mockData';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface DepartmentCardProps {
  department: Department;
  onClick: () => void;
}

export const DepartmentCard = ({ department, onClick }: DepartmentCardProps) => {
  const IconComponent = getIconComponent(department.icon);

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
          {IconComponent && <IconComponent className="w-6 h-6 text-blue-500" />}
        </div>
        <div>
          <CardTitle className="text-xl mb-1">{department.name}</CardTitle>
          <CardDescription className="text-gray-500">{department.description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
};