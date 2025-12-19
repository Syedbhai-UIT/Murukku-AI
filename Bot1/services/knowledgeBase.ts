
import { SemesterInfo, SubjectNote } from '../types';

export const enggTreeLinks = {
    questionPapers: 'https://www.enggtree.com/anna-university-question-papers-2021-regulation/',
    lectureNotes: 'https://www.enggtree.com/anna-university-lecture-notes-2021-regulation/',
    twoMarks: 'https://www.enggtree.com/category/two-mark-questions/',
    questionBank: 'https://www.enggtree.com/category/question-bank/',
    timetable: 'https://www.enggtree.com/timetable/',
    results: 'https://www.enggtree.com/anna-university-results/'
};

export const globalReferences = `
**GLOBAL STANDARD TEXTBOOKS (Foreign Authors) - SOURCE OF TRUTH:**
The AI should strictly base detailed explanations on these standards:

1.  **Algorithms & DSA:** "Introduction to Algorithms" (CLRS - Cormen, Leiserson, Rivest, Stein), "Algorithm Design" (Kleinberg & Tardos).
2.  **Operating Systems:** "Operating System Concepts" (Silberschatz, Galvin, Gagne), "Modern Operating Systems" (Tanenbaum).
3.  **Computer Networks:** "Computer Networking: A Top-Down Approach" (Kurose & Ross), "Computer Networks" (Tanenbaum).
4.  **Database Systems:** "Database System Concepts" (Silberschatz, Korth), "Fundamentals of Database Systems" (Elmasri & Navathe).
5.  **AI & ML:** "Artificial Intelligence: A Modern Approach" (Russell & Norvig), "Deep Learning" (Ian Goodfellow), "Pattern Recognition" (Bishop).
6.  **Compilers:** "Compilers: Principles, Techniques, and Tools" (Dragon Book - Aho, Lam, Sethi, Ullman).
7.  **Computer Architecture:** "Computer Architecture: A Quantitative Approach" (Hennessy & Patterson).
8.  **Digital Logic:** "Digital Design" (Morris Mano).
9.  **Electronic Circuits:** "Microelectronic Circuits" (Sedra & Smith), "Electronic Devices" (Boylestad).
10. **Signals & Systems:** "Signals and Systems" (Oppenheim & Willsky).
11. **Electromagnetics:** "Elements of Electromagnetics" (Sadiku), "Engineering Electromagnetics" (Hayt).
12. **Control Systems:** "Modern Control Engineering" (Ogata), "Control Systems Engineering" (Nise).
13. **Electrical Machines:** "Electric Machinery Fundamentals" (Chapman).
14. **Power Systems:** "Power System Analysis" (Grainger & Stevenson).
15. **Physics:** "Fundamentals of Physics" (Halliday, Resnick, Walker).
16. **Mechanical:** "Thermodynamics" (Cengel & Boles), "Fluid Mechanics" (White).
`;

// Common Sem 1 & 2 for Circuit Branches (CSE, ECE, EEE, AIDS, Cyber)
const commonSem1: SemesterInfo = {
    year: 1,
    title: 'Semester 1',
    focus: 'Math + Science Fundamentals with Python',
    subjects: [
        'MA3151 - Matrices and Calculus',
        'PH3151 - Engineering Physics',
        'CY3151 - Engineering Chemistry',
        'GE3151 - Problem Solving using Python',
        'GE3171 - Problem Solving Lab',
        'BS3171 - Physics & Chemistry Lab',
        'GE3172 - English Lab'
    ]
};

const commonSem2: SemesterInfo = {
    year: 1,
    title: 'Semester 2',
    focus: 'Statistics, C Programming, Graphics, Circuits',
    subjects: [
        'MA3251 - Statistics and Numerical Methods',
        'PH3256 - Physics for Information Science',
        'BE3251 - Basic Electrical & Electronics',
        'GE3251 - Engineering Graphics',
        'CS3251 - Programming in C',
        'GE3271 - Engineering Practices Lab',
        'CS3271 - Programming in C Lab'
    ]
};

