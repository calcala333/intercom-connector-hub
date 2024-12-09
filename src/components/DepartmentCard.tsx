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
      <CardHeader className="flex flex-row items-center gap-4">
        {IconComponent && <IconComponent className="w-8 h-8 text-primary" />}
        <div>
          <CardTitle className="text-xl">{department.name}</CardTitle>
          <CardDescription>{department.description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
};