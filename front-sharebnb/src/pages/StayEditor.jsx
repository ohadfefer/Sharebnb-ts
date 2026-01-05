import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { addStay, updateStay, getCmdSetStay } from '../store/actions/stay.actions'
import { stayService } from '../services/stay'
import { uploadService } from '../services/upload.service'
import { userService } from '../services/user'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

import { AutoCompletePanel } from '../cmps/AutoCompletePanel'

// options
const PROPERTY_TYPES = ['Apartment', 'House', 'Villa', 'Cabin', 'B&B', 'Loft', 'Unique Stay', 'Farm stay']
const LABEL_OPTIONS = ['Luxury', 'Beachfront', 'Family Friendly', 'Business', 'Trendy', 'Central', 'Cozy', 'Nature', 'Hiking', 'Romantic']
const AMENITY_OPTIONS = ['Wifi', 'Kitchen', 'Air conditioning', 'Heating', 'Parking', 'Pool', 'Elevator', 'Workspace', 'Breakfast included', 'Fireplace', 'Garden', 'Private bathroom']

export function StayEditor() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { stayId } = useParams()
    const isEditMode = !!stayId
    const loggedinUser = useMemo(() => userService.getLoggedinUser(), [])
    useEffect(() => { if (!loggedinUser) navigate('/auth/login') }, [loggedinUser, navigate])

    const { isLoading, stay } = useSelector(s => s.stayModule)

    const [step, setStep] = useState(0)
    const [saving, setSaving] = useState(false)
    const [addressQuery, setAddressQuery] = useState('')

    // main form state
    const [form, setForm] = useState(() => {
        // restore draft if exists (only for new stays)
        if (!isEditMode) {
            const draft = localStorage.getItem('addlist_draft')
            if (draft) return JSON.parse(draft)
        }
        return {
            name: '', type: '', price: '',
            loc: { address: '', city: '', country: '', countryCode: '', street: '', lat: null, lng: null },
            imgUrls: [],
            capacity: 0, rooms: 0, bedrooms: 0, bathrooms: 0,
            labels: [], amenities: [],
            description: ''
        }
    })

    // Load existing stay data when in edit mode
    useEffect(() => {
        if (isEditMode && stayId) {
            const loadStay = async () => {
                try {
                    const existingStay = await stayService.getById(stayId)
                    dispatch(getCmdSetStay(existingStay))
                    
                    // Populate form with existing stay data
                    setForm({
                        name: existingStay.name || '',
                        type: existingStay.type || '',
                        price: existingStay.price || '',
                        loc: {
                            address: existingStay.loc?.address || '',
                            city: existingStay.loc?.city || '',
                            country: existingStay.loc?.country || '',
                            countryCode: existingStay.loc?.countryCode || '',
                            street: existingStay.loc?.street || '',
                            lat: existingStay.loc?.lat || null,
                            lng: existingStay.loc?.lng || null
                        },
                        imgUrls: existingStay.imgUrls || [],
                        capacity: existingStay.capacity || 0,
                        rooms: existingStay.rooms || 0,
                        bedrooms: existingStay.bedrooms || 0,
                        bathrooms: existingStay.bathrooms || 0,
                        labels: existingStay.labels || [],
                        amenities: existingStay.amenities || [],
                        description: existingStay.description || ''
                    })
                    setAddressQuery(existingStay.loc?.address || '')
                } catch (err) {
                    showErrorMsg('Failed to load stay data')
                    navigate('/dashboard/listings')
                }
            }
            loadStay()
        }
    }, [isEditMode, stayId, dispatch, navigate])

    // autosave draft (only for new stays)
    useEffect(() => {
        if (!isEditMode) {
            localStorage.setItem('addlist_draft', JSON.stringify(form))
        }
    }, [form, isEditMode])

    function onChange(e) {
        const { name, value, type } = e.target
        if (name.startsWith('loc.')) {
            const key = name.split('.')[1]
            setForm(f => ({ ...f, loc: { ...f.loc, [key]: value } }))
        } else {
            setForm(f => ({ ...f, [name]: type === 'number' ? (value === '' ? '' : +value) : value }))
        }
    }

    function toggle(field, val) {
        setForm(f => {
            const s = new Set(f[field])
            s.has(val) ? s.delete(val) : s.add(val)
            return { ...f, [field]: Array.from(s) }
        })
    }

    async function onFileInput(e) {
        try {
            const res = await uploadService.uploadImg(e)
            const url = res?.secure_url || res?.url
            if (!url) throw new Error('Upload failed')
            setForm(f => ({ ...f, imgUrls: [...f.imgUrls, url] }))
        } catch (err) {
            showErrorMsg('Image upload failed')
        } finally {
            e.target.value = null
        }
    }
    function removeImg(i) {
        setForm(f => ({ ...f, imgUrls: f.imgUrls.filter((_, idx) => idx !== i) }))
    }

    function validate(idx) {
        if (idx === 0) return form.name && form.type && +form.price > 0
        if (idx === 1) return form.loc.city && form.loc.country && form.loc.address
        if (idx === 2) return form.imgUrls.length > 0
        return true
    }
    function next() { if (validate(step)) setStep(s => Math.min(s + 1, STEPS.length - 1)) }
    function back() { setStep(s => Math.max(s - 1, 0)) }

    function clearDraft() {
        localStorage.removeItem('addlist_draft')
        setForm({
            name: '', type: '', price: '',
            loc: { address: '', city: '', country: '', countryCode: '', street: '', lat: null, lng: null },
            imgUrls: [],
            capacity: 0, rooms: 0, bedrooms: 0, bathrooms: 0,
            labels: [], amenities: [],
            description: ''
        })
        setAddressQuery('')
        setStep(0)
    }

    async function publish(e) {
        e.preventDefault()
        if (saving || isLoading) return
        setSaving(true)
        try {
            const payload = {
                ...form,
                _id: isEditMode ? stayId : undefined,
                price: +form.price,
                host: loggedinUser ? { 
                    _id: loggedinUser._id, 
                    fullname: loggedinUser.fullname, 
                    pictureUrl: loggedinUser.imgUrl 
                } : undefined
            }
            
            let saved
            if (isEditMode) {
                saved = await updateStay(payload) // dispatches internally
                showSuccessMsg('Listing updated')
            } else {
                saved = await addStay(payload) // dispatches internally
                showSuccessMsg('Listing published')
                localStorage.removeItem('addlist_draft')
            }
            
            navigate(`/stay/${saved._id}`)
        } catch (err) {
            showErrorMsg(isEditMode ? 'Cannot update listing' : 'Cannot publish listing')
        } finally {
            setSaving(false)
        }
    }

    const STEPS = [
        {
            title: 'Basics',
            content: (
                <div className="grid">
                    <div className="field col-3">
                        <label>Name</label>
                        <input name="name" value={form.name} onChange={onChange} placeholder="Sea Breeze Villa" />
                    </div>
                    <div className="field">
                        <label>Type</label>
                        <select name="type" value={form.type} onChange={onChange}>
                            <option value="">Select</option>
                            {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="field">
                        <label>Price per night</label>
                        <input type="number" name="price" value={form.price} onChange={onChange} min="0" />
                    </div>
                </div>
            )
        },
        {
            title: 'Location',
            content: (
                <>
                    <div className="field col-3">
                        <label>Search address</label>
                        <input
                            name="loc.address"
                            value={addressQuery}
                            onChange={(e) => setAddressQuery(e.target.value)}
                            placeholder="Type an address or city…"
                        />
                    </div>
                    <AutoCompletePanel
                        value={{ address: addressQuery }}
                        onChange={(loc) => {
                            setForm(f => ({
                                ...f, loc: {
                                    address: loc.address || f.loc.address,
                                    city: loc.city || f.loc.city,
                                    country: loc.country || f.loc.country,
                                    countryCode: loc.countryCode || f.loc.countryCode,
                                    street: loc.street || f.loc.street,
                                    lat: loc.lat ?? f.loc.lat,
                                    lng: loc.lng ?? f.loc.lng
                                }
                            }))
                            setAddressQuery(loc.address || '')
                        }}
                        onAdvance={next}
                    />
                    <div className="grid" style={{ marginTop: 12 }}>
                        <div className="field"><label>City</label>
                            <input name="loc.city" value={form.loc.city} onChange={onChange} />
                        </div>
                        <div className="field"><label>Country</label>
                            <input name="loc.country" value={form.loc.country} onChange={onChange} />
                        </div>
                        <div className="field col-2"><label>Street</label>
                            <input name="loc.street" value={form.loc.street} onChange={onChange} />
                        </div>
                    </div>
                    {!!(form.loc.lat && form.loc.lng) && (
                        <div className="hint">Lat/Lng captured: {form.loc.lat.toFixed(6)}, {form.loc.lng.toFixed(6)}</div>
                    )}
                </>
            )
        },
        {
            title: 'Photos',
            content: (
                <div>
                    <div className="dropzone">
                        <input type="file" accept="image/*" onChange={onFileInput} />
                        <span>Drop or click to upload</span>
                    </div>
                    {!!form.imgUrls.length && (
                        <ul className="thumbs">
                            {form.imgUrls.map((u, i) => (
                                <li key={i}><img src={u} alt="" /><button type="button" onClick={() => removeImg(i)}>✕</button></li>
                            ))}
                        </ul>
                    )}
                </div>
            )
        },
        {
            title: 'Details',
            content: (
                <div className="grid">
                    <div className="field"><label>Capacity</label>
                        <input type="number" name="capacity" value={form.capacity} onChange={onChange} min="0" />
                    </div>
                    <div className="field"><label>Bedrooms</label>
                        <input type="number" name="bedrooms" value={form.bedrooms} onChange={onChange} min="0" />
                    </div>
                    <div className="field"><label>Bathrooms</label>
                        <input type="number" name="bathrooms" value={form.bathrooms} onChange={onChange} min="0" />
                    </div>
                    <div className="field"><label>Rooms (total)</label>
                        <input type="number" name="rooms" value={form.rooms} onChange={onChange} min="0" />
                    </div>
                    <div className="field col-3">
                        <label>Description</label>
                        <textarea name="description" value={form.description} onChange={onChange} rows={5} placeholder="What makes your place special?" />
                    </div>
                </div>
            )
        },
        {
            title: 'Amenities & Labels',
            content: (
                <>
                    <div className="chips">
                        {AMENITY_OPTIONS.map(a => (
                            <button key={a} type="button"
                                className={`amenity ${form.amenities.includes(a) ? 'active' : ''}`}
                                onClick={() => toggle('amenities', a)}>{a}</button>
                        ))}
                    </div>
                    <div className="chips">
                        {LABEL_OPTIONS.map(l => (
                            <button key={l} type="button"
                                className={`amenity ${form.labels.includes(l) ? 'active' : ''}`}
                                onClick={() => toggle('labels', l)}>{l}</button>
                        ))}
                    </div>
                </>
            )
        },
        {
            title: 'Review & Publish',
            content: (
                <div className="review">
                    <h4>Quick summary</h4>
                    <ul>
                        <li><b>{form.name || '—'}</b> — {form.type || '—'} — {form.price ? `$${form.price}/night` : '—'}</li>
                        <li>{form.loc.address || form.loc.street ? `${form.loc.street ? form.loc.street + ', ' : ''}${form.loc.city}, ${form.loc.country}` : `${form.loc.city}, ${form.loc.country}`}</li>
                        <li>{form.bedrooms} bd · {form.bathrooms} ba · {form.capacity} guests</li>
                        {!!form.labels.length && <li>Labels: {form.labels.join(', ')}</li>}
                        {!!form.amenities.length && <li>Amenities: {form.amenities.join(', ')}</li>}
                    </ul>
                </div>
            )
        }
    ]

    return (
        <section className="wizard">
            <header className="wizard__header">
                <div className="wizard__title">{isEditMode ? 'Edit your listing' : 'Create your listing'}</div>
                <Stepper step={step} titles={STEPS.map(s => s.title)} />
            </header>

            <form onSubmit={publish} className="wizard__card">
                {STEPS[step].content}

                <div className="wizard__actions">
                    <button type="button" className="btn ghost" onClick={back} disabled={step === 0}>Back</button>
                    <button type="button" className="btn ghost" onClick={clearDraft}>Clear</button>
                    {step < STEPS.length - 1 ? (
                        <button type="button" className="btn primary" onClick={next} disabled={!validate(step)}>Next</button>
                    ) : (
                        <button className="btn primary" disabled={saving || isLoading}>
                            {saving ? (isEditMode ? 'Updating…' : 'Publishing…') : (isEditMode ? 'Update' : 'Publish')}
                        </button>
                    )}
                </div>
            </form>
        </section>
    )
}

function Stepper({ step, titles }) {
    return (
        <ol className="stepper">
            {titles.map((t, i) => (
                <li key={t} className={`stepper__item ${i <= step ? 'active' : ''}`}>
                    <span className="stepper__dot">{i + 1}</span>
                    <span className="stepper__label">{t}</span>
                </li>
            ))}
        </ol>
    )
}
