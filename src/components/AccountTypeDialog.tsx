import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface AccountTypeDialogProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
  onSignup: () => void;
}

export function AccountTypeDialog({ open, onClose, onLogin, onSignup }: AccountTypeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center" style={{
            background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Welcome!
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <p className="text-center text-gray-600">
            Do you have an existing account?
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={onLogin}
              className="w-full py-3 rounded-lg text-white transition-all hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #4A00E0 0%, #8E2DE2 100%)'
              }}
            >
              YES - LOGIN
            </button>
            <button
              onClick={onSignup}
              className="w-full py-3 rounded-lg border-2 transition-all hover:shadow-lg"
              style={{
                borderColor: '#8E2DE2',
                color: '#8E2DE2'
              }}
            >
              NO - SIGN UP
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
