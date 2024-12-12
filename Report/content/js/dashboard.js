/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.657608695652174, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.625, 500, 1500, "https://dubarter.com/en/collections/kitchen"], "isController": false}, {"data": [0.4, 500, 1500, "https://dubarter.com/en/cart"], "isController": false}, {"data": [0.45, 500, 1500, "https://dubarter.com/en/search?q=%D8%AA%D9%8A%D8%B4%D9%8A%D8%B1%D8%AA"], "isController": false}, {"data": [0.7, 500, 1500, "https://dubarter.com/en/collections/fashion"], "isController": false}, {"data": [0.95, 500, 1500, "https://dubarter.com/wpm@ddf235a8wb39e0e63pa2ae5d69mfd50b9e6/custom/web-pixel-shopify-custom-pixel@0220/sandbox/modern/en/collections/babies-kids"], "isController": false}, {"data": [0.5625, 500, 1500, "https://dubarter.com/en/collections/beauty-health"], "isController": false}, {"data": [0.35, 500, 1500, "https://dubarter.com/en/collections/seasonal-offers"], "isController": false}, {"data": [0.9, 500, 1500, "https://dubarter.com/wpm@ddf235a8wb39e0e63pa2ae5d69mfd50b9e6/custom/web-pixel-shopify-custom-pixel@0220/sandbox/modern/en/collections/beauty-health"], "isController": false}, {"data": [0.9625, 500, 1500, "https://dubarter.com/wpm@ddf235a8wb39e0e63pa2ae5d69mfd50b9e6/custom/web-pixel-shopify-custom-pixel@0220/sandbox/modern/en/collections/fashion"], "isController": false}, {"data": [0.8, 500, 1500, "https://dubarter.com/wpm@ddf235a8wb39e0e63pa2ae5d69mfd50b9e6/custom/web-pixel-shopify-custom-pixel@0220/sandbox/modern/en/collections/kitchen"], "isController": false}, {"data": [0.8125, 500, 1500, "https://dubarter.com/wpm@ddf235a8wb39e0e63pa2ae5d69mfd50b9e6/custom/web-pixel-shopify-custom-pixel@0220/sandbox/modern/en/collections/household"], "isController": false}, {"data": [0.5875, 500, 1500, "https://dubarter.com/en/collections/household"], "isController": false}, {"data": [0.6125, 500, 1500, "https://dubarter.com/en/products/%D8%AA%D9%8A%D8%B4%D9%8A%D8%B1%D8%AA-%D9%82%D8%B7%D9%86-%D9%85%D9%86-%D9%86%D9%8A%D9%85-%D8%A7%D8%AA-%D9%84%D9%84%D8%A3%D9%88%D9%84%D8%A7%D8%AF?_pos=2&_sid=7693cbd13&_ss=r"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.9, 500, 1500, "https://dubarter.com/wpm@ddf235a8wb39e0e63pa2ae5d69mfd50b9e6/custom/web-pixel-shopify-custom-pixel@0231/sandbox/modern/checkouts/cn/Z2NwLWV1cm9wZS13ZXN0MTowMUpFQlY0QTlYSFFERk1CMFczU0pCVjEwNQ/stock-problems"], "isController": false}, {"data": [0.7875, 500, 1500, "https://dubarter.com/en/collections/babies-kids"], "isController": false}, {"data": [0.6875, 500, 1500, "https://dubarter.com/wpm@ddf235a8wb39e0e63pa2ae5d69mfd50b9e6/custom/web-pixel-shopify-custom-pixel@0220/sandbox/modern/en/cart"], "isController": false}, {"data": [0.825, 500, 1500, "https://dubarter.com/wpm@ddf235a8wb39e0e63pa2ae5d69mfd50b9e6/custom/web-pixel-shopify-custom-pixel@0220/sandbox/modern/en/search?q=%D8%AA%D9%8A%D8%B4%D9%8A%D8%B1%D8%AA"], "isController": false}, {"data": [0.7125, 500, 1500, "https://dubarter.com/en/cart-0"], "isController": false}, {"data": [0.925, 500, 1500, "https://dubarter.com/wpm@ddf235a8wb39e0e63pa2ae5d69mfd50b9e6/custom/web-pixel-shopify-custom-pixel@0220/sandbox/modern/en/collections/seasonal-offers"], "isController": false}, {"data": [0.8625, 500, 1500, "https://dubarter.com/wpm@ddf235a8wb39e0e63pa2ae5d69mfd50b9e6/custom/web-pixel-shopify-custom-pixel@0220/sandbox/modern/en/products/%D8%AA%D9%8A%D8%B4%D9%8A%D8%B1%D8%AA-%D9%82%D8%B7%D9%86-%D9%85%D9%86-%D9%86%D9%8A%D9%85-%D8%A7%D8%AA-%D9%84%D9%84%D8%A3%D9%88%D9%84%D8%A7%D8%AF?_pos=2&_sid=7693cbd13&_ss=r"], "isController": false}, {"data": [0.3125, 500, 1500, "https://dubarter.com/en/cart-1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 880, 0, 0.0, 839.8477272727284, 80, 8631, 500.0, 1753.3999999999996, 2621.8999999999996, 5078.949999999993, 4.4956218773308265, 481.8109060577866, 6.348110242354888], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://dubarter.com/en/collections/kitchen", 40, 0, 0.0, 813.0750000000002, 266, 2611, 585.5, 1808.6999999999998, 2429.849999999998, 2611.0, 0.3754458419373006, 83.39172787216069, 0.40991059695888865], "isController": false}, {"data": ["https://dubarter.com/en/cart", 80, 0, 0.0, 2264.8499999999995, 198, 8631, 1263.0, 5042.500000000001, 7113.350000000003, 8631.0, 0.696512215082972, 128.91107083039492, 1.7861729265701998], "isController": false}, {"data": ["https://dubarter.com/en/search?q=%D8%AA%D9%8A%D8%B4%D9%8A%D8%B1%D8%AA", 40, 0, 0.0, 1118.75, 288, 2448, 1170.0, 1746.3, 2331.9999999999973, 2448.0, 0.3682461357171133, 59.513834906626585, 0.41139997974646253], "isController": false}, {"data": ["https://dubarter.com/en/collections/fashion", 40, 0, 0.0, 623.125, 249, 1869, 517.5, 1426.9999999999995, 1712.0999999999995, 1869.0, 0.3689968819763473, 85.37202308882678, 0.4028696426265198], "isController": false}, {"data": ["https://dubarter.com/wpm@ddf235a8wb39e0e63pa2ae5d69mfd50b9e6/custom/web-pixel-shopify-custom-pixel@0220/sandbox/modern/en/collections/babies-kids", 40, 0, 0.0, 374.3250000000001, 244, 1189, 305.5, 514.3, 876.0499999999985, 1189.0, 0.38854944777409733, 1.0380227507843842, 0.45646971257054597], "isController": false}, {"data": ["https://dubarter.com/en/collections/beauty-health", 40, 0, 0.0, 963.0500000000001, 228, 3178, 937.5, 1586.9999999999995, 2707.3499999999967, 3178.0, 0.36811396808451896, 82.3171045161832, 0.40406259778027276], "isController": false}, {"data": ["https://dubarter.com/en/collections/seasonal-offers", 40, 0, 0.0, 1451.8249999999998, 542, 2845, 1239.5, 2612.7, 2724.2499999999995, 2845.0, 0.38371881085540516, 80.11465135848451, 0.19598138484118838], "isController": false}, {"data": ["https://dubarter.com/wpm@ddf235a8wb39e0e63pa2ae5d69mfd50b9e6/custom/web-pixel-shopify-custom-pixel@0220/sandbox/modern/en/collections/beauty-health", 40, 0, 0.0, 377.00000000000006, 85, 984, 363.0, 753.5999999999999, 883.9499999999995, 984.0, 0.3690547584997924, 23.042342906652213, 0.4342880703049315], "isController": false}, {"data": ["https://dubarter.com/wpm@ddf235a8wb39e0e63pa2ae5d69mfd50b9e6/custom/web-pixel-shopify-custom-pixel@0220/sandbox/modern/en/collections/fashion", 40, 0, 0.0, 242.87499999999994, 80, 778, 180.5, 457.0999999999999, 732.7499999999999, 778.0, 0.37016472330186934, 23.111427895960578, 0.43342529613177866], "isController": false}, {"data": ["https://dubarter.com/wpm@ddf235a8wb39e0e63pa2ae5d69mfd50b9e6/custom/web-pixel-shopify-custom-pixel@0220/sandbox/modern/en/collections/kitchen", 40, 0, 0.0, 485.0, 242, 2137, 408.5, 721.8, 1092.999999999999, 2137.0, 0.376725875416753, 1.0051572447917647, 0.4411077388912958], "isController": false}, {"data": ["https://dubarter.com/wpm@ddf235a8wb39e0e63pa2ae5d69mfd50b9e6/custom/web-pixel-shopify-custom-pixel@0220/sandbox/modern/en/collections/household", 40, 0, 0.0, 546.825, 245, 1765, 327.0, 1100.6, 1219.4499999999998, 1765.0, 0.38317112422407845, 1.0226814854107595, 0.44940285175109207], "isController": false}, {"data": ["https://dubarter.com/en/collections/household", 40, 0, 0.0, 956.9250000000002, 233, 2681, 790.5, 1910.6999999999996, 2158.5499999999997, 2681.0, 0.3823653118189118, 84.21686543190552, 0.41821205980193477], "isController": false}, {"data": ["https://dubarter.com/en/products/%D8%AA%D9%8A%D8%B4%D9%8A%D8%B1%D8%AA-%D9%82%D8%B7%D9%86-%D9%85%D9%86-%D9%86%D9%8A%D9%85-%D8%A7%D8%AA-%D9%84%D9%84%D8%A3%D9%88%D9%84%D8%A7%D8%AF?_pos=2&_sid=7693cbd13&_ss=r", 40, 0, 0.0, 851.7249999999999, 260, 2590, 711.0, 1792.5, 2407.4999999999977, 2590.0, 0.373660660071556, 61.18855690501545, 0.4667109221010939], "isController": false}, {"data": ["Test", 40, 0, 0.0, 16421.25, 9523, 23871, 14732.5, 23579.8, 23789.6, 23871.0, 0.33981819726446355, 741.4605080813016, 9.17973727805624], "isController": true}, {"data": ["https://dubarter.com/wpm@ddf235a8wb39e0e63pa2ae5d69mfd50b9e6/custom/web-pixel-shopify-custom-pixel@0231/sandbox/modern/checkouts/cn/Z2NwLWV1cm9wZS13ZXN0MTowMUpFQlY0QTlYSFFERk1CMFczU0pCVjEwNQ/stock-problems", 40, 0, 0.0, 402.45, 246, 951, 311.5, 656.1999999999999, 719.1499999999997, 951.0, 0.3872704212534007, 1.0530900095123297, 1.0888198660044341], "isController": false}, {"data": ["https://dubarter.com/en/collections/babies-kids", 40, 0, 0.0, 466.7000000000001, 292, 828, 455.5, 624.8, 728.2499999999999, 828.0, 0.38795402744774743, 67.59660396258668, 0.42508244023083264], "isController": false}, {"data": ["https://dubarter.com/wpm@ddf235a8wb39e0e63pa2ae5d69mfd50b9e6/custom/web-pixel-shopify-custom-pixel@0220/sandbox/modern/en/cart", 40, 0, 0.0, 863.65, 87, 5379, 258.5, 2539.5, 2569.55, 5379.0, 0.37724104759838917, 23.548968466774493, 0.4361849612856375], "isController": false}, {"data": ["https://dubarter.com/wpm@ddf235a8wb39e0e63pa2ae5d69mfd50b9e6/custom/web-pixel-shopify-custom-pixel@0220/sandbox/modern/en/search?q=%D8%AA%D9%8A%D8%B4%D9%8A%D8%B1%D8%AA", 40, 0, 0.0, 491.8499999999999, 252, 1166, 445.5, 894.1999999999998, 1062.3999999999994, 1166.0, 0.37187162991335393, 0.9923234655646871, 0.4448659635193931], "isController": false}, {"data": ["https://dubarter.com/en/cart-0", 40, 0, 0.0, 648.4999999999999, 335, 1402, 555.0, 1124.7, 1330.2499999999998, 1402.0, 0.37651665615557667, 1.6554047495222945, 0.4905011907339251], "isController": false}, {"data": ["https://dubarter.com/wpm@ddf235a8wb39e0e63pa2ae5d69mfd50b9e6/custom/web-pixel-shopify-custom-pixel@0220/sandbox/modern/en/collections/seasonal-offers", 40, 0, 0.0, 412.8499999999999, 241, 1064, 360.5, 839.6999999999997, 945.6499999999997, 1064.0, 0.38840607855512943, 1.0367009606981599, 0.4578184929844152], "isController": false}, {"data": ["https://dubarter.com/wpm@ddf235a8wb39e0e63pa2ae5d69mfd50b9e6/custom/web-pixel-shopify-custom-pixel@0220/sandbox/modern/en/products/%D8%AA%D9%8A%D8%B4%D9%8A%D8%B1%D8%AA-%D9%82%D8%B7%D9%86-%D9%85%D9%86-%D9%86%D9%8A%D9%85-%D8%A7%D8%AA-%D9%84%D9%84%D8%A3%D9%88%D9%84%D8%A7%D8%AF?_pos=2&_sid=7693cbd13&_ss=r", 40, 0, 0.0, 449.5499999999999, 246, 1212, 301.0, 1026.3999999999996, 1193.6999999999998, 1212.0, 0.37477747587370003, 1.0008644769511852, 0.4977513351447578], "isController": false}, {"data": ["https://dubarter.com/en/cart-1", 40, 0, 0.0, 1406.8999999999996, 597, 3355, 771.5, 2867.1, 3043.0999999999995, 3355.0, 0.3782434374763598, 64.86284870794407, 1.039800074703079], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 880, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
