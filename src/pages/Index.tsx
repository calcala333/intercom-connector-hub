import { useState } from 'react';
import { departments, personnel } from '../data/mockData';
import { DepartmentCard } from '../components/DepartmentCard';
import { PersonnelList } from '../components/PersonnelList';
import { SearchBar } from '../components/SearchBar';
import { Department } from '../types/directory';

const Index = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedDepartment(null);
  };

  const filteredPersonnel = personnel.filter((person) => {
    if (selectedDepartment) {
      return person.department === selectedDepartment.id;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        person.name.toLowerCase().includes(query) ||
        person.extension.includes(query) ||
        person.role.toLowerCase().includes(query)
      );
    }
    return false;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Directory</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <SearchBar onSearch={handleSearch} />

        {!selectedDepartment && !searchQuery && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((department) => (
              <DepartmentCard
                key={department.id}
                department={department}
                onClick={() => setSelectedDepartment(department)}
              />
            ))}
          </div>
        )}

        {(selectedDepartment || searchQuery) && (
          <div className="space-y-6">
            {selectedDepartment && (
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {selectedDepartment.name}
                </h2>
                <button
                  onClick={() => setSelectedDepartment(null)}
                  className="text-primary hover:text-primary/80"
                >
                  Back to Departments
                </button>
              </div>
            )}
            <PersonnelList personnel={filteredPersonnel} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;