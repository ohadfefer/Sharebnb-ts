export function AppFooter({ year = new Date().getFullYear() }) {
	const columns = [
		{
			title: "Support",
			links: [
				"Help Center",
				"Get help with a safety issue",
				"AirCover",
				"Anti-discrimination",
				"Disability support",
				"Cancellation options",
				"Report neighborhood concern",
			],
		},
		{
			title: "Hosting",
			links: [
				"Airbnb your home",
				"Airbnb your experience",
				"Airbnb your service",
				"AirCover for Hosts",
				"Hosting resources",
				"Community forum",
				"Hosting responsibly",
				"Airbnb-friendly apartments",
				"Join a free Hosting class",
				"Find a co-host",
			],
		},
		{
			title: "Airbnb",
			links: [
				"2025 Summer Release",
				"Newsroom",
				"Careers",
				"Investors",
				"Gift cards",
				"Airbnb.org emergency stays",
			],
		},
	]

	return (
		<footer className="af-footer">
			<div className="af-container">
				<div className="af-cols">
					{columns.map(({ title, links }) => (
						<nav key={title} className="af-col">
							<h3>{title}</h3>
							<ul>
								{links.map((label) => (
									<li key={label}>
										<a href="#">{label}</a>
									</li>
								))}
							</ul>
						</nav>
					))}
				</div>
			</div>

			<div className="af-divider" />

			<div className="af-container af-bottom">
				{/* Left: legal links */}
				<div className="af-legal">
					<span>© {year} Airbnb, Inc.</span>
					<span className="af-dot">·</span>
					<a href="#">Terms</a>
					<span className="af-dot">·</span>
					<a href="#">Sitemap</a>
					<span className="af-dot">·</span>
					<a href="#">Privacy</a>
					<span className="af-dot">·</span>
					<a href="#">
						Your Privacy Choices <span className="af-privacy-badge">🔒</span>
					</a>
				</div>

				{/* Right: language, currency, social */}
				<div className="af-right">
					<a href="#" className="af-lang">
						🌐 English (US)
					</a>
					<a href="#" className="af-currency">₪ ILS</a>
					<div className="af-social">
						<a href="#" aria-label="Facebook">📘</a>
						<a href="#" aria-label="X">✖</a>
						<a href="#" aria-label="Instagram">📸</a>
					</div>
				</div>
			</div>
		</footer>
	)
}
