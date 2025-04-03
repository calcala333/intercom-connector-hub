
import { Department } from '../types/directory';
import { getIconComponent } from '../data/mockData';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DepartmentCardProps {
  department: Department;
  onClick: () => void;
  isSelected?: boolean;
}

export const DepartmentCard = ({ department, onClick, isSelected = false }: DepartmentCardProps) => {
  const IconComponent = getIconComponent(department.icon);

  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 overflow-hidden ${
        isSelected 
          ? 'ring-2 ring-primary shadow-lg transform scale-[1.03] bg-gradient-to-br from-blue-50 to-white' 
          : 'hover:shadow-md hover:scale-[1.02] bg-white'
      }`}
      onClick={onClick}
    >
      <div className={`h-1 w-full ${isSelected ? 'bg-primary' : 'bg-blue-100'}`}></div>
      <CardHeader className="flex flex-row items-start gap-4">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
          isSelected ? 'bg-blue-100' : 'bg-blue-50'
        } transition-colors duration-300`}>
          {IconComponent && <IconComponent className={`w-7 h-7 ${
            isSelected ? 'text-primary' : 'text-blue-500'
          } transition-colors duration-300`} />}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold mb-1">{department.name}</CardTitle>
            {isSelected && <Badge variant="outline" className="bg-blue-50 text-primary border-primary">Selected</Badge>}
          </div>
          <CardDescription className="text-gray-600">{department.description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
};
