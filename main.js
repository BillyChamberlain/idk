// --- CONFIGURATION ---
const OWNER = 'YOUR_GITHUB_USERNAME'; // Change to your GitHub username
const REPO = 'YOUR_REPO_NAME';             // Change to your repository name
const FILE_PATH = 'database.json';         // The file where data will save

// --- ELEMENT SELECTION ---
const parentDiv = document.getElementById('tests');
const phoneInput = document.getElementById('phonenumber'); 
const submit = document.getElementById('submit');
const answercanvas = document.getElementById('answerz');

// --- 1. "NO" BUTTON LOGIC ---
// Only runs on the page that has the #tests element (e.g., index.html)
if (parentDiv) {
    const lolno = document.createElement('div');
    let width = 25; let height = 12; let font_size = 30;
    let pos_bottom = 5; let pos_left = 60; let rounded = 10;

    lolno.textContent = "No";
    Object.assign(lolno.style, {
        display: 'flex', position: 'absolute', bottom: `${pos_bottom}%`, left: `${pos_left}%`,
        width: `${width}%`, height: `${height}%`, backgroundColor: '#fa1900', color: 'rgb(14, 14, 14)',
        'justify-content': 'center', 'align-items': 'center', 'font-size': `${font_size}px`,
        'border-radius': `${rounded}px`, transition: 'transform 0.3s ease-in-out'
    });
    lolno.className = "no";
    parentDiv.appendChild(lolno);

    lolno.addEventListener("click", function() {
        width /= 1.3; height /= 1.3; font_size /= 1.3;
        pos_left = getRand(-20, 100); pos_bottom = getRand(-30, 100);
        lolno.style.width = `${width}%`; lolno.style.height = `${height}%`;
        lolno.style.fontSize = `${font_size}px`; lolno.style.left = `${pos_left}%`; lolno.style.bottom = `${pos_bottom}%`;
    });
}

// --- 2. INPUT PAGE: GITHUB API SUBMIT LOGIC ---
// Only runs on the page containing the submit button and phone input
if (submit && phoneInput) {
    submit.addEventListener("click", async function(e) {
        e.preventDefault(); // Prevent page reload
        
        let currentText = phoneInput.value.trim();
        if (currentText === "") return;

        // Prompt for the token so it's never stored inside your public repository
        let token = prompt("Enter your GitHub Personal Access Token to submit:");
        if (!token) {
            alert("Token required to save data!");
            return;
        }

        const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;

        try {
            let currentContent = [];
            let sha = null;

            // Step A: Attempt to fetch the existing JSON file
            const getResponse = await fetch(url, {
                headers: { 'Authorization': `token ${token}` }
            });

            if (getResponse.ok) {
                const fileData = await getResponse.json();
                sha = fileData.sha; // Save the unique file tracking ID
                const decodedText = atob(fileData.content); // Decode base64 to plain text
                currentContent = JSON.parse(decodedText);
            } else if (getResponse.status !== 404) {
                throw new Error("Failed to read the existing repository file.");
            }

            // Step B: Push the new phone number into the array
            currentContent.push(currentText);

            // Step C: Convert array to JSON string and encode into Base64 for the API
            const updatedJsonString = JSON.stringify(currentContent, null, 2);
            const encodedContent = btoa(updatedJsonString);

            // Step D: Put the updated file back into your GitHub repository
            const putResponse = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Database updated via web form: added ${currentText}`,
                    content: encodedContent,
                    sha: sha // Required by GitHub if the file already exists
                })
            });

            if (putResponse.ok) {
                alert("Successfully saved straight to GitHub!");
                phoneInput.value = ""; // Empty the text box
            } else {
                const errData = await putResponse.json();
                console.error(errData);
                alert("GitHub Error: " + errData.message);
            }

        } catch (error) {
            console.error("Network/API Error:", error);
            alert("An error occurred while communicating with GitHub.");
        }
    });
}

// --- 3. ANSWERS PAGE: RENDER DATA LOGIC ---
// Only runs on the page featuring the #answerz element
if (answercanvas) {
    // Read the static JSON file directly from your local repository folder
    fetch(`./${FILE_PATH}`)
        .then(response => {
            if (!response.ok) throw new Error("Could not find the database file yet.");
            return response.json();
        })
        .then(savedNumbers => {
            // Loop through each number in the array and render a paragraph tag
            savedNumbers.forEach(function(number) {
                const ansnumber = document.createElement('p');
                ansnumber.textContent = number;
                answercanvas.appendChild(ansnumber);
            });
        })
        .catch(err => {
            console.warn("Database empty or not yet generated on GitHub:", err.message);
            answercanvas.innerHTML = "<p style='color:gray;'>No submitted entries found yet.</p>";
        });
}

// --- UTILITY FUNCTIONS ---
function getRand(min, max) {
  min = Math.ceil(min); max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}