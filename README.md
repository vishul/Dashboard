# Dashboard
North Star:
- Have a dynamic context aware dashboard that automatically keeps updating to show data necessary for decisions i need to make at that timne, based on my calendar + other inputs.

Modules
- Path:
    - Next 3 PATH times from Hoboken to 33rd.

- Citi Bike: <make it pluggable to change the values for the stations>
    - Show number of Citi Bikes available at Christopher Street
    - Show parking dock availability at 8th Ave and 15th Street and new CPF

- Weather Forecast:
    - Challenge:
        - Animate the weather
        - Try pulling from the Insta post of the weather guy

- Todoist: Pull top <n> tasks sorted by closest due date.
    >Do not show tasks that are too stale, though.
- Add calendar widget to show events for the week.
    >Prefer embedding so we don't need to store auth tokens.
- Art?

Usage:
- Refresh rate: Only needs to refresh in the morning, so every 30 secs from 6–10am on weekdays and 6–11am on weekends.
- Weekends: I might be using other stations on the weekends; figure out how to plug or simply remove the Citi Bike info on the weekends.
