import re
from typing import List
from app.schemas import ExplainResponse, KeyTerm, QuizQuestion, QuizResponse, SummarizeResponse, RecommendResponse, RoadmapStep, QAResponse

# ==========================================
# 1. Predefined Concepts database
# ==========================================
CONCEPTS_DB = {
    "photosynthesis": {
        "beginner": {
            "explanation": "Photosynthesis is how green plants make their own food! Plants use their leaves to catch light from the Sun, and they breathe in carbon dioxide from the air. Together with water from the ground, they cook up a sweet sugar called glucose to eat, and breathe out fresh oxygen for us to breathe.",
            "analogy": "Imagine a plant leaf is a tiny solar-powered kitchen, cooking up tasty sugar cookies using sunshine as the oven heat!",
            "key_terms": [
                KeyTerm(term="Chlorophyll", definition="The special green paint inside plant leaves that catches sunlight."),
                KeyTerm(term="Glucose", definition="A simple sweet sugar that plants eat for energy.")
            ]
        },
        "intermediate": {
            "explanation": "Photosynthesis is the biochemical process by which plants, algae, and some bacteria convert light energy into chemical energy. Using solar radiation, these organisms convert carbon dioxide and water into glucose (a primary energy source) and oxygen (released as a byproduct). The process occurs in two main phases: the Light-Dependent Reactions (which capture light to form ATP and NADPH) and the Calvin Cycle (which uses that energy to build sugars).",
            "analogy": "Think of a plant leaf as a solar panel linked to an automated chemical manufacturing plant that turns raw air and water into fuel cells.",
            "key_terms": [
                KeyTerm(term="Calvin Cycle", definition="A set of chemical reactions that take place in chloroplasts during light-independent phase."),
                KeyTerm(term="Chloroplast", definition="The organelle in plant cells where photosynthesis takes place.")
            ]
        },
        "advanced": {
            "explanation": "Photosynthesis is an complex endergonic pathway consisting of photophosphorylation and carbon assimilation. Electron transport occurs across the thylakoid membrane, driven by Photosystem II (absorption peak 680nm) and Photosystem I (absorption peak 700nm). Water photolysis at the oxygen-evolving complex yields protons and oxygen. The resulting proton gradient drives ATP synthesis via chemiosmosis. In the stroma, Ribulose-1,5-bisphosphate carboxylase-oxygenase (RuBisCO) catalyzes the fixation of carbon dioxide in the C3, C4, or CAM pathways.",
            "analogy": "It functions like an atomic-level semiconductor circuit that uses photonic excitation to pump protons, powering a molecular rotor (ATP synthase) to synthesize organic compounds.",
            "key_terms": [
                KeyTerm(term="Photolysis", definition="The chemical decomposition of water molecules induced by light energy during the light reactions."),
                KeyTerm(term="RuBisCO", definition="Ribulose-1,5-bisphosphate carboxylase-oxygenase, the enzyme responsible for carbon fixation.")
            ]
        }
    },
    "quantum computing": {
        "beginner": {
            "explanation": "Normal computers use tiny switches called bits that are either ON (1) or OFF (0) to do work. Quantum computers are super computers that use quantum bits, or qubits! Qubits are special because they can be ON, OFF, or BOTH at the same time. This lets them solve extremely hard puzzles super fast!",
            "analogy": "A regular computer bit is like a coin sitting flat on a table (either Heads or Tails). A qubit is like a coin spinning on the table (it's both Heads and Tails at the same time until you stop it).",
            "key_terms": [
                KeyTerm(term="Qubit", definition="A quantum bit that can represent multiple states simultaneously."),
                KeyTerm(term="Superposition", definition="The ability of a qubit to exist in multiple states at the same time.")
            ]
        },
        "intermediate": {
            "explanation": "Quantum computing is a rapidly-emerging technology that harnesses the laws of quantum mechanics to solve problems too complex for classical computers. Unlike classical bits that represent either 0 or 1, qubits utilize principles of superposition and entanglement. Superposition allows qubits to exist in a linear combination of states. Entanglement links the state of one qubit to another, enabling exponential scaling of processing power to perform simultaneous calculations.",
            "analogy": "If a classical computer navigates a maze by trying every single path one after the other, a quantum computer navigates by traveling down all possible paths simultaneously.",
            "key_terms": [
                KeyTerm(term="Entanglement", definition="A quantum phenomenon where particles link up, such that the state of one instantly affects another."),
                KeyTerm(term="Quantum Gates", definition="Basic quantum circuits operating on qubits, analogous to classical logic gates.")
            ]
        },
        "advanced": {
            "explanation": "Quantum computing utilizes the quantum mechanical phenomena of superposition, entanglement, and interference to execute algorithms. Qubits are physical systems (e.g., superconducting Josephson junctions, trapped ions) modeled as vectors in a complex Hilbert space. Computational operations are represented by unitary matrices acting on these vectors. Algorithms like Shor's (for integer factorization) and Grover's (for unstructured database search) exploit quantum parallelism and constructive wave interference to achieve polynomial or exponential speedups over classical equivalents.",
            "analogy": "It is like using a complex array of overlapping waves in a harbor, tuning them so they perfectly cancel out wrong paths and peak at the correct escape route.",
            "key_terms": [
                KeyTerm(term="Hilbert Space", definition="A state space that extends the vector space to infinite dimensions, supporting quantum states."),
                KeyTerm(term="Decoherence", definition="The loss of quantum behavior caused by interaction/noise from the external environment.")
            ]
        }
    },
    "black holes": {
        "beginner": {
            "explanation": "A black hole is a spot in space where gravity pulls so incredibly strong that absolutely nothing can escape from it, not even light! They are born when giant stars run out of fuel and collapse in on themselves, squeezing all their heavy weight into a tiny dot.",
            "analogy": "Think of a black hole like a giant, invisible vacuum cleaner in space that never gets full and pulls in everything that gets too close.",
            "key_terms": [
                KeyTerm(term="Event Horizon", definition="The boundary line around a black hole. Once you cross this line, you can never get back out."),
                KeyTerm(term="Gravity", definition="The invisible pulling force that keeps our feet on the ground and pulls stars together.")
            ]
        },
        "intermediate": {
            "explanation": "A black hole is a region of spacetime where gravity is so strong that nothing, including electromagnetic radiation such as light, has enough energy to escape its gravitational pull. According to Einstein's General Theory of Relativity, a sufficiently compact mass can deform spacetime to form a black hole. Surrounding it is a boundary called the event horizon, which represents the point of no return. Beyond this lies the singularity, where mass is compressed to infinite density.",
            "analogy": "Imagine a bowling ball placed on a trampoline, creating a deep funnel. If you roll a marble too close to the funnel, it falls in and cannot roll back out.",
            "key_terms": [
                KeyTerm(term="Singularity", definition="The center of a black hole where all matter is crushed into an infinitely small space."),
                KeyTerm(term="Hawking Radiation", definition="Theoretical thermal radiation released by black holes due to quantum effects near the event horizon.")
            ]
        },
        "advanced": {
            "explanation": "Black holes are gravitational singularities characterized by a metric (e.g., Schwarzschild for non-rotating, Kerr for rotating black holes) solving Einstein's field equations in vacuum. The boundary of the black hole is the event horizon, a null hypersurface acting as a one-way causal membrane. Thermodynamically, black holes possess entropy proportional to their surface area, as described by the Bekenstein-Hawking formula. Research continues into the Information Paradox, examining whether quantum information entering a black hole is permanently lost during Hawking evaporation.",
            "analogy": "It operates like a topological defect in spacetime where the light cones tip completely inward, turning all future trajectories toward the singularity.",
            "key_terms": [
                KeyTerm(term="Kerr Metric", definition="An exact solution to Einstein's field equations describing spacetime geometry around a rotating black hole."),
                KeyTerm(term="Information Paradox", definition="The theoretical conflict between quantum mechanics (information conservation) and black hole evaporation.")
            ]
        }
    }
}