export const departmentCatalog: Record<string, Record<string, SemesterInfo>> = {
    CSE: {
        '1': commonSem1,
        '2': commonSem2,
        '3': {
            year: 2,
            title: 'Semester 3',
            focus: 'Discrete Math, DSA, OOP, Computer Org',
            subjects: [
                'MA3354 - Discrete Mathematics',
                'CS3351 - Digital Principles & Computer Org',
                'CS3352 - Foundations of Data Science',
                'CD3291 - Data Structures and Algorithms',
                'CS3391 - Object Oriented Programming'
            ]
        },
        '4': {
            year: 2,
            title: 'Semester 4',
            focus: 'Core CS Theory + DB/OS/AI',
            subjects: [
                'CS3452 - Theory of Computation',
                'CS3491 - Artificial Intelligence',
                'CS3492 - Database Management Systems',
                'CS3401 - Algorithms',
                'CS3451 - Introduction to Operating Systems'
            ]
        },
        '5': {
            year: 3,
            title: 'Semester 5',
            focus: 'Networks, Compiler, Security',
            subjects: [
                'CS3591 - Computer Networks',
                'CS3501 - Compiler Design',
                'CB3491 - Cryptography and Network Security',
                'CS3551 - Distributed Systems'
            ]
        },
        '6': {
            year: 3,
            title: 'Semester 6',
            focus: 'Software Engg, ML, Mobile Comp',
            subjects: [
                'CCS356 - Object Oriented Software Engineering',
                'CCS354 - Machine Learning',
                'CS3691 - Embedded Systems and IoT'
            ]
        },
        '7': { year: 4, title: 'Semester 7', focus: 'Cloud, Ethics, Project Phase I', subjects: ['CCS335 - Cloud Computing', 'GE3791 - Human Values and Ethics', 'CCS3711 - Project Work Phase I'] },
        '8': { year: 4, title: 'Semester 8', focus: 'Project Phase II', subjects: ['CCS3811 - Project Work Phase II'] }
    },
    
    ECE: {
        '1': commonSem1,
        '2': { ...commonSem2, subjects: [ ...commonSem2.subjects, 'EC3251 - Circuit Analysis'] }, // ECE Specific
        '3': {
            year: 2,
            title: 'Semester 3',
            focus: 'Signals, Digital Electronics, Analog Circuits',
            subjects: [
                'MA3355 - Random Processes and Linear Algebra',
                'EC3354 - Signals and Systems',
                'EC3353 - Electronic Circuits I',
                'EC3351 - Digital Electronics',
                'EC3352 - Electromagnetic Fields'
            ]
        },
        '4': {
            year: 2,
            title: 'Semester 4',
            focus: 'Communication, Linear Circuits, Control',
            subjects: [
                'EC3452 - Linear Integrated Circuits',
                'EC3451 - Linear Integrated Circuits', 
                'EC3491 - Communication Systems',
                'EC3401 - Networks and Security',
                'GE3451 - Environmental Sciences'
            ]
        },
        '5': {
            year: 3,
            title: 'Semester 5',
            focus: 'DSP, VLSI, Antenna',
            subjects: [
                'EC3501 - Wireless Communication',
                'EC3552 - VLSI and Chip Design',
                'EC3551 - Transmission Lines and RF Systems',
                'EC3591 - Medical Electronics'
            ]
        },
        '6': {
            year: 3,
            title: 'Semester 6',
            focus: 'Embedded, Wireless',
            subjects: [
                'ET3491 - Embedded Systems',
                'CS3491 - Artificial Intelligence', // Often elective
                'EC3601 - Wireless Networks'
            ]
        },
        '7': { year: 4, title: 'Semester 7', focus: 'Optical Comm, Microwave', subjects: ['EC3701 - Optical Communication', 'EC3751 - Microwave Theory'] },
        '8': { year: 4, title: 'Semester 8', focus: 'Project', subjects: ['EC3811 - Project Work'] }
    },

    EEE: {
        '1': commonSem1,
        '2': { ...commonSem2, subjects: ['EE3251 - Electric Circuit Analysis', ...commonSem2.subjects.slice(1)] },
        '3': {
            year: 2,
            title: 'Semester 3',
            focus: 'Fields, Machines, Digital Logic',
            subjects: [
                'MA3303 - Probability and Complex Functions',
                'EE3301 - Electromagnetic Fields',
                'EE3302 - Digital Logic Circuits',
                'EE3303 - Electrical Machines I',
                'EC3301 - Electron Devices and Circuits'
            ]
        },
        '4': {
            year: 2,
            title: 'Semester 4',
            focus: 'Transmission, Machines II, Measurements',
            subjects: [
                'EE3401 - Transmission and Distribution',
                'EE3402 - Linear Integrated Circuits',
                'EE3403 - Measurements and Instrumentation',
                'EE3404 - Microprocessor and Microcontroller',
                'EE3405 - Electrical Machines II'
            ]
        },
        '5': {
            year: 3,
            title: 'Semester 5',
            focus: 'Power Systems, Control, Electronics',
            subjects: [
                'EE3501 - Power System Analysis',
                'EE3503 - Control Systems',
                'EE3591 - Power Electronics',
                'EE3502 - Digital Signal Processing'
            ]
        },
        '6': {
            year: 3,
            title: 'Semester 6',
            focus: 'Drives, Protection',
            subjects: [
                'EE3601 - Protection and Switchgear',
                'EE3602 - Power System Operation and Control',
                'EE3603 - Solid State Drives'
            ]
        },
        '7': { year: 4, title: 'Semester 7', focus: 'High Voltage, Ethics', subjects: ['EE3701 - High Voltage Engineering', 'GE3791 - Human Values'] },
        '8': { year: 4, title: 'Semester 8', focus: 'Project', subjects: ['EE3811 - Project Work'] }
    },

    AIDS: {
        '1': commonSem1,
        '2': commonSem2,
        '3': {
            year: 2,
            title: 'Semester 3',
            focus: 'AI Fundamentals, Data Structures',
            subjects: [
                'MA3391 - Probability and Statistics',
                'AD3391 - Data Structures and Design',
                'AD3351 - Design and Analysis of Algorithms',
                'AD3301 - Data Exploration and Visualization'
            ]
        },
        '4': {
            year: 2,
            title: 'Semester 4',
            focus: 'Machine Learning, Database',
            subjects: [
                'AD3491 - Fundamentals of Data Science and Analytics',
                'CS3492 - Database Management Systems',
                'AD3451 - Machine Learning',
                'AL3451 - Artificial Intelligence'
            ]
        },
        '5': {
            year: 3,
            title: 'Semester 5',
            focus: 'Deep Learning, Web',
            subjects: [
                'AD3501 - Deep Learning',
                'CW3551 - Data and Information Security',
                'CS3591 - Computer Networks'
            ]
        },
        '6': { year: 3, title: 'Semester 6', focus: 'NLP, Vision', subjects: ['CCS355 - Neural Networks and Deep Learning', 'AD3601 - Natural Language Processing'] },
        '7': { year: 4, title: 'Semester 7', focus: 'Reinforcement Learning', subjects: ['AD3701 - Reinforcement Learning'] },
        '8': { year: 4, title: 'Semester 8', focus: 'Project', subjects: ['AD3811 - Project Work'] }
    },

    CYBER: {
        '1': commonSem1,
        '2': commonSem2,
        '3': {
            year: 2,
            title: 'Semester 3',
            focus: 'Security Principles, Networking',
            subjects: [
                'CB3301 - Digital Systems and Computer Org',
                'CB3302 - Data Structures and Algorithms',
                'MA3354 - Discrete Mathematics',
                'CS3391 - Object Oriented Programming'
            ]
        },
        '4': {
            year: 2,
            title: 'Semester 4',
            focus: 'Cryptography, OS',
            subjects: [
                'CB3401 - Database Management Systems and Security',
                'CB3402 - Operating Systems and Security',
                'CB3491 - Cryptography and Network Security'
            ]
        },
        '5': { year: 3, title: 'Semester 5', focus: 'Cyber Forensics', subjects: ['CB3501 - Cyber Forensics', 'CS3591 - Computer Networks'] },
        '6': { year: 3, title: 'Semester 6', focus: 'Ethical Hacking', subjects: ['CB3601 - Ethical Hacking', 'CB3602 - Network Security'] },
        '7': { year: 4, title: 'Semester 7', focus: 'Cloud Security', subjects: ['CB3701 - Cloud Security'] },
        '8': { year: 4, title: 'Semester 8', focus: 'Project', subjects: ['CB3811 - Project Work'] }
    }
};

