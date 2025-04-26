
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PersonnelList } from '@/components/PersonnelList';
import { departments, personnel as initialPersonnel } from '../data/mockData';
import { DepartmentCard } from '@/components/DepartmentCard';
import { AddPersonnelDialog } from '@/components/AddPersonnelDialog';
import { Person } from '../types/directory';
import { useToast } from '@/components/ui/use-toast';
import { Plus, User, Building } from 'lucide-react';
import { AddDepartmentDialog } from '@/components/AddDepartmentDialog';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">Admin Dashboard</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <User className="h-5 w-5" />
              <h3 className="font-bold">Active Personnel</h3>
            </div>
            <p className="text-3xl font-bold">{personnel.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Building className="h-5 w-5" />
              <h3 className="font-bold">Departments</h3>
            </div>
            <p className="text-3xl font-bold">{departments.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <Plus className="h-5 w-5" />
              <h3 className="font-bold">Pending Requests</h3>
            </div>
            <p className="text-3xl font-bold">0</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-8">
          <div className="px-6 py-4 flex justify-between items-center border-b">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Department Management
            </h2>
            <AddDepartmentDialog />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {departments.map((department) => (
              <DepartmentCard
                key={department.id}
                department={department}
                onClick={() => {}}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="px-6 py-4 flex justify-between items-center border-b">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personnel Management
            </h2>
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
