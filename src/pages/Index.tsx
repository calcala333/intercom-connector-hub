
import { useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { DepartmentCard } from '../components/DepartmentCard';
import { PersonnelList } from '../components/PersonnelList';
import { departments, personnel } from '../data/mockData';
import { Link } from 'react-router-dom';
import { Person } from '../types/directory';
import { Building, Users, Search } from 'lucide-react';

const Index = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPersonnel = personnel.filter((person) => {
    const matchesDepartment = selectedDepartment ? person.department === selectedDepartment : true;
    const matchesSearch = searchQuery.toLowerCase() === '' 
      ? true 
      : person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesDepartment && matchesSearch;
  });

  const handleDepartmentClick = (departmentName: string) => {
    setSelectedDepartment(departmentName === selectedDepartment ? null : departmentName);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Intercom Directory
            </h1>
          </div>
          <Link 
            to="/admin" 
            className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2 px-4 py-2 rounded-full hover:bg-blue-50"
          >
            <Users className="w-4 h-4" />
            Admin Sign In
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2 mb-6">
            <Building className="w-5 h-5 text-primary" />
            Departments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {departments.map((department) => (
              <DepartmentCard
                key={department.id}
                department={department}
                onClick={() => handleDepartmentClick(department.name)}
                isSelected={selectedDepartment === department.name}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-blue-50 border-b">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              {selectedDepartment ? `${selectedDepartment} Personnel` : 'All Personnel'}
              <span className="ml-2 text-sm font-normal bg-blue-100 text-primary px-2 py-1 rounded-full">
                {filteredPersonnel.length} {filteredPersonnel.length === 1 ? 'person' : 'people'}
              </span>
            </h2>
          </div>
          <PersonnelList personnel={filteredPersonnel} />
        </div>
      </main>
    </div>
  );
};

export default Index;
