import { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gradient-to-br from-white to-white/95 dark:from-zinc-900 dark:to-zinc-900/95 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-primary/20">
        <div className="flex items-center justify-between p-6 border-b border-primary/10 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-2xl">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 bg-gradient-to-br from-white/50 to-white/30 dark:from-zinc-900/50 dark:to-zinc-900/30">
          {children}
        </div>
        {footer && (
          <div className="p-6 border-t border-primary/10 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
