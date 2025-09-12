// src/services/courseService.js

const BASE_URL = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5000/api"; 
const COURSES_URL = `${BASE_URL}/courses`;

// Implement according to the auth setup (cookie, localStorage, etc.)
function getAuthToken() {
  // Example: return localStorage.getItem('token');
  return localStorage.getItem("token") || null;
}

function authHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  // Tries to parse JSON; if not ok, throws a normalized error
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : null;
  if (!res.ok) {
    const message = data?.message || data?.error || `HTTP ${res.status}`;
    const status = res.status;
    throw Object.assign(new Error(message), { status, data });
  }
  return data;
}

/**
 * Query helpers
 */
function buildQuery(params = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    q.append(k, v);
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}

/**
 * File upload helpers
 * If later the backend supports multipart for modules/thumbnail, use these.
 */
function courseToFormData(course) {
  const fd = new FormData();
  // Primitive fields
  fd.append("title", course.title);
  fd.append("description", course.description || "");
  fd.append("shortDescription", course.shortDescription || course.description?.slice(0, 300) || "");
  fd.append("category", course.category);
  // Map FE level to BE enum if needed
  const levelMap = { Beginner: "beginner", Intermediate: "intermediate", Advanced: "advanced" };
  fd.append("level", levelMap[course.level] || course.level || "beginner");
  fd.append("duration", String(course.durationHours ?? course.duration ?? 0)); // backend expects number (hours)
  fd.append("price", String(course.price ?? 0));
  if (course.originalPrice != null) fd.append("originalPrice", String(course.originalPrice));
  fd.append("language", course.language || "English");
  fd.append("currency", course.currency || "INR");
  fd.append("isPublished", String(course.status === "published"));

  // Optional arrays
  (course.tags || []).forEach((t, i) => fd.append(`tags[${i}]`, t));
  (course.requirements || []).forEach((r, i) => fd.append(`requirements[${i}]`, r));
  (course.learningOutcomes || []).forEach((o, i) => fd.append(`learningOutcomes[${i}]`, o));

  // Thumbnail as File (if present)
  if (course.thumbnailFile instanceof File) {
    fd.append("thumbnailFile", course.thumbnailFile);
  } else if (course.thumbnail) {
    fd.append("thumbnail", course.thumbnail);
  }

  // Modules and lessons (example flattening to match backend embedded schema)
  // If only “modules” with simple media in FE, map each to a single “lesson” in a single module block or per-module block
  const modules = course.modules || [];
  modules.forEach((m, mi) => {
    const modPrefix = `modules[${mi}]`;
    fd.append(`${modPrefix}[title]`, m.title || `Module ${mi + 1}`);
    fd.append(`${modPrefix}[description]`, m.description || "");
    fd.append(`${modPrefix}[order]`, String(mi + 1));
    fd.append(`${modPrefix}[isPublished]`, "true");
    // Lessons – create one lesson per FE module item
    const lessonPrefix = `${modPrefix}[lessons]`;
    fd.append(`${lessonPrefix}[title]`, m.title || `Lesson ${mi + 1}`);
    fd.append(`${lessonPrefix}[description]`, m.description || "");
    fd.append(`${lessonPrefix}[content]`, m.description || "Content");
    fd.append(`${lessonPrefix}[order]`, "1");
    fd.append(`${lessonPrefix}[isFree]`, "false");
    // Map FE type to BE resource or store as videoUrl for now
    if (m.file instanceof File) {
      // Attach as videoFile or an image file; backend needs a handler to process
      fd.append(`${lessonPrefix}[videoFile]`, m.file);
    }
    if (m.thumbnail instanceof File) {
      fd.append(`${lessonPrefix}[resources][title]`, "Thumbnail");
      fd.append(`${lessonPrefix}[resources][type]`, "document");
      fd.append(`${lessonPrefix}[resources][file]`, m.thumbnail);
    }
  });

  return fd;
}

/**
 * Public endpoints
 */
export async function listCourses({ page = 1, limit = 12, q, category, level, instructor, minPrice, maxPrice, sort } = {}) {
  const query = buildQuery({ page, limit, q, category, level, instructor, minPrice, maxPrice, sort });
  const res = await fetch(`${COURSES_URL}/${query}`, {
    method: "GET",
    credentials: "include",
//     headers: {
//       ...authHeaders(),
//     },
  });
  return handleResponse(res); // { status, data: { courses, pagination } }
}

export async function getFeaturedCourses() {
  const res = await fetch(`${COURSES_URL}/featured`, {
    method: "GET",
    credentials: "include",
    headers: {
      ...authHeaders(),
    },
  });
  return handleResponse(res); // { status, data: { courses } }
}

export async function getCourseCategories() {
  const res = await fetch(`${COURSES_URL}/categories/list`, {
    method: "GET",
    credentials: "include",
    headers: {
      ...authHeaders(),
    },
  });
  return handleResponse(res); // { status, data: { categories } }
}

