export interface AggregateReview {
    _id: string
    txt: string
    byUser: {
        _id: string
        fullname: string
        imgUrl: string
    }
    aboutStay: {
        _id: string
        fullname: string
    }
}