$(document).ready(reload);

var chart;
function reload() {
    $("#myChart").remove();
    $("#chartContainer").append('<canvas id="myChart"></canvas>');
    var ctx = $("#myChart");
    // ctx.attr({ width: 100, height: 100 }).css({ width: 200, height: 200 });
    let formula = document.getElementById("formula").value;
    let zoomX = 1/parseFloat(document.getElementById("zoomX").value);
    let zoomY = 1/parseFloat(document.getElementById("zoomY").value);
    let camX = parseFloat(document.getElementById("cameraX").value);
    let camY = parseFloat(document.getElementById("cameraY").value);

    let data = [];

    let formulaFunction = new Function("x", "return " + formula);

    for (
        let x = -4 * zoomX + camX - 5;
        x < 4 * zoomX + camX + 5;
        x += zoomX * 0.01
    ) {
        let result = formulaFunction(x);
        if (data.length > 0) console.log(data[data.length - 1].y - result)
        if (!isNaN(result)) data.push({ x: x, y: result });
    }

    chart = new Chart(ctx, {
        // The type of chart we want to create
        type: "line",

        // The data for our dataset
        data: {
            datasets: [
                {
                    label: "Base",
                    data: data,
                    fill: false,
                    pointBorderColor: 'black',
                    fillColor: "black",
                    backgroundColor: "black",
                    strokeColor: "red",
                    borderColor: 'red',
                }
            ],
        },

        // Configuration options go here
        options: {
            aspectRatio: 1,
            scales: {
                xAxes: [
                    {
                        type: "linear",

                        ticks: {
                            min: -4 * zoomX + camX,
                            max: 4 * zoomX + camX,
                        },
                    },
                ],
                yAxes: [
                    {
                        type: "linear",

                        ticks: {
                            min: -4 * zoomY + camY,
                            max: 4 * zoomY + camY,
                        },
                    },
                ],
            },
            legend: {
                display: false,
            },

            tooltips: {
                callbacks: {
                    label: function (tooltipItem) {
                        return tooltipItem.yLabel;
                    },
                },
            },
        },
    });
}
