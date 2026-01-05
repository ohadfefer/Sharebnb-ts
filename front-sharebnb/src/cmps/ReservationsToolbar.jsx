export function ReservationsToolbar({ q, onQuery, status, onStatus, onExport }) {
    return (
        <div className="res-toolbar">
            <input
                className="res-search"
                placeholder="Search guest, listing, status…"
                value={q}
                onChange={e => onQuery(e.target.value)}
            />
            <select
                className="res-status-filter"
                value={status}
                onChange={e => onStatus(e.target.value)}
            >
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
            </select>
            <div className="spacer" />
            <button className="res-csv" onClick={onExport}>Export CSV</button>
        </div>
    )
}
