import { WherePanel } from "../../cmps/WherePanel.jsx"
import { DateRangePanel } from "../../cmps/DateRangePanel.jsx"
import { GuestsPanel } from "../../cmps/GuestsPanel.jsx"

export const PANELS_BY_KEY = {
    where: (props) => <WherePanel {...props} />,
    checkin: (props) => <DateRangePanel {...props} activeCell="checkin" />,
    checkout: (props) => <DateRangePanel {...props} activeCell="checkout" />,
    who: (props) => <GuestsPanel {...props} />,
}
