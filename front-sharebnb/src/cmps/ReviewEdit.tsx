import { FormEvent, useState } from "react"
import { useSelector } from "react-redux"

import { addReview } from "../store/actions/review.actions.js"

import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { useAppSelector } from "../store/hooks.js"

// types
import { Review } from "../types/review.js"
import { useParams } from "react-router"
import { error } from "node:console"

type ReviewToEdit = { txt: string }
export function ReviewEdit() {
	const { stayId } = useParams()
	const [reviewToEdit, setReviewToEdit] = useState<ReviewToEdit>({ txt: '' })

	function handleChange(ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
		const { name, value } = ev.target
		setReviewToEdit({ ...reviewToEdit, [name]: value })
	}

	async function onAddReview(ev: FormEvent) {
		ev.preventDefault()
		if (!reviewToEdit.txt) return alert('All fields are required')
		if (!stayId) {
			showErrorMsg('Cannot add review — missing stayId')
			return
		}

		try {
			await addReview({ ...reviewToEdit, aboutStayId: stayId })
			showSuccessMsg('Review added')
			setReviewToEdit({ txt: '' })
		} catch (err) {
			showErrorMsg('Cannot add review')
		}
	}

	return (
		<div className="review-edit-container">
			<form className="review-edit-form" onSubmit={onAddReview}>
				<textarea
					name="txt"
					placeholder="Write your review..."
					onChange={handleChange}
					value={reviewToEdit.txt}
					className="review-textarea"
					rows={4}
				/>
				<div className="review-edit-actions">
					<button
						type="submit"
						className="btn-submit-review"
						disabled={!reviewToEdit.txt?.trim()}
					>
						Submit review
					</button>
				</div>
			</form>
		</div>
	)

}