// Quarterly Sales Revenue and Transactions Chart
function createQuarterlySalesChart() {
  fetch("File Json/Quarterly_Sales_revenue.json")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(function (data) {
      var arrRevenue = [];
      var arrQuarters = [];
      var arrTransactions = [];

      data.forEach((element) => {
        arrRevenue.push(element.TOTAL_REVENUE);
        arrTransactions.push(element.TOTAL_TRANSACTIONS);
        arrQuarters.push(
          `Q${element.EXTRACTED_QUARTER} ${element.EXTRACTED_YEAR}`
        );
      });

      var objChart = {
        total_revenue: arrRevenue,
        quarters: arrQuarters,
        total_transactions: arrTransactions,
      };

      createQuarterlyChart(objChart, "line");
    })
    .catch(function (error) {
      console.error("Error during fetch operation:", error);
    });
}

function createQuarterlyChart(arrPassed, type) {
  const ctx = document.getElementById("chartQuarterly");
  new Chart(ctx, {
    type: type,
    data: {
      labels: arrPassed.quarters,
      datasets: [
        {
          label: "Total Revenue",
          data: arrPassed.total_revenue,
          borderColor: "rgb(0, 0, 255)",
          backgroundColor: "rgba(0, 0, 255, 0.1)",
          borderWidth: 1,
          fill: false,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "QUARTERLY SALES REVENUE",
        },
        legend: {
          onClick: (e) => e.stopPropagation(),
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = "Total Revenue: " + context.raw || "";
              let index = context.dataIndex;
              let totalTransactions = arrPassed.total_transactions[index];
              return [label, "Total Transactions: " + totalTransactions];
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 1400000000,
          title: {
            display: true,
            text: "Total Revenue (in USD)",
          },
        },
      },
    },
  });
}

createQuarterlySalesChart();

//MONTHLY AVERAGE REVENUE
const chart2 = document.getElementById("chartMonthly").getContext("2d");
let chartMonthlyRevenue = null;

fetch("File Json/Monthly_Average_Revenue.json")
  .then(function (response) {
    if (response.ok == true) {
      return response.json();
    }
  })
  .then(function (data) {
    const arrYearMonth = data.map((item) => item.YEAR_MONTH);
    const arrAverageSalePrice = data.map((item) => item.AVERAGE_SALE_PRICE);

    const objChart = {
      Year_month: arrYearMonth,
      Avg_salesprice: arrAverageSalePrice,
    };
    window.dataMonthlyRevenue = objChart;
    generateMonthlyRevenueFilter(objChart);
    createMonthlyRevenueChart(objChart, "line");
  });

function showHideMonthly(e) {
  var modal = document.getElementById("insightMonthlyModal");
  modal.style.display = "block";

  const startSelect = document.getElementById("start-month");
  const endSelect = document.getElementById("end-month");

  const from = startSelect.value;
  const to = endSelect.value;

  const fromIndex = window.dataMonthlyRevenue.Year_month.indexOf(from);
  const toIndex = window.dataMonthlyRevenue.Year_month.indexOf(to);

  const yearMonth = window.dataMonthlyRevenue.Year_month.slice(
    fromIndex,
    toIndex + 1
  );

  let paragraphInsights = document.getElementsByClassName(
    "insightLineChartFilter"
  );
  let flagAll =
    yearMonth.length == window.dataMonthlyRevenue.Year_month.length
      ? true
      : false;

  Array.from(paragraphInsights).forEach((element) => {
    if (
      yearMonth.includes(element.dataset.rangeFrom) &&
      yearMonth.includes(element.dataset.rangeTo)
    ) {
      if (
        (flagAll &&
          element.dataset.rangeFrom == yearMonth[0] &&
          element.dataset.rangeTo == yearMonth[yearMonth.length - 1]) ||
        !flagAll
      ) {
        element.classList.remove("hidden");
        element.classList.add("show");
      } else {
        element.classList.remove("show");
        element.classList.add("hidden");
      }
    } else {
      element.classList.remove("show");
      element.classList.add("hidden");
    }
  });
}

