/* ==========================================================================
   EDUGENIE CLIENT SPA APPLICATION SCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // ==========================================================================
    // CLIENT-SIDE MOCK DATABASE & API INTERCEPTOR FOR STATIC HOSTING (GITHUB PAGES)
    // ==========================================================================
    const CONCEPTS_DB = {
        "photosynthesis": {
            "beginner": {
                "explanation": "Photosynthesis is how green plants make their own food! Plants use their leaves to catch light from the Sun, and they breathe in carbon dioxide from the air. Together with water from the ground, they cook up a sweet sugar called glucose to eat, and breathe out fresh oxygen for us to breathe.",
                "analogy": "Imagine a plant leaf is a tiny solar-powered kitchen, cooking up tasty sugar cookies using sunshine as the oven heat!",
                "key_terms": [
                    { "term": "Chlorophyll", "definition": "The special green paint inside plant leaves that catches sunlight." },
                    { "term": "Glucose", "definition": "A simple sweet sugar that plants eat for energy." }
                ]
            },
            "intermediate": {
                "explanation": "Photosynthesis is the biochemical process by which plants, algae, and some bacteria convert light energy into chemical energy. Using solar radiation, these organisms convert carbon dioxide and water into glucose (a primary energy source) and oxygen (released as a byproduct). The process occurs in two main phases: the Light-Dependent Reactions (which capture light to form ATP and NADPH) and the Calvin Cycle (which uses that energy to build sugars).",
                "analogy": "Think of a plant leaf as a solar panel linked to an automated chemical manufacturing plant that turns raw air and water into fuel cells.",
                "key_terms": [
                    { "term": "Calvin Cycle", "definition": "A set of chemical reactions that take place in chloroplasts during light-independent phase." },
                    { "term": "Chloroplast", "definition": "The organelle in plant cells where photosynthesis takes place." }
                ]
            },
            "advanced": {
                "explanation": "Photosynthesis is an complex endergonic pathway consisting of photophosphorylation and carbon assimilation. Electron transport occurs across the thylakoid membrane, driven by Photosystem II (absorption peak 680nm) and Photosystem I (absorption peak 700nm). Water photolysis at the oxygen-evolving complex yields protons and oxygen. The resulting proton gradient drives ATP synthesis via chemiosmosis. In the stroma, Ribulose-1,5-bisphosphate carboxylase-oxygenase (RuBisCO) catalyzes the fixation of carbon dioxide in the C3, C4, or CAM pathways.",
                "analogy": "It functions like an atomic-level semiconductor circuit that uses photonic excitation to pump protons, powering a molecular rotor (ATP synthase) to synthesize organic compounds.",
                "key_terms": [
                    { "term": "Photolysis", "definition": "The chemical decomposition of water molecules induced by light energy during the light reactions." },
                    { "term": "RuBisCO", "definition": "Ribulose-1,5-bisphosphate carboxylase-oxygenase, the enzyme responsible for carbon fixation." }
                ]
            }
        },
        "quantum computing": {
            "beginner": {
                "explanation": "Normal computers use tiny switches called bits that are either ON (1) or OFF (0) to do work. Quantum computers are super computers that use quantum bits, or qubits! Qubits are special because they can be ON, OFF, or BOTH at the same time. This lets them solve extremely hard puzzles super fast!",
                "analogy": "A regular computer bit is like a coin sitting flat on a table (either Heads or Tails). A qubit is like a coin spinning on the table (it's both Heads and Tails at the same time until you stop it).",
                "key_terms": [
                    { "term": "Qubit", "definition": "A quantum bit that can represent multiple states simultaneously." },
                    { "term": "Superposition", "definition": "The ability of a qubit to exist in multiple states at the same time." }
                ]
            },
            "intermediate": {
                "explanation": "Quantum computing is a rapidly-emerging technology that harnesses the laws of quantum mechanics to solve problems too complex for classical computers. Unlike classical bits that represent either 0 or 1, qubits utilize principles of superposition and entanglement. Superposition allows qubits to exist in a linear combination of states. Entanglement links the state of one qubit to another, enabling exponential scaling of processing power to perform simultaneous calculations.",
                "analogy": "If a classical computer navigates a maze by trying every single path one after the other, a quantum computer navigates by traveling down all possible paths simultaneously.",
                "key_terms": [
                    { "term": "Entanglement", "definition": "A quantum phenomenon where particles link up, such that the state of one instantly affects another." },
                    { "term": "Quantum Gates", "definition": "Basic quantum circuits operating on qubits, analogous to classical logic gates." }
                ]
            },
            "advanced": {
                "explanation": "Quantum computing utilizes the quantum mechanical phenomena of superposition, entanglement, and interference to execute algorithms. Qubits are physical systems (e.g., superconducting Josephson junctions, trapped ions) modeled as vectors in a complex Hilbert space. Computational operations are represented by unitary matrices acting on these vectors. Algorithms like Shor's (for integer factorization) and Grover's (for unstructured database search) exploit quantum parallelism and constructive wave interference to achieve polynomial or exponential speedups over classical equivalents.",
                "analogy": "It is like using a complex array of overlapping waves in a harbor, tuning them so they perfectly cancel out wrong paths and peak at the correct escape route.",
                "key_terms": [
                    { "term": "Hilbert Space", "definition": "A state space that extends the vector space to infinite dimensions, supporting quantum states." },
                    { "term": "Decoherence", "definition": "The loss of quantum behavior caused by interaction/noise from the external environment." }
                ]
            }
        },
        "black holes": {
            "beginner": {
                "explanation": "A black hole is a spot in space where gravity pulls so incredibly strong that absolutely nothing can escape from it, not even light! They are born when giant stars run out of fuel and collapse in on themselves, squeezing all their heavy weight into a tiny dot.",
                "analogy": "Think of a black hole like a giant, invisible vacuum cleaner in space that never gets full and pulls in everything that gets too close.",
                "key_terms": [
                    { "term": "Event Horizon", "definition": "The boundary line around a black hole. Once you cross this line, you can never get back out." },
                    { "term": "Gravity", "definition": "The invisible pulling force that keeps our feet on the ground and pulls stars together." }
                ]
            },
            "intermediate": {
                "explanation": "A black hole is a region of spacetime where gravity is so strong that nothing, including electromagnetic radiation such as light, has enough energy to escape its gravitational pull. According to Einstein's General Theory of Relativity, a sufficiently compact mass can deform spacetime to form a black hole. Surrounding it is a boundary called the event horizon, which represents the point of no return. Beyond this lies the singularity, where mass is compressed to infinite density.",
                "analogy": "Imagine a bowling ball placed on a trampoline, creating a deep funnel. If you roll a marble too close to the funnel, it falls in and cannot roll back out.",
                "key_terms": [
                    { "term": "Singularity", "definition": "The center of a black hole where all matter is crushed into an infinitely small space." },
                    { "term": "Hawking Radiation", "definition": "Theoretical thermal radiation released by black holes due to quantum effects near the event horizon." }
                ]
            },
            "advanced": {
                "explanation": "Black holes are gravitational singularities characterized by a metric (e.g., Schwarzschild for non-rotating, Kerr for rotating black holes) solving Einstein's field equations in vacuum. The boundary of the black hole is the event horizon, a null hypersurface acting as a one-way causal membrane. Thermodynamically, black holes possess entropy proportional to their surface area, as described by the Bekenstein-Hawking formula. Research continues into the Information Paradox, examining whether quantum information entering a black hole is permanently lost during Hawking evaporation.",
                "analogy": "It operates like a topological defect in spacetime where the light cones tip completely inward, turning all future trajectories toward the singularity.",
                "key_terms": [
                    { "term": "Kerr Metric", "definition": "An exact solution to Einstein's field equations describing spacetime geometry around a rotating black hole." },
                    { "term": "Information Paradox", "definition": "The theoretical conflict between quantum mechanics (information conservation) and black hole evaporation." }
                ]
            }
        }
    };

    const QA_DB = {
        "why is the sky blue?": "The sky is blue because of a phenomenon called Rayleigh scattering. Sunlight reaches Earth's atmosphere and is scattered in all directions by all the gases and particles in the air. Sunlight is made up of all the colors of the rainbow, but blue light travels as smaller, shorter waves than other colors. This causes blue light to be scattered more than the other colors, making us see a blue sky.",
        "how do cells convert energy?": "Cells convert energy through cellular respiration. This occurs inside the mitochondria, often called the powerhouses of the cell. Cells take glucose (from food) and oxygen, and through a series of chemical reactions (Glycolysis, the Krebs Cycle, and the Electron Transport Chain), they convert it into ATP (Adenosine Triphosphate), which is the chemical energy currency that cells use to fuel their activities.",
        "what is euler's constant?": "Euler's constant (often written as 'e') is an irrational mathematical constant approximately equal to 2.71828. It is the unique base of natural logarithms. It represents the limit of (1 + 1/n)^n as n approaches infinity, which is the mathematical foundation for continuous compounding interest, population growth rates, and wave descriptions."
    };

    const QUIZ_DB = {
        "newtonian mechanics": [
            {
                "question_text": "Which of Newton's Laws states that 'for every action, there is an equal and opposite reaction'?",
                "options": ["First Law", "Second Law", "Third Law", "Law of Gravitation"],
                "correct_index": 2,
                "explanation": "Newton's Third Law states that forces always occur in equal and opposite pairs. If Object A exerts a force on Object B, Object B exerts an equal force in the opposite direction on Object A."
            },
            {
                "question_text": "What physical quantity is defined as the product of an object's mass and its velocity?",
                "options": ["Acceleration", "Momentum", "Kinetic Energy", "Force"],
                "correct_index": 1,
                "explanation": "Momentum (p) is defined as mass multiplied by velocity (p = mv). It is a vector quantity representing the quantity of motion."
            },
            {
                "question_text": "What is the net force acting on an object traveling at a constant velocity?",
                "options": ["Zero", "Equal to mass times acceleration", "Continuously increasing", "Independent of velocity"],
                "correct_index": 0,
                "explanation": "According to Newton's First Law (Inertia), if velocity is constant, acceleration is zero. Since F = ma, the net force must be zero."
            }
        ],
        "world war ii": [
            {
                "question_text": "In which year did World War II officially begin?",
                "options": ["1914", "1939", "1941", "1945"],
                "correct_index": 1,
                "explanation": "World War II began on September 1, 1939, when Germany invaded Poland, leading France and Great Britain to declare war."
            },
            {
                "question_text": "What was the codename for the Allied invasion of Normandy on D-Day?",
                "options": ["Operation Barbarossa", "Operation Torch", "Operation Overlord", "Operation Sea Lion"],
                "correct_index": 2,
                "explanation": "Operation Overlord was the official codename for the Battle of Normandy, launched on June 6, 1944 (D-Day)."
            },
            {
                "question_text": "Which event prompted the United States to officially enter World War II?",
                "options": ["The invasion of Poland", "The Battle of Britain", "The bombing of Pearl Harbor", "The signing of the Tripartite Pact"],
                "correct_index": 2,
                "explanation": "The Japanese surprise attack on Pearl Harbor on December 7, 1941, led the US Congress to declare war the following day."
            }
        ],
        "cell division": [
            {
                "question_text": "What is the process of cell division that results in four genetically diverse daughter cells?",
                "options": ["Mitosis", "Meiosis", "Binary Fission", "Cytokinesis"],
                "correct_index": 1,
                "explanation": "Meiosis is a specialized type of cell division that reduces the chromosome number by half, producing four genetically unique haploid gamete cells."
            },
            {
                "question_text": "During which phase of mitosis do sister chromatids separate and move to opposite poles of the cell?",
                "options": ["Prophase", "Metaphase", "Anaphase", "Telophase"],
                "correct_index": 2,
                "explanation": "In Anaphase, the sister chromatids are pulled apart by spindle fibers and move toward opposite ends of the dividing cell."
            },
            {
                "question_text": "What is the name of the resting phase where cells prepare for division by copying their DNA?",
                "options": ["Interphase", "Prophase", "Cytokinesis", "Metaphase"],
                "correct_index": 0,
                "explanation": "Interphase is the longest part of the cell cycle, during which the cell grows, performs metabolic processes, and replicates its DNA (S phase) in preparation for mitosis."
            }
        ]
    };

    const ROADMAPS_DB = {
        "deep learning in python": {
            "goal": "Deep Learning in Python",
            "overview": "Deep learning powers modern AI, from computer vision to large language models. This curriculum takes you from basic Python programming to building neural networks using PyTorch.",
            "roadmap": [
                {
                    "step_number": 1,
                    "title": "Prerequisites & Python Basics",
                    "description": "Master Python syntax, functions, object-oriented concepts, and basic libraries like NumPy and Pandas for data manipulation.",
                    "estimated_duration": "2 weeks",
                    "resources": ["Python Documentation", "Kaggle Python Course", "NumPy Quickstart Guide"]
                },
                {
                    "step_number": 2,
                    "title": "Linear Algebra & Machine Learning Foundations",
                    "description": "Understand matrix multiplication, derivatives, gradient descent, linear regression, and standard evaluations.",
                    "estimated_duration": "2 weeks",
                    "resources": ["3Blue1Brown Linear Algebra Series", "Scikit-Learn Tutorials"]
                },
                {
                    "step_number": 3,
                    "title": "Introduction to PyTorch & Neural Networks",
                    "description": "Learn the building blocks of neural networks: Tensors, autograd, activation functions, and fully-connected layers.",
                    "estimated_duration": "3 weeks",
                    "resources": ["PyTorch Official Tutorial (Learn the Basics)", "Fast.ai Practical Deep Learning"]
                },
                {
                    "step_number": 4,
                    "title": "Convolutional & Recurrent Networks (CNNs & RNNs)",
                    "description": "Dive into spatial data architectures (convolutions, pooling) for image processing and sequential data models (LSTMs, GRUs) for text.",
                    "estimated_duration": "3 weeks",
                    "resources": ["CS231n: CNNs for Visual Recognition", "PyTorch Sequence Modeling Tutorials"]
                }
            ],
            "tips": [
                "Don't just watch videos: type out code and inspect tensor shapes at every layer.",
                "Start with small architectures and tiny datasets to verify training decreases training loss.",
                "Utilize free GPU resources like Google Colab or Kaggle Notebooks to accelerate training."
            ]
        },
        "calculus i": {
            "goal": "Calculus I",
            "overview": "Calculus is the mathematical study of continuous change. This study plan establishes the concepts of limits, derivatives, and introduction to integrals.",
            "roadmap": [
                {
                    "step_number": 1,
                    "title": "Limits & Continuity",
                    "description": "Understand how functions behave as they approach specific points. Master limit laws, one-sided limits, limits at infinity, and continuous functions.",
                    "estimated_duration": "2 weeks",
                    "resources": ["Khan Academy Calculus limits", "Paul's Online Math Notes"]
                },
                {
                    "step_number": 2,
                    "title": "The Derivative & Differentiation Rules",
                    "description": "Define the derivative as a rate of change and tangent line slope. Learn the power, product, quotient, and chain rules.",
                    "estimated_duration": "3 weeks",
                    "resources": ["3Blue1Brown Essence of Calculus", "Mit OpenCourseWare Single Variable Calculus"]
                },
                {
                    "step_number": 3,
                    "title": "Applications of Derivatives",
                    "description": "Apply derivatives to graph functions (maxima/minima, concavity), solve related rates, and perform optimization problems.",
                    "estimated_duration": "3 weeks",
                    "resources": ["Calculus Optimization practice guides", "Paul's Math Notes - Derivative Apps"]
                },
                {
                    "step_number": 4,
                    "title": "Introduction to Integration",
                    "description": "Learn about anti-derivatives, Riemann sums, definite integrals, and the Fundamental Theorem of Calculus.",
                    "estimated_duration": "2 weeks",
                    "resources": ["Khan Academy integration basics", "Professor Leonard Calculus I Playlist"]
                }
            ],
            "tips": [
                "Algebra is 80% of Calculus. Review factoring, trig identities, and fractional exponents.",
                "Draw a picture for every optimization and related rates problem.",
                "Understand the geometric meaning of limits and derivatives before memorizing formulas."
            ]
        }
    };

    // Detect if we should use local client-side mock fallback
    const isLocalServer = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
    const useClientSideMock = !isLocalServer;

    if (useClientSideMock) {
        const originalFetch = window.fetch;
        window.fetch = async function (url, options) {
            if (!url.startsWith("/api/")) {
                return originalFetch(url, options);
            }
            
            const reqBody = options && options.body ? JSON.parse(options.body) : {};
            let resData = {};
            
            if (url === "/api/health") {
                resData = {
                    status: "healthy",
                    gemini_configured: false,
                    lamini_loaded: false,
                    lamini_model_id: "MBZUAI/LaMini-Flan-T5-248M (Client Demo)"
                };
            } else if (url === "/api/explain") {
                const concept = reqBody.concept || "";
                const level = reqBody.level || "intermediate";
                const cleanKey = concept.trim().toLowerCase();
                
                if (CONCEPTS_DB[cleanKey] && CONCEPTS_DB[cleanKey][level]) {
                    const dbData = CONCEPTS_DB[cleanKey][level];
                    resData = {
                        concept: concept,
                        level: level,
                        explanation: dbData.explanation,
                        analogy: dbData.analogy,
                        key_terms: dbData.key_terms,
                        success: false,
                        error: "Gemini API Key missing. Running in Client-Side Demo Mode."
                    };
                } else {
                    resData = {
                        concept: concept,
                        level: level,
                        explanation: `The concept of '${concept}' refers to the structured study and application of this subject. For a ${level} learner, it involves key processes, foundational rules, and operational pathways.`,
                        analogy: `Think of ${concept} like a well-designed blueprint for a house, where every line has a functional purpose.`,
                        key_terms: [
                            { term: `Foundations of ${concept}`, definition: "The essential theories and formulas that form the base of the topic." },
                            { term: "Application Layer", definition: "How this topic is used in real-world scenarios and industries." }
                        ],
                        success: false,
                        error: "Gemini API Key missing. Running in Client-Side Demo Mode."
                    };
                }
            } else if (url === "/api/qa") {
                const question = reqBody.question || "";
                const cleanKey = question.trim().toLowerCase();
                let matchedAns = "";
                
                for (const dbQ in QA_DB) {
                    if (cleanKey.includes(dbQ) || dbQ.includes(cleanKey)) {
                        matchedAns = QA_DB[dbQ];
                        break;
                    }
                }
                
                if (matchedAns) {
                    resData = {
                        answer: matchedAns,
                        model_used: "Gemini 1.5 Pro (Client Mock)",
                        success: false,
                        error: "Gemini API Key missing. Running in Client-Side Demo Mode."
                    };
                } else {
                    resData = {
                        answer: `Thank you for asking about '${question}'. In education, this topic relates to core principles of scientific and logical inquiry. Generally, these elements follow standard rules.`,
                        model_used: "Gemini 1.5 Pro (Client Mock)",
                        success: false,
                        error: "Gemini API Key missing. Running in Client-Side Demo Mode."
                    };
                }
            } else if (url === "/api/quiz") {
                const topic = reqBody.topic || "";
                const numQuestions = reqBody.num_questions || 3;
                const cleanKey = topic.trim().toLowerCase();
                let matchedQs = null;
                
                for (const dbT in QUIZ_DB) {
                    if (cleanKey.includes(dbT) || dbT.includes(cleanKey)) {
                        matchedQs = QUIZ_DB[dbT];
                        break;
                    }
                }
                
                const questions = [];
                if (matchedQs) {
                    for (let i = 0; i < numQuestions; i++) {
                        const q = matchedQs[i % matchedQs.length];
                        questions.push({
                            question_text: `[${topic}] ` + q.question_text,
                            options: q.options,
                            correct_index: q.correct_index,
                            explanation: q.explanation
                        });
                    }
                } else {
                    for (let i = 0; i < numQuestions; i++) {
                        questions.push({
                            question_text: `Which of the following best describes a primary mechanism of '${topic}'?`,
                            options: [
                                `A foundational process governing the behavior of ${topic}`,
                                `An secondary, optional feature unrelated to ${topic}`,
                                `A historical event that occurred prior to the discovery of ${topic}`,
                                `A mathematical constant used to scale ${topic} variables`
                            ],
                            correct_index: 0,
                            explanation: `Option A is correct. The primary mechanism of ${topic} represents its core operational principle.`
                        });
                    }
                }
                
                resData = {
                    topic: topic,
                    questions: questions,
                    success: false,
                    error: "Gemini API Key missing. Running in Client-Side Demo Mode."
                };
            } else if (url === "/api/summarize") {
                const text = reqBody.text || "";
                const cleanText = text.trim();
                const sentences = cleanText.split(/[.!?]/).map(s => s.trim()).filter(s => s.length > 0);
                
                if (sentences.length === 0) {
                    resData = {
                        summary: "Empty text provided. Nothing to summarize.",
                        key_points: [],
                        vocabulary: [],
                        success: false
                    };
                } else {
                    const summary = sentences.slice(0, 3).join(". ") + ".";
                    const takeaways = sentences.slice(3, 7).map(s => s + ".").filter(s => s.length > 10);
                    if (takeaways.length === 0) {
                        takeaways.push("This text presents key educational insights on this topic.");
                        takeaways.push("Detailed analysis indicates consistent variables and inputs.");
                    }
                    
                    resData = {
                        summary: summary,
                        key_points: takeaways,
                        vocabulary: [
                            { term: "Analysis", definition: "Detailed examination of elements or structure." },
                            { term: "Synthesis", definition: "The combination of ideas to form a theory or system." }
                        ],
                        success: false,
                        error: "Gemini API Key missing. Running in Client-Side Demo Mode."
                    };
                }
            } else if (url === "/api/recommend") {
                const goal = reqBody.goal || "";
                const cleanKey = goal.trim().toLowerCase();
                let matchedRoadmap = null;
                
                for (const dbG in ROADMAPS_DB) {
                    if (cleanKey.includes(dbG) || dbG.includes(cleanKey)) {
                        matchedRoadmap = ROADMAPS_DB[dbG];
                        break;
                    }
                }
                
                if (matchedRoadmap) {
                    resData = {
                        goal: goal,
                        overview: matchedRoadmap.overview,
                        roadmap: matchedRoadmap.roadmap,
                        tips: matchedRoadmap.tips,
                        success: false,
                        error: "Gemini API Key missing. Running in Client-Side Demo Mode."
                    };
                } else {
                    resData = {
                        goal: goal,
                        overview: `Mastering '${goal}' requires dedication and a structured pathway. This curriculum outline will guide you from ground foundations to advanced execution stages.`,
                        roadmap: [
                            {
                                step_number: 1,
                                title: `Core Foundations of ${goal}`,
                                description: `Establish the basic rules, terminology, and tools necessary to study ${goal}.`,
                                estimated_duration: "Week 1-2",
                                resources: [`Introduction to ${goal} (Video series)`, `${goal} beginner reading material`]
                            },
                            {
                                step_number: 2,
                                title: "Hands-on Practice & Implementation",
                                description: `Build small tasks, solve basic problems, and apply concepts related to ${goal}.`,
                                estimated_duration: "Week 3-4",
                                resources: [`Interactive exercises for ${goal}`, "Practice problem sheets"]
                            },
                            {
                                step_number: 3,
                                title: "Advanced Application & Mastery",
                                description: `Tackle complex scenarios, optimization techniques, and project integrations for ${goal}.`,
                                estimated_duration: "Week 5+",
                                resources: [`Advanced guide to ${goal}`, `${goal} capstone project ideas`]
                            }
                        ],
                        tips: [
                            `Dedicate at least 30 minutes a day to practicing concepts around ${goal}.`,
                            "Document your progress and share challenges with classmates or online forums.",
                            "Always begin with simple inputs before stepping up to higher complexity."
                        ],
                        success: false,
                        error: "Gemini API Key missing. Running in Client-Side Demo Mode."
                    };
                }
            }
            
            return {
                ok: true,
                status: 200,
                json: async () => resData
            };
        };
    }

    // Initialize Lucide Icons
    lucide.createIcons();
    
    // Application state
    let systemHealth = {
        geminiConfigured: false,
        laminiLoaded: false,
        laminiModelId: ""
    };
    
    let quizState = {
        topic: "",
        questions: [],
        currentIndex: 0,
        score: 0,
        answered: false
    };

    // ==========================================
    // DOM Element Selectors
    // ==========================================
    const navItems = document.querySelectorAll(".nav-item");
    const tabContents = document.querySelectorAll(".tab-content");
    const pageTitle = document.getElementById("page-title");
    const pageSubtitle = document.getElementById("page-subtitle");
    
    // Status Elements
    const apiStatusDot = document.getElementById("api-status-dot");
    const apiStatusText = document.getElementById("api-status-text");
    const healthGemini = document.getElementById("health-gemini");
    const healthLamini = document.getElementById("health-lamini");
    const healthModelId = document.getElementById("health-model-id");
    
    // Loading & Toast Elements
    const loadingOverlay = document.getElementById("loading-overlay");
    const loadingText = document.getElementById("loading-text");
    const alertToast = document.getElementById("alert-toast");
    const toastTitle = document.getElementById("toast-title");
    const toastMessage = document.getElementById("toast-message");
    const btnToastClose = document.getElementById("btn-toast-close");
    
    // Forms
    const formExplain = document.getElementById("form-explain");
    const formQa = document.getElementById("form-qa");
    const formQuiz = document.getElementById("form-quiz");
    const formSummarize = document.getElementById("form-summarize");
    const formRecommend = document.getElementById("form-recommend");
    
    // Summary character counter
    const summarizeText = document.getElementById("summarize-text-input");
    const charCounter = document.getElementById("char-counter");
    
    // Action cards on dashboard
    const actionCards = document.querySelectorAll(".action-card");

    // ==========================================
    // UI Helpers (Loading, Toasts, Skeletons)
    // ==========================================
    function showLoading(message = "Processing request...") {
        loadingText.textContent = message;
        loadingOverlay.classList.remove("hide");
    }

    function hideLoading() {
        loadingOverlay.classList.add("hide");
    }

    function showToast(title, message, isError = true) {
        toastTitle.textContent = title;
        toastMessage.textContent = message;
        
        if (isError) {
            alertToast.style.borderColor = "rgba(244, 63, 94, 0.4)";
            alertToast.querySelector("i").setAttribute("data-lucide", "alert-circle");
        } else {
            alertToast.style.borderColor = "rgba(20, 184, 166, 0.4)";
            alertToast.querySelector("i").setAttribute("data-lucide", "check-circle");
        }
        
        lucide.createIcons();
        alertToast.classList.remove("hide");
        
        // Auto-dismiss after 5s
        setTimeout(dismissToast, 5000);
    }

    function dismissToast() {
        alertToast.classList.add("hide");
    }
    
    btnToastClose.addEventListener("click", dismissToast);

    // ==========================================
    // Navigation / Router
    // ==========================================
    const tabDetails = {
        dashboard: { title: "Dashboard", subtitle: "Supercharge your educational growth with AI support." },
        explain: { title: "Concept Explainer", subtitle: "Break down complex topics into digestible explanations." },
        qa: { title: "Intelligent Q&A", subtitle: "Get answers to your educational questions instantly." },
        quiz: { title: "Quiz Generator", subtitle: "Assess your memory retention and learn from detail feedbacks." },
        summarize: { title: "Smart Summarizer", subtitle: "Condense long readings into bullet notes and vocab lists." },
        recommend: { title: "Roadmap Planner", subtitle: "Plan milestones and timelines to master new goals." }
    };

    function switchTab(tabName) {
        // Deactivate all nav items & tab views
        navItems.forEach(item => item.classList.remove("active"));
        tabContents.forEach(content => content.classList.remove("active"));
        
        // Activate current tab button
        const activeNav = document.querySelector(`.nav-item[data-tab="${tabName}"]`);
        if (activeNav) activeNav.classList.add("active");
        
        // Activate current tab content
        const activeContent = document.getElementById(`tab-${tabName}`);
        if (activeContent) activeContent.classList.add("active");
        
        // Update headers
        if (tabDetails[tabName]) {
            pageTitle.textContent = tabDetails[tabName].title;
            pageSubtitle.textContent = tabDetails[tabName].subtitle;
        }
        
        // Special case: reset quiz if returning to setup
        if (tabName === "quiz") {
            resetQuizToSetup();
        }
    }

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const tabName = item.getAttribute("data-tab");
            switchTab(tabName);
        });
    });
    
    actionCards.forEach(card => {
        card.addEventListener("click", () => {
            const action = card.getAttribute("data-action");
            switchTab(action);
        });
    });

    // ==========================================
    // System Status & Health Check
    // ==========================================
    async function checkSystemHealth() {
        try {
            const response = await fetch("/api/health");
            if (!response.ok) throw new Error("Health check failed");
            
            systemHealth = await response.json();
            
            // Update UI status badges
            if (systemHealth.gemini_configured) {
                healthGemini.textContent = "Configured";
                healthGemini.className = "badge badge-success";
            } else {
                healthGemini.textContent = "Demo / Mock Mode";
                healthGemini.className = "badge badge-warning";
            }
            
            if (systemHealth.lamini_loaded) {
                healthLamini.textContent = "Loaded (Ready)";
                healthLamini.className = "badge badge-success";
            } else {
                healthLamini.textContent = "Standby (Lazy Load)";
                healthLamini.className = "badge badge-warning";
            }
            
            healthModelId.textContent = systemHealth.lamini_model_id;
            
            // Update sidebar indicator
            apiStatusDot.className = "status-indicator healthy";
            apiStatusText.textContent = "Server Online";
        } catch (err) {
            console.error(err);
            apiStatusDot.className = "status-indicator error";
            apiStatusText.textContent = "Server Offline";
            
            healthGemini.textContent = "Offline";
            healthGemini.className = "badge badge-danger";
            healthLamini.textContent = "Offline";
            healthLamini.className = "badge badge-danger";
            healthModelId.textContent = "N/A";
        }
    }

    // Run initial health check, repeat every 30s
    checkSystemHealth();
    setInterval(checkSystemHealth, 30000);

    // ==========================================
    // Feature 1: Concept Explainer
    // ==========================================
    formExplain.addEventListener("submit", async (e) => {
        e.preventDefault();
        const concept = document.getElementById("explain-concept").value.trim();
        const level = document.querySelector('input[name="explain-level"]:checked').value;
        
        if (!concept) return;
        
        showLoading(`Deconstructing '${concept}' for ${level} level...`);
        
        try {
            const response = await fetch("/api/explain", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ concept, level })
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || "Concept explanation request failed.");
            
            // Render Result
            document.getElementById("explain-output-title").textContent = data.concept;
            document.getElementById("explain-output-badge").textContent = data.level.toUpperCase();
            document.getElementById("explain-text").textContent = data.explanation;
            document.getElementById("explain-analogy").textContent = data.analogy;
            
            const vocabContainer = document.getElementById("explain-vocab");
            vocabContainer.innerHTML = "";
            
            if (data.key_terms && data.key_terms.length > 0) {
                data.key_terms.forEach(item => {
                    const vocabItem = document.createElement("div");
                    vocabItem.className = "vocab-item";
                    vocabItem.innerHTML = `
                        <div class="vocab-term">${item.term}</div>
                        <div class="vocab-definition">${item.definition}</div>
                    `;
                    vocabContainer.appendChild(vocabItem);
                });
            } else {
                vocabContainer.innerHTML = "<p class='text-secondary'>No vocabulary terms extracted.</p>";
            }
            
            document.getElementById("explain-output").classList.remove("hide");
            
            // Check if returned mock warnings
            if (!data.success && data.error) {
                showToast("Configuration Warning", data.error);
            }
            
            // Scroll to results
            document.getElementById("explain-output").scrollIntoView({ behavior: "smooth" });
        } catch (err) {
            showToast("Error Generating Explanation", err.message);
        } finally {
            hideLoading();
        }
    });

    // ==========================================
    // Feature 2: Intelligent Q&A
    // ==========================================
    formQa.addEventListener("submit", async (e) => {
        e.preventDefault();
        const question = document.getElementById("qa-question").value.trim();
        const model = document.querySelector('input[name="qa-model"]:checked').value;
        
        if (!question) return;
        
        const loaderMsg = model === "lamini" 
            ? "Executing local LaMini-T5 model... (First load may take 1-2 mins to download weights)" 
            : "Consulting Gemini 1.5 Pro...";
            
        showLoading(loaderMsg);
        
        try {
            const response = await fetch("/api/qa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question, model })
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || "Q&A request failed.");
            
            document.getElementById("qa-output-badge").textContent = data.model_used;
            document.getElementById("qa-text").textContent = data.answer;
            document.getElementById("qa-output").classList.remove("hide");
            
            if (!data.success && data.error) {
                showToast("System Alert", data.error);
            }
            
            document.getElementById("qa-output").scrollIntoView({ behavior: "smooth" });
            checkSystemHealth(); // Refresh health to update if local model loaded
        } catch (err) {
            showToast("Q&A Error", err.message);
        } finally {
            hideLoading();
        }
    });

    // ==========================================
    // Feature 3: Smart Summarizer
    // ==========================================
    summarizeText.addEventListener("input", () => {
        const count = summarizeText.value.length;
        charCounter.textContent = `${count} character${count !== 1 ? 's' : ''}`;
    });

    formSummarize.addEventListener("submit", async (e) => {
        e.preventDefault();
        const text = summarizeText.value.trim();
        if (!text) return;
        
        showLoading("Summarizing passage and extracting definitions...");
        
        try {
            const response = await fetch("/api/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text })
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || "Summarizer failed.");
            
            document.getElementById("summarize-result-text").textContent = data.summary;
            
            // Key Takeaways bullets
            const keyPointsList = document.getElementById("summarize-key-points");
            keyPointsList.innerHTML = "";
            if (data.key_points && data.key_points.length > 0) {
                data.key_points.forEach(point => {
                    const li = document.createElement("li");
                    li.textContent = point;
                    keyPointsList.appendChild(li);
                });
            } else {
                keyPointsList.innerHTML = "<li>No specific bullet points extracted.</li>";
            }
            
            // Vocab
            const vocabContainer = document.getElementById("summarize-vocab");
            vocabContainer.innerHTML = "";
            if (data.vocabulary && data.vocabulary.length > 0) {
                data.vocabulary.forEach(item => {
                    const vocabItem = document.createElement("div");
                    vocabItem.className = "vocab-item";
                    vocabItem.innerHTML = `
                        <div class="vocab-term">${item.term}</div>
                        <div class="vocab-definition">${item.definition}</div>
                    `;
                    vocabContainer.appendChild(vocabItem);
                });
            } else {
                vocabContainer.innerHTML = "<p class='text-secondary'>No vocabulary terms identified.</p>";
            }
            
            document.getElementById("summarize-output").classList.remove("hide");
            
            if (!data.success && data.error) {
                showToast("System Alert", data.error);
            }
            
            document.getElementById("summarize-output").scrollIntoView({ behavior: "smooth" });
        } catch (err) {
            showToast("Summarization Error", err.message);
        } finally {
            hideLoading();
        }
    });

    // ==========================================
    // Feature 4: Study Roadmap Planner
    // ==========================================
    formRecommend.addEventListener("submit", async (e) => {
        e.preventDefault();
        const goal = document.getElementById("recommend-goal").value.trim();
        if (!goal) return;
        
        showLoading(`Formulating roadmap to master '${goal}'...`);
        
        try {
            const response = await fetch("/api/recommend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ goal })
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || "Roadmap planner failed.");
            
            document.getElementById("recommend-output-title").textContent = `Curriculum: ${data.goal}`;
            document.getElementById("recommend-overview").textContent = data.overview;
            
            // Timeline Milestone Rendering
            const timelineContainer = document.getElementById("recommend-timeline");
            timelineContainer.innerHTML = "";
            
            if (data.roadmap && data.roadmap.length > 0) {
                data.roadmap.forEach((step, idx) => {
                    const stepDiv = document.createElement("div");
                    stepDiv.className = "timeline-step";
                    
                    let resourcesHtml = "";
                    if (step.resources && step.resources.length > 0) {
                        resourcesHtml = `
                            <div class="timeline-resources">
                                <h5>Resources & Key Topics:</h5>
                                <ul class="resources-list">
                                    ${step.resources.map(res => `<li>${res}</li>`).join("")}
                                </ul>
                            </div>
                        `;
                    }
                    
                    stepDiv.innerHTML = `
                        <div class="timeline-bubble">${step.step_number || (idx + 1)}</div>
                        <div class="timeline-header">
                            <h4>${step.title}</h4>
                            <span class="timeline-duration">${step.estimated_duration}</span>
                        </div>
                        <p class="timeline-description">${step.description}</p>
                        ${resourcesHtml}
                    `;
                    timelineContainer.appendChild(stepDiv);
                });
            } else {
                timelineContainer.innerHTML = "<p class='text-secondary'>No milestones planned.</p>";
            }
            
            // Study tips
            const tipsList = document.getElementById("recommend-tips");
            tipsList.innerHTML = "";
            if (data.tips && data.tips.length > 0) {
                data.tips.forEach(tip => {
                    const li = document.createElement("li");
                    li.textContent = tip;
                    tipsList.appendChild(li);
                });
            } else {
                tipsList.innerHTML = "<li>Stay consistent and practice regularly!</li>";
            }
            
            document.getElementById("recommend-output").classList.remove("hide");
            
            if (!data.success && data.error) {
                showToast("System Alert", data.error);
            }
            
            document.getElementById("recommend-output").scrollIntoView({ behavior: "smooth" });
        } catch (err) {
            showToast("Planner Error", err.message);
        } finally {
            hideLoading();
        }
    });

    // ==========================================
    // Feature 5: Interactive Quiz Runner Engine
    // ==========================================
    const quizSetup = document.getElementById("quiz-setup-container");
    const quizRunner = document.getElementById("quiz-runner-container");
    const quizScoreboard = document.getElementById("quiz-score-container");
    const btnQuizNext = document.getElementById("btn-quiz-next");
    const btnQuizRestart = document.getElementById("btn-quiz-restart");
    const btnQuizNew = document.getElementById("btn-quiz-new");

    formQuiz.addEventListener("submit", async (e) => {
        e.preventDefault();
        const topic = document.getElementById("quiz-topic").value.trim();
        const numQuestions = parseInt(document.getElementById("quiz-count").value);
        
        if (!topic) return;
        
        showLoading(`Drafting multiple-choice questions on '${topic}'...`);
        
        try {
            const response = await fetch("/api/quiz", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, num_questions: numQuestions })
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || "Quiz generation failed.");
            
            if (!data.questions || data.questions.length === 0) {
                throw new Error("No quiz questions generated. Try another topic.");
            }
            
            // Set Quiz State
            quizState.topic = data.topic;
            quizState.questions = data.questions;
            quizState.currentIndex = 0;
            quizState.score = 0;
            
            // Hide setup, show runner
            quizSetup.classList.add("hide");
            quizScoreboard.classList.add("hide");
            quizRunner.classList.remove("hide");
            
            document.getElementById("quiz-runner-title").textContent = quizState.topic;
            
            loadQuizQuestion();
            
            if (!data.success && data.error) {
                showToast("Demo Mode Enabled", data.error);
            }
        } catch (err) {
            showToast("Quiz Error", err.message);
        } finally {
            hideLoading();
        }
    });

    function loadQuizQuestion() {
        const question = quizState.questions[quizState.currentIndex];
        quizState.answered = false;
        
        // Progress UI
        const progressPercent = ((quizState.currentIndex + 1) / quizState.questions.length) * 100;
        document.getElementById("quiz-progress-bar").style.width = `${progressPercent}%`;
        document.getElementById("quiz-progress-label").textContent = `Question ${quizState.currentIndex + 1} of ${quizState.questions.length}`;
        document.getElementById("quiz-runner-score").textContent = `${quizState.score}/${quizState.questions.length}`;
        
        // Question texts
        document.getElementById("quiz-question-text").textContent = question.question_text;
        
        // Generate options cards
        const optionsGrid = document.getElementById("quiz-options");
        optionsGrid.innerHTML = "";
        
        question.options.forEach((optText, index) => {
            const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
            const card = document.createElement("div");
            card.className = "option-card";
            card.setAttribute("data-index", index);
            card.innerHTML = `
                <span><strong>${optionLetter}.</strong> ${optText}</span>
                <div class="option-icon"></div>
            `;
            
            card.addEventListener("click", () => {
                if (quizState.answered) return;
                selectQuizOption(index);
            });
            
            optionsGrid.appendChild(card);
        });
        
        // Hide explanation card, disable next button
        document.getElementById("quiz-explanation-card").classList.add("hide");
        btnQuizNext.disabled = true;
    }

    function selectQuizOption(selectedIndex) {
        quizState.answered = true;
        const currentQuestion = quizState.questions[quizState.currentIndex];
        const correctIndex = currentQuestion.correct_index;
        
        const optionCards = document.querySelectorAll(".option-card");
        
        // Set CSS states
        optionCards.forEach((card, index) => {
            card.classList.add("disabled");
            
            if (index === correctIndex) {
                card.classList.add("correct");
                card.querySelector(".option-icon").innerHTML = "<i data-lucide='check' style='width:12px; height:12px;'></i>";
            }
            
            if (index === selectedIndex && index !== correctIndex) {
                card.classList.add("incorrect");
                card.querySelector(".option-icon").innerHTML = "<i data-lucide='x' style='width:12px; height:12px;'></i>";
            }
        });
        
        // Update Score state
        if (selectedIndex === correctIndex) {
            quizState.score++;
            document.getElementById("quiz-runner-score").textContent = `${quizState.score}/${quizState.questions.length}`;
        }
        
        // Render explanation
        document.getElementById("quiz-explanation-text").textContent = currentQuestion.explanation;
        document.getElementById("quiz-explanation-card").classList.remove("hide");
        
        // Enable Next button
        btnQuizNext.disabled = false;
        
        // Refresh icons
        lucide.createIcons();
    }

    btnQuizNext.addEventListener("click", () => {
        if (quizState.currentIndex < quizState.questions.length - 1) {
            quizState.currentIndex++;
            loadQuizQuestion();
        } else {
            showQuizFinalScore();
        }
    });

    function showQuizFinalScore() {
        quizRunner.classList.add("hide");
        quizScoreboard.classList.remove("hide");
        
        const total = quizState.questions.length;
        const finalScoreText = `${quizState.score}/${total}`;
        document.getElementById("quiz-final-score").textContent = finalScoreText;
        
        const scorePercent = (quizState.score / total) * 100;
        let feedback = "Great try! Review the topics to study up and perform even better next time.";
        
        if (scorePercent === 100) {
            feedback = "Masterful performance! You scored 100%. You have completely mastered this subject matter!";
        } else if (scorePercent >= 80) {
            feedback = "Spectacular job! You have a highly competent understanding of this topic.";
        } else if (scorePercent >= 60) {
            feedback = "Good effort! You understand the key foundations, but have a few areas to review.";
        } else if (scorePercent >= 40) {
            feedback = "Passable! Keep practicing and reading through explanations to boost your scores.";
        }
        
        document.getElementById("quiz-feedback-text").textContent = feedback;
    }

    function resetQuizToSetup() {
        quizRunner.classList.add("hide");
        quizScoreboard.classList.add("hide");
        quizSetup.classList.remove("hide");
    }

    btnQuizRestart.addEventListener("click", () => {
        quizState.currentIndex = 0;
        quizState.score = 0;
        quizScoreboard.classList.add("hide");
        quizRunner.classList.remove("hide");
        loadQuizQuestion();
    });

    btnQuizNew.addEventListener("click", resetQuizToSetup);
});
