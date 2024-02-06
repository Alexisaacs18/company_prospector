import React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function OpenPosition() {

    const navigate = useNavigate()

    function navigateToOpenPositions() {
        navigate('/openpositions')
    }

    const location = useLocation()
    const prop = location.state

    const url = "http://127.0.0.1:5555"

    const formOutline = {
        company_id: prop.position.company_id,
        contact_id: prop.position.contact_id,
        position: prop.position.position,
        salary_range: prop.position.salary_range,
        position_status: prop.position.position_status
    }

    const [form, setForm] = useState(formOutline)
    const [edit, setEdit] = useState(true)
    const [companies, setCompanies] = useState([])
    const [contacts, setContacts] = useState([])
    const [company, setCompany] = useState({})
    const [contact, setContact] = useState({})

    useEffect(() => {
        fetch(`${url}/companies`)
            .then((res) => res.json())
            .then((data) => {
                setCompanies(data)
            })
    }, [])

    useEffect(() => {
        fetch(`${url}/contacts`)
            .then((res) => res.json())
            .then((data) => {
                setContacts(data)
            })
    }, [])

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    function handleClick() {
        setEdit(prev => !prev)
    }

    useEffect(() => {
        getCompany()
    }, [])

    useEffect(() => {
        getContact()
    }, [])

    function handleSubmit(e) {
        e.preventDefault()

        const data = {
            company_id: form.company_id,
            contact_id: form.contact_id,
            position: form.position,
            salary_range: form.salary_range,
            position_status: form.position_status
        }

        getCompany()
        getContact()

        fetch(`${url}/open_positions/${prop.position.id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    }

    function getCompany() {
        fetch(`${url}/companies/${form.company_id}`)
            .then((res) => res.json())
            .then((data) => {
                setCompany(data)
            })
    }

    function getContact() {
        fetch(`${url}/contacts/${form.contact_id}`)
            .then((res) => res.json())
            .then((data) => {
                setContact(data)
            })
    }

    return (
        <div>
            <div className="page">
                <button onClick={navigateToOpenPositions}>Back to Open Positions</button>
            </div>
            <div className="container">
                <div className="openPosition">
                    {edit ?
                        <div>
                            <h3>Position: {form.position}</h3>
                            <p>Company: {company.name}</p>
                            <p>Contact: {contact.name}</p>
                            <p>Salary Range: {form.salary_range}</p>
                            {form.position_status ? <p>Status: Open</p> : <p>Status: Closed</p>}
                            <button onClick={handleClick}>Edit</button>
                        </div>
                        :
                        <div>
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="position">Position:</label>
                                <input onChange={handleChange} value={form.position} type="text" name="position" />

                                <label htmlFor="company_id">Company:</label>
                                <select onChange={handleChange} name="company_id" defaultValue={form.company_id}>
                                    {companies.map((company) => (
                                        <option key={company.id} value={company.id} label={company.name} />
                                    ))}
                                </select>

                                <label htmlFor="contact_id">Contact:</label>
                                <select onChange={handleChange} name="contact_id" defaultValue={form.contact_id}>
                                    {contacts.map((contact) => (
                                        <option key={contact.id} value={contact.id} label={contact.name} />
                                    ))}
                                </select>

                                <label htmlFor="salary_range">Salary Range:</label>
                                <input onChange={handleChange} value={form.salary_range} type="text" name="salary_range" />

                                <label htmlFor="position_status">Status:</label>
                                <select onChange={handleChange} value={form.position_status} name="position_status" >
                                    <option value={true}>Open</option>
                                    <option value={false}>Closed</option>
                                </select>

                                <button type="submit">Update Position</button>
                            </form>
                            <button onClick={handleClick}>Back</button>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default OpenPosition