import { useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { DepartmentCard } from '../components/DepartmentCard';
import { PersonnelList } from '../components/PersonnelList';
import { departments, personnel } from '../data/mockData';
import { Link } from 'react-router-dom';
import { Person } from '../types/directory';

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
            <h1 className="text-2xl font-bold">Intercom Directory</h1>
          </div>
          <Link to="/admin" className="text-blue-500 hover:text-blue-600">
            Admin Portal
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <SearchBar onSearch={handleSearch} />

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

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-bold">
              {selectedDepartment ? `${selectedDepartment} Personnel` : 'All Personnel'}
            </h2>
          </div>
          <PersonnelList personnel={filteredPersonnel} />
        </div>
      </main>
    </div>
  );
};

export default Index;