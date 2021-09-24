let menulateral = document.querySelector(".menulateral");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");

closeBtn.addEventListener("click", () => {
    menulateral.classList.toggle("open");
    menuBtnChange(); //calling the function(optional)
});

searchBtn.addEventListener("click", () => { // menulateral open when you click on the search iocn
    menulateral.classList.toggle("open");
    menuBtnChange(); //calling the function(optional)
});

// following are the code to change menulateral button(optional)
function menuBtnChange() {
    if (menulateral.classList.contains("open")) {
        closeBtn.classList.replace("bx-menu", "bx-menu-alt-right"); //replacing the iocns class
    } else {
        closeBtn.classList.replace("bx-menu-alt-right", "bx-menu"); //replacing the iocns class
    }
}

am4core.ready(function() {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var data = [{
        "country": "Dummy",
        "disabled": true,
        "litres": 1000,
        "color": am4core.color("#dadada"),
        "opacity": 0.3,
        "strokeDasharray": "4,4"
    }, {
        "country": "Cardiologia",
        "litres": 501
    }, {
        "country": "Dermatologia",
        "litres": 301
    }, {
        "country": "Obstetrícia",
        "litres": 201
    }, {
        "country": "Urologia",
        "litres": 165
    }, {
        "country": "Oncologia",
        "litres": 139
    }, {
        "country": "Neurologia",
        "litres": 128
    }];


    // cointainer to hold both charts
    var container = am4core.create("pizza", am4core.Container);
    container.width = am4core.percent(100);
    container.height = am4core.percent(100);
    container.layout = "horizontal";

    container.events.on("maxsizechanged", function() {
        chart1.zIndex = 0;
        separatorLine.zIndex = 1;
        dragText.zIndex = 2;
        chart2.zIndex = 3;
    })

    var chart1 = container.createChild(am4charts.PieChart);
    chart1.fontSize = 11;
    chart1.hiddenState.properties.opacity = 0; // this makes initial fade in effect
    chart1.data = data;
    chart1.radius = am4core.percent(70);
    chart1.innerRadius = am4core.percent(40);
    chart1.zIndex = 1;

    var series1 = chart1.series.push(new am4charts.PieSeries());
    series1.dataFields.value = "litres";
    series1.dataFields.category = "country";
    series1.colors.step = 2;
    series1.alignLabels = false;
    series1.labels.template.bent = true;
    series1.labels.template.radius = 3;
    series1.labels.template.padding(0, 0, 0, 0);

    var sliceTemplate1 = series1.slices.template;
    sliceTemplate1.cornerRadius = 5;
    sliceTemplate1.draggable = true;
    sliceTemplate1.inert = true;
    sliceTemplate1.propertyFields.fill = "color";
    sliceTemplate1.propertyFields.fillOpacity = "opacity";
    sliceTemplate1.propertyFields.stroke = "color";
    sliceTemplate1.propertyFields.strokeDasharray = "strokeDasharray";
    sliceTemplate1.strokeWidth = 1;
    sliceTemplate1.strokeOpacity = 1;

    var zIndex = 5;

    sliceTemplate1.events.on("down", function(event) {
        event.target.toFront();
        // also put chart to front
        var series = event.target.dataItem.component;
        series.chart.zIndex = zIndex++;
    })

    series1.ticks.template.disabled = true;

    sliceTemplate1.states.getKey("active").properties.shiftRadius = 0;

    sliceTemplate1.events.on("dragstop", function(event) {
        handleDragStop(event);
    })

    // separator line and text

    var separatorLine = container.createChild(am4core.Line);
    separatorLine.x1 = 0;
    separatorLine.y2 = 500;
    separatorLine.strokeWidth = 3;
    separatorLine.stroke = am4core.color("#dadada");
    separatorLine.valign = "middle";
    separatorLine.strokeDasharray = "5,5";


    var dragText = container.createChild(am4core.Label);
    dragText.text = "Arraste as bordas para personalizar o gráfico.";
    dragText.rotation = 90;
    dragText.valign = "middle";
    dragText.align = "center";
    dragText.paddingBottom = 5;

    // second chart
    var chart2 = container.createChild(am4charts.PieChart);
    chart2.hiddenState.properties.opacity = 0; // this makes initial fade in effect
    chart2.fontSize = 11;
    chart2.radius = am4core.percent(70);
    chart2.data = data;
    chart2.innerRadius = am4core.percent(40);
    chart2.zIndex = 1;

    var series2 = chart2.series.push(new am4charts.PieSeries());
    series2.dataFields.value = "litres";
    series2.dataFields.category = "country";
    series2.colors.step = 2;

    series2.alignLabels = false;
    series2.labels.template.bent = true;
    series2.labels.template.radius = 3;
    series2.labels.template.padding(0, 0, 0, 0);
    series2.labels.template.propertyFields.disabled = "disabled";

    var sliceTemplate2 = series2.slices.template;
    sliceTemplate2.copyFrom(sliceTemplate1);

    series2.ticks.template.disabled = true;

    function handleDragStop(event) {
        var targetSlice = event.target;
        var dataItem1;
        var dataItem2;
        var slice1;
        var slice2;


        if (series1.slices.indexOf(targetSlice) != -1) {
            slice1 = targetSlice;
            slice2 = series2.dataItems.getIndex(targetSlice.dataItem.index).slice;
        } else if (series2.slices.indexOf(targetSlice) != -1) {
            slice1 = series1.dataItems.getIndex(targetSlice.dataItem.index).slice;
            slice2 = targetSlice;
        }


        dataItem1 = slice1.dataItem;
        dataItem2 = slice2.dataItem;

        var series1Center = am4core.utils.spritePointToSvg({ x: 0, y: 0 }, series1.slicesContainer);
        var series2Center = am4core.utils.spritePointToSvg({ x: 0, y: 0 }, series2.slicesContainer);

        var series1CenterConverted = am4core.utils.svgPointToSprite(series1Center, series2.slicesContainer);
        var series2CenterConverted = am4core.utils.svgPointToSprite(series2Center, series1.slicesContainer);

        // tooltipY and tooltipY are in the middle of the slice, so we use them to avoid extra calculations
        var targetSlicePoint = am4core.utils.spritePointToSvg({ x: targetSlice.tooltipX, y: targetSlice.tooltipY }, targetSlice);

        if (targetSlice == slice1) {
            if (targetSlicePoint.x > container.pixelWidth / 2) {
                var value = dataItem1.value;

                dataItem1.hide();

                var animation = slice1.animate([{ property: "x", to: series2CenterConverted.x }, { property: "y", to: series2CenterConverted.y }], 400);
                animation.events.on("animationprogress", function(event) {
                    slice1.hideTooltip();
                })

                slice2.x = 0;
                slice2.y = 0;

                dataItem2.show();
            } else {
                slice1.animate([{ property: "x", to: 0 }, { property: "y", to: 0 }], 400);
            }
        }
        if (targetSlice == slice2) {
            if (targetSlicePoint.x < container.pixelWidth / 2) {

                var value = dataItem2.value;

                dataItem2.hide();

                var animation = slice2.animate([{ property: "x", to: series1CenterConverted.x }, { property: "y", to: series1CenterConverted.y }], 400);
                animation.events.on("animationprogress", function(event) {
                    slice2.hideTooltip();
                })

                slice1.x = 0;
                slice1.y = 0;
                dataItem1.show();
            } else {
                slice2.animate([{ property: "x", to: 0 }, { property: "y", to: 0 }], 400);
            }
        }

        toggleDummySlice(series1);
        toggleDummySlice(series2);

        series1.hideTooltip();
        series2.hideTooltip();
    }

    function toggleDummySlice(series) {
        var show = true;
        for (var i = 1; i < series.dataItems.length; i++) {
            var dataItem = series.dataItems.getIndex(i);
            if (dataItem.slice.visible && !dataItem.slice.isHiding) {
                show = false;
            }
        }

        var dummySlice = series.dataItems.getIndex(0);
        if (show) {
            dummySlice.show();
        } else {
            dummySlice.hide();
        }
    }

    series2.events.on("datavalidated", function() {

        var dummyDataItem = series2.dataItems.getIndex(0);
        dummyDataItem.show(0);
        dummyDataItem.slice.draggable = false;
        dummyDataItem.slice.tooltipText = undefined;

        for (var i = 1; i < series2.dataItems.length; i++) {
            series2.dataItems.getIndex(i).hide(0);
        }
    })

    series1.events.on("datavalidated", function() {
        var dummyDataItem = series1.dataItems.getIndex(0);
        dummyDataItem.hide(0);
        dummyDataItem.slice.draggable = false;
        dummyDataItem.slice.tooltipText = undefined;
    })

}); // end am4core.ready()

