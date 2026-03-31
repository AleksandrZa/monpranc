const URLS = {
  auth: '/api/auth',
  reviews: '/api/reviews',
  enroll: '/api/enroll',
  admin: '/api/admin',
};

async function post(url: string, body: object, adminKey?: string) {
  const payload = adminKey ? { ...body, key: adminKey } : body;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

async function get(url: string, params?: Record<string, string>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  const res = await fetch(url + query);
  return res.json();
}

export const api = {
  register: (name: string, email: string, password: string) =>
    post(URLS.auth, { action: 'register', name, email, password }),

  login: (email: string, password: string) =>
    post(URLS.auth, { action: 'login', email, password }),

  getReviews: () =>
    get(URLS.reviews),

  submitReview: (data: { user_id: number; user_name: string; course_title: string; text: string; rating: number }) =>
    post(URLS.reviews, data),

  submitEnroll: (data: {
    user_id?: number;
    user_name: string;
    user_email: string;
    user_phone: string;
    course_title: string;
    message?: string;
  }) => post(URLS.enroll, data),

  getEnrollments: (userId: number) =>
    get(URLS.enroll, { user_id: String(userId) }),

  admin: {
    getEnrollments: (key: string) =>
      post(URLS.admin, { action: 'get_enrollments' }, key),
    updateEnrollment: (key: string, id: number, status: string, schedule: string) =>
      post(URLS.admin, { action: 'update_enrollment', id, status, schedule }, key),
    getReviews: (key: string) =>
      post(URLS.admin, { action: 'get_reviews' }, key),
    approveReview: (key: string, id: number) =>
      post(URLS.admin, { action: 'approve_review', id }, key),
    rejectReview: (key: string, id: number) =>
      post(URLS.admin, { action: 'reject_review', id }, key),
    getUsers: (key: string) =>
      post(URLS.admin, { action: 'get_users' }, key),
  },
};