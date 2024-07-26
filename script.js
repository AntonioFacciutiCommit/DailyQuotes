document.addEventListener("DOMContentLoaded", function () {
  const quoteList = document.getElementById("quote-list");
  const favoriteQuoteList = document.getElementById("favorite-quote-list");
  const quoteForm = document.getElementById("quote-form");
  const quoteText = document.getElementById("quote-text");
  const quoteAuthor = document.getElementById("quote-author");
  const clearQuotesBtn = document.getElementById("clear-quotes");
  const pagination = document.getElementById("pagination");

  const quotesPerPage = 5;
  let currentPage = 1;
  let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
  let favoriteQuotes = JSON.parse(localStorage.getItem("favoriteQuotes")) || [];

  // Funzione per visualizzare le citazioni sulla pagina corrente
  function displayQuotes() {
    quoteList.innerHTML = "";
    const startIndex = (currentPage - 1) * quotesPerPage;
    const endIndex = startIndex + quotesPerPage;
    const quotesToDisplay = quotes.slice(startIndex, endIndex);
    if (currentPage > 1 && quotesToDisplay.length === 0) {
      currentPage--;
      displayQuotes();
    } else {
      quotesToDisplay.forEach((quote, index) =>
        addQuoteToList(quote.text, quote.author, index + startIndex)
      );
    }
    updatePagination();
  }

  // Rimuove tutte le citazioni dal localStorage e dalla lista visuale
  function clearQuotes() {
    quotes = [];
    favoriteQuotes = [];
    localStorage.removeItem("quotes");
    localStorage.removeItem("favoriteQuotes");
    currentPage = 1;
    displayQuotes();
    displayFavoriteQuotes();
  }

  // Salva una nuova citazione nel localStorage
  function saveQuote(text, author) {
    quotes.push({ text, author });
    localStorage.setItem("quotes", JSON.stringify(quotes));
    displayQuotes();
  }

  // Funzione per cancellare una citazione
  function deleteQuote(index) {
    const [removedQuote] = quotes.splice(index, 1);
    localStorage.setItem("quotes", JSON.stringify(quotes));
    removeFromFavorites(removedQuote);
    displayQuotes();
  }
  
  // Aggiungi una citazione alla lista visuale
  function addQuoteToList(text, author, index) {
    const quoteItem = document.createElement("div");
    quoteItem.className = "quote-item";
    quoteItem.innerHTML = `
                <p>"${text}"</p>
                <footer class="blockquote-footer">${author}</footer>
                <button class="btn btn-sm btn-outline-primary favorite-btn">Favorite</button>
                <button class="btn btn-sm btn-outline-danger delete-btn">Delete</button>
            `;
    quoteList.appendChild(quoteItem);

    // Aggiungi event listener per segnare come preferita
    const favoriteBtn = quoteItem.querySelector(".favorite-btn");
    favoriteBtn.addEventListener("click", function () {
      toggleFavoriteQuote(index);
    });

    // Aggiungi event listener per cancellare la citazione
    const deleteBtn = quoteItem.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", function () {
      deleteQuote(index);
    });
  }

  // Funzione per aggiornare la paginazione
  function updatePagination() {
    pagination.innerHTML = "";
    const pageCount = Math.ceil(quotes.length / quotesPerPage);

    for (let i = 1; i <= pageCount; i++) {
      const pageItem = document.createElement("li");
      pageItem.className = "page-item " + (i === currentPage ? "active" : "");
      const pageLink = document.createElement("a");
      pageLink.className = "page-link";
      pageLink.textContent = i;
      pageLink.href = "#";
      pageLink.addEventListener("click", function (e) {
        e.preventDefault();
        currentPage = i;
        displayQuotes();
      });

      pageItem.appendChild(pageLink);
      pagination.appendChild(pageItem);
    }
  }

  // Funzione per rimuovere una citazione dalla lista dei preferiti
  function removeFromFavorites(quote) {
    const favoriteIndex = favoriteQuotes.findIndex(
      (q) => q.text === quote.text && q.author === quote.author
    );
    if (favoriteIndex > -1) {
      favoriteQuotes.splice(favoriteIndex, 1);
      localStorage.setItem("favoriteQuotes", JSON.stringify(favoriteQuotes));
      displayFavoriteQuotes();
    }
  }

  // Aggiungi una citazione alla lista dei preferiti
  function toggleFavoriteQuote(index) {
    const quote = quotes[index];
    const favoriteIndex = favoriteQuotes.findIndex(
      (q) => q.text === quote.text && q.author === quote.author
    );

    if (favoriteIndex > -1) {
      // Se la citazione è già tra i preferiti, rimuovila
      favoriteQuotes.splice(favoriteIndex, 1);
    } else {
      // Altrimenti, aggiungila
      favoriteQuotes.push(quote);
    }

    localStorage.setItem("favoriteQuotes", JSON.stringify(favoriteQuotes));
    displayFavoriteQuotes();
  }

  // Visualizza le citazioni preferite
  function displayFavoriteQuotes() {
    favoriteQuoteList.innerHTML = "";
    favoriteQuotes.forEach((quote) =>
      addFavoriteQuoteToList(quote.text, quote.author)
    );
  }

  // Aggiungi una citazione alla lista visuale dei preferiti
  function addFavoriteQuoteToList(text, author) {
    const quoteItem = document.createElement("div");
    quoteItem.className = "quote-item";
    quoteItem.innerHTML = `
            <p>"${text}"</p>
            <footer class="blockquote-footer">${author}</footer>
        `;
    favoriteQuoteList.appendChild(quoteItem);
  }

  // Gestione del submit del form
  quoteForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = quoteText.value.trim();
    const author = quoteAuthor.value.trim();

    if (text && author) {
      saveQuote(text, author);
      quoteText.value = "";
      quoteAuthor.value = "";
    }
  });

  // Gestione del click sul pulsante "Clear All Quotes"
  clearQuotesBtn.addEventListener("click", function () {
    clearQuotes();
  });

  // Carica le citazioni salvate quando la pagina è caricata
  displayQuotes();
  displayFavoriteQuotes();
});
