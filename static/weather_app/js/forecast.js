// Forecast page specific JavaScript
document.addEventListener("DOMContentLoaded", () => {
  initializeForecastAnimations()
  initializeHourlyScroll()
  initializeAlerts()
})

function initializeForecastAnimations() {
  // Animate forecast cards on scroll
  const forecastDays = document.querySelectorAll(".forecast-day")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.animation = "slideInUp 0.6s ease-out forwards"
          }, index * 100)
        }
      })
    },
    {
      threshold: 0.1,
    },
  )

  forecastDays.forEach((day) => {
    day.style.opacity = "0"
    day.style.transform = "translateY(20px)"
    observer.observe(day)
  })

  // Animate temperature bars
  const tempBars = document.querySelectorAll(".temp-fill")
  tempBars.forEach((bar, index) => {
    setTimeout(() => {
      bar.style.animation = "fillBar 1s ease-out forwards"
    }, index * 200)
  })
}

function initializeHourlyScroll() {
  const hourlyScrolls = document.querySelectorAll(".hourly-scroll")

  hourlyScrolls.forEach((scroll) => {
    // Add smooth scrolling
    scroll.style.scrollBehavior = "smooth"

    // Add scroll indicators
    const scrollIndicator = document.createElement("div")
    scrollIndicator.className = "scroll-indicator"
    scrollIndicator.innerHTML = '<i class="fas fa-chevron-right"></i>'
    scrollIndicator.style.cssText = `
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(52, 152, 219, 0.8);
            color: white;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: opacity 0.3s ease;
        `

    scroll.parentElement.style.position = "relative"
    scroll.parentElement.appendChild(scrollIndicator)

    // Handle scroll indicator click
    scrollIndicator.addEventListener("click", () => {
      scroll.scrollLeft += 200
    })

    // Hide indicator when at end
    scroll.addEventListener("scroll", () => {
      const isAtEnd = scroll.scrollLeft >= scroll.scrollWidth - scroll.clientWidth - 10
      scrollIndicator.style.opacity = isAtEnd ? "0" : "1"
    })
  })
}

function initializeAlerts() {
  const alertItems = document.querySelectorAll(".alert-item")

  alertItems.forEach((alert, index) => {
    // Add blinking animation for urgent alerts
    if (alert.textContent.toLowerCase().includes("warning") || alert.textContent.toLowerCase().includes("urgent")) {
      alert.style.animation = "blink 2s ease-in-out infinite"
    }

    // Add click to expand functionality
    alert.addEventListener("click", function () {
      const desc = this.querySelector(".alert-desc")
      if (desc.style.maxHeight) {
        desc.style.maxHeight = null
        desc.style.overflow = "hidden"
      } else {
        desc.style.maxHeight = desc.scrollHeight + "px"
        desc.style.overflow = "visible"
      }
    })

    // Initially collapse long descriptions
    const desc = alert.querySelector(".alert-desc")
    if (desc && desc.textContent.length > 100) {
      desc.style.maxHeight = "3em"
      desc.style.overflow = "hidden"
      desc.style.cursor = "pointer"
      desc.title = "Click to expand"
    }
  })
}

// Add forecast-specific CSS animations
const style = document.createElement("style")
style.textContent = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fillBar {
        from {
            width: 0%;
        }
        to {
            width: var(--target-width, 100%);
        }
    }
    
    @keyframes blink {
        0%, 50% {
            opacity: 1;
        }
        51%, 100% {
            opacity: 0.7;
        }
    }
    
    .hourly-scroll::-webkit-scrollbar {
        height: 6px;
    }
    
    .hourly-scroll::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
    }
    
    .hourly-scroll::-webkit-scrollbar-thumb {
        background: #3498db;
        border-radius: 3px;
    }
    
    .hourly-scroll::-webkit-scrollbar-thumb:hover {
        background: #2980b9;
    }
    
    .hour-item {
        transition: all 0.3s ease;
    }
    
    .hour-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
`
document.head.appendChild(style)