function closeMonthlyModal() {
  var modal = document.getElementById("insightMonthlyModal");
  modal.style.display = "none";
}

function generateMonthlyRevenueFilter(dataMonthlyRevenuePassed) {
  const startSelect = document.getElementById("start-month");
  const endSelect = document.getElementById("end-month");

  dataMonthlyRevenuePassed.Year_month.forEach((Yearmonth, index) => {
    const startOption = document.createElement("option");
    startOption.value = Yearmonth;
    startOption.textContent = Yearmonth;
    startSelect.appendChild(startOption);

    if (index === dataMonthlyRevenuePassed.Year_month.length - 1) {
      const endOption = document.createElement("option");
      endOption.value = Yearmonth;
      endOption.textContent = Yearmonth;
      endSelect.appendChild(endOption);
      endOption.selected = true;
    }
  });

  startSelect.addEventListener("change", function (event) {
    const selectedStartMonth = event.target.value;
    const startIndex =
      window.dataMonthlyRevenue.Year_month.indexOf(selectedStartMonth);

    endSelect.innerHTML = "";

    for (
      let i = startIndex;
      i < window.dataMonthlyRevenue.Year_month.length;
      i++
    ) {
      const endOption = document.createElement("option");
      endOption.value = window.dataMonthlyRevenue.Year_month[i];
      endOption.textContent = window.dataMonthlyRevenue.Year_month[i];
      endSelect.appendChild(endOption);

      if (i === window.dataMonthlyRevenue.Year_month.length - 1) {
        endOption.selected = true;
      }
    }
  });

  startSelect.dispatchEvent(new Event("change"));
}

function updateMonthlyRevenueChart(e) {
  e.preventDefault();

  const startSelect = document.getElementById("start-month");
  const endSelect = document.getElementById("end-month");

  const from = startSelect.value;
  const to = endSelect.value;

  const fromIndex = window.dataMonthlyRevenue.Year_month.indexOf(from);
  const toIndex = window.dataMonthlyRevenue.Year_month.indexOf(to);

  const yearMonth = window.dataMonthlyRevenue.Year_month.slice(
    fromIndex,
    toIndex + 1
  );
  const averageRevenue = window.dataMonthlyRevenue.Avg_salesprice.slice(
    fromIndex,
    toIndex + 1
  );
  let paragraphInsights = document.getElementsByClassName(
    "insightLineChartFilter"
  );
  let flagAll =
    yearMonth.length == window.dataMonthlyRevenue.Year_month.length
      ? true
      : false;

  Array.from(paragraphInsights).forEach((element) => {
    if (
      yearMonth.includes(element.dataset.rangeFrom) &&
      yearMonth.includes(element.dataset.rangeTo)
    ) {
      if (
        (flagAll &&
          element.dataset.rangeFrom == yearMonth[0] &&
          element.dataset.rangeTo == yearMonth[yearMonth.length - 1]) ||
        !flagAll
      ) {
        element.classList.remove("hidden");
        element.classList.add("show");
      } else {
        element.classList.remove("show");
        element.classList.add("hidden");
      }
    } else {
      element.classList.remove("show");
      element.classList.add("hidden");
    }
  });
  chartMonthlyRevenue.data.labels = yearMonth;
  chartMonthlyRevenue.data.datasets[0].data = averageRevenue;
  chartMonthlyRevenue.update();
}

function createMonthlyRevenueChart(arrLine3, type) {
  chartMonthlyRevenue = new Chart(chart2, {
    type: type,
    data: {
      labels: arrLine3.Year_month,
      datasets: [
        {
          label: "Average Revenue",
          data: arrLine3.Avg_salesprice,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "MONTHLY AVERAGE REVENUE",
        },
        legend: {
          onClick: (e) => e.stopPropagation(),
        },
      },
      scales: {
        y: {
          display: true,
          title: {
            display: true,
            text: "Average Revenue (in USD)",
          },
          ticks: {
            beginAtZero: true,
            max: 800000,
            min: 500000,
          },
        },
      },
    },
  });
}

