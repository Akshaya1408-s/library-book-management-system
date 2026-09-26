/**
 * ==============================================================================
 * LIBRARY BOOK MANAGEMENT SYSTEM - JAVASCRIPT (script.js)
 * Simple, clean, beginner-friendly JavaScript using localStorage.
 * Ideal for college assignments and viva demonstrations.
 * ==============================================================================
 */

// --- 1. LOCAL STORAGE KEYS ---
// Used to store and retrieve data from browser's localStorage
const STORAGE_KEY_BOOKS = 'college_library_books';
const STORAGE_KEY_TRANSACTIONS = 'college_library_transactions';

// --- 2. SAMPLE INITIAL DATA ---
// Provided when the user opens the application for the very first time
const INITIAL_BOOKS = [
  {
    id: 'BK-101',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Programming',
    isbn: '978-0132350884',
    quantity: 5,
    availableCopies: 4,
    issuedCopies: 1
  },
  {
    id: 'BK-102',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    category: 'Algorithms',
    isbn: '978-0262033848',
    quantity: 4,
    availableCopies: 3,
    issuedCopies: 1
  },
  {
    id: 'BK-103',
    title: 'Database System Concepts',
    author: 'Abraham Silberschatz',
    category: 'Database',
    isbn: '978-0073523323',
    quantity: 3,
    availableCopies: 3,
    issuedCopies: 0
  },
  {
    id: 'BK-104',
    title: 'Python Crash Course',
    author: 'Eric Matthes',
    category: 'Programming',
    isbn: '978-1593279288',
    quantity: 6,
    availableCopies: 6,
    issuedCopies: 0
  },
  {
    id: 'BK-105',
    title: 'Computer Networks',
    author: 'Andrew S. Tanenbaum',
    category: 'Networking',
    isbn: '978-0132126953',
    quantity: 3,
    availableCopies: 2,
    issuedCopies: 1
  }
];

// Sample initial transactions matching the issued books above
const INITIAL_TRANSACTIONS = [
  {
    id: 'TXN-1001',
    studentId: 'STU-2024-01',
    studentName: 'Aarav Sharma',
    bookId: 'BK-101',
    bookTitle: 'Clean Code',
    issueDate: '2026-09-15',
    dueDate: '2026-09-29',
    returnDate: null,
    status: 'Issued'
  },
  {
    id: 'TXN-1002',
    studentId: 'STU-2024-02',
    studentName: 'Priya Patel',
    bookId: 'BK-102',
    bookTitle: 'Introduction to Algorithms',
    issueDate: '2026-09-18',
    dueDate: '2026-10-02',
    returnDate: null,
    status: 'Issued'
  },
  {
    id: 'TXN-1003',
    studentId: 'STU-2024-03',
    studentName: 'Rahul Verma',
    bookId: 'BK-105',
    bookTitle: 'Computer Networks',
    issueDate: '2026-09-20',
    dueDate: '2026-10-04',
    returnDate: null,
    status: 'Issued'
  },
  {
    id: 'TXN-1004',
    studentId: 'STU-2024-04',
    studentName: 'Sneha Rao',
    bookId: 'BK-103',
    bookTitle: 'Database System Concepts',
    issueDate: '2026-09-01',
    dueDate: '2026-09-15',
    returnDate: '2026-09-14',
    status: 'Returned'
  }
];

// --- 3. GLOBAL APPLICATION STATE ---
let books = [];
let transactions = [];

// --- 4. INITIALIZATION FUNCTION ---
// Runs automatically when the webpage completes loading
window.addEventListener('DOMContentLoaded', () => {
  loadData();
  setupEventListeners();
  setupDefaultDates();
  renderAllViews();
});

/**
 * Loads data from localStorage, or seeds sample data if storage is empty
 */
function loadData() {
  const storedBooks = localStorage.getItem(STORAGE_KEY_BOOKS);
  const storedTransactions = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);

  if (storedBooks) {
    try {
      books = JSON.parse(storedBooks);
    } catch (e) {
      books = [...INITIAL_BOOKS];
    }
  } else {
    // First time loading - initialize with 5 sample books
    books = [...INITIAL_BOOKS];
    saveBooks();
  }

  if (storedTransactions) {
    try {
      transactions = JSON.parse(storedTransactions);
    } catch (e) {
      transactions = [...INITIAL_TRANSACTIONS];
    }
  } else {
    transactions = [...INITIAL_TRANSACTIONS];
    saveTransactions();
  }
}

