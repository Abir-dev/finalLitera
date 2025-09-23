import React from "react";

export default function InternshipPreviewModal({ internship, isOpen, onClose }) {
  if (!isOpen || !internship) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-premium w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Internship Preview</h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Review the details before applying
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{internship.name}</span>
                {internship.role && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>{internship.role}</span>
                )}
              </div>
              <div className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                {internship.company}
                {internship.stipend ? ` • ${internship.stipend}` : ''}
              </div>
              {internship.description && (
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{internship.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {internship.contactNumber && (
                <div className="rounded-lg p-3 btn-outline-premium">
                  <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>Contact Number</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{internship.contactNumber}</div>
                </div>
              )}
              {internship.contactEmail && (
                <div className="rounded-lg p-3 btn-outline-premium">
                  <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>Contact Email</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{internship.contactEmail}</div>
                </div>
              )}
            </div>

            {internship.applyUrl && (
              <div className="rounded-lg p-3 btn-outline-premium">
                <div className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Application Link</div>
                <a className="text-sm hover:underline" style={{ color: 'var(--brand)' }} href={internship.applyUrl} target="_blank" rel="noreferrer">
                  {internship.applyUrl}
                </a>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={onClose} className="px-4 py-2 btn-outline-premium rounded-lg">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


