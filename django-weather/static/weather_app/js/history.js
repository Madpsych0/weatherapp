import { Chart } from "@/components/ui/chart"
// History page specific JavaScript
document.addEventListener("DOMContentLoaded", () => {
  initializeDatePicker()
  initializeChart()
  initializeTable()
})

function initializeDatePicker() {
  const dateInput = document.getElementById("date")

  if (dateInput) {
    // Set max date to today
    const today = new Date().toISOString().split("T")[0]
    dateInput.max = today

    // Set default date to yesterday if no date is selected
    if (!dateInput.value) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      dateInput.value = yesterday.toISOString().split("T")[0]
    }

    // Add date validation
    dateInput.addEventListener("change", function () {
      const selectedDate = new Date(this.value)
      const today = new Date()
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(today.getDate() - 7)

      if (selectedDate > today) {
        showNotification("Cannot select future dates", "error")
        this.value = today.toISOString().split("T")[0]
      } else if (selectedDate < sevenDaysAgo) {
        showNotification("Historical data is only available for the past 7 days", "warning")
      }
    })
  }
}

function initializeChart() {
  const canvas = document.getElementById("tempChart")

  if (canvas && typeof Chart !== "undefined") {
    // Get historical data from the hidden div
    const historyDataDiv = document.querySelector(".history-data-json")
    if (!historyDataDiv) return

    try {
      const historyData = JSON.parse(historyDataDiv.textContent)
      const hourlyData = historyData.forecast.forecastday[0].hour

      // Prepare chart data
      const labels = hourlyData.map((hour) => hour.time.slice(-5))
      const temperatures = hourlyData.map((hour) => hour.temp_c)
      const humidity = hourlyData.map((hour) => hour.humidity)

      const ctx = canvas.getContext("2d")

      new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Temperature (°C)",
              data: temperatures,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.4,
              yAxisID: "y",
            },
            {
              label: "Humidity (%)",
              data: humidity,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.4,
              yAxisID: "y1",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: "index",
            intersect: false,
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: "Time",
              },
            },
            y: {
              type: "linear",
              display: true,
              position: "left",
              title: {
                display: true,
                text: "Temperature (°C)",
              },
            },
            y1: {
              type: "linear",
              display: true,
              position: "right",
              title: {
                display: true,
                text: "Humidity (%)",
              },
              grid: {
                drawOnChartArea: false,
              },
            },
          },
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                afterLabel: (context) => {
                  const hourData = hourlyData[context.dataIndex]
                  return [
                    `Condition: ${hourData.condition.text}`,
                    `Wind: ${hourData.wind_kph} km/h`,
                    `Precipitation: ${hourData.precip_mm} mm`,
                  ]
                },
              },
            },
          },
        },
      })
    } catch (error) {
      console.error("Error creating chart:", error)
    }
  }
}

function initializeTable() {
  const table = document.querySelector(".hourly-table table")

  if (table) {
    // Add sorting functionality
    const headers = table.querySelectorAll("th")

    headers.forEach((header, index) => {
      if (index > 1) {
        // Skip time and condition columns
        header.style.cursor = "pointer"
        header.title = "Click to sort"

        header.addEventListener("click", () => {
          sortTable(table, index)
        })
      }
    })

    // Add row highlighting
    const rows = table.querySelectorAll("tbody tr")
    rows.forEach((row) => {
      row.addEventListener("mouseenter", function () {
        this.style.backgroundColor = "#e3f2fd"
      })

      row.addEventListener("mouseleave", function () {
        this.style.backgroundColor = ""
      })
    })

    // Add temperature color coding
    const tempCells = table.querySelectorAll("tbody tr td:nth-child(3)")
    tempCells.forEach((cell) => {
      const temp = Number.parseFloat(cell.textContent)
      if (temp >= 30) {
        cell.style.color = "#e74c3c"
        cell.style.fontWeight = "bold"
      } else if (temp >= 20) {
        cell.style.color = "#f39c12"
        cell.style.fontWeight = "bold"
      } else if (temp <= 0) {
        cell.style.color = "#3498db"
        cell.style.fontWeight = "bold"
      }
    })
  }
}

function sortTable(table, columnIndex) {
  const tbody = table.querySelector("tbody")
  const rows = Array.from(tbody.querySelectorAll("tr"))

  // Determine sort direction
  const isAscending = table.dataset.sortDirection !== "asc"
  table.dataset.sortDirection = isAscending ? "asc" : "desc"

  // Sort rows
  rows.sort((a, b) => {
    const aValue = Number.parseFloat(a.cells[columnIndex].textContent) || 0
    const bValue = Number.parseFloat(b.cells[columnIndex].textContent) || 0

    return isAscending ? aValue - bValue : bValue - aValue
  })

  // Clear and re-append sorted rows
  tbody.innerHTML = ""
  rows.forEach((row) => tbody.appendChild(row))

  // Update header indicators
  const headers = table.querySelectorAll("th")
  headers.forEach((header, index) => {
    header.classList.remove("sort-asc", "sort-desc")
    if (index === columnIndex) {
      header.classList.add(isAscending ? "sort-asc" : "sort-desc")
    }
  })
}

function showNotification(message, type) {
  // Simple notification function implementation
  alert(`${type.toUpperCase()}: ${message}`)
}

// Add history-specific CSS
const style = document.createElement("style")
style.textContent = `
    .sort-asc::after {
        content: ' ↑';
        color: #3498db;
    }
    
    .sort-desc::after {
        content: ' ↓';
        color: #3498db;
    }
    
    .hourly-table tbody tr {
        transition: background-color 0.3s ease;
    }
    
    .small-icon {
        transition: transform 0.3s ease;
    }
    
    .small-icon:hover {
        transform: scale(1.2);
    }
`
document.head.appendChild(style)