export async function getCourseById(id) {
  const res = await fetch(`${COURSES_URL}/${id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      ...authHeaders(),
    },
  });
  return handleResponse(res); // { status, data: { course, enrollment } }
}

/**
 * Protected endpoints (Instructor/Admin for writes)
 */
export async function createCourse(coursePayload, { useMultipart = false } = {}) {
  // coursePayload comes from Admin form. Convert fields to backend expectations.
  let body;
  let headers = {
    ...authHeaders(),
  };

  if (useMultipart) {
    body = courseToFormData(coursePayload);
    // Do not set Content-Type; browser sets multipart boundary automatically
  } else {
    // JSON: map FE fields to BE schema: instructor is taken from token server-side
    const levelMap = { Beginner: "beginner", Intermediate: "intermediate", Advanced: "advanced" };
    const payload = {
      title: coursePayload.title,
      description: coursePayload.description || "",
      shortDescription: coursePayload.description?.slice(0, 300) || "",
      category: coursePayload.category,
      level: levelMap[coursePayload.level] || coursePayload.level || "beginner",
      duration: Number(coursePayload.durationHours ?? coursePayload.duration ?? 0), // in hours
      price: Number(coursePayload.price ?? 0),
      currency: coursePayload.currency || "INR",
      language: coursePayload.language || "English",
      isPublished: coursePayload.status === "published",
      // Thumbnail URL; switch to upload if needed via multipart
      thumbnail: coursePayload.thumbnail || "",
      modules: (coursePayload.modules || []).map((m, idx) => ({
        title: m.title || `Module ${idx + 1}`,
        description: m.description || "",
        order: idx + 1,
        isPublished: true,
        lessons: [
          {
            title: m.title || `Lesson ${idx + 1}`,
            description: m.description || "",
            content: m.description || "Content",
            order: 1,
            isFree: false,
            // Store preview URL as videoUrl if available; actual uploads require multipart/backed file handling
            videoUrl: m.filePreview || "",
            duration: 0,
          },
        ],
      })),
    };
    body = JSON.stringify(payload);
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${COURSES_URL}`, {
    method: "POST",
    credentials: "include",
    headers,
    body,
  });
  return handleResponse(res); // { status, message, data: { course } }
}

export async function updateCourse(id, coursePayload, { useMultipart = false } = {}) {
  let body;
  let headers = {
    ...authHeaders(),
  };

  if (useMultipart) {
    body = courseToFormData(coursePayload);
  } else {
    const levelMap = { Beginner: "beginner", Intermediate: "intermediate", Advanced: "advanced" };
    const payload = {
      title: coursePayload.title,
      description: coursePayload.description || "",
      shortDescription: coursePayload.description?.slice(0, 300) || "",
      category: coursePayload.category,
      level: levelMap[coursePayload.level] || coursePayload.level || "beginner",
      duration: Number(coursePayload.durationHours ?? coursePayload.duration ?? 0),
      price: Number(coursePayload.price ?? 0),
      currency: coursePayload.currency || "INR",
      language: coursePayload.language || "English",
      isPublished: coursePayload.status === "published",
      thumbnail: coursePayload.thumbnail || "",
      modules: (coursePayload.modules || []).map((m, idx) => ({
        title: m.title || `Module ${idx + 1}`,
        description: m.description || "",
        order: idx + 1,
        isPublished: true,
        lessons: [
          {
            title: m.title || `Lesson ${idx + 1}`,
            description: m.description || "",
            content: m.description || "Content",
            order: 1,
            isFree: false,
            videoUrl: m.filePreview || "",
            duration: 0,
          },
        ],
      })),
    };
    body = JSON.stringify(payload);
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${COURSES_URL}/${id}`, {
    method: "PUT",
    credentials: "include",
    headers,
    body,
  });
  return handleResponse(res); // { status, message, data: { course } }
}

export async function deleteCourse(id) {
  const res = await fetch(`${COURSES_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      ...authHeaders(),
    },
  });
  return handleResponse(res); // { status, message }
}

/**
 * Enrollment and reviews
 */
export async function enrollInCourse(id) {
  const res = await fetch(`${COURSES_URL}/${id}/enroll`, {
    method: "POST",
    credentials: "include",
    headers: {
      ...authHeaders(),
    },
  });
  return handleResponse(res); // { status, message }
}

export async function addCourseReview(id, { rating, title, comment }) {
  const headers = {
    ...authHeaders(),
    "Content-Type": "application/json",
  };
  const res = await fetch(`${COURSES_URL}/${id}/reviews`, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify({ rating, title, comment }),
  });
  return handleResponse(res); // { status, message, data: { review } }
}

/**
 * Helpers to map Admin UI local state to service payloads
 */
export function mapAdminFormToBackend(form) {
  // Converts AdminCourses local form to create/update payload for JSON pathway
  return {
    title: form.title,
    description: form.description,
    category: form.category,
    level: form.level, // mapping handled in create/update
    duration: form.duration, // string like "8 weeks" in UI; consider converting to hours (number)
    durationHours: extractHoursFromText(form.duration),
    price: Number(form.price),
    status: form.status, // draft | published | archived
    target: form.target, // not used by backend unless added
    students: Number(form.students || 0),
    rating: Number(form.rating || 0),
    thumbnail: form.thumbnail,
    createdAt: form.createdAt,
    modules: (form.modules || []).map(m => ({
      title: m.title,
      type: m.type,
      description: m.description,
      // The Admin UI uses previews; keep for videoUrl mapping
      filePreview: m.filePreview || null,
      thumbnailPreview: m.thumbnailPreview || null,
      // If wiring multipart, also pass File objects
      file: m.file || null,
      thumbnail: m.thumbnail || null,
    })),
  };
}

// naive converter: "8 weeks" => 8*7*24 = 1344; "10h" => 10
function extractHoursFromText(text) {
  if (!text) return 0;
  const s = String(text).toLowerCase().trim();
  const num = parseFloat((s.match(/[\d.]+/) || ["0"])[0]);
  if (s.includes("week")) return Math.round(num * 7 * 24);
  if (s.includes("day")) return Math.round(num * 24);
  if (s.includes("hour") || s.includes("hr") || s.includes("h")) return Math.round(num);
  if (s.includes("min")) return Math.round(num / 60);
  return Math.round(num); // fallback
}
