import React from 'react'
import ReactDOM from 'react-dom/client'

import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'

import * as serviceWorkerRegistration from './serviceWorkerRegistration.js'

import { store } from './store/store.js'
import { RootCmp } from './RootCmp.js'

import './store/actions/stay.actions.js'
import 'react-day-picker/dist/style.css'
import 'react-loading-skeleton/dist/skeleton.css'
import './assets/styles/main.css'


const rootElement = document.getElementById('root')

if (rootElement) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(
		<Provider store={store}>
			<Router>
				<RootCmp />
			</Router>
		</Provider>
	)
}

serviceWorkerRegistration.register()
