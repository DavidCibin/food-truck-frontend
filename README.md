# ⚛️ Food Facilities Challenge: Mobile Food Truck Finder (Frontend) 📱

This is the frontend web application for the SF Food Truck Finder project. Built with React and styled with Tailwind CSS and React Bootstrap, it provides an intuitive interface for users to search and discover mobile food facilities in San Francisco.

## ✨ Features

- **🔍 Search by Name or Address:** Allows users to easily find food trucks by typing in the applicant's name or a part of their address.
- **📍 Search by Geolocation:** Enables users to find nearby food trucks by providing their latitude and longitude.
- **🚦 Status Filtering:** Provides options to filter food trucks based on their permit status (e.g., Approved, Pending).
- **🗺️ Interactive Display:** Presents search results in a clear and responsive list format, adapting to different screen sizes.
- **📱 Mobile-First Design:** Built with responsiveness in mind, ensuring a seamless experience across various devices.

## 🛠️ Technologies Used

- **⚛️ React:** A JavaScript library for building dynamic and interactive user interfaces. Its component-based architecture facilitates reusability and maintainability.
- **💨 Tailwind CSS:** A utility-first CSS framework for rapid styling and creating responsive designs directly in the component markup.
- **🎨 React Bootstrap:** A UI library providing pre-built, accessible React components styled with Bootstrap, accelerating development and ensuring consistency.
- **📝 TypeScript:** A superset of JavaScript that adds static typing, improving code quality and developer experience.
- **🚀 Vite:** A fast build tool and development server that significantly speeds up the development workflow with features like Hot Module Replacement (HMR).
- **🧪 Jest:** A JavaScript testing framework used for writing unit tests to ensure the reliability and correctness of frontend components and logic.

## 📂 Components

This application utilizes a component-based architecture to organize the UI and manage state effectively. Key components include:

- **`FoodTruckContext`:** Manages the global state for the application, including search queries (name/address, geolocation), status filters, and view options.
- **`SearchByNameOrAddress`:** A user interface component providing an input field for searching food trucks by name or address. It updates the global search query in the `FoodTruckContext`.
- **`SearchByGeolocation`:** Allows users to input latitude and longitude to find nearby food trucks. Includes input validation and updates the geolocation query in the `FoodTruckContext`.
- **`FoodTruckCard`:** Displays detailed information for an individual food truck in a card format. This component is reused to render lists of search results.

## 🚀 Setup and Installation

To run the frontend application locally, follow these steps:

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
    Make sure you have Node.js and npm installed on your system.
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This will start the Vite development server, and the application will typically be accessible at `http://localhost:5173`.

## 🧪 Running Tests

To ensure the quality and reliability of the frontend code, unit tests are written using Jest.

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Run Jest tests:**
    ```bash
    npm test
    ```
    This command will execute all the test files located in your frontend's test directory.

## 🧹 Optional Commands

For maintaining code quality and consistency, the following optional commands are available:

1.  **Linting with ESLint:**

    ```bash
    npm run lint
    ```

    This command analyzes your codebase for potential stylistic and programmatic errors based on the configured ESLint rules.

2.  **Formatting with Prettier:**
    ```bash
    npm run format
    ```
    This command automatically formats your code according to Prettier's style guidelines, ensuring a consistent code style across the project.

---

This README provides an overview of the frontend application, the technologies used, key components, and instructions for setup, running, and testing. It serves as a guide for developers working on the user interface of the Food Truck Finder.