/**
 * Saves current books array into browser localStorage
 */
function saveBooks() {
  localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(books));
}

/**
 * Saves current transactions array into browser localStorage
 */
function saveTransactions() {
  localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
}

/**
 * Updates all UI views and tables
 */
function renderAllViews() {
  renderDashboard();
  renderBooksTable();
  renderAvailableBooksTable();
  renderTransactionsTable();
  renderActiveIssuedTable();
  populateBookDropdowns();
}

// --- 5. NAVIGATION / SECTION SWITCHING ---
/**
 * Switch visible section by ID
 * @param {string} sectionId - The ID of section to show (e.g. 'section-dashboard')
 */
function navigateTo(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll('.content-view');
  sections.forEach(sec => sec.classList.remove('active'));

  // Show selected section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Update active state in sidebar navigation buttons
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(btn => {
    if (btn.getAttribute('data-target') === sectionId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Close mobile sidebar if open
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.classList.remove('mobile-open');
  }

  // Refresh dropdowns or views whenever navigating
  if (sectionId === 'section-issue-book') {
    populateBookDropdowns();
  } else if (sectionId === 'section-return-book') {
    renderActiveIssuedTable();
  }
}

// --- 6. DASHBOARD RENDERING ---
/**
 * Calculates statistics and updates dashboard cards
 */
function renderDashboard() {
  const totalTitles = books.length;
  
  // Total copies across all books
  const totalCopies = books.reduce((sum, book) => sum + Number(book.quantity || 0), 0);
  
  // Available copies currently in library
  const availableCopies = books.reduce((sum, book) => sum + Number(book.availableCopies || 0), 0);
  
  // Currently issued copies
  const issuedCopies = books.reduce((sum, book) => sum + Number(book.issuedCopies || 0), 0);

  // Update card numbers
  const elTotalBooks = document.getElementById('stat-total-books');
  const elAvailBooks = document.getElementById('stat-available-books');
  const elIssuedBooks = document.getElementById('stat-issued-books');
  const elTotalTxns = document.getElementById('stat-total-transactions');

  if (elTotalBooks) elTotalBooks.innerText = totalTitles;
  if (elAvailBooks) elAvailBooks.innerText = availableCopies;
  if (elIssuedBooks) elIssuedBooks.innerText = issuedCopies;
  if (elTotalTxns) elTotalTxns.innerText = transactions.length;

  // Update badges on sidebar navigation
  const badgeAllBooks = document.getElementById('nav-badge-all');
  const badgeAvailBooks = document.getElementById('nav-badge-avail');
  if (badgeAllBooks) badgeAllBooks.innerText = totalTitles;
  if (badgeAvailBooks) badgeAvailBooks.innerText = books.filter(b => b.availableCopies > 0).length;

  // Render recent activity table on dashboard
  renderDashboardRecentActivity();
}

/**
 * Shows recent 5 transactions on the dashboard for quick overview
 */
function renderDashboardRecentActivity() {
  const tbody = document.getElementById('dashboard-recent-tbody');
  if (!tbody) return;

  if (transactions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-state">No transaction records found.</td></tr>`;
    return;
  }

  // Show the last 5 transactions (newest first)
  const recent = [...transactions].reverse().slice(0, 5);

  let html = '';
  recent.forEach(txn => {
    const statusBadge = txn.status === 'Issued'
      ? `<span class="badge badge-issued">Issued</span>`
      : `<span class="badge badge-returned">Returned</span>`;

    html += `
      <tr>
        <td><strong>${txn.id}</strong></td>
        <td>${escapeHtml(txn.studentName)} (${escapeHtml(txn.studentId)})</td>
        <td>${escapeHtml(txn.bookTitle)}</td>
        <td>${txn.issueDate}</td>
        <td>${statusBadge}</td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

// --- 7. VIEW ALL BOOKS & SEARCH ---
/**
 * Renders the main books table with optional filter list
 */
function renderBooksTable(filteredList = null) {
  const tbody = document.getElementById('books-table-tbody');
  if (!tbody) return;

  const listToRender = filteredList !== null ? filteredList : books;

  if (listToRender.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="empty-state">
          <div class="empty-state-icon">📚</div>
          <h3>No Books Found</h3>
          <p>No books match your search criteria. Try a different search term or add a new book.</p>
        </td>
      </tr>
    `;
    return;
  }

  let html = '';
  listToRender.forEach(book => {
    // Determine status badge
    let statusBadge = '';
    if (book.availableCopies === 0) {
      statusBadge = `<span class="badge badge-out-of-stock">Out of Stock</span>`;
    } else if (book.availableCopies < book.quantity) {
      statusBadge = `<span class="badge badge-partial">${book.availableCopies} Left</span>`;
    } else {
      statusBadge = `<span class="badge badge-available">Available</span>`;
    }

    const issueButton = book.availableCopies > 0
      ? `<button class="btn-sm btn-issue" onclick="quickIssueBook('${book.id}')" title="Issue this book">📤 Issue</button>`
      : `<button class="btn-sm" disabled style="opacity: 0.5; cursor: not-allowed;">Out of Stock</button>`;

    html += `
      <tr>
        <td><code>${escapeHtml(book.id)}</code></td>
        <td>
          <div class="book-title-cell">${escapeHtml(book.title)}</div>
          <div class="book-author-cell">ISBN: ${escapeHtml(book.isbn || 'N/A')}</div>
        </td>
        <td>${escapeHtml(book.author)}</td>
        <td><span class="badge badge-category">${escapeHtml(book.category)}</span></td>
        <td><strong>${book.quantity}</strong></td>
        <td><strong style="color: ${book.availableCopies > 0 ? '#10b981' : '#ef4444'}">${book.availableCopies}</strong></td>
        <td>${statusBadge}</td>
        <td>
          <div class="table-actions">
            ${issueButton}
            <button class="btn-sm btn-delete" onclick="deleteBook('${book.id}')" title="Delete book">🗑️ Delete</button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

/**
 * Searches books by Title, Author, or Book ID and category
 */
function searchBooks() {
  const searchInput = document.getElementById('search-books-input');
  const categoryFilter = document.getElementById('filter-category');

  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const selectedCategory = categoryFilter ? categoryFilter.value : 'all';

  const filtered = books.filter(book => {
    const matchesQuery = 
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.id.toLowerCase().includes(query) ||
      (book.isbn && book.isbn.toLowerCase().includes(query));

    const matchesCategory = (selectedCategory === 'all') || (book.category === selectedCategory);

    return matchesQuery && matchesCategory;
  });

  renderBooksTable(filtered);
}

// --- 8. AVAILABLE BOOKS SECTION ---
/**
 * Renders only books that currently have availableCopies > 0
 */
function renderAvailableBooksTable() {
  const tbody = document.getElementById('available-books-tbody');
  if (!tbody) return;

  const availableBooks = books.filter(book => book.availableCopies > 0);

  if (availableBooks.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">
          <div class="empty-state-icon">📕</div>
          <h3>No Books Available Right Now</h3>
          <p>All copies of all books have been issued to students.</p>
        </td>
      </tr>
    `;
    return;
  }

  let html = '';
  availableBooks.forEach(book => {
    html += `
      <tr>
        <td><code>${escapeHtml(book.id)}</code></td>
        <td class="book-title-cell">${escapeHtml(book.title)}</td>
        <td>${escapeHtml(book.author)}</td>
        <td><span class="badge badge-category">${escapeHtml(book.category)}</span></td>
        <td><span class="badge badge-available">${book.availableCopies} Available</span></td>
        <td>Total: ${book.quantity} (Issued: ${book.issuedCopies})</td>
        <td>
          <button class="btn-sm btn-issue" onclick="quickIssueBook('${book.id}')">
            📤 Issue This Book
          </button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

// --- 9. ADD BOOK FEATURE ---
/**
 * Handles adding a new book to the library system
 */
function handleAddBook(event) {
  event.preventDefault(); // Prevent standard page reload on form submit

  const idInput = document.getElementById('book-id');
  const titleInput = document.getElementById('book-title');
  const authorInput = document.getElementById('book-author');
  const categoryInput = document.getElementById('book-category');
  const isbnInput = document.getElementById('book-isbn');
  const quantityInput = document.getElementById('book-quantity');

  const id = idInput.value.trim().toUpperCase();
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const category = categoryInput.value.trim();
  const isbn = isbnInput.value.trim();
  const quantity = parseInt(quantityInput.value, 10);

  // Validation: Check duplicate Book ID
  const existingBook = books.find(b => b.id.toUpperCase() === id);
  if (existingBook) {
    showNotification(`Book ID "${id}" already exists! Please use a unique ID.`, 'error');
    idInput.focus();
    return;
  }

  if (quantity < 1 || isNaN(quantity)) {
    showNotification('Quantity must be at least 1.', 'error');
    quantityInput.focus();
    return;
  }

  // Create new book object
  const newBook = {
    id: id,
    title: title,
    author: author,
    category: category,
    isbn: isbn || 'N/A',
    quantity: quantity,
    availableCopies: quantity,
    issuedCopies: 0
  };

  // Add to books array and persist
  books.push(newBook);
  saveBooks();

  // Reset form
  document.getElementById('add-book-form').reset();
  generateNextBookId();

  // Update UI views
  renderAllViews();

  showNotification(`Book "${title}" added successfully!`, 'success');
  navigateTo('section-view-books');
}

/**
 * Automatically suggests a Book ID like BK-106 based on current books
 */
function generateNextBookId() {
  const idInput = document.getElementById('book-id');
  if (!idInput) return;

  let maxNum = 100;
  books.forEach(b => {
    const match = b.id.match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (num > maxNum) maxNum = num;
    }
  });

  idInput.value = `BK-${maxNum + 1}`;
}

/**
 * Deletes a book if it has no active issued copies
 */
function deleteBook(bookId) {
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  if (book.issuedCopies > 0) {
    showNotification(`Cannot delete "${book.title}". There are ${book.issuedCopies} issued copies out with students. Return them first.`, 'error');
    return;
  }

  const confirmed = confirm(`Are you sure you want to remove "${book.title}" (ID: ${book.id}) from the library?`);
  if (!confirmed) return;

  books = books.filter(b => b.id !== bookId);
  saveBooks();
  renderAllViews();
  showNotification(`Book "${book.title}" was removed.`, 'info');
}

// --- 10. ISSUE BOOK FEATURE ---
/**
 * Populates dropdown in Issue Book form with currently available books
 */
function populateBookDropdowns() {
  const select = document.getElementById('issue-book-select');
  if (!select) return;

  const availableBooks = books.filter(b => b.availableCopies > 0);

  if (availableBooks.length === 0) {
    select.innerHTML = '<option value="" disabled selected>No books available to issue</option>';
    return;
  }

  let html = '<option value="" disabled selected>-- Select an Available Book --</option>';
  availableBooks.forEach(b => {
    html += `<option value="${b.id}">${b.id} - ${b.title} (${b.availableCopies} available)</option>`;
  });

  select.innerHTML = html;
}

/**
 * Quick Issue: Navigates to issue section and selects the chosen book
 */
function quickIssueBook(bookId) {
  navigateTo('section-issue-book');
  const select = document.getElementById('issue-book-select');
  if (select) {
    select.value = bookId;
  }
}

/**
 * Handles issuing a book to a student
 */
function handleIssueBook(event) {
  event.preventDefault();

  const studentIdInput = document.getElementById('issue-student-id');
  const studentNameInput = document.getElementById('issue-student-name');
  const bookSelect = document.getElementById('issue-book-select');
  const issueDateInput = document.getElementById('issue-date');
  const dueDateInput = document.getElementById('issue-due-date');

  const studentId = studentIdInput.value.trim().toUpperCase();
  const studentName = studentNameInput.value.trim();
  const bookId = bookSelect.value;
  const issueDate = issueDateInput.value;
  const dueDate = dueDateInput.value;

  if (!bookId) {
    showNotification('Please select a book to issue.', 'error');
    return;
  }

  // Find book in array
  const book = books.find(b => b.id === bookId);
  if (!book) {
    showNotification('Selected book was not found!', 'error');
    return;
  }

  // Critical check: Ensure copies are available
  if (book.availableCopies <= 0) {
    showNotification(`Sorry, "${book.title}" has no available copies right now!`, 'error');
    return;
  }

  // Decrease available copies by 1, increase issued copies by 1
  book.availableCopies -= 1;
  book.issuedCopies += 1;
  saveBooks();

  // Create transaction record
  const newTxnId = `TXN-${1000 + transactions.length + 1}`;
  const transaction = {
    id: newTxnId,
    studentId: studentId,
    studentName: studentName,
    bookId: book.id,
    bookTitle: book.title,
    issueDate: issueDate,
    dueDate: dueDate,
    returnDate: null,
    status: 'Issued'
  };

  transactions.push(transaction);
  saveTransactions();

  // Reset form and re-setup default dates
  document.getElementById('issue-book-form').reset();
  setupDefaultDates();

  // Refresh views
  renderAllViews();

  showNotification(`Success! "${book.title}" issued to ${studentName} (${studentId}).`, 'success');
  navigateTo('section-transactions');
}

// --- 11. RETURN BOOK FEATURE ---
/**
 * Renders the active (currently issued) books in the Return section
 * This makes it super convenient for the user to return with 1 click!
 */
function renderActiveIssuedTable() {
  const tbody = document.getElementById('active-issued-tbody');
  if (!tbody) return;

  const activeIssues = transactions.filter(t => t.status === 'Issued');

  if (activeIssues.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">
          <div class="empty-state-icon">✅</div>
          <h3>No Active Issued Books</h3>
          <p>All issued books have been safely returned to the library.</p>
        </td>
      </tr>
    `;
    return;
  }

  let html = '';
  activeIssues.forEach(txn => {
    html += `
      <tr>
        <td><strong>${txn.id}</strong></td>
        <td>${escapeHtml(txn.studentName)} (<code>${escapeHtml(txn.studentId)}</code>)</td>
        <td><code>${escapeHtml(txn.bookId)}</code> - ${escapeHtml(txn.bookTitle)}</td>
        <td>${txn.issueDate}</td>
        <td>${txn.dueDate}</td>
        <td><span class="badge badge-issued">Currently Issued</span></td>
        <td>
          <button class="btn-sm btn-return" onclick="returnByTransactionId('${txn.id}')">
            📥 Return Book
          </button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

/**
 * Handles returning a book via manual form entry (Student ID + Book ID)
 */
function handleReturnBookForm(event) {
  event.preventDefault();

  const studentIdInput = document.getElementById('return-student-id');
  const bookIdInput = document.getElementById('return-book-id');

  const studentId = studentIdInput.value.trim().toUpperCase();
  const bookId = bookIdInput.value.trim().toUpperCase();

  // Find active issued transaction
  const txn = transactions.find(t => 
    t.studentId.toUpperCase() === studentId && 
    t.bookId.toUpperCase() === bookId && 
    t.status === 'Issued'
  );

  if (!txn) {
    showNotification(`No active issue found for Student ID "${studentId}" and Book ID "${bookId}". Please verify your details.`, 'error');
    return;
  }

  processReturn(txn);
  document.getElementById('return-book-form').reset();
}

/**
 * Quick return by clicking Return button in active issues list
 */
function returnByTransactionId(txnId) {
  const txn = transactions.find(t => t.id === txnId);
  if (!txn || txn.status !== 'Issued') {
    showNotification('Invalid transaction or book already returned.', 'error');
    return;
  }

  processReturn(txn);
}

/**
 * Core return logic: Updates copies, sets return date, updates status
 */
function processReturn(txn) {
  // Find associated book
  const book = books.find(b => b.id === txn.bookId);
  if (book) {
    book.availableCopies += 1;
    book.issuedCopies = Math.max(0, book.issuedCopies - 1);
    saveBooks();
  }

  // Update transaction status
  txn.status = 'Returned';
  const today = new Date().toISOString().split('T')[0];
  txn.returnDate = today;
  saveTransactions();

  // Refresh all views
  renderAllViews();

  showNotification(`Success! "${txn.bookTitle}" has been returned by ${txn.studentName}.`, 'success');
}

// --- 12. TRANSACTION HISTORY ---
/**
 * Renders complete transaction history table
 */
function renderTransactionsTable(filter = 'all') {
  const tbody = document.getElementById('transactions-table-tbody');
  if (!tbody) return;

  let list = transactions;
  if (filter === 'Issued') {
    list = transactions.filter(t => t.status === 'Issued');
  } else if (filter === 'Returned') {
    list = transactions.filter(t => t.status === 'Returned');
  }

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="empty-state">
          <div class="empty-state-icon">📋</div>
          <h3>No Transactions</h3>
          <p>No transaction history records match the selected filter.</p>
        </td>
      </tr>
    `;
    return;
  }

  let html = '';
  // Show in reverse chronological order (newest first)
  [...list].reverse().forEach(txn => {
    const statusBadge = txn.status === 'Issued'
      ? `<span class="badge badge-issued">Issued</span>`
      : `<span class="badge badge-returned">Returned</span>`;

    const returnDisplay = txn.returnDate ? txn.returnDate : '<span style="color: #94a3b8;">Pending</span>';

    html += `
      <tr>
        <td><strong>${txn.id}</strong></td>
        <td><code>${escapeHtml(txn.studentId)}</code></td>
        <td>${escapeHtml(txn.studentName)}</td>
        <td><code>${escapeHtml(txn.bookId)}</code></td>
        <td class="book-title-cell">${escapeHtml(txn.bookTitle)}</td>
        <td>${txn.issueDate}</td>
        <td>${txn.dueDate}</td>
        <td>${returnDisplay}</td>
        <td>${statusBadge}</td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

// --- 13. UTILITY FUNCTIONS & EVENT LISTENERS ---
/**
 * Sets today's date for Issue Date and 14 days later for Due Date
 */
function setupDefaultDates() {
  const issueDateInput = document.getElementById('issue-date');
  const dueDateInput = document.getElementById('issue-due-date');

  const today = new Date();
  const issueFormatted = today.toISOString().split('T')[0];

  const due = new Date();
  due.setDate(today.getDate() + 14); // 14-day borrowing period
  const dueFormatted = due.toISOString().split('T')[0];

  if (issueDateInput) issueDateInput.value = issueFormatted;
  if (dueDateInput) dueDateInput.value = dueFormatted;
}

/**
 * Displays floating notification toast
 */
function showNotification(message, type = 'info') {
  const banner = document.getElementById('notification-banner');
  if (!banner) return;

  banner.className = `notification-banner ${type} show`;
  banner.innerText = message;

  // Auto-hide after 3.5 seconds
  setTimeout(() => {
    banner.classList.remove('show');
  }, 3500);
}

/**
 * Resets local storage data back to initial 5 sample books
 * Very useful for viva demonstrations!
 */
function resetToSampleData() {
  const confirmed = confirm('Reset all library data back to default sample books and transactions? Any custom additions will be cleared.');
  if (!confirmed) return;

  books = JSON.parse(JSON.stringify(INITIAL_BOOKS));
  transactions = JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS));

  saveBooks();
  saveTransactions();
  renderAllViews();

  showNotification('Library data reset to default sample books.', 'info');
  navigateTo('section-dashboard');
}

/**
 * Escape HTML to prevent XSS injection in plain text output
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Set up all DOM event listeners
 */
function setupEventListeners() {
  // Sidebar navigation clicks
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      if (target) navigateTo(target);
    });
  });

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const sidebar = document.getElementById('sidebar');
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });
  }

  // Add Book Form
  const addBookForm = document.getElementById('add-book-form');
  if (addBookForm) {
    addBookForm.addEventListener('submit', handleAddBook);
  }

  // Issue Book Form
  const issueBookForm = document.getElementById('issue-book-form');
  if (issueBookForm) {
    issueBookForm.addEventListener('submit', handleIssueBook);
  }

  // Return Book Form
  const returnBookForm = document.getElementById('return-book-form');
  if (returnBookForm) {
    returnBookForm.addEventListener('submit', handleReturnBookForm);
  }

  // Search input and Category filter in View Books
  const searchInput = document.getElementById('search-books-input');
  if (searchInput) {
    searchInput.addEventListener('input', searchBooks);
  }

  const categoryFilter = document.getElementById('filter-category');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', searchBooks);
  }

  // Filter in Transactions table
  const txnFilter = document.getElementById('filter-transactions');
  if (txnFilter) {
    txnFilter.addEventListener('change', (e) => {
      renderTransactionsTable(e.target.value);
    });
  }

  // Reset button
  const resetBtn = document.getElementById('reset-sample-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetToSampleData);
  }

  // Generate Book ID button
  const genIdBtn = document.getElementById('btn-generate-id');
  if (genIdBtn) {
    genIdBtn.addEventListener('click', generateNextBookId);
  }

  // Automatically suggest next ID when opening Add Book
  generateNextBookId();
}
