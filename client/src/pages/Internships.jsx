import { useEffect, useState } from "react";
import { Briefcase, ArrowRight, Eye } from "lucide-react";
import { listInternships, applyToInternship } from "../services/internshipService.js";
import InternshipPreviewModal from "../components/InternshipPreviewModal.jsx";

export default function Internships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await listInternships();
        setInternships(res?.data?.internships || []);
      } catch (e) {
        console.error("Failed to load internships", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onApply = async (internship) => {
    try {
      await applyToInternship(internship.id);
    } catch {}
    if (internship.applyUrl) {
      window.open(internship.applyUrl, "_blank", "noopener");
    }
  };

  const onPreview = (internship) => {
    setSelectedInternship(internship);
    setPreviewOpen(true);
  };

  return (
    <>
    <div className="container-premium">
      <div className="card-premium p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
                background: 'linear-gradient(135deg, var(--brand)20, var(--brand)10)',
                border: '1px solid var(--brand)30'
              }}>
                <Briefcase size={20} style={{ color: 'var(--brand)' }} />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Internships</h1>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--accent-gold)20, var(--accent-gold)10)',
                border: '1px solid var(--accent-gold)30',
                color: 'var(--accent-gold)'
              }}
            >
              Coming soon
            </span>
          </div>

          {loading ? (
            <div className="card-premium p-8 text-center" style={{ color: 'var(--text-secondary)' }}>
              Loading internships...
            </div>
          ) : internships.length === 0 ? (
            <div className="card-premium p-8 text-center" style={{ color: 'var(--text-secondary)' }}>
              No internships available yet. Please check back later.
            </div>
          ) : (
            <div className="space-y-4">
              {internships.map((i) => (
                <div key={i.id} className="card-premium p-6 group hover:scale-[1.01] transition-all duration-300">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{i.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>{i.role}</span>
                      </div>
                      <div className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{i.company} • {i.stipend || 'Stipend not specified'}</div>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{i.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => onPreview(i)} className="btn-outline-premium inline-flex items-center gap-2">
                        <Eye size={16} />
                        Preview
                      </button>
                      <button onClick={() => onApply(i)} className="btn-premium inline-flex items-center gap-2">
                        Apply
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    <InternshipPreviewModal
      internship={selectedInternship}
      isOpen={previewOpen}
      onClose={() => setPreviewOpen(false)}
    />
    </>
  );
}


