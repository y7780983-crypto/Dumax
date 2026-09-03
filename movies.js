// Movies System
// توجه: ابتدای این فایل (تعریف MOVIES_DATA، DOMContentLoaded و شروع initMovies)
// در متن ارسالی شما وجود نداشت.

    document.getElementById('movieSearch').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = MOVIES_DATA.filter(movie =>
            movie.name.toLowerCase().includes(query) ||
            movie.description.toLowerCase().includes(query) ||
            movie.genre.toLowerCase().includes(query)
        );
        renderMovies(filtered);
    });
}

function renderMovies(movies) {
    const grid = document.getElementById('moviesGrid');

    if (movies.length === 0) {
        grid.innerHTML = `
            <div style="text-align:center;padding:40px 20px;color:var(--text-secondary);grid-column:1/-1;">
                <i class="fas fa-film" style="font-size:48px;margin-bottom:16px;display:block;"></i>
                <p>فیلمی یافت نشد</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = movies.map(movie => `
        <div class="movie-card">
            <div class="movie-image">${movie.image}</div>
            <div class="movie-info">
                <h4>${movie.name}</h4>
                <p>${movie.description}</p>
                <div class="movie-meta">
                    <span>${movie.genre}</span>
                    <span>${movie.year}</span>
                </div>
                <button class="btn-primary" onclick="watchMovie('${movie.id}')">
                    <i class="fas fa-play"></i> مشاهده
                </button>
            </div>
        </div>
    `).join('');
}

function watchMovie(movieId) {
    const movie = MOVIES_DATA.find(m => m.id == movieId);
    if (!movie) return;

    showToast(`در حال پخش ${movie.name}...`, 'info');

    // In production, this would navigate to watch page or open player
    setTimeout(() => {
        showToast(`در حال پخش ${movie.name}`, 'success');
        // Open watch page
        window.open(movie.watchUrl, '_blank');
    }, 1000);
}

// Export for global use
window.MOVIES_DATA = MOVIES_DATA;
window.watchMovie = watchMovie;
