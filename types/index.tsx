// types/index.ts
export interface Student {
    id: string;
    student_name: string;
    cohort: string;
    courses: string;
    date_joined: string;
    last_login: string;
    status: string;  // Change to string if you want to allow any string value
    class: string;
  }
  
  
  export interface User {
    name: string;
    avatar: string;
  }
  