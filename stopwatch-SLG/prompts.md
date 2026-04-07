#### MODEL USED: CLAUDE CODE 4.5 Sonnet

### PROMPT 1

You are an expert developer creating stopwatch (chronometer) and countdown.

You must use just the following files: index.html, script.js and styles.css

First, you need to display 2 options. Stopwatch or countdown.

- When the stopwatch is clicked, display the stopwatch feature.
  Here, must be:
  - a panel for the time with the following format: hh:mm:ss:ms (3 decimals, in less size)
  - start button
  - clear button

- Countdown feature:
  Must have:
  - a panel for display the time set by the user with the following format: hh:mm:ss:ms (3 decimals, in less size)
  - number inputs from 0 to 9, and when user clicks: the hh:mm:ss starts filling.
    - Example: user clicks first 8, we would have: hh:mm:s8, then he clicks 5, we would have hh:mm:85, ...
    - the numbers are enabled until the hh:mm:ss is not complete, when complete, disable the numbers
    - there must be a clear button that reset the whole input
    - there must be a set button that confirms the input of the user
      - when confirmed, you need to normalize the input:
        - imagine user inputs the following: 88:88:88 -> 89:29:28 (normalized)
        - you need to display another tab with the input time, a start button and a clear button

For all tabs, include a back button to go to the main section.

For the style, please use a modern, smooth user-friendly UI.

###### META PROMPTING 1

# Stopwatch & Countdown Timer Web App

You are an expert front-end developer tasked with building a web-based **Stopwatch (Chronometer) and Countdown Timer**.

## Technical Constraints

- Use **only** the following files:
  - `index.html`
  - `styles.css`
  - `script.js`
- Do not use external libraries or frameworks.

---

## Application Structure

### 1. Main Screen

- Display two options:
  - **Stopwatch**
  - **Countdown**

---

## 2. Stopwatch Feature

When the user selects **Stopwatch**, display:

- A time display panel formatted as:
  `hh:mm:ss:ms`
  - Milliseconds must have **3 digits** and appear in a **smaller font size**
- A **Start / Pause toggle button**
- A **Clear (Reset) button**
- A **Back button** to return to the main screen

---

## 3. Countdown Feature

### Input Phase

- Display a time panel formatted as:
  `hh:mm:ss:ms` (milliseconds shown smaller)
- Provide a numeric keypad with digits **0–9**

#### Input Behavior

- Each digit press fills the time from **right to left**
- Example sequence:
  - Press `8` → `00:00:08`
  - Press `5` → `00:00:85`
  - Continue shifting left as more digits are entered
- Disable the keypad once all required digits are filled

#### Controls

- **Clear button** → resets input
- **Set button** → confirms the entered time

---

### Normalization

- On confirmation, normalize the time values:
  - Example: `88:88:88` → `89:29:28`
- Properly convert overflow:
  - Seconds → Minutes
  - Minutes → Hours

---

### Countdown Phase

After setting the time, display a new view with:

- The **normalized time**
- A **Start / Pause button**
- A **Clear (Reset) button**
- A **Back button** to return to the main screen

---

## UI / UX Requirements

- Use a **modern, clean, and responsive design**
- Ensure smooth transitions between views
- Make the interface intuitive and user-friendly
- Use clear visual hierarchy (buttons, panels, typography)

---

## Additional Notes

- Ensure accurate time handling and updates
- Keep code well-structured and readable
- Separate concerns properly between HTML, CSS, and JavaScript

# Prompt 3

Just keep 3 decimals

# Prompt 4

For the countdown, user can just input from ss to hh, but not ms

# Prompt 5.

2 more fixes:

Althoug ms are not set, dipslay them always as 000. But when user starts the countdown, dipslay the current value for ms
when countdown is running and user clears it, do not go back. Just reset it