// SALES COMPOSITION
const chartCompo = document.getElementById("chartComposition");

fetch("File Json/Sales_Composition_building_classification (1).json")
  .then(function (response) {
    if (response.ok == true) {
      return response.json();
    }
  })
  .then(function (data) {
    var arrBuildingClass = [];
    var arrTotalRevenue = [];
    var arrPercentage = [];
    data.forEach((element) => {
      arrTotalRevenue.push(element.TOTAL_REVENUE);
      arrBuildingClass.push(element.BUILDING_CLASS);
      arrPercentage.push(element.PERCENTAGE_REVENUE);
    });
    var objChart = {
      total_revenue: arrTotalRevenue,
      building_class: arrBuildingClass,
      percentage_revenue: arrPercentage,
    };
    createSalesCompositionChart(objChart, "pie");
  });

function createSalesCompositionChart(arrPassed, type) {
  new Chart(chartCompo, {
    type: type,
    data: {
      labels: arrPassed.building_class,
      datasets: [
        {
          label: "Total Revenue",
          data: arrPassed.total_revenue,
          backgroundColor: [
            "rgb(285, 109, 132)",
            "rgb(89, 89, 119)",
            "rgb(169, 76, 119)",
            "rgb(17, 78, 117)",
            "rgb(241, 186, 124)",
          ],
          hoverOffset: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "SALES COMPOSITION BUILDING CLASSIFICATION",
        },
        legend: {
          position: "bottom",
          onHover: null,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const index = context.dataIndex;
              const label = context.label;
              const totalRevenues = arrPassed.total_revenue[index];
              const percentages = arrPassed.percentage_revenue[index];
              return `${label}: ${"$" + totalRevenues} (${percentages}%)`;
            },
          },
        },
      },
    },
  });
}

//Total Revenue By Tax Class
const chartTax = document.getElementById("chartTaxClass");
let dataTaxClass = null;
let chartTaxClass = null;

fetch("File Json/Total_Revenue_by_Tax_Class.json")
  .then(function (response) {
    if (response.ok == true) {
      return response.json();
    }
  })
  .then(function (data) {
    var arrTotalRevenue = [];
    var arrTaxClass = [];
    data.forEach((element) => {
      arrTotalRevenue.push(element.TOTAL_REVENUE);
      arrTaxClass.push(element.TAX_CLASS);
    });
    var objChart = {
      tax_class: arrTaxClass,
      total_revenue: arrTotalRevenue,
    };

    window.dataTaxClass = objChart;
    generateTaxClassOptions(objChart);

    createTaxClassChart(objChart, "bar");
  });

function generateTaxClassOptions(dataTaxClassPassed) {
  const select = document.getElementById("chart-4-taxclass");

  const option = document.createElement("option");
  option.value = "All";
  option.textContent = "All";
  select.appendChild(option);

  let arrDataTaxClassPassed = dataTaxClassPassed.tax_class;

  arrDataTaxClassPassed.forEach((taxClass, index) => {
    const option = document.createElement("option");
    option.value = taxClass;
    option.textContent = taxClass;
    select.appendChild(option);
  });
  select.addEventListener("change", updateTaxClassChart);

  select.getElementsByTagName("option")[0].selected = "selected";
}

