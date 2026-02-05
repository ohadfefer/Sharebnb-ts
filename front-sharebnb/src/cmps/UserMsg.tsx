import { eventBus, showSuccessMsg } from '../services/event-bus.service.js'
import { useState, useEffect, useRef } from 'react'
import { socketService, SOCKET_EVENT_REVIEW_ABOUT_YOU } from '../services/socket.service.js'

export function UserMsg() {
	const [msg, setMsg] = useState('') as any // notification system does not exist
	const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | undefined>()

	useEffect(() => {
		const unsubscribe = eventBus.on('show-msg', (msg: string) => {
			setMsg(msg)
			if (timeoutIdRef.current) {
				timeoutIdRef.current = undefined
				clearTimeout(timeoutIdRef.current)
			}
			timeoutIdRef.current = setTimeout(closeMsg, 3000)
		})

		socketService.on(SOCKET_EVENT_REVIEW_ABOUT_YOU, (review: Record<string, any>) => {
			showSuccessMsg(`New review about me ${review.txt}`)
		})

		return () => {
			unsubscribe()
			socketService.off(SOCKET_EVENT_REVIEW_ABOUT_YOU)
		}
	}, [])

	function closeMsg() {
		setMsg('')
	}

    function msgClass() {
        return msg ? 'visible' : ''
    }
	return (
		<section className={`user-msg ${msg?.type} ${msgClass()}`}>
			{msg?.stay && (
				<img 
					src={msg.stay.imgUrls?.[0]} 
					alt={msg.stay.name}
					className="stay-image"
					onError={(e: any) => {
						e.target.src = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
					}}
				/>
			)}
			<div className="msg-content">
				<span className="msg-text">{msg?.txt}</span>
				<button className="close-btn" onClick={closeMsg}>x</button>
			</div>
		</section>
	)
}