# ==========================================
# 2. Predefined Questions & Answers
# ==========================================
QA_DB = {
    "why is the sky blue?": "The sky is blue because of a phenomenon called Rayleigh scattering. Sunlight reaches Earth's atmosphere and is scattered in all directions by all the gases and particles in the air. Sunlight is made up of all the colors of the rainbow, but blue light travels as smaller, shorter waves than other colors. This causes blue light to be scattered more than the other colors, making us see a blue sky.",
    "how do cells convert energy?": "Cells convert energy through cellular respiration. This occurs inside the mitochondria, often called the powerhouses of the cell. Cells take glucose (from food) and oxygen, and through a series of chemical reactions (Glycolysis, the Krebs Cycle, and the Electron Transport Chain), they convert it into ATP (Adenosine Triphosphate), which is the chemical energy currency that cells use to fuel their activities.",
    "what is euler's constant?": "Euler's constant (often written as 'e') is an irrational mathematical constant approximately equal to 2.71828. It is the unique base of natural logarithms. It represents the limit of (1 + 1/n)^n as n approaches infinity, which is the mathematical foundation for continuous compounding interest, population growth rates, and wave descriptions."
}

# ==========================================
# 3. Predefined Quizzes
# ==========================================
QUIZ_DB = {
    "newtonian mechanics": [
        QuizQuestion(
            question_text="Which of Newton's Laws states that 'for every action, there is an equal and opposite reaction'?",
            options=["First Law", "Second Law", "Third Law", "Law of Gravitation"],
            correct_index=2,
            explanation="Newton's Third Law states that forces always occur in equal and opposite pairs. If Object A exerts a force on Object B, Object B exerts an equal force in the opposite direction on Object A."
        ),
        QuizQuestion(
            question_text="What physical quantity is defined as the product of an object's mass and its velocity?",
            options=["Acceleration", "Momentum", "Kinetic Energy", "Force"],
            correct_index=1,
            explanation="Momentum (p) is defined as mass multiplied by velocity (p = mv). It is a vector quantity representing the quantity of motion."
        ),
        QuizQuestion(
            question_text="What is the net force acting on an object traveling at a constant velocity?",
            options=["Zero", "Equal to mass times acceleration", "Continuously increasing", "Independent of velocity"],
            correct_index=0,
            explanation="According to Newton's First Law (Inertia), if velocity is constant, acceleration is zero. Since F = ma, the net force must be zero."
        )
    ],
    "world war ii": [
        QuizQuestion(
            question_text="In which year did World War II officially begin?",
            options=["1914", "1939", "1941", "1945"],
            correct_index=1,
            explanation="World War II began on September 1, 1939, when Germany invaded Poland, leading France and Great Britain to declare war."
        ),
        QuizQuestion(
            question_text="What was the codename for the Allied invasion of Normandy on D-Day?",
            options=["Operation Barbarossa", "Operation Torch", "Operation Overlord", "Operation Sea Lion"],
            correct_index=2,
            explanation="Operation Overlord was the official codename for the Battle of Normandy, launched on June 6, 1944 (D-Day)."
        ),
        QuizQuestion(
            question_text="Which event prompted the United States to officially enter World War II?",
            options=["The invasion of Poland", "The Battle of Britain", "The bombing of Pearl Harbor", "The signing of the Tripartite Pact"],
            correct_index=2,
            explanation="The Japanese surprise attack on Pearl Harbor on December 7, 1941, led the US Congress to declare war the following day."
        )
    ],
    "cell division": [
        QuizQuestion(
            question_text="What is the process of cell division that results in four genetically diverse daughter cells?",
            options=["Mitosis", "Meiosis", "Binary Fission", "Cytokinesis"],
            correct_index=1,
            explanation="Meiosis is a specialized type of cell division that reduces the chromosome number by half, producing four genetically unique haploid gamete cells."
        ),
        QuizQuestion(
            question_text="During which phase of mitosis do sister chromatids separate and move to opposite poles of the cell?",
            options=["Prophase", "Metaphase", "Anaphase", "Telophase"],
            correct_index=2,
            explanation="In Anaphase, the sister chromatids are pulled apart by spindle fibers and move toward opposite ends of the dividing cell."
        ),
        QuizQuestion(
            question_text="What is the name of the resting phase where cells prepare for division by copying their DNA?",
            options=["Interphase", "Prophase", "Cytokinesis", "Metaphase"],
            correct_index=0,
            explanation="Interphase is the longest part of the cell cycle, during which the cell grows, performs metabolic processes, and replicates its DNA (S phase) in preparation for mitosis."
        )
    ]
}

