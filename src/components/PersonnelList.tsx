
import { Person } from '../types/directory';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PersonnelListProps {
  personnel: Person[];
  onDelete?: (id: string) => void;
}

export const PersonnelList = ({ personnel, onDelete }: PersonnelListProps) => {
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NAME</TableHead>
            <TableHead>ROLE</TableHead>
            <TableHead>EXTENSION</TableHead>
            <TableHead>DEPARTMENT</TableHead>
            <TableHead>STATUS</TableHead>
            {onDelete && <TableHead>ACTIONS</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {personnel.map((person) => (
            <TableRow key={person.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{person.name}</div>
                  <div className="text-sm text-gray-500">{person.email}</div>
                </div>
              </TableCell>
              <TableCell>{person.role}</TableCell>
              <TableCell>{person.extension}</TableCell>
              <TableCell>{person.department}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  person.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {person.status}
                </span>
              </TableCell>
              {onDelete && (
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(person.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
