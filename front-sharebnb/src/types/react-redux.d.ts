
// import type { Dispatch as ReduxDispatch, Action } from 'redux';

// // Make Dispatch<Action<unknown>> compatible with places expecting Action<string>
// declare module 'react-redux' {
//   // This relaxes the constraint in connect / useSelector internals
//   export interface DefaultRootState {} // optional, can be empty

//   // Override the Dispatch type to accept Action<unknown>
//   export function useAppDispatch<T = Dispatch<Action<unknown>>>(): T;

//   // If you use connect, this helps too
//   export type Dispatch<A extends Action = Action<unknown>> = ReduxDispatch<A>;
// }