# ==========================================
# 4. Predefined Study Roadmaps
# ==========================================
ROADMAPS_DB = {
    "deep learning in python": RecommendResponse(
        goal="Deep Learning in Python",
        overview="Deep learning powers modern AI, from computer vision to large language models. This curriculum takes you from basic Python programming to building neural networks using PyTorch.",
        roadmap=[
            RoadmapStep(
                step_number=1,
                title="Prerequisites & Python Basics",
                description="Master Python syntax, functions, object-oriented concepts, and basic libraries like NumPy and Pandas for data manipulation.",
                estimated_duration="2 weeks",
                resources=["Python Documentation", "Kaggle Python Course", "NumPy Quickstart Guide"]
            ),
            RoadmapStep(
                step_number=2,
                title="Linear Algebra & Machine Learning Foundations",
                description="Understand matrix multiplication, derivatives, gradient descent, linear regression, and standard evaluations.",
                estimated_duration="2 weeks",
                resources=["3Blue1Brown Linear Algebra Series", "Scikit-Learn Tutorials"]
            ),
            RoadmapStep(
                step_number=3,
                title="Introduction to PyTorch & Neural Networks",
                description="Learn the building blocks of neural networks: Tensors, autograd, activation functions, and fully-connected layers.",
                estimated_duration="3 weeks",
                resources=["PyTorch Official Tutorial (Learn the Basics)", "Fast.ai Practical Deep Learning"]
            ),
            RoadmapStep(
                step_number=4,
                title="Convolutional & Recurrent Networks (CNNs & RNNs)",
                description="Dive into spatial data architectures (convolutions, pooling) for image processing and sequential data models (LSTMs, GRUs) for text.",
                estimated_duration="3 weeks",
                resources=["CS231n: CNNs for Visual Recognition", "PyTorch Sequence Modeling Tutorials"]
            )
        ],
        tips=[
            "Don't just watch videos: type out code and inspect tensor shapes at every layer.",
            "Start with small architectures and tiny datasets to verify training decreases training loss.",
            "Utilize free GPU resources like Google Colab or Kaggle Notebooks to accelerate training."
        ]
    ),
    "calculus i": RecommendResponse(
        goal="Calculus I",
        overview="Calculus is the mathematical study of continuous change. This study plan establishes the concepts of limits, derivatives, and introduction to integrals.",
        roadmap=[
            RoadmapStep(
                step_number=1,
                title="Limits & Continuity",
                description="Understand how functions behave as they approach specific points. Master limit laws, one-sided limits, limits at infinity, and continuous functions.",
                estimated_duration="2 weeks",
                resources=["Khan Academy Calculus limits", "Paul's Online Math Notes"]
            ),
            RoadmapStep(
                step_number=2,
                title="The Derivative & Differentiation Rules",
                description="Define the derivative as a rate of change and tangent line slope. Learn the power, product, quotient, and chain rules.",
                estimated_duration="3 weeks",
                resources=["3Blue1Brown Essence of Calculus", "Mit OpenCourseWare Single Variable Calculus"]
            ),
            RoadmapStep(
                step_number=3,
                title="Applications of Derivatives",
                description="Apply derivatives to graph functions (maxima/minima, concavity), solve related rates, and perform optimization problems.",
                estimated_duration="3 weeks",
                resources=["Calculus Optimization practice guides", "Paul's Math Notes - Derivative Apps"]
            ),
            RoadmapStep(
                step_number=4,
                title="Introduction to Integration",
                description="Learn about anti-derivatives, Riemann sums, definite integrals, and the Fundamental Theorem of Calculus.",
                estimated_duration="2 weeks",
                resources=["Khan Academy integration basics", "Professor Leonard Calculus I Playlist"]
            )
        ],
        tips=[
            "Algebra is 80% of Calculus. Review factoring, trig identities, and fractional exponents.",
            "Draw a picture for every optimization and related rates problem.",
            "Understand the geometric meaning of limits and derivatives before memorizing formulas."
        ]
    )
}

