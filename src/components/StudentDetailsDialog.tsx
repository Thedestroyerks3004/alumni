import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Mail, Phone, GraduationCap } from 'lucide-react';

interface StudentDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  student: any;
  scholarship: any;
}

export function StudentDetailsDialog({ open, onClose, student, scholarship }: StudentDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white rounded-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle style={{
            background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Student Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Personal Information */}
          <div className="bg-gradient-to-br from-[#EEF4FC] to-white p-6 rounded-lg space-y-3">
            <h3 className="text-gray-700 mb-3">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Name</p>
                <p>{student.name}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Roll Number</p>
                <p>{student.rollNumber}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Department</p>
                <p>{student.department}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Year</p>
                <p>Year {student.year}</p>
              </div>
            </div>

            <div className="pt-3 space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={16} />
                <span>{student.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={16} />
                <span>{student.email || `${student.rollNumber}@student.internal`}</span>
              </div>
            </div>
          </div>

          {/* Academic Performance */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="text-[#8E2DE2]" size={24} />
              <h3 className="text-gray-700">Academic Performance</h3>
            </div>

            <div className="bg-gradient-to-br from-[#EEF4FC] to-white p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total CGPA</span>
                <span className="text-2xl" style={{
                  background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {scholarship.totalCGPA || 'N/A'}
                </span>
              </div>
            </div>

            {scholarship.semesterGPA && scholarship.semesterGPA.length > 0 && (
              <div className="bg-white border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="border-b" style={{ background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)' }}>
                    <tr>
                      <th className="px-4 py-3 text-left text-white">Semester</th>
                      <th className="px-4 py-3 text-right text-white">GPA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scholarship.semesterGPA.map((gpa: any, index: number) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-700">Semester {gpa.semester}</td>
                        <td className="px-4 py-3 text-right" style={{ color: '#8E2DE2' }}>
                          {gpa.gpa}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 rounded-lg text-white transition-all hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)'
            }}
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
