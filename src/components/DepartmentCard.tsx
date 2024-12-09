import { Department } from '../types/directory';
import { getIconComponent } from '../data/mockData';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface DepartmentCardProps {
  department: Department;
  onClick: () => void;
  isSelected?: boolean;
}

export const DepartmentCard = ({ department, onClick, isSelected = false }: DepartmentCardProps) => {
  const IconComponent = getIconComponent(department.icon);

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-blue-500 shadow-lg transform scale-[1.02]' 
          : 'hover:shadow-lg hover:scale-[1.01]'
      }`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-start gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isSelected ? 'bg-blue-100' : 'bg-blue-50'
        }`}>
          {IconComponent && <IconComponent className={`w-6 h-6 ${
            isSelected ? 'text-blue-600' : 'text-blue-500'
          }`} />}
        </div>
        <div>
          <CardTitle className="text-xl mb-1">{department.name}</CardTitle>
          <CardDescription className="text-gray-500">{department.description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
};