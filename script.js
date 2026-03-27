let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let points = [];
let opticalImage = new Image();
// SAR IMAGE PREVIEW
document.getElementById("sarInput").addEventListener("change", function(event) {

    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            document.getElementById("sarPreview").src = e.target.result;
        }

        reader.readAsDataURL(file);
    }
});


// OPTICAL IMAGE PREVIEW
document.getElementById("opticalInput").addEventListener("change", function(event) {

    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            document.getElementById("opticalPreview").src = e.target.result;
        }

        reader.readAsDataURL(file);
    }
});

// Load Optical Image to Canvas
document.getElementById("opticalInput").addEventListener("change", function(e) {
    let file = e.target.files[0];
    let reader = new FileReader();

    reader.onload = function(event) {
        opticalImage.src = event.target.result;
        document.getElementById("opticalPreview").src = event.target.result;
    };

    reader.readAsDataURL(file);
});

opticalImage.onload = function() {
    canvas.width = 400;
    canvas.height = 300;
    ctx.drawImage(opticalImage, 0, 0, canvas.width, canvas.height);
};

// Click to select buildings
canvas.addEventListener("click", function(e) {
    let x = e.offsetX;
    let y = e.offsetY;

    points.push({x, y});

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
});

// Height Estimation
function estimateHeights() {
    let table = document.getElementById("resultTable");
    table.innerHTML = `
    <tr>
        <th>Building</th>
        <th>Predicted Height</th>
        <th>Actual Height</th>
        <th>Error</th>
    </tr>`;

    let predicted = [];
    let actual = [];

    for (let i = 0; i < points.length; i++) {

        // Simulated Fusion Logic
        let sarFactor = Math.random() * 50;
        let opticalFactor = Math.random() * 50;

        let height = (opticalFactor * 0.6 + sarFactor * 0.4).toFixed(2);

        let actualHeight = (Math.random() * 50).toFixed(2);

        let error = Math.abs(height - actualHeight).toFixed(2);

        predicted.push(height);
        actual.push(actualHeight);

        table.innerHTML += `
        <tr>
            <td>B${i+1}</td>
            <td>${height}</td>
            <td>${actualHeight}</td>
            <td>${error}</td>
        </tr>`;
    }

    calculateMetrics(predicted, actual);
    drawChart(predicted, actual);
}

// Metrics
function calculateMetrics(pred, act) {
    let mae = 0;
    let rmse = 0;

    for (let i = 0; i < pred.length; i++) {
        let diff = pred[i] - act[i];
        mae += Math.abs(diff);
        rmse += diff * diff;
    }

    mae = (mae / pred.length).toFixed(2);
    rmse = Math.sqrt(rmse / pred.length).toFixed(2);

    document.getElementById("metrics").innerText =
        `MAE: ${mae} | RMSE: ${rmse}`;
}

// Chart
function drawChart(pred, act) {
    new Chart(document.getElementById("chart"), {
        type: 'bar',
        data: {
            labels: pred.map((_, i) => "B" + (i+1)),
            datasets: [
                {
                    label: "Predicted",
                    data: pred
                },
                {
                    label: "Actual",
                    data: act
                }
            ]
        }
    });
}