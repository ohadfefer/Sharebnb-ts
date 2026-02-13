export function makeId(length = 5) {
	var txt = ''
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	for (let i = 0; i < length; i++) {
		txt += possible.charAt(Math.floor(Math.random() * possible.length))
	}
	return txt
}

export function debounce<T extends (...args: any[]) => any>(
	func: T,
	timeout = 300
): (...args: Parameters<T>) => void {
	let timer: ReturnType<typeof setTimeout> | undefined

	return function (this: any, ...args: Parameters<T>) {
		clearTimeout(timer)
		timer = setTimeout(() => {
			func.apply(this, args)
		}, timeout)
	}
}

export function getRandomInt(min: number, max: number) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateRandomName() {
	const names = ['Jhon', 'Wick', 'Strong', 'Dude', 'Yep', 'Hello', 'World', 'Power', 'Goku', 'Super', 'Hi', 'You', 'Are', 'Awesome']
	const famName = ['star', 'kamikaza', 'family', 'eat', 'some', 'banana', 'brock', 'david', 'gun', 'walk', 'talk', 'stay', 'wing', 'yang', 'snow', 'fire']
	return names[Math.floor(Math.random() * names.length)] + famName[Math.floor(Math.random() * names.length)]
}

export function generateRandomImg() {
	//try to get diff img every time
	return 'pro' + Math.floor(Math.random() * 17 + 1) + '.png'
}

export function timeAgo(
	ms: number | Date = new Date()
): string {
	const date = ms instanceof Date ? ms : new Date(ms)
	const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

	const ranges: Record<string, number> = {
		years: 3600 * 24 * 365,
		months: 3600 * 24 * 30,
		weeks: 3600 * 24 * 7,
		days: 3600 * 24,
		hours: 3600,
		minutes: 60,
		seconds: 1,
	}

	const secondsElapsed = (date.getTime() - Date.now()) / 1000

	for (const [unit, seconds] of Object.entries(ranges)) {
		if (seconds < Math.abs(secondsElapsed)) {
			const delta = secondsElapsed / seconds
			let time = formatter.format(Math.round(delta), unit as Intl.RelativeTimeFormatUnit)

			if (time.includes('in ')) {
				time = time.replace('in ', '')
			}
			if (!time.includes('ago') && secondsElapsed < 0) {
				time += ' ago'
			}
			return time
		}
	}

	return 'just now'
}

export function getRandomIntInclusive(min: number, max: number) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomPastTime() {
	const HOUR = 1000 * 60 * 60
	const DAY = 1000 * 60 * 60 * 24
	const WEEK = 1000 * 60 * 60 * 24 * 7

	const pastTime = getRandomIntInclusive(HOUR, WEEK)
	return Date.now() - pastTime
}