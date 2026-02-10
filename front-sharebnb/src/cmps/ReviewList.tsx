// import { userService } from '../services/user/index.js'

// import { ReviewPreview } from './ReviewPreview.js'

// // types
// import { Review } from '../types/review.js'

// type ReviewListProps = { reviews: Review[]; onRemoveReview: (reviewId: string) => void }

// export function ReviewList({ reviews, onRemoveReview }: ReviewListProps) {

//     function shouldShowActionBtns(review: Review) {
//         const user = userService.getLoggedinUser()

//         if (!user) return false
//         if (user.isAdmin) return true
//         return review.by?._id === user._id
//     }

//     return <section>
//         <ul className="review-list">
//             {reviews.map(review =>
//                 <li key={review._id}>
//                     {shouldShowActionBtns(review) && <div className="actions">
//                         <button onClick={() => onRemoveReview(review._id)}>x</button>
//                     </div>}
//                     <ReviewPreview review={review} />
//                 </li>)
//             }
//         </ul>
//     </section>
// }