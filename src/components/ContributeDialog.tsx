import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { IndianRupee } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface ContributeDialogProps {
  open: boolean;
  onClose: () => void;
  scholarship: any;
  accessToken: string;
  onSuccess: () => void;
}

export function ContributeDialog({ open, onClose, scholarship, accessToken, onSuccess }: ContributeDialogProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const remaining = scholarship.amountRequired - scholarship.totalReceived;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const contributionAmount = parseInt(amount);
    if (isNaN(contributionAmount) || contributionAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (contributionAmount > remaining) {
      setError(`Amount exceeds remaining requirement (₹${remaining.toLocaleString('en-IN')})`);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-adaf32ad/contribute`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            studentId: scholarship.studentId,
            amount: contributionAmount
          })
        }
      );

      if (!response.ok) {
        throw new Error('Contribution failed');
      }

      alert('Contribution successful! Thank you for supporting education.');
      onSuccess();
    } catch (err) {
      console.log('Contribution error:', err);
      setError('Failed to process contribution. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle style={{
            background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Make a Contribution
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-gradient-to-br from-[#EEF4FC] to-white p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Student:</span>
              <span>{scholarship.studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Department:</span>
              <span>{scholarship.studentDepartment}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Required:</span>
              <span className="flex items-center gap-1">
                <IndianRupee size={16} />
                {scholarship.amountRequired.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Already Raised:</span>
              <span className="flex items-center gap-1 text-green-600">
                <IndianRupee size={16} />
                {scholarship.totalReceived.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-gray-700">Remaining:</span>
              <span className="flex items-center gap-1" style={{ color: '#8E2DE2' }}>
                <IndianRupee size={16} />
                {remaining.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-500 text-sm mb-2">
                Contribution Amount
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                  min="1"
                  max={remaining}
                  className="w-full pl-10 pr-4 py-2 border-b border-gray-300 focus:border-[#8E2DE2] outline-none transition-colors"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-lg border-2 transition-all"
                style={{
                  borderColor: '#8E2DE2',
                  color: '#8E2DE2'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 rounded-lg text-white transition-all hover:shadow-lg disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)'
                }}
              >
                {loading ? 'Processing...' : 'Contribute'}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
