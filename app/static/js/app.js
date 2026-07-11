/* ==========================================================================
   EDUGENIE CLIENT SPA APPLICATION SCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
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
