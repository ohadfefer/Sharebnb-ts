import { FormEvent, useState } from "react"
import { useSelector } from "react-redux"

import { addReview } from "../store/actions/review.actions.js"

import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { useAppSelector } from "../store/hooks.js"

// types
import { Review } from "../types/review.js"

export function ReviewEdit() {
	const users = useAppSelector(storeState => storeState.userModule.users)
	const [reviewToEdit, setReviewToEdit] = useState<Partial<Review>>({})

	function handleChange(ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
		const { name, value } = ev.target
		setReviewToEdit({ ...reviewToEdit, [name]: value })
	}

    async function onAddReview(ev: FormEvent) {
		ev.preventDefault()
		if (!reviewToEdit.txt || !reviewToEdit.aboutStayId) return alert('All fields are required')
            
		try {
			await addReview(reviewToEdit)
			showSuccessMsg('Review added')
			setReviewToEdit({ txt: '', aboutStayId: '' })
		} catch (err) {
			showErrorMsg('Cannot add review')
		}
	}

   return <form className="review-edit" onSubmit={onAddReview}>
        <select onChange={handleChange} value={reviewToEdit.aboutStayId} name="aboutUserId">
            <option value="">Review about...</option>
            {users.map(user =>
                <option key={user._id} value={user._id}>
                    {user.fullname}
                </option>
            )}
        </select>
        <textarea name="txt" onChange={handleChange} value={reviewToEdit.txt}></textarea>
        <button>Add</button>
    </form>

}