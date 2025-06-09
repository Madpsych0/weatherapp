// Global JavaScript functionality
document.addEventListener("DOMContentLoaded", () => {
  // Initialize common functionality
  initializeSearch()
  initializeAnimations()
  initializeTooltips()
})

function initializeSearch() {
  const searchForm = document.getElementById("search-form")
  const locationInput = document.getElementById("location")

  if (searchForm && locationInput) {
    // Add search suggestions functionality
    locationInput.addEventListener("input", function () {
      const query = this.value.trim()
      if (query.length > 2) {
        // You can implement search suggestions here
        // For now, we'll just add a simple validation
        this.style.borderColor = "#28a745"
      } else {
        this.style.borderColor = ""
      }
    })

    // Handle form submission
    searchForm.addEventListener("submit", (e) => {
      const location = locationInput.value.trim()
      if (!location) {
        e.preventDefault()
        showNotification("Please enter a location", "error")
      }
    })
  }
}

function initializeAnimations() {
  // Add entrance animations to cards
  const cards = document.querySelectorAll(".forecast-card, .detail-item, .hour-item")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = "fadeIn 0.5s ease-out forwards"
        }
      })
    },
    {
      threshold: 0.1,
    },
  )

  cards.forEach((card) => {
    observer.observe(card)
  })
}

function initializeTooltips() {
  // Add tooltips to weather icons
  const weatherIcons = document.querySelectorAll('img[alt*="weather"], img[alt*="condition"]')

  weatherIcons.forEach((icon) => {
    icon.addEventListener("mouseenter", function () {
      showTooltip(this, this.alt)
    })

    icon.addEventListener("mouseleave", () => {
      hideTooltip()
    })
  })
}

function showTooltip(element, text) {
  const tooltip = document.createElement("div")
  tooltip.className = "tooltip"
  tooltip.textContent = text
  tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        z-index: 1000;
        pointer-events: none;
        white-space: nowrap;
    `

  document.body.appendChild(tooltip)

  const rect = element.getBoundingClientRect()
  tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px"
  tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + "px"

  // Store reference for cleanup
  element._tooltip = tooltip
}

function hideTooltip() {
  const tooltips = document.querySelectorAll(".tooltip")
  tooltips.forEach((tooltip) => tooltip.remove())
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem;
        border-radius: 4px;
        color: white;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `

  // Set background color based on type
  const colors = {
    success: "#28a745",
    error: "#dc3545",
    warning: "#ffc107",
    info: "#17a2b8",
  }

  notification.style.backgroundColor = colors[type] || colors.info

  document.body.appendChild(notification)

  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out"
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

// Utility function to format dates
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Utility function to get weather icon class
function getWeatherIconClass(condition) {
  const iconMap = {
    sunny: "fas fa-sun",
    clear: "fas fa-sun",
    "partly cloudy": "fas fa-cloud-sun",
    cloudy: "fas fa-cloud",
    overcast: "fas fa-cloud",
    rain: "fas fa-cloud-rain",
    snow: "fas fa-snowflake",
    thunderstorm: "fas fa-bolt",
    fog: "fas fa-smog",
    mist: "fas fa-smog",
  }

  const lowerCondition = condition.toLowerCase()
  for (const key in iconMap) {
    if (lowerCondition.includes(key)) {
      return iconMap[key]
    }
  }

  return "fas fa-cloud" // Default icon
}

// Add CSS animations
const style = document.createElement("style")
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`
document.head.appendChild(style)
