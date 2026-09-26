# 📚 Library Book Management System

A beginner-friendly **Library Book Management System** developed as a college assignment. This web application helps manage library books, track book availability, issue and return books, and maintain transaction records through a simple, interactive dashboard.

## ✨ Features

* 📊 **Dashboard:** Displays library statistics, including total book titles, available copies, issued copies, and transactions.
* 📚 **View All Books:** Browse the library's book collection.
* 🔍 **Search Books:** Quickly find books in the collection.
* ➕ **Add New Books:** Register new books in the library.
* ✅ **Available Books:** View books currently available for borrowing.
* 📤 **Issue Books:** Record book issues and update available copies.
* 📥 **Return Books:** Record returned books and restore availability.
* 📋 **Transaction History:** Track book issue and return activities.
* 💾 **Local Storage:** Preserve application data in the browser.
* 📱 **Responsive Interface:** Navigate the application through a clean, user-friendly layout.

## 🛠️ Technologies Used

| Technology              | Purpose                                 |
| ----------------------- | --------------------------------------- |
| HTML5                   | Web page structure                      |
| CSS3                    | Styling and layout                      |
| TypeScript / JavaScript | Application logic and interactivity     |
| React                   | User interface                          |
| Vite                    | Development server and build tool       |
| Browser Local Storage   | Client-side data persistence            |
| Git & GitHub            | Version control and source code hosting |
| Vercel                  | Website deployment                      |

## 📖 Main Modules

### 1. Dashboard
Provides an overview of the library, displaying total book titles, available copies, issued copies, and transaction counts.

### 2. Book Management
Allows users to add books, browse the collection, search for titles, and check book availability.

### 3. Issue Book
Records the issue of a book to a student and updates the number of available copies.

### 4. Return Book
Records the return of an issued book and updates the library's available book count.

### 5. Transaction History
Maintains a record of book issue and return activities.

## 📁 Project Structure

```text
library-book-management-system/
│
├── src/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── index.html
├── script.js
├── style.css
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── metadata.json
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites
Install **Node.js** and **npm** on your computer.

### Step 1: Clone the repository
```bash
git clone https://github.com/Akshaya1408-s/library-book-management-system.git
```

### Step 2: Navigate to the project directory
```bash
cd library-book-management-system
```

### Step 3: Install dependencies
```bash
npm install
```

### Step 4: Start the development server
```bash
npm run dev
```

### Step 5: Open the application
Open the local URL displayed in your terminal, typically:

```text
http://localhost:3000/
```

## 🔄 How It Works

1. The librarian adds books to the library collection.
2. Users can search for books and check their availability.
3. When a book is issued, its available copy count decreases.
4. When a book is returned, its available copy count increases.
5. Issue and return activities are recorded in the transaction history.
6. Application data is stored using the browser's Local Storage.

**Note:** This project uses client-side storage rather than a shared database. Data is stored separately for each browser and device.

## 🎯 Project Objective

The objective of this project is to develop a simple library management interface that demonstrates:

* Frontend web development
* Interactive forms and user interfaces
* Book inventory management
* Basic transaction handling
* Client-side data storage
* Version control using Git and GitHub
* Deployment of a web application

## 🚀 Deployment

The application is deployed using **Vercel** and connected to the GitHub repository.

**Live Application:** https://library-book-management-system-one.vercel.app/

## 👩‍💻 Author

**Akshaya Sivakumar**

B.Tech – Computer Science and Engineering
SRM Institute of Science and Technology

## 📄 License

This project was developed for educational and academic purposes.
