// @/content/data.ts
export const enrollmentSample = [
  {
    "enrollment_id": 1,
    "course_id": 102,
    "name": "Web Development Basics",
    "join_code": "WEBDEV202",
    "host_id": 2,
    "host_name": "Jane Doe",
    "enrolled_at": 1701388800
  },
  {
    "enrollment_id": 2,
    "course_id": 101,
    "name": "Introduction to Python",
    "join_code": "PYTHON101",
    "host_id": 1,
    "host_name": "John Doe",
    "enrolled_at": 1702080000
  },
  {
    "enrollment_id": 3,
    "course_id": 104,
    "name": "Database Management Systems",
    "join_code": "DBMS404",
    "host_id": 4,
    "host_name": "Bob Johnson",
    "enrolled_at": 1703030400
  },
  {
    "enrollment_id": 4,
    "course_id": 103,
    "name": "Data Structures & Algorithms",
    "join_code": "DSALGO303",
    "host_id": 3,
    "host_name": "Alice Smith",
    "enrolled_at": 1704240000
  },
  {
    "enrollment_id": 5,
    "course_id": 107,
    "name": "Artificial Intelligence",
    "join_code": "AI707",
    "host_id": 1,
    "host_name": "John Doe",
    "enrolled_at": 1705622400
  },
  {
    "enrollment_id": 6,
    "course_id": 105,
    "name": "Mobile App Development",
    "join_code": "MOBILEAPP505",
    "host_id": 5,
    "host_name": "Charlie Brown",
    "enrolled_at": 1706832000
  },
  {
    "enrollment_id": 7,
    "course_id": 109,
    "name": "Game Development with Unity",
    "join_code": "UNITY909",
    "host_id": 7,
    "host_name": "Eve Adams",
    "enrolled_at": 1708128000
  },
  {
    "enrollment_id": 8,
    "course_id": 106,
    "name": "Network Security",
    "join_code": "NETSEC606",
    "host_id": 6,
    "host_name": "Diana Prince",
    "enrolled_at": 1709424000
  },
  {
    "enrollment_id": 9,
    "course_id": 108,
    "name": "Cloud Computing",
    "join_code": "CLOUD808",
    "host_id": 2,
    "host_name": "Jane Doe",
    "enrolled_at": 1710720000
  },
  {
    "enrollment_id": 10,
    "course_id": 110,
    "name": "Cybersecurity Fundamentals",
    "join_code": "CYBER1010",
    "host_id": 8,
    "host_name": "Frank White",
    "enrolled_at": 1712016000
  }
]



export const sessionsSample =
 [
  {
    "session_id": 1,
    "course_id": 101,
    "start_time": 1730438400,
    "end_time": 1730442000
  },
  {
    "session_id": 2,
    "course_id": 102,
    "start_time": 1730524800,
    "end_time": 1730528400
  },
  {
    "session_id": 3,
    "course_id": 103,
    "start_time": 1730611200,
    "end_time": 1730614800
  },
  {
    "session_id": 4,
    "course_id": 104,
    "start_time": 1730697600,
    "end_time": 1730701200
  },
  {
    "session_id": 5,
    "course_id": 105,
    "start_time": 1730784000,
    "end_time": 1730787600
  },
  {
    "session_id": 6,
    "course_id": 106,
    "start_time": 1730870400,
    "end_time": 1730874000
  },
  {
    "session_id": 7,
    "course_id": 107,
    "start_time": 1730956800,
    "end_time": 1730960400
  },
  {
    "session_id": 8,
    "course_id": 108,
    "start_time": 1731043200,
    "end_time": 1731046800
  },
  {
    "session_id": 9,
    "course_id": 109,
    "start_time": 1731129600,
    "end_time": 1731133200
  },
  {
    "session_id": 10,
    "course_id": 110,
    "start_time": 1731216000,
    "end_time": 1731219600
  }
]


export const courses = [
  { id: 1, title: "Company" },
  { id: 2, title: "Sport Org" },
  { id: 3, title: "Group Project" },
  { id: 4, title: "Company 2" },
];

