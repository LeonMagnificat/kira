export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  category: 'doctors' | 'nurses' | 'janitors' | 'investors' | 'members';
  hireDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  avatar: string;
  hasSystemAccess: boolean;
  salary: number;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  skills: string[];
  notes: string;
}

export const mockEmployees: Employee[] = [
  {
    id: "EMP001",
    firstName: "Dr. Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@clinic.com",
    phone: "+1 (555) 123-4567",
    position: "Chief Medical Officer",
    department: "Medical",
    category: "doctors",
    hireDate: "2020-03-15",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    hasSystemAccess: true,
    salary: 180000,
    address: "123 Medical Ave, Health City, HC 12345",
    emergencyContact: {
      name: "Michael Johnson",
      phone: "+1 (555) 987-6543",
      relationship: "Spouse"
    },
    skills: ["Cardiology", "Emergency Medicine", "Leadership"],
    notes: "Excellent leadership skills, specializes in cardiac procedures."
  },
  {
    id: "EMP002",
    firstName: "Dr. Robert",
    lastName: "Williams",
    email: "robert.williams@clinic.com",
    phone: "+1 (555) 456-7890",
    position: "Pediatrician",
    department: "Medical",
    category: "doctors",
    hireDate: "2019-09-05",
    status: "on-leave",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    hasSystemAccess: true,
    salary: 160000,
    address: "321 Kids Avenue, Family Town, FT 24680",
    emergencyContact: {
      name: "Jennifer Williams",
      phone: "+1 (555) 654-3210",
      relationship: "Spouse"
    },
    skills: ["Pediatric Care", "Child Psychology", "Vaccination"],
    notes: "Currently on paternity leave. Expected return: Next month."
  },
  {
    id: "EMP003",
    firstName: "Dr. James",
    lastName: "Thompson",
    email: "james.thompson@clinic.com",
    phone: "+1 (555) 678-9012",
    position: "Surgeon",
    department: "Medical",
    category: "doctors",
    hireDate: "2018-11-30",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
    hasSystemAccess: true,
    salary: 220000,
    address: "987 Surgery Street, Precision City, PC 86420",
    emergencyContact: {
      name: "Mary Thompson",
      phone: "+1 (555) 432-1098",
      relationship: "Spouse"
    },
    skills: ["General Surgery", "Minimally Invasive Procedures", "Trauma Surgery"],
    notes: "Senior surgeon with over 15 years of experience."
  },
  {
    id: "EMP004",
    firstName: "Mike",
    lastName: "Davis",
    email: "mike.davis@clinic.com",
    phone: "+1 (555) 234-5678",
    position: "Registered Nurse",
    department: "Nursing",
    category: "nurses",
    hireDate: "2021-07-22",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face",
    hasSystemAccess: true,
    salary: 75000,
    address: "456 Care Street, Wellness Town, WT 67890",
    emergencyContact: {
      name: "Lisa Davis",
      phone: "+1 (555) 876-5432",
      relationship: "Sister"
    },
    skills: ["Patient Care", "IV Therapy", "Emergency Response"],
    notes: "Dedicated nurse with excellent patient care skills."
  },
  {
    id: "EMP005",
    firstName: "Lisa",
    lastName: "Martinez",
    email: "lisa.martinez@clinic.com",
    phone: "+1 (555) 345-6789",
    position: "Head Nurse",
    department: "Nursing",
    category: "nurses",
    hireDate: "2019-03-12",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1594824388853-d0d4c0b5e5b5?w=150&h=150&fit=crop&crop=face",
    hasSystemAccess: true,
    salary: 85000,
    address: "789 Nursing Ave, Care City, CC 24680",
    emergencyContact: {
      name: "Carlos Martinez",
      phone: "+1 (555) 765-4321",
      relationship: "Husband"
    },
    skills: ["Team Leadership", "Critical Care", "Patient Education"],
    notes: "Excellent leadership and mentoring skills for junior nurses."
  },
  {
    id: "EMP006",
    firstName: "Emily",
    lastName: "Chen",
    email: "emily.chen@clinic.com",
    phone: "+1 (555) 345-6789",
    position: "Medical Technician",
    department: "Laboratory",
    category: "members",
    hireDate: "2022-01-10",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150&h=150&fit=crop&crop=face",
    hasSystemAccess: true,
    salary: 55000,
    address: "789 Lab Lane, Science City, SC 13579",
    emergencyContact: {
      name: "David Chen",
      phone: "+1 (555) 765-4321",
      relationship: "Father"
    },
    skills: ["Lab Analysis", "Equipment Maintenance", "Quality Control"],
    notes: "Highly skilled in laboratory procedures and equipment handling."
  },
  {
    id: "EMP007",
    firstName: "Amanda",
    lastName: "Rodriguez",
    email: "amanda.rodriguez@clinic.com",
    phone: "+1 (555) 567-8901",
    position: "Receptionist",
    department: "Administration",
    category: "members",
    hireDate: "2023-04-18",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c0763c5c?w=150&h=150&fit=crop&crop=face",
    hasSystemAccess: false,
    salary: 42000,
    address: "654 Front Desk Blvd, Welcome City, WC 97531",
    emergencyContact: {
      name: "Carlos Rodriguez",
      phone: "+1 (555) 543-2109",
      relationship: "Brother"
    },
    skills: ["Customer Service", "Scheduling", "Multi-line Phone Systems"],
    notes: "Excellent communication skills and very organized."
  },
  {
    id: "EMP008",
    firstName: "Marcus",
    lastName: "Johnson",
    email: "marcus.johnson@clinic.com",
    phone: "+1 (555) 678-9012",
    position: "Head Custodian",
    department: "Maintenance",
    category: "janitors",
    hireDate: "2020-08-15",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    hasSystemAccess: false,
    salary: 38000,
    address: "321 Clean Street, Tidy Town, TT 86420",
    emergencyContact: {
      name: "Patricia Johnson",
      phone: "+1 (555) 432-1098",
      relationship: "Wife"
    },
    skills: ["Facility Maintenance", "Sanitation Protocols", "Team Management"],
    notes: "Ensures highest standards of cleanliness and safety."
  },
  {
    id: "EMP009",
    firstName: "Rosa",
    lastName: "Garcia",
    email: "rosa.garcia@clinic.com",
    phone: "+1 (555) 789-0123",
    position: "Custodian",
    department: "Maintenance",
    category: "janitors",
    hireDate: "2022-06-20",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    hasSystemAccess: false,
    salary: 32000,
    address: "456 Sparkle Ave, Clean City, CL 97531",
    emergencyContact: {
      name: "Miguel Garcia",
      phone: "+1 (555) 321-0987",
      relationship: "Son"
    },
    skills: ["Deep Cleaning", "Equipment Operation", "Chemical Safety"],
    notes: "Reliable and thorough in maintaining facility cleanliness."
  },
  {
    id: "EMP010",
    firstName: "Richard",
    lastName: "Sterling",
    email: "richard.sterling@clinic.com",
    phone: "+1 (555) 890-1234",
    position: "Board Member",
    department: "Executive",
    category: "investors",
    hireDate: "2018-01-01",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    hasSystemAccess: true,
    salary: 0,
    address: "123 Executive Plaza, Business District, BD 12345",
    emergencyContact: {
      name: "Margaret Sterling",
      phone: "+1 (555) 210-9876",
      relationship: "Spouse"
    },
    skills: ["Strategic Planning", "Financial Analysis", "Healthcare Investment"],
    notes: "Major investor and strategic advisor to the clinic."
  },
  {
    id: "EMP011",
    firstName: "Victoria",
    lastName: "Chen",
    email: "victoria.chen@clinic.com",
    phone: "+1 (555) 901-2345",
    position: "Investment Partner",
    department: "Executive",
    category: "investors",
    hireDate: "2019-06-15",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    hasSystemAccess: true,
    salary: 0,
    address: "789 Capital Street, Finance Quarter, FQ 67890",
    emergencyContact: {
      name: "James Chen",
      phone: "+1 (555) 109-8765",
      relationship: "Brother"
    },
    skills: ["Healthcare Technology", "Market Analysis", "Growth Strategy"],
    notes: "Specializes in healthcare technology investments and digital transformation."
  }
];