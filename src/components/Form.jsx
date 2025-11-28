import React, { useEffect, useState } from 'react';

const Form = () => {

    const [emp, setEmp] = useState({
        ename: '',
        esalary: '',
        gender: '',
        hobbies: [],
        address: '',
        city: ''           // added city
    });
    const [list, setList] = useState([]);
    const [errors, setErrors] = useState({});
    const [editId, setEditId] = useState(null)
    const [mount, setMount] = useState(false);

    useEffect(() => {
        let oldData = JSON.parse(localStorage.getItem('list')) || [];
        setList(oldData);
        setMount(true);
    }, [])

    useEffect(() => {
        if (mount) {
            localStorage.setItem('list', JSON.stringify(list));
        }
    }, [list, mount])

    const handleInput = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            const prev = emp.hobbies || [];
            let updated;

            if (checked) {
                updated = prev.includes(value) ? prev : [...prev, value];
            } else {
                updated = prev.filter((h) => h !== value);
            }
            setEmp({ ...emp, hobbies: updated })
        } else {
            setEmp({ ...emp, [name]: value });
        }

    }
    const handleForm = (e) => {
        e.preventDefault();

        if (validation()) return;

        if (!editId) {
            setList([...list, { ...emp, id: Date.now() }]);

        } else {
            const data = list.map((val) => {
                if (val.id === editId) {
                    return { ...val, ...emp }
                } else {
                    return val;
                }
            });
            setList(data);
            setEditId(null);
        }
        setEmp({ ename: '', esalary: '', gender: '', hobbies: [], address: '', city: '' }); // reset includes city
        setErrors({});
    }
    const validation = () => {
        let errors = {}

        if (!emp.ename?.trim()) {
            errors.ename = "Name is required";
        }
        if (!emp.esalary) {
            errors.esalary = "Salary is required";
        }
        setErrors(errors);
        return Object.keys(errors).length !== 0
    }

    const handleDelete = (id) => {
        const data = list.filter((val) => val.id !== id);
        setList(data);

        if (editId === id) {
            setEditId(null);
            setEmp({ ename: '', esalary: '', gender: '', hobbies: [], address: '', city: '' });
            setErrors({});
        }
    }

    const handleEdit = (id) => {
        let editData = list.find((val) => val.id == id);
        setEmp({
          ename: editData.ename || '',
          esalary: editData.esalary || '',
          gender: editData.gender || '',
          hobbies: Array.isArray(editData.hobbies) ? editData.hobbies : (editData.hobbies ? [editData.hobbies] : []),
          address: editData.address || '',
          city: editData.city || ''  
        });
        setEditId(id);
    }


    return (
        <div className="container my-app-wrap">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card-ish">
                        <h4 style={{ marginBottom: 18 }}>Employee form</h4>

                        <form method='post' onSubmit={handleForm}>
                            <div className="mb-3">
                                <label htmlFor="ename" className="form-label">
                                    Employee Name
                                </label>
                                <input
                                    type="text"
                                    name="ename"
                                    className="form-control"
                                    id="ename"
                                    aria-describedby="ename"
                                    onChange={handleInput}
                                    value={emp.ename}
                                    placeholder="e.g. Aman Kumar"
                                />
                                {errors.ename ? <div className='text-danger mt-1' style={{ fontSize: 13 }}>{errors.ename}</div> : <div className="hint mt-1">Full name, please.</div>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="esalary" className="form-label">
                                    Employee Salary
                                </label>
                                <input
                                    type="number"
                                    name="esalary"
                                    className="form-control"
                                    id="esalary"
                                    onChange={handleInput}
                                    value={emp.esalary}
                                    placeholder="monthly salary"
                                />
                                {errors.esalary ? <div className='text-danger mt-1' style={{ fontSize: 13 }}>{errors.esalary}</div> : null}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Gender: </label>
                                <div>
                                    <input
                                        id="male"
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        onChange={handleInput}
                                        checked={emp.gender === 'male'}
                                    />
                                    <label htmlFor="male" className="ms-2 me-3">
                                        Male
                                    </label>

                                    <input
                                        id="female"
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        onChange={handleInput}
                                        checked={emp.gender === 'female'}
                                    />
                                    <label htmlFor="female" className="ms-2">
                                        Female
                                    </label>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Hobbies: </label>
                                <div>
                                    <input
                                        id="coding"
                                        type="checkbox"
                                        name="hobbies"
                                        value="coding"
                                        className="ms-2"
                                        onChange={handleInput}
                                        checked={emp.hobbies?.includes('coding') || false}
                                    />
                                    <label htmlFor="coding" className="me-3">
                                        Coding
                                    </label>

                                    <input
                                        id="reading"
                                        type="checkbox"
                                        name="hobbies"
                                        value="reading"
                                        className="ms-2"
                                        onChange={handleInput}
                                        checked={emp.hobbies?.includes('reading') || false}
                                    />
                                    <label htmlFor="reading" className="me-3">
                                        Reading
                                    </label>

                                    <input
                                        id="writing"
                                        type="checkbox"
                                        name="hobbies"
                                        value="writing"
                                        className="ms-2"
                                        onChange={handleInput}
                                        checked={emp.hobbies?.includes('writing') || false}
                                    />
                                    <label htmlFor="writing">Writing</label>
                                </div>

                                <div style={{ marginTop: 8 }}>
                                    {emp.hobbies && emp.hobbies.map(h => <span key={h} className="hobby-chip">{h}</span>)}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Address:</label>
                                <textarea
                                    name="address"
                                    className="form-control"
                                    rows={3}
                                    placeholder="Street, city, state"
                                    value={emp.address}
                                    onChange={handleInput}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">City:</label>
                                <select
                                    name="city"
                                    className="form-select"
                                    value={emp.city}
                                    onChange={handleInput}
                                >
                                    <option value="">Select city</option>
                                    <option value="Ahmedabad">Ahmedabad</option>
                                    <option value="Mumbai">Mumbai</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Bangalore">Bangalore</option>
                                    <option value="Chennai">Chennai</option>
                                </select>
                            </div>

                            <div style={{ marginTop: 8 }}>
                                <button type="submit" className="btn btn-primary me-2">
                                    {editId ? 'Update' : 'Submit'}
                                </button>
                                <button type="button" className="btn btn-outline-secondary" onClick={() => {
                                    setEmp({ ename: '', esalary: '', gender: '', hobbies: [], address: '', city: '' });
                                    setErrors({});
                                    setEditId(null);
                                }}>
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="card-ish mt-4">
                        <h5 style={{ marginBottom: 12 }}>Employee</h5>
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Sr.no</th>
                                        <th>Emp Name</th>
                                        <th>Emp Salary</th>
                                        <th>Gender</th>
                                        <th>Hobbies</th>
                                        <th>Address</th>
                                        <th>City</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.length !== 0 ? (
                                        list.map((employee, index) => (
                                            <tr key={employee.id}>
                                                <td>{index + 1}</td>
                                                <td>{employee.ename}</td>
                                                <td>{employee.esalary}</td>
                                                <td>{employee.gender}</td>
                                                <td>{Array.isArray(employee.hobbies) ? employee.hobbies.join(', ') : employee.hobbies}</td>
                                                <td style={{ maxWidth: 260, whiteSpace: 'normal', wordBreak: 'break-word' }}>{employee.address}</td>
                                                <td>{employee.city}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-danger me-2" onClick={() => handleDelete(employee.id)}>
                                                        Delete
                                                    </button>
                                                    <button className="btn btn-sm btn-warning" onClick={() => handleEdit(employee.id)}>
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} style={{ textAlign: 'center' }}>
                                                No data available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Form;
