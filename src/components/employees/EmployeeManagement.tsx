import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Edit, Trash2, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient, Employee, CreateEmployeeInput, UpdateEmployeeInput } from "@/lib/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { AddEmployeeDialog } from "./AddEmployeeDialog";
import { EditEmployeeDialog } from "./EditEmployeeDialog";

export const EmployeeManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const employeesData = await apiClient.getEmployees();
      setEmployees(employeesData || []);
    } catch (error) {
      console.error('Failed to load employees:', error);
      toast({
        title: "Error",
        description: "Failed to load employees. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const lowerSearchTerm = searchTerm.toLowerCase();
  const filteredEmployees = employees.filter(employee => {
    const name = employee.Name ? employee.Name.toLowerCase() : '';
    const email = employee.Email ? employee.Email.toLowerCase() : '';
    const phone = employee.Phone ? employee.Phone.toString() : '';

    return (
      name.includes(lowerSearchTerm) ||
      email.includes(lowerSearchTerm) ||
      phone.includes(searchTerm) // Phone doesn't need lowercase conversion
    );
  });

  const handleCreateEmployee = async (employeeData: CreateEmployeeInput) => {
    try {
      await apiClient.createEmployee(employeeData);
      await loadEmployees();
      toast({
        title: "Employee Added",
        description: "New employee has been added successfully.",
      });
    } catch (error) {
      console.error('Failed to create employee:', error);
      toast({
        title: "Error",
        description: "Failed to add employee. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditEmployee = async (updateData: UpdateEmployeeInput) => {
    if (!editingEmployee) return;

    try {
      await apiClient.updateEmployee(editingEmployee.ID, updateData);
      await loadEmployees();
      toast({
        title: "Employee Updated",
        description: `${editingEmployee.Name} has been updated successfully.`,
      });
    } catch (error) {
      console.error('Failed to update employee:', error);
      toast({
        title: "Error",
        description: "Failed to update employee. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;

    try {
      await apiClient.deleteEmployee(employeeToDelete.ID);
      await loadEmployees();
      toast({
        title: "Employee Removed",
        description: `${employeeToDelete.Name} has been removed successfully.`,
      });
      setEmployeeToDelete(null);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete employee:', error);
      toast({
        title: "Error",
        description: "Failed to remove employee. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (employee: Employee) => {
    setEditingEmployee(employee);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  // Mobile card view for employees
  const MobileEmployeeCard = ({ employee }: { employee: Employee }) => (
    <Card key={employee.ID} className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg">{employee.Name}</h3>
            <p className="text-sm text-gray-600">{employee.Email}</p>
            <p className="text-sm text-gray-600">{employee.Phone}</p>
          </div>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
            Employee
          </span>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditDialog(employee)}
            title="Edit Employee"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openDeleteDialog(employee)}
            title="Remove Employee"
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Employee Management</h2>
          <p className="text-sm md:text-base text-gray-600">Manage your salon employees</p>
        </div>
        <AddEmployeeDialog onCreateEmployee={handleCreateEmployee} />
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search employees by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle>Employees ({filteredEmployees.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0 md:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-lg">Loading employees...</div>
            </div>
          ) : (
            <>
              {isMobile ? (
                <div className="p-4">
                  {filteredEmployees.map((employee) => (
                    <MobileEmployeeCard key={employee.ID} employee={employee} />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployees.map((employee) => (
                        <TableRow key={employee.ID}>
                          <TableCell className="font-medium">
                            {employee.Name}
                          </TableCell>
                          <TableCell>{employee.Email}</TableCell>
                          <TableCell>{employee.Phone}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                              Employee
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(employee)}
                                title="Edit Employee"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openDeleteDialog(employee)}
                                title="Remove Employee"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}

          {!loading && filteredEmployees.length === 0 && (
            <div className="p-12 text-center">
              <UserPlus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No employees found.</p>
              <p className="text-gray-400 text-sm">Add your first employee to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <EditEmployeeDialog
        employee={editingEmployee}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onEditEmployee={handleEditEmployee}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {employeeToDelete?.Name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEmployee}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