# ==========================================
# 5. Dynamic Fallback Generators
# ==========================================

def clean_key(text: str) -> str:
    """Normalize input strings for key lookups."""
    return re.sub(r'\s+', ' ', text.strip().lower())

def generate_dynamic_explain(concept: str, level: str) -> ExplainResponse:
    """Generates a highly contextual explanation dynamically based on the topic."""
    key = clean_key(concept)
    if key in CONCEPTS_DB and level in CONCEPTS_DB[key]:
        data = CONCEPTS_DB[key][level]
        return ExplainResponse(
            concept=concept,
            level=level,
            explanation=data["explanation"],
            analogy=data["analogy"],
            key_terms=data["key_terms"],
            success=False,
            error="Gemini API Key missing. Running in Smart Demo Mode."
        )

    # Dynamic explanation generation
    explanation = ""
    analogy = ""
    key_terms = []

    if level == "beginner":
        explanation = (
            f"Let's learn about {concept}! Think of it as a special way of doing things. "
            f"At its core, {concept} is when different parts work together to make something neat happen. "
            f"It's like a game where everyone has a special job to do so the team wins!"
        )
        analogy = f"Imagine {concept} is like a group of friendly ants building a castle out of twigs."
        key_terms = [
            KeyTerm(term=f"{concept} Basics", definition="The simple starting steps to learn this topic."),
            KeyTerm(term="Core Idea", definition="The most important rule or feature to remember.")
        ]
    elif level == "advanced":
        explanation = (
            f"In academic terms, {concept} represents a complex paradigm governed by specific systemic parameters and mechanisms. "
            f"To evaluate the structural properties of {concept}, researchers examine the correlation between underlying variables, "
            f"functional dependencies, and mathematical or thematic constraints that dictate its execution."
        )
        analogy = f"It behaves similarly to a multi-tiered cryptographic protocol operating over a distributed network."
        key_terms = [
            KeyTerm(term=f"{concept} Dynamics", definition="The study of forces and interactions within this specific system."),
            KeyTerm(term="Systemic Constraint", definition="Boundaries that limit or define the state space of the paradigm.")
        ]
    else: # intermediate
        explanation = (
            f"The concept of {concept} refers to the structured study and application of this subject. "
            f"It involves key processes, foundational rules, and operational pathways. "
            f"To understand {concept}, students analyze how it behaves under standard conditions, "
            f"its historical/scientific significance, and how it connects to surrounding fields of study."
        )
        analogy = f"Think of {concept} like a well-designed blueprint for a house, where every line has a functional purpose."
        key_terms = [
            KeyTerm(term=f"Foundations of {concept}", definition="The essential theories and formulas that form the base of the topic."),
            KeyTerm(term="Application Layer", definition="How this topic is used in real-world scenarios and industries.")
        ]

    return ExplainResponse(
        concept=concept,
        level=level,
        explanation=explanation,
        analogy=analogy,
        key_terms=key_terms,
        success=False,
        error="Gemini API Key missing. Running in Smart Demo Mode."
    )