function updateTaxClassChart(e) {
  e.preventDefault();
  const select = document.getElementById("chart-4-taxclass");
  const selectedTaxClass = select.value;
  const taxClassIndex = window.dataTaxClass.tax_class.indexOf(selectedTaxClass);
  var arrTaxClassFiltered = window.dataTaxClass.tax_class.filter(
    (taxClass, index) => index == taxClassIndex
  );
  var arrTotalRevenueFiltered = window.dataTaxClass.total_revenue.filter(
    (taxClass, index) => index == taxClassIndex
  );
  if (selectedTaxClass == "All") {
    arrTaxClassFiltered = window.dataTaxClass.tax_class;
    arrTotalRevenueFiltered = window.dataTaxClass.total_revenue;
  }
  window.chartTaxClass.data.labels = arrTaxClassFiltered;
  window.chartTaxClass.data.datasets[0].data = arrTotalRevenueFiltered;
  window.chartTaxClass.data.datasets[0].label = "Monthly Average Revenue";
  window.chartTaxClass.update();
}

function sortTaxClass(strSort) {
  let arrTaxClassChart = window.chartTaxClass.data.labels;
  let arrTotalRevenueChart = window.chartTaxClass.data.datasets[0].data;
  let arrSort = [];

  arrTotalRevenueChart.forEach((element, index) => {
    arrSort.push({ taxClass: arrTaxClassChart[index], totalRevenue: element });
  });

  if (strSort == "asc") {
    arrSort.sort((a, b) => a.totalRevenue - b.totalRevenue);
  } else {
    arrSort.sort((a, b) => b.totalRevenue - a.totalRevenue);
  }

  arrTaxClassChart = [];
  arrTotalRevenueChart = [];
  arrSort.forEach((element) => {
    arrTaxClassChart.push(element.taxClass);
    arrTotalRevenueChart.push(element.totalRevenue);
  });

  window.chartTaxClass.data.labels = arrTaxClassChart;
  window.chartTaxClass.data.datasets[0].data = arrTotalRevenueChart;
  window.chartTaxClass.update();
}

function createTaxClassChart(arrPassedTax, type) {
  window.chartTaxClass = new Chart(chartTax, {
    type: type,
    data: {
      labels: arrPassedTax.tax_class,
      datasets: [
        {
          label: "Total Revenue",
          data: arrPassedTax.total_revenue,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          onClick: (e) => e.stopPropagation(),
        },
        title: {
          display: true,
          text: "TOTAL REVENUE BY TAX CLASS",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Total Revenue (in USD)",
          },
        },
      },
    },
  });
}

//TOP 10 TOTAL REVENUE AND TRANSACTION BY NEIGHBORHOOD CHART
const chartNeighbour = document.getElementById("megachart");

fetch("File Json/Total_revenue_transaction_neighborhood.json")
  .then(function (response) {
    if (response.ok == true) {
      return response.json();
    }
  })
  .then(function (data) {
    var arrTotalSales = [];
    var arrTotalTransaction = [];
    var arrNeighborhood = [];
    data.forEach((element) => {
      arrTotalSales.push(element.TOTAL_SALES);
      arrTotalTransaction.push(element.TOTAL_TRANSACTIONS);
      arrNeighborhood.push(element.NEIGHBORHOOD);
    });
    var objChart = {
      total_sales: arrTotalSales,
      total_transaction: arrTotalTransaction,
      neighborhood: arrNeighborhood,
    };
    createNeighbourhoodChart(objChart, "bar");
  });

let neighborhoodChartSort; // Deklarasikan variabel chart di luar fungsi agar dapat diakses di luar fungsi juga

