import { WherePanel, WherePanelProps } from "../../cmps/WherePanel.js"
import { DateRangePanel, DateRangePanelProps } from "../../cmps/DateRangePanel.js"
import { GuestsPanel, GuestsPanelProps } from "../../cmps/GuestsPanel.js"

export const PANELS_BY_KEY = {
    where: (props: WherePanelProps) => <WherePanel {...props} />,
    checkin: (props: DateRangePanelProps) => <DateRangePanel {...props} />,
    checkout: (props: DateRangePanelProps) => <DateRangePanel {...props} />,
    who: (props: GuestsPanelProps) => <GuestsPanel {...props} />,
}
