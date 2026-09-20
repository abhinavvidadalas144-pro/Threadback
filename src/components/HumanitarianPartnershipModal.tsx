import React, { useState } from 'react';
import { Building2, X, Check, ArrowRight, Loader2 } from 'lucide-react';

interface HumanitarianPartnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HumanitarianPartnershipModal: React.FC<HumanitarianPartnershipModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [orgName, setOrgName] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgEmail || !orgName) return;

    setIsSubmitting(true);
    // Simulate brief network submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setOrgEmail('');
        setOrgName('');
        onClose();
      }, 2400);
    }, 450);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-partner-title"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1C1917]/40 backdrop-blur-xs backdrop-animate-fade"
    >
      <div className="relative w-full max-w-[460px] bg-white border border-[#E7E2D8] rounded-xl shadow-[0_16px_40px_rgba(28,25,23,0.12),0_2px_8px_rgba(28,25,23,0.04)] overflow-hidden modal-animate-enter">
        
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-1.5 rounded-md text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F2EB] active:bg-[#EAE5DC] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#115E59] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          /* Thank You / Success State */
          <div className="p-7 sm:p-8 text-center space-y-3.5">
            <div className="w-10 h-10 rounded-full bg-[#EEF5F1] text-[#115E59] border border-[#D5E5DC] flex items-center justify-center mx-auto">
              <Check className="w-5 h-5 stroke-[2.25]" />
            </div>
            <div className="space-y-1.5">
              <h3 id="modal-partner-title" className="font-sans text-lg font-semibold text-[#1C1917] tracking-tight">
                Request Received
              </h3>
              <p className="text-[13px] text-[#57534E] leading-relaxed max-w-xs mx-auto">
                Our humanitarian partnerships team will follow up within 2 business days regarding caseworker access and sandbox integration.
              </p>
            </div>
          </div>
        ) : (
          /* Partnership Request Form */
          <div className="p-6 sm:p-7 space-y-5">
            
            {/* Header: Subtle Eyebrow + Minimal Icon + Primary Heading */}
            <div className="space-y-1.5 pr-6">
              <div className="flex items-center gap-1.5 text-[#57534E]">
                <Building2 className="w-3.5 h-3.5 stroke-[1.75] text-[#115E59]" />
                <span className="font-mono text-[10.5px] font-medium tracking-[0.12em] text-[#78716C] uppercase select-none">
                  Humanitarian Partnership
                </span>
              </div>

              <h3 id="modal-partner-title" className="font-sans text-lg sm:text-[19px] font-semibold text-[#1C1917] tracking-tight leading-snug">
                Partner with ThreadBack
              </h3>

              <p className="text-[12.5px] text-[#57534E] leading-relaxed pt-0.5">
                ThreadBack collaborates with accredited refugee councils, tracing services, and adoption organizations under strict privacy safeguards.
              </p>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Organization Name */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="org-name-input"
                  className="block text-[12px] font-medium text-[#292524]"
                >
                  Organization Name
                </label>
                <input
                  id="org-name-input"
                  type="text"
                  required
                  placeholder="e.g. International Tracing Service"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 text-[13px] rounded-lg border border-[#D6D0C4] bg-[#FAF8F5] text-[#1C1917] placeholder:text-[#A8A29E] transition-colors focus:outline-none focus:bg-white focus:border-[#115E59] focus:ring-1 focus:ring-[#115E59] disabled:opacity-50"
                />
              </div>

              {/* Official Contact Email */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="org-email-input"
                  className="block text-[12px] font-medium text-[#292524]"
                >
                  Official Contact Email
                </label>
                <input
                  id="org-email-input"
                  type="email"
                  required
                  placeholder="caseworker@organization.org"
                  value={orgEmail}
                  onChange={(e) => setOrgEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 text-[13px] rounded-lg border border-[#D6D0C4] bg-[#FAF8F5] text-[#1C1917] placeholder:text-[#A8A29E] transition-colors focus:outline-none focus:bg-white focus:border-[#115E59] focus:ring-1 focus:ring-[#115E59] disabled:opacity-50"
                />
              </div>

              {/* Information Message: Refined, Integrated, Non-bulky */}
              <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-[#F7FAF8] border border-[#DCE8E2] text-[11.5px] text-[#44403C] leading-relaxed">
                <Check className="w-3.5 h-3.5 text-[#115E59] shrink-0 mt-0.5 stroke-[2]" />
                <span>
                  Includes access to moderator queue, encrypted records, and caseworker review workflows.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-3.5 py-2 rounded-lg text-[12.5px] font-medium text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5F2EB] active:bg-[#EAE5DC] transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !orgName.trim() || !orgEmail.trim()}
                  className="px-4 py-2 rounded-lg bg-[#11322E] hover:bg-[#0D2825] active:bg-[#081C1A] text-white text-[12.5px] font-medium transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#115E59] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Request Partner Access</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        )}

      </div>
    </div>
  );
};