function createNeighbourhoodChart(arrPassed, type) {
  const updateChartScales = (chart, isMobile) => {
    if (isMobile) {
      chart.options.scales.sales.display = false;
      chart.options.scales.transaction.display = false;
      chart.options.scales.x.ticks.maxRotation = 90;
      chart.options.scales.x.ticks.minRotation = 90;
    } else {
      chart.options.scales.sales.display = true;
      chart.options.scales.transaction.display = true;
      chart.options.scales.x.ticks.maxRotation = 45;
      chart.options.scales.x.ticks.minRotation = 45;
    }
    chart.update();
  };

  const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

  neighborhoodChartSort = new Chart(chartNeighbour, {
    type: type,
    data: {
      labels: arrPassed.neighborhood,
      datasets: [
        {
          label: "Total Revenue",
          data: arrPassed.total_sales,
          borderWidth: 1,
          yAxisID: "sales",
        },
        {
          label: "Transactions",
          data: arrPassed.total_transaction,
          borderWidth: 1,
          yAxisID: "transaction",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "TOP 10 TOTAL REVENUE & TRANSACTION BY NEIGHBORHOOD",
        },
      },
      layout: {
        padding: {},
      },
      scales: {
        x: {
          ticks: {
            maxRotation: isMobile() ? 90 : 45,
            minRotation: isMobile() ? 90 : 45,
          },
        },
        y: {
          beginAtZero: true,
          display: false,
        },
        sales: {
          type: "linear",
          position: "left",
          min: 0,
          max: 400000000,
          display: !isMobile(),
          title: {
            display: true,
            text: "Total Revenue (in USD)",
          },
        },
        transaction: {
          type: "linear",
          position: "right",
          min: 0,
          max: 1000,
          display: !isMobile(),
          title: {
            display: true,
            text: "Total Transactions",
          },
        },
      },
    },
  });

  // Event listener untuk mendeteksi perubahan ukuran layar
  window.addEventListener("resize", () => {
    updateChartScales(neighborhoodChartSort, isMobile());
  });

  // Panggil fungsi updateChartScales untuk mengatur skala grafik pada saat pertama kali dimuat
  updateChartScales(neighborhoodChartSort, isMobile());
}

document
  .getElementById("sortAscRevenue")
  .addEventListener("click", function () {
    sortChartNeighbourhood("asc", "revenue");
  });

document
  .getElementById("sortDescRevenue")
  .addEventListener("click", function () {
    sortChartNeighbourhood("desc", "revenue");
  });

document
  .getElementById("sortAscTransactions")
  .addEventListener("click", function () {
    sortChartNeighbourhood("asc", "transaction");
  });

document
  .getElementById("sortDescTransactions")
  .addEventListener("click", function () {
    sortChartNeighbourhood("desc", "transaction");
  });

function sortChartNeighbourhood(strSort, sortBy) {
  let arrNeighborhoodChart = neighborhoodChartSort.data.labels;
  let arrTotalSalesChart = neighborhoodChartSort.data.datasets[0].data;
  let arrTotalTransactionChart = neighborhoodChartSort.data.datasets[1].data;
  let arrSort = [];

  arrTotalSalesChart.forEach((element, index) => {
    arrSort.push({
      neighborhood: arrNeighborhoodChart[index],
      totalSales: element,
      totalTransaction: arrTotalTransactionChart[index],
    });
  });

  if (sortBy === "revenue") {
    if (strSort === "asc") {
      arrSort.sort((a, b) => a.totalSales - b.totalSales);
    } else {
      arrSort.sort((a, b) => b.totalSales - a.totalSales);
    }
  } else if (sortBy === "transaction") {
    if (strSort === "asc") {
      arrSort.sort((a, b) => a.totalTransaction - b.totalTransaction);
    } else {
      arrSort.sort((a, b) => b.totalTransaction - a.totalTransaction);
    }
  }

  arrNeighborhoodChart = [];
  arrTotalSalesChart = [];
  arrTotalTransactionChart = [];
  arrSort.forEach((element) => {
    arrNeighborhoodChart.push(element.neighborhood);
    arrTotalSalesChart.push(element.totalSales);
    arrTotalTransactionChart.push(element.totalTransaction);
  });

  neighborhoodChartSort.data.labels = arrNeighborhoodChart;
  neighborhoodChartSort.data.datasets[0].data = arrTotalSalesChart;
  neighborhoodChartSort.data.datasets[1].data = arrTotalTransactionChart;
  neighborhoodChartSort.update();
}