export const coursesSample = [
  {
    "course_id": 101,
    "name": "Introduction to Python",
    "join_code": "PYTHON101",
    "host_id": 1,
    "host_name": "John Doe",
    "geolocation_latitude": 10.3157,
    "geolocation_longitude": 123.8854,
    "late_threshold_minutes": 15,
    "present_threshold_minutes": 5,
    "created_at": 1678886400
  },
  {
    "course_id": 102,
    "name": "Web Development Basics",
    "join_code": "WEBDEV202",
    "host_id": 2,
    "host_name": "Jane Doe",
    "geolocation_latitude": null,
    "geolocation_longitude": null,
    "late_threshold_minutes": 10,
    "present_threshold_minutes": 5,
    "created_at": 1678972800
  },
  {
    "course_id": 103,
    "name": "Data Structures & Algorithms",
    "join_code": "DSALGO303",
    "host_id": 3,
    "host_name": "Alice Smith",
    "geolocation_latitude": 10.3190,
    "geolocation_longitude": 123.8900,
    "late_threshold_minutes": 20,
    "present_threshold_minutes": 7,
    "created_at": 1679059200
  },
  {
    "course_id": 104,
    "name": "Database Management Systems",
    "join_code": "DBMS404",
    "host_id": 4,
    "host_name": "Bob Johnson",
    "geolocation_latitude": 10.2900,
    "geolocation_longitude": 123.9000,
    "late_threshold_minutes": 10,
    "present_threshold_minutes": 3,
    "created_at": 1679145600
  },
  {
    "course_id": 105,
    "name": "Mobile App Development",
    "join_code": "MOBILEAPP505",
    "host_id": 5,
    "host_name": "Charlie Brown",
    "geolocation_latitude": null,
    "geolocation_longitude": null,
    "late_threshold_minutes": 15,
    "present_threshold_minutes": 5,
    "created_at": 1679232000
  },
  {
    "course_id": 106,
    "name": "Network Security",
    "join_code": "NETSEC606",
    "host_id": 6,
    "host_name": "Diana Prince",
    "geolocation_latitude": 10.3200,
    "geolocation_longitude": 123.8800,
    "late_threshold_minutes": 25,
    "present_threshold_minutes": 10,
    "created_at": 1679318400
  },
  {
    "course_id": 107,
    "name": "Artificial Intelligence",
    "join_code": "AI707",
    "host_id": 1,
    "host_name": "John Doe",
    "geolocation_latitude": 10.3160,
    "geolocation_longitude": 123.8860,
    "late_threshold_minutes": 20,
    "present_threshold_minutes": 8,
    "created_at": 1679404800
  },
  {
    "course_id": 108,
    "name": "Cloud Computing",
    "join_code": "CLOUD808",
    "host_id": 2,
    "host_name": "Jane Doe",
    "geolocation_latitude": null,
    "geolocation_longitude": null,
    "late_threshold_minutes": 10,
    "present_threshold_minutes": 4,
    "created_at": 1679491200
  },
  {
    "course_id": 109,
    "name": "Game Development with Unity",
    "join_code": "UNITY909",
    "host_id": 7,
    "host_name": "Eve Adams",
    "geolocation_latitude": 10.3000,
    "geolocation_longitude": 123.9100,
    "late_threshold_minutes": 15,
    "present_threshold_minutes": 6,
    "created_at": 1679577600
  },
  {
    "course_id": 110,
    "name": "Cybersecurity Fundamentals",
    "join_code": "CYBER1010",
    "host_id": 8,
    "host_name": "Frank White",
    "geolocation_latitude": 10.3100,
    "geolocation_longitude": 123.8950,
    "late_threshold_minutes": 12,
    "present_threshold_minutes": 5,
    "created_at": 1679664000
  }
]


