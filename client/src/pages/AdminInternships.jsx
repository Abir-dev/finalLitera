import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Plus,
  Trash2,
  ExternalLink,
  Link as LinkIcon,
  Phone,
  Mail,
} from "lucide-react";
import {
  createInternship,
  deleteInternship,
  listInternships,
  updateInternship,
  validateInternshipForm,
} from "../services/internshipService.js";

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
  const [confirmId, setConfirmId] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    company: "",
    role: "",
    stipend: "",
    description: "",
    contactNumber: "",
    contactEmail: "",
    applyUrl: "",
  });
  const [editing, setEditing] = useState(false);

  // Resolve the canonical id for an internship item
  const getId = (item) => {
    if (!item) return null;
    return item.id || item._id || null;
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await listInternships();
        const items = res?.data?.internships || [];
        // Filter out any null/undefined items and normalize IDs
        const normalized = items
          .filter((item) => item && (item.id || item._id))
          .map((it) => ({ ...it, id: it.id || it._id }));
        setInternships(normalized);
      } catch (e) {
        console.error("Failed to load internships", e);
        setApiError(`Load failed: ${e?.status || ""} ${e?.message || ""}`);
        setInternships([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      company: "",
      role: "",
      stipend: "",
      description: "",
      contactNumber: "",
      contactEmail: "",
      applyUrl: "",
    });
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
      const normalized = created
        ? { ...created, id: created.id || created._id }
        : created;
      setInternships((list) => [normalized, ...list]);
      resetForm();
    } catch (e) {
      console.error("Failed to create internship", e);
      setApiError(`Create failed: ${e?.status || ""} ${e?.message || ""}`);
    } finally {
      setCreating(false);
    }
  };

  const requestDelete = (id) => {
    setConfirmId(id);
  };

  const cancelDelete = () => {
    if (confirming) return;
    setConfirmId(null);
  };

  const confirmDelete = async () => {
    if (!confirmId) return;
    try {
      setConfirming(true);
      await deleteInternship(confirmId);
      setInternships((list) => list.filter((i) => getId(i) !== confirmId));
      setConfirmId(null);
    } catch (e) {
      console.error("Failed to delete", e);
      setApiError(`Delete failed: ${e?.status || ""} ${e?.message || ""}`);
    } finally {
      setConfirming(false);
    }
  };

  const startEdit = (item) => {
    setEditId(getId(item));
    setEditForm({
      name: item.name || "",
      company: item.company || "",
      role: item.role || "",
      stipend: item.stipend || "",
      description: item.description || "",
      contactNumber: item.contactNumber || "",
      contactEmail: item.contactEmail || "",
      applyUrl: item.applyUrl || "",
    });
  };

  const cancelEdit = () => {
    if (editing) return;
    setEditId(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((f) => ({ ...f, [name]: value }));
  };

  const submitEdit = async (e) => {
    e?.preventDefault?.();
    if (!editId) return;
    try {
      setEditing(true);
      const res = await updateInternship(editId, editForm);
      const updated = res?.data?.internship;
      const normalized = updated
        ? { ...updated, id: updated.id || updated._id }
        : updated;
      setInternships((list) =>
        list.map((it) => (getId(it) === editId ? normalized : it))
      );
      setEditId(null);
    } catch (e) {
      console.error("Failed to update internship", e);
      setApiError(`Update failed: ${e?.status || ""} ${e?.message || ""}`);
    } finally {
      setEditing(false);
    }
  };

  return (
    <>
      <style>
        {`
          .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
        `}
      </style>
      <div className="container-premium">
        <div className="card-premium p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--brand)20, var(--brand)10)",
                    border: "1px solid var(--brand)30",
                  }}
                >
                  <Briefcase size={20} style={{ color: "var(--brand)" }} />
                </div>
                <h1
                  className="text-2xl md:text-3xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Internships
                </h1>
              </div>
            </div>

            {apiError && (
              <div className="card-premium p-4 mb-4 border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
                {apiError}
              </div>
            )}

            {/* Create Form */}
            <div className="card-premium p-6 mb-8">
              <form
                onSubmit={handleCreate}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <label
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Internship Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="input-premium mt-1 w-full"
                    placeholder="e.g., Summer Internship"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400 mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Company Name
                  </label>
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    className="input-premium mt-1 w-full"
                    placeholder="e.g., Litera Labs"
                  />
                  {errors.company && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.company}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Job Role
                  </label>
                  <input
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="input-premium mt-1 w-full"
                    placeholder="e.g., Frontend Intern"
                  />
                  {errors.role && (
                    <p className="text-xs text-red-400 mt-1">{errors.role}</p>
                  )}
                </div>
                <div>
                  <label
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Stipend
                  </label>
                  <input
                    name="stipend"
                    value={form.stipend}
                    onChange={handleChange}
                    className="input-premium mt-1 w-full"
                    placeholder="e.g., ₹10,000 / month"
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="input-premium mt-1 w-full min-h-[100px]"
                    placeholder="Brief description and responsibilities"
                  />
                  {errors.description && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Contact Number
                  </label>
                  <input
                    name="contactNumber"
                    value={form.contactNumber}
                    onChange={handleChange}
                    className="input-premium mt-1 w-full"
                    placeholder="e.g., +91 98xxxxxx"
                  />
                  {errors.contactNumber && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.contactNumber}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Contact E-mail
                  </label>
                  <input
                    name="contactEmail"
                    value={form.contactEmail}
                    onChange={handleChange}
                    className="input-premium mt-1 w-full"
                    placeholder="e.g., hr@company.com"
                  />
                  {errors.contactEmail && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.contactEmail}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Apply Redirect URL
                  </label>
                  <input
                    name="applyUrl"
                    value={form.applyUrl}
                    onChange={handleChange}
                    className="input-premium mt-1 w-full"
                    placeholder="https://company.com/apply"
                  />
                  {errors.applyUrl && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.applyUrl}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={creating}
                    className="btn-premium inline-flex items-center gap-2"
                  >
                    <Plus size={16} />
                    {creating ? "Creating..." : "Create Internship"}
                  </button>
                </div>
              </form>
            </div>

            {/* List */}
            <div className="space-y-4">
              {loading ? (
                <div
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Loading internships...
                </div>
              ) : internships.length === 0 ? (
                <div
                  className="card-premium p-6 text-center"
                  style={{ color: "var(--text-secondary)" }}
                >
                  No internships yet. Create your first posting above.
                </div>
              ) : (
                internships
                  .filter((i) => i && (i.id || i._id))
                  .map((i) => (
                    <div key={getId(i)} className="card-premium p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="text-lg font-semibold"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {i?.name || "Untitled Internship"}
                            </span>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{
                                background: "var(--bg-elevated)",
                                border: "1px solid var(--border)",
                                color: "var(--text-secondary)",
                              }}
                            >
                              {i?.role || "No role specified"}
                            </span>
                          </div>
                          <div
                            className="text-sm mb-2"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {i?.company || "No company"} •{" "}
                            {i?.stipend || "Stipend not specified"}
                          </div>
                          <p
                            className="text-sm mb-3"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {i?.description || "No description available"}
                          </p>
                          <div
                            className="flex items-center gap-4 text-xs"
                            style={{ color: "var(--text-muted)" }}
                          >
                            <span className="inline-flex items-center gap-1">
                              <Phone size={14} />{" "}
                              {i?.contactNumber || "No contact number"}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Mail size={14} />{" "}
                              {i?.contactEmail || "No contact email"}
                            </span>
                            {i?.applyUrl && (
                              <a
                                className="inline-flex items-center gap-1 hover:underline"
                                href={i.applyUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <LinkIcon size={14} /> Apply URL
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => i && startEdit(i)}
                            className="btn-secondary inline-flex items-center gap-2 border px-3 py-1.5 rounded-md"
                            style={{ borderColor: "var(--border)" }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => i && requestDelete(getId(i))}
                            className="btn-danger inline-flex items-center gap-2"
                          >
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
      {/* Confirm Delete Modal */}
      {Boolean(confirmId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={cancelDelete}
          ></div>
          <div className="relative z-10 w-full max-w-md card-premium p-6">
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                }}
              >
                <Trash2 size={18} style={{ color: "var(--brand)" }} />
              </div>
              <div className="flex-1">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Delete internship?
                </h3>
                <p
                  className="text-sm mt-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  This action cannot be undone. The internship will be
                  permanently removed.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={cancelDelete}
                disabled={confirming}
                className="btn-secondary border px-4 py-2 rounded-md"
                style={{ borderColor: "var(--border)" }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={confirming}
                className="btn-danger bg-red-600 hover:bg-red-700 border border-red-500 text-white px-4 py-2 rounded-md"
              >
                {confirming ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {Boolean(editId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={cancelEdit}
          ></div>
          <div className="relative z-10 w-full max-w-2xl card-premium p-6 max-h-[70vh] overflow-y-auto no-scrollbar">
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Edit internship
            </h3>
            <form
              onSubmit={submitEdit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar"
            >
              <div>
                <label
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Internship Name
                </label>
                <input
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="input-premium mt-1 w-full"
                />
              </div>
              <div>
                <label
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Company Name
                </label>
                <input
                  name="company"
                  value={editForm.company}
                  onChange={handleEditChange}
                  className="input-premium mt-1 w-full"
                />
              </div>
              <div>
                <label
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Job Role
                </label>
                <input
                  name="role"
                  value={editForm.role}
                  onChange={handleEditChange}
                  className="input-premium mt-1 w-full"
                />
              </div>
              <div>
                <label
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Stipend
                </label>
                <input
                  name="stipend"
                  value={editForm.stipend}
                  onChange={handleEditChange}
                  className="input-premium mt-1 w-full"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Description
                </label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  className="input-premium mt-1 w-full min-h-[100px]"
                />
              </div>
              <div>
                <label
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Contact Number
                </label>
                <input
                  name="contactNumber"
                  value={editForm.contactNumber}
                  onChange={handleEditChange}
                  className="input-premium mt-1 w-full"
                />
              </div>
              <div>
                <label
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Contact E-mail
                </label>
                <input
                  name="contactEmail"
                  value={editForm.contactEmail}
                  onChange={handleEditChange}
                  className="input-premium mt-1 w-full"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Apply Redirect URL
                </label>
                <input
                  name="applyUrl"
                  value={editForm.applyUrl}
                  onChange={handleEditChange}
                  className="input-premium mt-1 w-full"
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={editing}
                  className="btn-secondary border px-4 py-2 rounded-md"
                  style={{ borderColor: "var(--border)" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editing}
                  className="btn-premium px-4 py-2 rounded-md"
                >
                  {editing ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
