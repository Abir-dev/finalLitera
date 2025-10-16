import { useEffect, useState } from "react";
import { Briefcase, ArrowRight, Eye } from "lucide-react";
import { listInternships, applyToInternship } from "../services/internshipService.js";
import InternshipPreviewModal from "../components/InternshipPreviewModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Internships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [locked, setLocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [applyingId, setApplyingId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await listInternships();
        setInternships(res?.data?.internships || []);
        setLocked(false);
        setErrorMsg("");
      } catch (e) {
        console.error("Failed to load internships", e);
        if (e?.status === 401 || e?.status === 403) {
          setLocked(true);
          setErrorMsg(
            "Internships are available only after purchasing any paid course."
          );
        } else {
          setErrorMsg("Failed to load internships. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onApply = async (internship) => {
    setApplyingId(internship.id);
    try {
      // Track the application
      await applyToInternship(internship.id);
      
      // Redirect to the apply URL if it exists
      if (internship.applyUrl) {
        window.open(internship.applyUrl, "_blank", "noopener");
      } else {
        // Show error if no apply URL is configured
        setErrorMsg("No application link available for this internship. Please contact the company directly.");
        setTimeout(() => setErrorMsg(""), 5000);
      }
    } catch (error) {
      console.error("Failed to apply to internship:", error);
      // Still try to redirect even if tracking fails
      if (internship.applyUrl) {
        window.open(internship.applyUrl, "_blank", "noopener");
      } else {
        setErrorMsg("Failed to apply. Please try again or contact support.");
        setTimeout(() => setErrorMsg(""), 5000);
      }
    } finally {
      setApplyingId(null);
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
          ) : locked ? (
            <div className="card-premium p-8 text-center space-y-4">
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {errorMsg}
              </div>
              <a href="/courses" className="btn-premium inline-block">Browse paid courses</a>
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
                      {i.applyUrl ? (
                        <button 
                          onClick={() => onApply(i)} 
                          disabled={applyingId === i.id}
                          className="btn-premium inline-flex items-center gap-2 disabled:opacity-50"
                        >
                          {applyingId === i.id ? "Applying..." : "Apply"}
                          <ArrowRight size={16} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => onApply(i)} 
                          className="btn-outline-premium inline-flex items-center gap-2 opacity-75"
                          title="No application link available"
                        >
                          Apply
                          <ArrowRight size={16} />
                        </button>
                      )}
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