// Flattened subject DB for easy lookup
export const subjectDatabase: Record<string, SubjectNote> = {
    // --- CSE / COMMON ---
    'ge3151': {
        title: 'GE3151 - Problem Solving using Python',
        bullets: [
            'Algorithmic Problem Solving: Flowcharts, Pseudocode',
            'Data types, Operators, Expressions',
            'Control Flow: if, else, while, for',
            'Functions, Recursion, Strings',
            'Lists, Tuples, Dictionaries, Files, Exception Handling'
        ],
        links: [{ label: 'Python Docs', url: 'https://docs.python.org/3/' }]
    },
    'ph3151': {
        title: 'PH3151 - Engineering Physics',
        bullets: ['Ultrasonics', 'Laser Systems', 'Fiber Optics', 'Quantum Physics', 'Crystal Physics'],
        links: [{ label: 'HyperPhysics', url: 'http://hyperphysics.phy-astr.gsu.edu/hbase/hframe.html' }]
    },
    'cs3491': {
        title: 'CS3491 - Artificial Intelligence',
        bullets: ['Agents', 'Search Algorithms (A*)', 'Minimax', 'Logical Agents', 'Knowledge Representation'],
        links: [{ label: 'Stanford AI', url: 'https://stanford.edu/~shervine/teaching/cs-221/' }]
    },
    'cs3401': {
        title: 'CS3401 - Algorithms',
        bullets: ['Analysis', 'Divide & Conquer', 'Dynamic Programming', 'Greedy', 'Backtracking'],
        links: [{ label: 'VisuAlgo', url: 'https://visualgo.net/en' }]
    },
    'cs3451': {
        title: 'CS3451 - Introduction to Operating Systems',
        bullets: [
            'Process Management: Scheduling Algorithms (FCFS, SJF, RR)',
            'Threads & Concurrency: Deadlocks, Semaphores, Mutex',
            'Memory Management: Paging, Segmentation, Virtual Memory',
            'File Systems: Inodes, FAT, NTFS',
            'I/O Systems & Disk Scheduling (SCAN, C-SCAN)'
        ],
        links: [{ label: 'OS Three Easy Pieces', url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/' }]
    },
    'cs3591': {
        title: 'CS3591 - Computer Networks',
        bullets: [
            'OSI & TCP/IP Models',
            'Data Link Layer: Framing, Error Correction (CRC), Switching',
            'Network Layer: IP Addressing (IPv4/IPv6), Routing (OSPF, BGP)',
            'Transport Layer: TCP (Flow/Congestion Control) vs UDP',
            'Application Layer: HTTP, DNS, SMTP'
        ],
        links: [{ label: 'Kurose & Ross Slides', url: 'https://gaia.cs.umass.edu/kurose_ross/online_lectures.htm' }]
    },
    'cs3492': {
        title: 'CS3492 - Database Management Systems',
        bullets: [
            'ER Modeling & Relational Model',
            'SQL: DDL, DML, Joins, Aggregate Functions',
            'Normalization: 1NF, 2NF, 3NF, BCNF',
            'Transaction Management: ACID Properties',
            'Concurrency Control: Locking, Timestamp ordering'
        ],
        links: [{ label: 'MySQL Tutorial', url: 'https://dev.mysql.com/doc/refman/8.0/en/tutorial.html' }]
    },
    'cs3501': {
        title: 'CS3501 - Compiler Design',
        bullets: [
            'Lexical Analysis (Finite Automata)',
            'Syntax Analysis (Parsers: LL, LR, SLR, LALR)',
            'Semantic Analysis & Type Checking',
            'Intermediate Code Generation (Three Address Code)',
            'Code Optimization & Generation'
        ],
        links: [{ label: 'Dragon Book Resources', url: 'https://suif.stanford.edu/dragonbook/' }]
    },
    'ec3354': {
        title: 'EC3354 - Signals and Systems',
        bullets: [
            'Classification of Signals (CT/DT)',
            'Fourier Series & Fourier Transform',
            'Laplace Transform & ROC',
            'Z-Transform analysis of LTI systems',
            'Convolution Integral & Sum'
        ],
        links: [{ label: 'Oppenheim PDF', url: 'https://www.google.com/search?q=oppenheim+signals+and+systems' }]
    },
    'ec3351': {
        title: 'EC3351 - Digital Electronics',
        bullets: [
            'Number Systems & Boolean Algebra',
            'Combinational Circuits (Adders, Mux)',
            'Sequential Circuits (Flip Flops, Counters)',
            'Synchronous & Asynchronous Design',
            'Memory & Programmable Logic'
        ],
        links: [{ label: 'Falstad Circuit Sim', url: 'https://www.falstad.com/circuit/' }]
    },
    'ec3452': {
        title: 'EC3452 - Linear Integrated Circuits',
        bullets: [
            'Op-Amp Characteristics & Applications',
            'Active Filters & Oscillators',
            '555 Timer & PLL',
            'A/D and D/A Converters',
            'Voltage Regulators'
        ],
        links: [{ label: 'TI OpAmps', url: 'https://www.ti.com/amplifier-circuit/op-amps/overview.html' }]
    },
    'ee3301': {
        title: 'EE3301 - Electromagnetic Fields',
        bullets: [
            'Vector Calculus & Coordinate Systems',
            'Electrostatics (Gauss Law, Potential)',
            'Magnetostatics (Biot-Savart, Ampere)',
            'Electrodynamic Fields (Maxwell Eqns)',
            'Electromagnetic Waves'
        ],
        links: [{ label: 'Maxwell Eqns Guide', url: 'http://hyperphysics.phy-astr.gsu.edu/hbase/electric/maxeq.html' }]
    },
    'ee3303': {
        title: 'EE3303 - Electrical Machines I',
        bullets: [
            'Magnetic Circuits & Transformers',
            'Electromechanical Energy Conversion',
            'DC Generators (Construction, EMF)',
            'DC Motors (Torque, Speed Control)',
            'Testing of DC Machines'
        ],
        links: [{ label: 'Machines Visuals', url: 'https://www.electrical4u.com/electrical-machines/' }]
    },
    'ee3401': {
        title: 'EE3401 - Transmission and Distribution',
        bullets: [
            'Transmission Line Parameters (R, L, C)',
            'Performance of Lines (Short, Med, Long)',
            'Insulators & Cables',
            'Sag & Tension Calculations',
            'Substations & Distribution Systems'
        ],
        links: [{ label: 'Power Systems', url: 'https://circuitglobe.com/power-system.html' }]
    },
    'ee3591': {
        title: 'EE3591 - Power Electronics',
        bullets: [
            'Power Semi-Conductors (SCR, MOSFET, IGBT)',
            'Phase Controlled Converters (Rectifiers)',
            'DC-DC Choppers (Buck, Boost)',
            'Inverters (VSI, CSI, PWM)',
            'AC Voltage Controllers'
        ],
        links: [{ label: 'Power Elec Sim', url: 'https://www.plexim.com/plecs' }]
    },
    'ad3451': {
        title: 'AD3451 - Machine Learning',
        bullets: [
            'Supervised Learning (Regression, Classification)',
            'Decision Trees & Random Forests',
            'Unsupervised (Clustering, PCA)',
            'Neural Networks & Backpropagation',
            'Model Evaluation Metrics'
        ],
        links: [{ label: 'Scikit-Learn', url: 'https://scikit-learn.org/' }]
    },
    'cb3491': {
        title: 'CB3491 - Cryptography and Network Security',
        bullets: [
            'Symmetric Ciphers (AES, DES)',
            'Public Key Crypto (RSA, ECC)',
            'Hash Functions (SHA) & MAC',
            'Key Distribution & Auth',
            'Web Security (SSL/TLS)'
        ],
        links: [{ label: 'Crypto 101', url: 'https://www.crypto101.io/' }]
    }
};

export const techGlossary: Record<string, string> = {
    'api': 'API (Application Programming Interface) allows different software to talk to each other.',
    'http': 'HyperText Transfer Protocol: The foundation of data communication for the World Wide Web.',
    'https': 'Secure version of HTTP, encrypted using SSL/TLS.',
    'rest': 'REST (Representational State Transfer) is an architectural style for web services.',
    'json': 'JSON (JavaScript Object Notation) is a lightweight data interchange format.',
    'sql': 'Structured Query Language: Used for managing data held in a relational database.',
    'nosql': 'NoSQL databases are non-tabular and store data differently (e.g., MongoDB documents).',
    'docker': 'A platform to develop, ship, and run applications inside containers.',
    'kubernetes': 'An open-source system for automating deployment, scaling, and management of containerized applications.',
    'ai': 'Artificial Intelligence: Machines designed to mimic human cognitive functions.',
    'ml': 'Machine Learning: Systems that learn from data to improve performance without explicit programming.',
    'dl': 'Deep Learning: A subset of ML based on artificial neural networks.',
    'iot': 'Internet of Things: Physical objects with sensors, processing ability, software, and other technologies.',
    'arduino': 'Open-source electronic prototyping platform enabling users to create interactive electronic objects.',
    'transformer': 'Electrical device that transfers electrical energy between two or more circuits through electromagnetic induction.',
    'motor': 'Electrical machine that converts electrical energy into mechanical energy.',
    'generator': 'Electrical machine that converts mechanical energy into electrical energy.',
    'opamp': 'Operational Amplifier: High-gain electronic voltage amplifier with a differential input and a single-ended output.',
    'microcontroller': 'Small computer on a single metal-oxide-semiconductor (MOS) integrated circuit chip.',
    'vlsi': 'Very Large Scale Integration: Process of creating an integrated circuit (IC) by combining millions of MOS transistors onto a single chip.',
    'scada': 'Supervisory Control and Data Acquisition: Control system architecture comprising computers, networked data communications and GUIs.',
    'cybersecurity': 'Practice of protecting systems, networks, and programs from digital attacks.',
    'firewall': 'Network security system that monitors and controls incoming and outgoing network traffic based on predetermined security rules.'
};

export const openResourceHub = {
    datasets: [
        { label: 'Kaggle Datasets', url: 'https://www.kaggle.com/datasets' },
        { label: 'UCI ML Repository', url: 'https://archive.ics.uci.edu' }
    ],
    academics: [
        { label: 'MIT OCW', url: 'https://ocw.mit.edu' },
        { label: 'NPTEL', url: 'https://nptel.ac.in' },
        { label: 'GeeksForGeeks', url: 'https://www.geeksforgeeks.org/' }
    ]
};

// Existing Chat Regex Helper
export const interviewQA = [
    {
        keywords: ['tell me about yourself', 'intro', 'introduction'],
        answer: '💡 **Interview Tip:** Start with your name, year, and department. Mention key technical skills (e.g., Python, Web Dev). Talk about a major project. End with your career goal.'
    },
    {
        keywords: ['strength', 'weakness'],
        answer: '💡 **Interview Tip:**\n**Strengths:** Quick learner, Adaptable, Team player.\n**Weaknesses:** Perfectionism (working on deadlines), Detail-oriented (sometimes too much).'
    },
    {
        keywords: ['why hire you', 'why should we hire'],
        answer: '💡 **Interview Tip:** Connect your skills to the job description. Highlight your academic consistency, project experience, and willingness to learn.'
    },
    {
        keywords: ['project', 'explain project'],
        answer: '💡 **Interview Tip:** Use the **STAR** method:\n**S**ituation: What was the problem?\n**T**ask: What was your role?\n**A**ction: What tech stack did you use?\n**R**esult: What was the outcome/efficiency?'
    }
];

// Rich Data for UI Module
export const interviewModules = {
    hr: {
        title: "HR & Behavioral",
        icon: "Users",
        items: [
            { q: "Tell me about yourself.", a: "Formula: **Present** (Current role/student status) + **Past** (Experience/Projects) + **Future** (Why this role?).\n\n*Keep it under 2 minutes.*" },
            { q: "What is your greatest weakness?", a: "Choose a real weakness but one that isn't fatal to the job. Explain how you are working to improve it.\n\n*Example: 'I sometimes focus too much on details, so I've started using time-boxing to ensure I meet deadlines.'*" },
            { q: "Why should we hire you?", a: "Connect your skills directly to the job description. Mention your unique value proposition.\n\n*Example: 'I not only know Python, but I've built deployed apps with it, so I can hit the ground running.'*" },
            { q: "Where do you see yourself in 5 years?", a: "Focus on growth and adding value.\n\n*Example: 'I hope to have mastered the stack you use here and eventually take on leadership responsibilities within the engineering team.'*" }
        ]
    },
    dsa: {
        title: "Data Structures & Algo",
        icon: "Code",
        items: [
            { q: "Explain Time Complexity (Big O).", a: "It measures how the runtime of an algorithm grows as input size grows.\n\n• **O(1):** Constant (Hash Map Access)\n• **O(log n):** Logarithmic (Binary Search)\n• **O(n):** Linear (Loop)\n• **O(n log n):** Linearithmic (Merge Sort)\n• **O(n²):** Quadratic (Bubble Sort)" },
            { q: "Array vs Linked List?", a: "• **Array:** Fixed size, O(1) access, O(n) insertion/deletion (shifting needed).\n• **Linked List:** Dynamic size, O(n) access, O(1) insertion/deletion (if pointer known)." },
            { q: "What is a Hash Map?", a: "A key-value store that uses a hash function to compute an index. Average **O(1)** for search, insert, delete. Handles collisions via **Chaining** (Linked List) or **Open Addressing**." },
            { q: "Stack vs Queue", a: "• **Stack:** LIFO (Last In First Out). Used in recursion, undo mechanisms.\n• **Queue:** FIFO (First In First Out). Used in task scheduling, BFS." }
        ]
    },
    core: {
        title: "CS Fundamentals (OS/DBMS)",
        icon: "Database",
        items: [
            { q: "Process vs Thread", a: "• **Process:** Independent program in execution, separate memory space. Heavyweight.\n• **Thread:** Lightweight unit within a process, shares memory/resources. Context switching threads is faster." },
            { q: "ACID properties in DBMS", a: "• **Atomicity:** All or nothing.\n• **Consistency:** Database remains in valid state.\n• **Isolation:** Transactions don't interfere.\n• **Durability:** Data is saved permanently." },
            { q: "What is Normalization?", a: "Organizing data to reduce redundancy.\n• **1NF:** Atomic values.\n• **2NF:** No partial dependency.\n• **3NF:** No transitive dependency." },
            { q: "OSI Model Layers", a: "Physical, Data Link, Network (IP), Transport (TCP/UDP), Session, Presentation, Application (HTTP)." }
        ]
    },
    oops: {
        title: "OOP Concepts",
        icon: "Box",
        items: [
            { q: "Four Pillars of OOP", a: "1. **Encapsulation:** Bundling data & methods (Classes).\n2. **Abstraction:** Hiding complexity (Interfaces/Abstract Classes).\n3. **Inheritance:** Parent-Child relationship (Reusability).\n4. **Polymorphism:** Many forms (Overloading/Overriding)." },
            { q: "Overloading vs Overriding", a: "• **Overloading:** Same method name, different parameters (Compile-time).\n• **Overriding:** Same method signature in child class (Runtime)." },
            { q: "Interface vs Abstract Class", a: "• **Interface:** 100% abstract (before Java 8), multiple implementation supported.\n• **Abstract Class:** Can have concrete methods, single inheritance only." }
        ]
    }
};
