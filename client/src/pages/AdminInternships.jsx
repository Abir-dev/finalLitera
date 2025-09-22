import React, { useEffect, useMemo, useState } from "react";
import { Briefcase, Plus, Trash2, ExternalLink, Link as LinkIcon, Phone, Mail } from "lucide-react";
import { createInternship, deleteInternship, listInternships, updateInternship, validateInternshipForm } from "../services/internshipService.js";

export default function AdminInternships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    role: "",
    stipend: "",
    description: "",
    contactNumber: "",
    contactEmail: "",
    applyUrl: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await listInternships();
        setInternships(res?.data?.internships || []);
      } catch (e) {
        console.error("Failed to load internships", e);
        setApiError(`Load failed: ${e?.status || ''} ${e?.message || ''}`);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const resetForm = () => {
    setForm({ name: "", company: "", role: "", stipend: "", description: "", contactNumber: "", contactEmail: "", applyUrl: "" });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const v = validateInternshipForm(form);
    setErrors(v);
    if (Object.keys(v).length) return;
    try {
      setCreating(true);
      const res = await createInternship(form);
      const created = res?.data?.internship;
      setInternships((list) => [created, ...list]);
      resetForm();
    } catch (e) {
      console.error("Failed to create internship", e);
      setApiError(`Create failed: ${e?.status || ''} ${e?.message || ''}`);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this internship?")) return;
    try {
      await deleteInternship(id);
      setInternships((list) => list.filter((i) => i.id !== id));
    } catch (e) {
      console.error("Failed to delete", e);
      setApiError(`Delete failed: ${e?.status || ''} ${e?.message || ''}`);
    }
  };

  return (
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
          </div>

          {apiError && (
            <div className="card-premium p-4 mb-4 border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
              {apiError}
            </div>
          )}

          {/* Create Form */}
          <div className="card-premium p-6 mb-8">
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>Internship Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="input-premium mt-1 w-full" placeholder="e.g., Summer Internship" />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>Company Name</label>
                <input name="company" value={form.company} onChange={handleChange} className="input-premium mt-1 w-full" placeholder="e.g., Litera Labs" />
                {errors.company && <p className="text-xs text-red-400 mt-1">{errors.company}</p>}
              </div>
              <div>
                <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>Job Role</label>
                <input name="role" value={form.role} onChange={handleChange} className="input-premium mt-1 w-full" placeholder="e.g., Frontend Intern" />
                {errors.role && <p className="text-xs text-red-400 mt-1">{errors.role}</p>}
              </div>
              <div>
                <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>Stipend</label>
                <input name="stipend" value={form.stipend} onChange={handleChange} className="input-premium mt-1 w-full" placeholder="e.g., ₹10,000 / month" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="input-premium mt-1 w-full min-h-[100px]" placeholder="Brief description and responsibilities" />
                {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
              </div>
              <div>
                <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>Contact Number</label>
                <input name="contactNumber" value={form.contactNumber} onChange={handleChange} className="input-premium mt-1 w-full" placeholder="e.g., +91 98xxxxxx" />
                {errors.contactNumber && <p className="text-xs text-red-400 mt-1">{errors.contactNumber}</p>}
              </div>
              <div>
                <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>Contact E-mail</label>
                <input name="contactEmail" value={form.contactEmail} onChange={handleChange} className="input-premium mt-1 w-full" placeholder="e.g., hr@company.com" />
                {errors.contactEmail && <p className="text-xs text-red-400 mt-1">{errors.contactEmail}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>Apply Redirect URL</label>
                <input name="applyUrl" value={form.applyUrl} onChange={handleChange} className="input-premium mt-1 w-full" placeholder="https://company.com/apply" />
                {errors.applyUrl && <p className="text-xs text-red-400 mt-1">{errors.applyUrl}</p>}
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button type="submit" disabled={creating} className="btn-premium inline-flex items-center gap-2">
                  <Plus size={16} />
                  {creating ? "Creating..." : "Create Internship"}
                </button>
              </div>
            </form>
          </div>

          {/* List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading internships...</div>
            ) : internships.length === 0 ? (
              <div className="card-premium p-6 text-center" style={{ color: 'var(--text-secondary)' }}>No internships yet. Create your first posting above.</div>
            ) : (
              internships.map((i) => (
                <div key={i.id} className="card-premium p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{i.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>{i.role}</span>
                      </div>
                      <div className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>{i.company} • {i.stipend || 'Stipend not specified'}</div>
                      <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{i.description}</p>
                      <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span className="inline-flex items-center gap-1"><Phone size={14} /> {i.contactNumber}</span>
                        <span className="inline-flex items-center gap-1"><Mail size={14} /> {i.contactEmail}</span>
                        {i.applyUrl && (
                          <a className="inline-flex items-center gap-1 hover:underline" href={i.applyUrl} target="_blank" rel="noreferrer">
                            <LinkIcon size={14} /> Apply URL
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDelete(i.id)} className="btn-danger inline-flex items-center gap-2">
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