def generate_dynamic_qa(question: str) -> QAResponse:
    """Generates a dynamic answer to a question."""
    key = clean_key(question)
    
    # Try exact match or substring matches in database
    for db_q, db_a in QA_DB.items():
        if db_q in key or key in db_q:
            return QAResponse(
                answer=db_a,
                model_used="Gemini 1.5 Pro (Smart Mock)",
                success=False,
                error="Gemini API Key missing. Running in Smart Demo Mode."
            )
            
    # Generic dynamic question answers
    answer = (
        f"Thank you for asking about '{question}'. "
        f"In education, this topic relates to core principles of scientific and logical inquiry. "
        f"To address this question thoroughly: we examine the conditions under which it occurs, "
        f"the factors that influence it, and its applications. "
        f"Generally, it is understood that these elements follow standard physical, mathematical, or historical rules."
    )
    
    return QAResponse(
        answer=answer,
        model_used="Gemini 1.5 Pro (Smart Mock)",
        success=False,
        error="Gemini API Key missing. Running in Smart Demo Mode."
    )

def generate_dynamic_quiz(topic: str, num_questions: int) -> QuizResponse:
    """Generates a structured educational quiz dynamically."""
    key = clean_key(topic)
    questions = []
    
    # Check pre-defined quiz database
    predefined_qs = []
    for db_t, db_qs in QUIZ_DB.items():
        if db_t in key or key in db_t:
            predefined_qs = db_qs
            break
            
    if predefined_qs:
        # Pad or slice to match num_questions
        for i in range(num_questions):
            q = predefined_qs[i % len(predefined_qs)]
            questions.append(QuizQuestion(
                question_text=f"[{topic.title()} Q{i+1}] " + q.question_text,
                options=q.options,
                correct_index=q.correct_index,
                explanation=q.explanation
            ))
    else:
        # Generate fully dynamic quiz questions
        for i in range(num_questions):
            questions.append(QuizQuestion(
                question_text=f"Which of the following best describes a primary mechanism of '{topic}'?",
                options=[
                    f"A foundational process governing the behavior of {topic}",
                    f"An secondary, optional feature unrelated to {topic}",
                    f"A historical event that occurred prior to the discovery of {topic}",
                    f"A mathematical constant used to scale {topic} variables"
                ],
                correct_index=0,
                explanation=f"Option A is correct. The primary mechanism of {topic} represents its core operational principle."
            ))
            
    return QuizResponse(
        topic=topic,
        questions=questions,
        success=False,
        error="Gemini API Key missing. Running in Smart Demo Mode."
    )