//Segundo Grafico

am4core.ready(function() {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.padding(40, 40, 40, 40);

    chart.numberFormatter.bigNumberPrefixes = [
        { "number": 1e+3, "suffix": "K" },
        { "number": 1e+6, "suffix": "M" },
        { "number": 1e+9, "suffix": "B" }
    ];

    var label = chart.plotContainer.createChild(am4core.Label);
    label.x = am4core.percent(97);
    label.y = am4core.percent(95);
    label.horizontalCenter = "right";
    label.verticalCenter = "middle";
    label.dx = -15;
    label.fontSize = 50;

    var playButton = chart.plotContainer.createChild(am4core.PlayButton);
    playButton.x = am4core.percent(97);
    playButton.y = am4core.percent(95);
    playButton.dy = -2;
    playButton.verticalCenter = "middle";
    playButton.events.on("toggled", function(event) {
        if (event.target.isActive) {
            play();
        } else {
            stop();
        }
    })

    var stepDuration = 4000;

    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "network";
    categoryAxis.renderer.minGridDistance = 1;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.disabled = true;

    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.rangeChangeEasing = am4core.ease.linear;
    valueAxis.rangeChangeDuration = stepDuration;
    valueAxis.extraMax = 0.1;

    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryY = "network";
    series.dataFields.valueX = "MAU";
    series.tooltipText = "{valueX.value}"
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusBottomRight = 5;
    series.columns.template.column.cornerRadiusTopRight = 5;
    series.interpolationDuration = stepDuration;
    series.interpolationEasing = am4core.ease.linear;

    var labelBullet = series.bullets.push(new am4charts.LabelBullet())
    labelBullet.label.horizontalCenter = "right";
    labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}";
    labelBullet.label.textAlign = "end";
    labelBullet.label.dx = -10;

    chart.zoomOutButton.disabled = true;

    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    series.columns.template.adapter.add("fill", function(fill, target) {
        return chart.colors.getIndex(target.dataItem.index);
    });

    var year = 2016;
    label.text = year.toString();

    var interval;

    function play() {
        interval = setInterval(function() {
            nextYear();
        }, stepDuration)
        nextYear();
    }

    function stop() {
        if (interval) {
            clearInterval(interval);
        }
    }

    function nextYear() {
        year++

        if (year > 2021) {
            year = 2016;
        }

        var newData = allData[year];
        var itemsWithNonZero = 0;
        for (var i = 0; i < chart.data.length; i++) {
            chart.data[i].MAU = newData[i].MAU;
            if (chart.data[i].MAU > 0) {
                itemsWithNonZero++;
            }
        }

        if (year == 2003) {
            series.interpolationDuration = stepDuration / 4;
            valueAxis.rangeChangeDuration = stepDuration / 4;
        } else {
            series.interpolationDuration = stepDuration;
            valueAxis.rangeChangeDuration = stepDuration;
        }

        chart.invalidateRawData();
        label.text = year.toString();

        categoryAxis.zoom({ start: 0, end: itemsWithNonZero / categoryAxis.dataItems.length });
    }


    categoryAxis.sortBySeries = series;

    var allData = {
        "2016": [{
                "network": "Cardiologia",
                "MAU": 34
            },
            {
                "network": "Dermatologia",
                "MAU": 17
            },
            {
                "network": "Obstetrícia",
                "MAU": 20
            },

            {
                "network": "Urologia",
                "MAU": 80
            },
            {
                "network": "Oncologia",
                "MAU": 54
            },
            {
                "network": "Neurologia",
                "MAU": 34
            },
        ],
        "2017": [{
                "network": "Cardiologia",
                "MAU": 102
            },
            {
                "network": "Dermatologia",
                "MAU": 274
            },
            {
                "network": "Obstetrícia",
                "MAU": 300
            },

            {
                "network": "Urologia",
                "MAU": 300
            },
            {
                "network": "Oncologia",
                "MAU": 90
            },
            {
                "network": "Neurologia",
                "MAU": 80
            },
        ],
        "2018": [{
                "network": "Cardiologia",
                "MAU": 343
            },
            {
                "network": "Dermatologia",
                "MAU": 263
            },
            {
                "network": "Obstetrícia",
                "MAU": 211
            },

            {
                "network": "Urologia",
                "MAU": 203
            },
            {
                "network": "Oncologia",
                "MAU": 182
            },
            {
                "network": "Neurologia",
                "MAU": 200
            },
        ],
        "2019": [{
                "network": "Cardiologia",
                "MAU": 432
            },
            {
                "network": "Dermatologia",
                "MAU": 343
            },
            {
                "network": "Obstetrícia",
                "MAU": 464
            },

            {
                "network": "Urologia",
                "MAU": 403
            },
            {
                "network": "Oncologia",
                "MAU": 234
            },
            {
                "network": "Neurologia",
                "MAU": 432
            },

        ],


    }

    chart.data = JSON.parse(JSON.stringify(allData[year]));
    categoryAxis.zoom({ start: 0, end: 1 / chart.data.length });

    series.events.on("inited", function() {
        setTimeout(function() {
            playButton.isActive = true; // this starts interval
        }, 2000)
    })

}); // end am4core.ready()