//Total Revenue By Building Category
const chartBuildingCategory = document.getElementById("megachart_2");

fetch("File Json/Total_Revenue_building_Category.json")
  .then(function (response) {
    if (response.ok == true) {
      return response.json();
    }
  })
  .then(function (data) {
    var arrTotalRevenue = [];
    var arrBuildingClassCategory = [];
    var arrRevenuePercentage = [];
    data.sort((a, b) => b.Total_Revenue - a.Total_Revenue);
    var slicedData = data.slice(0, 10);

    slicedData.forEach((element) => {
      arrTotalRevenue.push(element.Total_Revenue);
      arrBuildingClassCategory.push(element.BUILDING_CLASS_CATEGORY);
      arrRevenuePercentage.push(element.Revenue_Percentage);
    });

    var objChart = {
      building_class_category: arrBuildingClassCategory,
      total_revenue: arrTotalRevenue,
      revenue_percentage: arrRevenuePercentage,
    };

    createChartBuildingCategory(objChart, "bar");
  });

function createChartBuildingCategory(arrPassedBuildingCategory, type) {
  window.megaChart2Sort = new Chart(chartBuildingCategory, {
    type: "bar",
    data: {
      labels: arrPassedBuildingCategory.building_class_category,
      datasets: [
        {
          label: "Total Revenue",
          data: arrPassedBuildingCategory.total_revenue,
          borderColor: "rgb(0, 0, 255)",
          backgroundColor: "rgba(47, 160, 215, 0.5)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      scales: {
        x: {
          type: "logarithmic",
          title: {
            display: true,
            text: "Total Revenue (in USD)",
          },
          display: function (context) {
            return context.chart.width >= 600;
          },
        },
        y: {
          display: function (context) {
            return context.chart.width >= 600;
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: "TOP 10 TOTAL REVENUE BY BUILDING CATEGORY",
        },
        legend: {
          onClick: (e) => e.stopPropagation(),
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem, data) {
              const formatterUsd = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              });
              let sum = 0;
              tooltipItem.dataset.data.forEach((data) => {
                sum += parseInt(data);
              });
              let percentage =
                ((parseInt(tooltipItem.parsed.x) * 100) / sum).toFixed(3) + "%";
              var priceValue = formatterUsd.format(tooltipItem.parsed.x);
              var strDisplay = `Total Revenue: ${priceValue} | Percentage: (${percentage})`;

              return strDisplay;
            },
          },
        },
      },
    },
  });
}

document.getElementById("sortChartAsc").addEventListener("click", function () {
  sortChartDataRevenue("asc", "revenue");
});

document.getElementById("sortChartDesc").addEventListener("click", function () {
  sortChartDataRevenue("desc", "revenue");
});

function sortChartDataRevenue(strSort, sortBy) {
  let arrBuildingClassCategoryChart = window.megaChart2Sort.data.labels;
  let arrTotalRevenueChart = window.megaChart2Sort.data.datasets[0].data;
  let arrSort = [];

  arrTotalRevenueChart.forEach((element, index) => {
    arrSort.push({
      building_class_category: arrBuildingClassCategoryChart[index],
      totalRevenue: element,
    });
  });

  if (sortBy === "revenue") {
    if (strSort === "asc") {
      arrSort.sort((a, b) => a.totalRevenue - b.totalRevenue);
    } else {
      arrSort.sort((a, b) => b.totalRevenue - a.totalRevenue);
    }
  }

  arrBuildingClassCategoryChart = [];
  arrTotalRevenueChart = [];
  arrSort.forEach((element) => {
    arrBuildingClassCategoryChart.push(element.building_class_category);
    arrTotalRevenueChart.push(element.totalRevenue);
  });

  window.megaChart2Sort.data.labels = arrBuildingClassCategoryChart;
  window.megaChart2Sort.data.datasets[0].data = arrTotalRevenueChart;
  window.megaChart2Sort.update();
}
