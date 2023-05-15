var parameters = {
    data: [
        {
            fn: "Math.sin(x)",
            color: "red"
        },
    ],
    grid: true,
    yAxis: { domain: [-1, 1] },
    xAxis: { domain: [0, 2 * Math.PI] },
};

var g;

function plot() {
    var f = document.querySelector("#function").value;
    var xMin = document.querySelector("#xMin").value;
    var xMax = document.querySelector("#xMax").value;
    var yMin = document.querySelector("#yMin").value;
    var yMax = document.querySelector("#yMax").value;
    var color = document.querySelector("#color").value;

    parameters.data[0].fn = f;

    parameters.xAxis.domain = [xMin, xMax];
    parameters.yAxis.domain = [yMin, yMax];
    parameters.data[0].color = color;

    parameters.target = document.createElement("div");

    g = functionPlot(parameters);

    document.querySelector("#myFunction").innerHTML = '';

    document.querySelector("#myFunction").appendChild(parameters.target)
}