export const sampleData = {
  "Users": [
    { "user_id": 1, "name": "Eliseo Alcaraz", "email": "eliseo@example.com", "password_hash": "hash1", "created_at": "2025-05-01T08:00:00Z" },
    { "user_id": 2, "name": "Maria Santos", "email": "maria@example.com", "password_hash": "hash2", "created_at": "2025-05-01T08:10:00Z" },
    { "user_id": 3, "name": "Juan Cruz", "email": "juan@example.com", "password_hash": "hash3", "created_at": "2025-05-01T08:20:00Z" },
    { "user_id": 4, "name": "Liza Reyes", "email": "liza@example.com", "password_hash": "hash4", "created_at": "2025-05-01T08:30:00Z" },
    { "user_id": 5, "name": "Carlos dela Peña", "email": "carlos@example.com", "password_hash": "hash5", "created_at": "2025-05-01T08:40:00Z" },
    { "user_id": 6, "name": "Anna Lim", "email": "anna@example.com", "password_hash": "hash6", "created_at": "2025-05-01T08:50:00Z" },
    { "user_id": 7, "name": "Noel Tan", "email": "noel@example.com", "password_hash": "hash7", "created_at": "2025-05-01T09:00:00Z" },
    { "user_id": 8, "name": "Grace Uy", "email": "grace@example.com", "password_hash": "hash8", "created_at": "2025-05-01T09:10:00Z" },
    { "user_id": 9, "name": "Robert Ong", "email": "robert@example.com", "password_hash": "hash9", "created_at": "2025-05-01T09:20:00Z" },
    { "user_id": 10, "name": "Irene Gomez", "email": "irene@example.com", "password_hash": "hash10", "created_at": "2025-05-01T09:30:00Z" }
  ],

  "Courses": [
    { "course_id": 101, "host_id": 1, "name": "Intro to Data Science", "join_code": "DS101", "geolocation": "14.5995,120.9842", "created_at": "2025-05-02T08:00:00Z", "late_threshold_minutes": 10 },
    { "course_id": 102, "host_id": 2, "name": "Web Development", "join_code": "WEB102", "geolocation": "14.6095,121.0000", "created_at": "2025-05-02T08:10:00Z", "late_threshold_minutes": 5 },
    { "course_id": 103, "host_id": 3, "name": "Mobile Apps", "join_code": "MOB103", "geolocation": "14.6200,121.0010", "created_at": "2025-05-02T08:20:00Z", "late_threshold_minutes": 7 },
    { "course_id": 104, "host_id": 4, "name": "Databases", "join_code": "DB104", "geolocation": "14.6100,121.0020", "created_at": "2025-05-02T08:30:00Z", "late_threshold_minutes": 8 },
    { "course_id": 105, "host_id": 5, "name": "Cybersecurity", "join_code": "SEC105", "geolocation": "14.6200,121.0030", "created_at": "2025-05-02T08:40:00Z", "late_threshold_minutes": 6 },
    { "course_id": 106, "host_id": 6, "name": "Networking", "join_code": "NET106", "geolocation": "14.6300,121.0040", "created_at": "2025-05-02T08:50:00Z", "late_threshold_minutes": 10 },
    { "course_id": 107, "host_id": 7, "name": "Machine Learning", "join_code": "ML107", "geolocation": "14.6400,121.0050", "created_at": "2025-05-02T09:00:00Z", "late_threshold_minutes": 5 },
    { "course_id": 108, "host_id": 8, "name": "AI Ethics", "join_code": "ETH108", "geolocation": "14.6500,121.0060", "created_at": "2025-05-02T09:10:00Z", "late_threshold_minutes": 9 },
    { "course_id": 109, "host_id": 9, "name": "Cloud Computing", "join_code": "CLOUD109", "geolocation": "14.6600,121.0070", "created_at": "2025-05-02T09:20:00Z", "late_threshold_minutes": 10 },
    { "course_id": 110, "host_id": 10, "name": "Quantum Computing", "join_code": "QUANT110", "geolocation": "14.6700,121.0080", "created_at": "2025-05-02T09:30:00Z", "late_threshold_minutes": 4 }
  ],

  "Enrollments": [
    { "user_id": 1, "course_id": 101, "enrolled_at": "2025-05-03T10:00:00Z" },
    { "user_id": 2, "course_id": 101, "enrolled_at": "2025-05-03T10:01:00Z" },
    { "user_id": 3, "course_id": 102, "enrolled_at": "2025-05-03T10:02:00Z" },
    { "user_id": 4, "course_id": 102, "enrolled_at": "2025-05-03T10:03:00Z" },
    { "user_id": 5, "course_id": 103, "enrolled_at": "2025-05-03T10:04:00Z" },
    { "user_id": 6, "course_id": 104, "enrolled_at": "2025-05-03T10:05:00Z" },
    { "user_id": 7, "course_id": 105, "enrolled_at": "2025-05-03T10:06:00Z" },
    { "user_id": 8, "course_id": 106, "enrolled_at": "2025-05-03T10:07:00Z" },
    { "user_id": 9, "course_id": 107, "enrolled_at": "2025-05-03T10:08:00Z" },
    { "user_id": 10, "course_id": 108, "enrolled_at": "2025-05-03T10:09:00Z" }
  ],

  "Sessions": [
    { "session_id": 201, "course_id": 101, "start_time": "2025-05-10T08:00:00Z", "end_time": "2025-05-10T09:30:00Z" },
    { "session_id": 202, "course_id": 102, "start_time": "2025-05-11T08:00:00Z", "end_time": "2025-05-11T09:30:00Z" },
    { "session_id": 203, "course_id": 103, "start_time": "2025-05-12T08:00:00Z", "end_time": "2025-05-12T09:30:00Z" },
    { "session_id": 204, "course_id": 104, "start_time": "2025-05-13T08:00:00Z", "end_time": "2025-05-13T09:30:00Z" },
    { "session_id": 205, "course_id": 105, "start_time": "2025-05-14T08:00:00Z", "end_time": "2025-05-14T09:30:00Z" },
    { "session_id": 206, "course_id": 106, "start_time": "2025-05-15T08:00:00Z", "end_time": "2025-05-15T09:30:00Z" },
    { "session_id": 207, "course_id": 107, "start_time": "2025-05-16T08:00:00Z", "end_time": "2025-05-16T09:30:00Z" },
    { "session_id": 208, "course_id": 108, "start_time": "2025-05-17T08:00:00Z", "end_time": "2025-05-17T09:30:00Z" },
    { "session_id": 209, "course_id": 109, "start_time": "2025-05-18T08:00:00Z", "end_time": "2025-05-18T09:30:00Z" },
    { "session_id": 210, "course_id": 110, "start_time": "2025-05-19T08:00:00Z", "end_time": "2025-05-19T09:30:00Z" }
  ],

  "Attendances": [
    { "attendance_id": 301, "session_id": 201, "user_id": 1, "status": "present", "user_geolocation": "14.5996,120.9843", "proof_base64": "proof1", "joined_at": "2025-05-10T08:01:00Z" },
    { "attendance_id": 302, "session_id": 201, "user_id": 2, "status": "late", "user_geolocation": "14.5997,120.9844", "proof_base64": "proof2", "joined_at": "2025-05-10T08:12:00Z" },
    { "attendance_id": 303, "session_id": 202, "user_id": 3, "status": "present", "user_geolocation": "14.6095,121.0001", "proof_base64": "proof3", "joined_at": "2025-05-11T08:05:00Z" },
    { "attendance_id": 304, "session_id": 202, "user_id": 4, "status": "present", "user_geolocation": "14.6096,121.0002", "proof_base64": "proof4", "joined_at": "2025-05-11T08:03:00Z" },
    { "attendance_id": 305, "session_id": 203, "user_id": 5, "status": "absent", "user_geolocation": "", "proof_base64": "", "joined_at": "" },
    { "attendance_id": 306, "session_id": 204, "user_id": 6, "status": "present", "user_geolocation": "14.6101,121.0021", "proof_base64": "proof6", "joined_at": "2025-05-13T08:00:00Z" },
    { "attendance_id": 307, "session_id": 205, "user_id": 7, "status": "present", "user_geolocation": "14.6201,121.0031", "proof_base64": "proof7", "joined_at": "2025-05-14T08:02:00Z" },
    { "attendance_id": 308, "session_id": 206, "user_id": 8, "status": "late", "user_geolocation": "14.6301,121.0041", "proof_base64": "proof8", "joined_at": "2025-05-15T08:20:00Z" },
    { "attendance_id": 309, "session_id": 207, "user_id": 9, "status": "present", "user_geolocation": "14.6401,121.0051", "proof_base64": "proof9", "joined_at": "2025-05-16T08:00:00Z" },
    { "attendance_id": 310, "session_id": 208, "user_id": 10, "status": "present", "user_geolocation": "14.6501,121.0061", "proof_base64": "proof10", "joined_at": "2025-05-17T08:00:00Z" }
  ]
}
