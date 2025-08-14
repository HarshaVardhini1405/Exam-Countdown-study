mermaid.initialize({ startOnLoad: false });

let plans = JSON.parse(localStorage.getItem("plans")) || [];

document.getElementById("addPlan").addEventListener("click", () => {
    const examName = document.getElementById("examName").value.trim();
    const examDate = document.getElementById("examDate").value;
    const topics = document.getElementById("topics").value.split(",");
    const subTopics = document.getElementById("subTopics").value.split(",");
    const timePerTopic = parseInt(document.getElementById("timePerTopic").value) || 0;
    const timePerSub = parseInt(document.getElementById("timePerSub").value) || 0;

    if (!examName || !examDate || topics.length === 0) {
        alert("Please fill all required fields!");
        return;
    }

    const newPlan = {
        examName,
        examDate,
        topics,
        subTopics,
        timePerTopic,
        timePerSub
    };

    plans.push(newPlan);
    localStorage.setItem("plans", JSON.stringify(plans));
    generateFlowchart(newPlan);
    alert("Plan Added Successfully!");
});

document.getElementById("showPlans").addEventListener("click", () => {
    displayPlans();
});

function generateFlowchart(plan) {
    let chart = `flowchart TD\n`;

    // Subtopics on top
    plan.subTopics.forEach((sub, i) => {
        chart += `S${i}["${sub.trim()} - ${plan.timePerSub} min"]:::subtopic\n`;
    });

    // Main topic
    chart += `Main["${plan.topics.join(", ")} - ${plan.timePerTopic} min"]:::mainTopic\n`;

    // Connect all subtopics to main topic
    plan.subTopics.forEach((_, i) => {
        chart += `S${i} --> Main\n`;
    });

    // Styles
    chart += `
        classDef subtopic fill:#ffcccc,stroke:#ff0000,stroke-width:2px,color:#000;
        classDef mainTopic fill:#ccffcc,stroke:#008000,stroke-width:2px,color:#000;
    `;

    document.getElementById("flowchart").textContent = chart;
    mermaid.init(undefined, document.querySelectorAll(".mermaid"));
}

function displayPlans() {
    const listContainer = document.getElementById("plansList");
    listContainer.innerHTML = "";

    plans.forEach((plan, index) => {
        const card = document.createElement("div");
        card.classList.add("plan-card");
        card.innerHTML = `
            <strong>${plan.examName}</strong> - ${plan.examDate}<br>
            Topics: ${plan.topics.join(", ")}<br>
            Subtopics: ${plan.subTopics.join(", ")}<br>
            <button class="delete-btn" onclick="deletePlan(${index})">Delete</button>
        `;
        listContainer.appendChild(card);
    });
}

function deletePlan(index) {
    plans.splice(index, 1);
    localStorage.setItem("plans", JSON.stringify(plans));
    displayPlans();
}
