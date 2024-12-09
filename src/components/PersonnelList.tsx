import { Person } from '../types/directory';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PersonnelListProps {
  personnel: Person[];
}

export const PersonnelList = ({ personnel }: PersonnelListProps) => {
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};