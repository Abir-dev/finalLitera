import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { courseService } from "../services/courseService.js";

export default function AdminCoupons() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ code: "", percentOff: "", courseId: "", expiresAt: "" });
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await courseService.getCourses();
        // API returns { status, data: { courses, pagination } }
        const list = Array.isArray(res?.data?.courses) ? res.data.courses : Array.isArray(res?.data) ? res.data : [];
        setCourses(list);
      } catch (e) {
        console.error(e);
        setCourses([]);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");
    setCreating(true);
    try {
      const API = import.meta.env.VITE_API_URL || "https://finallitera.onrender.com/api";
      const adminToken = localStorage.getItem("adminToken");
      const resp = await fetch(`${API}/coupons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(form),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || "Failed to create coupon");
      setMessage("Coupon created successfully");
      setForm({ code: "", percentOff: "", courseId: "", expiresAt: "" });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Generate Promocode</h1>
        <button
          type="button"
          onClick={() => navigate("/admin/dashboard")}
          className="btn-premium px-4 py-2 font-semibold"
        >
          Back to Dashboard
        </button>
      </div>
      <form onSubmit={handleCreate} className="space-y-4 max-w-xl">
        <div>
          <label className="block text-sm mb-1">Coupon Code</label>
          <input name="code" value={form.code} onChange={handleChange} className="w-full p-2 rounded bg-white/5 border border-white/10" placeholder="ENTER50" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Percent Off</label>
          <input name="percentOff" type="number" min="1" max="100" value={form.percentOff} onChange={handleChange} className="w-full p-2 rounded bg-white/5 border border-white/10" placeholder="e.g. 20" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Course</label>
          <select name="courseId" value={form.courseId} onChange={handleChange} className="w-full p-2 rounded bg-white/5 border border-white/10" required>
            <option value="">Select a course</option>
            {courses.map((c) => (
              <option key={c._id || c.id} value={c._id || c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Expiry (optional)</label>
          <input name="expiresAt" type="datetime-local" value={form.expiresAt} onChange={handleChange} className="w-full p-2 rounded bg-white/5 border border-white/10" />
        </div>
        <button disabled={creating} className="btn-premium px-6 py-2 font-semibold disabled:opacity-50">{creating ? "Creating..." : "Create Coupon"}</button>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}


