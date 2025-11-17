import { useResetPasswordMutation } from '@iblai/data-layer';
import { toast } from 'sonner';
import { Toaster } from '@web-containers/components/ui/sonner';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Shield } from 'lucide-react';

export const Security = ({ email }: { email?: string }) => {
  const [resetPassword] = useResetPasswordMutation();
  const [processing, setProcessing] = useState(false);

  const handleResetPasswordLink = async () => {
    try {
      setProcessing(true);
      await resetPassword(email);
      toast.success('Link to Reset Your Password has been sent to your email');
    } catch (error) {
      console.error(JSON.stringify(error));
      toast.error('An error occurred while sending your reset password link. Try again!');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="max-w-md mx-auto text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-6">
            <Shield className="h-20 w-20 mx-auto" />
          </div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Security Settings
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Click to reset your password.</p>
          <Button
            className="w-full bg-gradient-to-r from-[#2563EB] to-[#93C5FD] hover:opacity-90 text-white"
            onClick={handleResetPasswordLink}
            disabled={processing}
          >
            {processing ? 'Sending Password Reset Link...' : 'Send Password Reset Link'}
          </Button>
        </div>
      </div>
      <Toaster />
    </>
  );
};