def generate_dynamic_summarize(text: str) -> SummarizeResponse:
    """Extracts summary and terms heuristically from the provided text."""
    clean_text = text.strip()
    sentences = [s.strip() for s in re.split(r'[.!?]', clean_text) if s.strip()]
    
    if len(sentences) == 0:
        return SummarizeResponse(
            summary="Empty text provided. Nothing to summarize.",
            key_points=[],
            vocabulary=[],
            success=False
        )
        
    # Build summary paragraph from the first 2-3 sentences
    summary_sentences = sentences[:3]
    summary = " ".join(summary_sentences) + "."
    if not summary.endswith('.'):
        summary += '.'
        
    # Takeaways from other sentences
    takeaways = []
    for s in sentences[3:7]:
        if len(s) > 10:
            takeaways.append(s + ".")
            
    if not takeaways:
        takeaways = [
            "This text presents key educational insights on this topic.",
            "Detailed analysis indicates consistent variables and inputs.",
            "Synthesizing these elements improves student conceptual retention."
        ]
        
    # Extract terms (find words starting with capital letters, length > 4)
    words = re.findall(r'\b[A-Z][a-z]{4,}\b', clean_text)
    unique_words = list(dict.fromkeys(words))[:3] # top 3 unique capitalized words
    
    vocab = []
    for w in unique_words:
        vocab.append(KeyTerm(term=w, definition=f"A key topic or proper noun highlighted within the source material."))
        
    if not vocab:
        vocab = [
            KeyTerm(term="Analysis", definition="Detailed examination of elements or structure."),
            KeyTerm(term="Synthesis", definition="The combination of ideas to form a theory or system.")
        ]
        
    return SummarizeResponse(
        summary=summary,
        key_points=takeaways,
        vocabulary=vocab,
        success=False,
        error="Gemini API Key missing. Running in Smart Demo Mode."
    )

def generate_dynamic_recommend(goal: str) -> RecommendResponse:
    """Generates a personalized study roadmap dynamically based on the goal."""
    key = clean_key(goal)
    
    # Check database
    for db_g, db_resp in ROADMAPS_DB.items():
        if db_g in key or key in db_g:
            return RecommendResponse(
                goal=goal,
                overview=db_resp.overview,
                roadmap=db_resp.roadmap,
                tips=db_resp.tips,
                success=False,
                error="Gemini API Key missing. Running in Smart Demo Mode."
            )
            
    # Generate dynamic steps
    roadmap = [
        RoadmapStep(
            step_number=1,
            title=f"Core Foundations of {goal}",
            description=f"Establish the basic rules, terminology, and tools necessary to study {goal}.",
            estimated_duration="Week 1-2",
            resources=[f"Introduction to {goal} (Video series)", f"{goal} beginner reading material"]
        ),
        RoadmapStep(
            step_number=2,
            title=f"Hands-on Practice & Implementation",
            description=f"Build small tasks, solve basic problems, and apply concepts related to {goal}.",
            estimated_duration="Week 3-4",
            resources=[f"Interactive exercises for {goal}", f"Practice problem sheets"]
        ),
        RoadmapStep(
            step_number=3,
            title=f"Advanced Application & Mastery",
            description=f"Tackle complex scenarios, optimization techniques, and project integrations for {goal}.",
            estimated_duration="Week 5+",
            resources=[f"Advanced guide to {goal}", f"{goal} capstone project ideas"]
        )
    ]
    
    tips = [
        f"Dedicate at least 30 minutes a day to practicing concepts around {goal}.",
        f"Document your progress and share challenges with classmates or online forums.",
        f"Always begin with simple inputs before stepping up to higher complexity."
    ]
    
    return RecommendResponse(
        goal=goal,
        overview=f"Mastering '{goal}' requires dedication and a structured pathway. This curriculum outline will guide you from ground foundations to advanced execution stages.",
        roadmap=roadmap,
        tips=tips,
        success=False,
        error="Gemini API Key missing. Running in Smart Demo Mode."
    )
