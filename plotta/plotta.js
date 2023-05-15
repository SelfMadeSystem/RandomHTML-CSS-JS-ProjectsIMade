var myPlot;

function reload() {
    $("#myChart").remove();
    var container = $("#chartContainer").append('<canvas id="myChart"></canvas>');
    var width = container.width() * 0.5- 5, height = container.height() * 0.5 - 5;
    $('#myChart').attr({ width: width, height: height }).css({ width: width*2, height: height*2 });
    var canvas = document.getElementById('myChart');
    // ctx.attr({ width: 100, height: 100 }).css({ width: 200, height: 200 });
    let formula = document.getElementById("formula").value;
    // let zoomX = 1 / parseFloat(document.getElementById("zoomX").value);
    // let zoomY = 1 / parseFloat(document.getElementById("zoomY").value);
    // let camX = parseFloat(document.getElementById("cameraX").value);
    // let camY = parseFloat(document.getElementById("cameraY").value);

    const data = {
        linedatas: [
            {
                id: "line1",
                type: "func",
                legend: "graph",
                color: "#55A8DE",
                visible: true,
                func: new Function("x", "return " + formula),
                dotNum: 1000,
            },
            {
                id: "xAxis",
                type: "func",
                legend: "x",
                color: "#0005",
                visible: true,
                func: (x) => 0,
                dotNum: 1000,
            },
            {
                id: "yAxis",
                type: "func",
                legend: "y",
                color: "#0005",
                visible: true,
                func: (x) => x*1000000000000000,
                dotNum: 1000,
            }
        ],
    };

    myPlot = new Plotta(canvas, data);
    // myPlot.ShowBorder(false);
    myPlot.SetTitle(" ");
}

reload();
