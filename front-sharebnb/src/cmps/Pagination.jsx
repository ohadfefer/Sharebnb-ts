export function Pagination({ page, perPage = 18, total, onChange }) {
    const totalPages = Math.max(1, Math.ceil(total / perPage))
    if (totalPages <= 1) return null

    const go = (n) => {
        const clamped = Math.min(totalPages, Math.max(1, n))
        if (clamped !== page) onChange?.(clamped)
    }

    const pages = (() => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
        if (page <= 3) return [1, 2, 3, 4, "…", totalPages]
        if (page >= totalPages - 2) return [1, "…", totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        return [1, "…", page - 1, page, page + 1, "…", totalPages]
    })()

    return (
        <nav className="pagination" aria-label="Pagination">
            <button
                className={`arrow ${page === 1 ? "disabled" : ""}`}
                onClick={() => go(page - 1)}
                aria-label="Previous page"
                disabled={page === 1}
                type="button"
            >
                ‹
            </button>

            {pages.map((p, idx) =>
                p === "…" ? (
                    <span key={`e-${idx}`} className="ellipsis" aria-hidden>…</span>
                ) : (
                    <button
                        key={p}
                        type="button"
                        className={`item ${p === page ? "current" : "ghost"}`}
                        onClick={() => go(p)}
                        aria-current={p === page ? "page" : undefined}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                className={`arrow ${page === totalPages ? "disabled" : ""}`}
                onClick={() => go(page + 1)}
                aria-label="Next page"
                disabled={page === totalPages}
                type="button"
            >
                ›
            </button>
        </nav>
    )
}
