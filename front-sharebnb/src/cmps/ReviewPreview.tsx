import { Link } from 'react-router-dom'

// types

import { Review } from '../types/stay.js'

export function ReviewPreview({ review }: { review: Review }) {
    const { by, aboutUser } = review

    return <article className="review-preview">
        <p>About: <Link to={`/user/${aboutUser?._id}`}>{aboutUser?.fullname}</Link></p>
        <p className="review-by">By: <Link to={`/user/${by._id}`}>{by.fullname}</Link></p>
        <p className="review-txt">{review.txt}</p>
    </article>
}