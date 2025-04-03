import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  :root {
    --bg-color: #191B1F;
    --card-bg: #212429;
    --button-bg: #2172E5;
    --button-hover: #1A5BB6;
    --text-primary: #FFFFFF;
    --text-secondary: #8F96AC;
    --border-color: #40444F;
    --input-bg: #2C2F36;
    --success: #27AE60;
    --error: #E53935;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', sans-serif;
    background-color: var(--bg-color);
    color: var(--text-primary);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  button {
    font-family: 'Inter', sans-serif;
    cursor: pointer;
  }

  input {
    font-family: 'Inter', sans-serif;
  }
`
