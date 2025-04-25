
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PersonnelList } from '@/components/PersonnelList';
import { departments, personnel as initialPersonnel } from '../data/mockData';
import { DepartmentCard } from '@/components/DepartmentCard';
import { AddPersonnelDialog } from '@/components/AddPersonnelDialog';
import { Person } from '../types/directory';
import { useToast } from '@/components/ui/use-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [personnel, setPersonnel] = useState<Person[]>(initialPersonnel);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/admin');
      return;
    }
    setIsAuthenticated(true);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/admin');
  };

  const handlePersonnelAdded = (newPerson: Person) => {
    setPersonnel((prev) => [...prev, newPerson]);
    toast({
      title: "Success",
      description: "Personnel added successfully",
    });
  };

  const handlePersonnelDeleted = (id: string) => {
    setPersonnel((prev) => prev.filter(person => person.id !== id));
    toast({
      title: "Success",
      description: "Personnel deleted successfully",
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              View Directory
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Departments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((department) => (
              <DepartmentCard
                key={department.id}
                department={department}
                onClick={() => {}}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Personnel Management</h2>
            <AddPersonnelDialog onPersonnelAdded={handlePersonnelAdded} />
          </div>
          <PersonnelList 
            personnel={personnel} 
            onDelete={handlePersonnelDeleted} 
          />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
