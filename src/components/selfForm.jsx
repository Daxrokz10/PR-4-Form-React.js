import React, { useState } from 'react';

const Form = () => {
  const [emp, setEmp] = useState({
    ename: '',
    esalary: '',
    gender: '',
    hobbies: []
  });
  const [list, setList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      const prev = emp.hobbies || [];
      let updated;
      if (checked) {
        // add if not already present
        updated = prev.includes(value) ? prev : [...prev, value];
      } else {
        updated = prev.filter((h) => h !== value);
      }
      setEmp((p) => ({ ...p, hobbies: updated }));
    } else {
      setEmp((p) => ({ ...p, [name]: value }));
    }
  };

  const validateForm = () => {
    let errs = {};
    if (!emp.ename?.trim()) {
      errs.ename = 'Employee name is required';
    }
    if (!emp.esalary) {
      errs.esalary = 'Employee salary is required';
    }
    setErrors(errs);
    return Object.keys(errs).length !== 0; // true if errors exist
  };

  const handleForm = (e) => {
    e.preventDefault();
    // return early if validation fails
    if (validateForm()) return;

    if (!editId) {
      setList((prev) => [...prev, { ...emp, id: Date.now() }]);
    } else {
      const data = list.map((val) => {
        if (val.id === editId) {
          return { ...val, ...emp };
        }
        return val;
      });
      setList(data);
      setEditId(null);
    }

    // reset form
    setEmp({ ename: '', esalary: '', gender: '', hobbies: [] });
    setErrors({});
  };

  const handleEdit = (id) => {
    const editData = list.find((val) => val.id === id);
    if (!editData) return;
    // ensure hobbies is an array
    setEmp({
      ename: editData.ename || '',
      esalary: editData.esalary || '',
      gender: editData.gender || '',
      hobbies: Array.isArray(editData.hobbies) ? editData.hobbies : []
    });
    setEditId(id);
    setErrors({});
  };

  const handleDelete = (id) => {
    const data = list.filter((val) => val.id !== id);
    setList(data);
    // if deleting the entry currently being edited, clear edit state
    if (editId === id) {
      setEditId(null);
      setEmp({ ename: '', esalary: '', gender: '', hobbies: [] });
      setErrors({});
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleForm}>
            <div className="mb-3">
              <label htmlFor="ename" className="form-label">
                Employee Name
              </label>
              <input
                type="text"
                value={emp.ename}
                name="ename"
                onChange={handleInput}
                className="form-control"
                id="ename"
                aria-describedby="ename"
              />
              {errors.ename ? <div className="text-danger">{errors.ename}</div> : null}
            </div>

            <div className="mb-3">
              <label htmlFor="esalary" className="form-label">
                Employee Salary
              </label>
              <input
                type="number"
                value={emp.esalary}
                name="esalary"
                onChange={handleInput}
                className="form-control"
                id="esalary"
              />
              {errors.esalary ? <div className="text-danger">{errors.esalary}</div> : null}
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
                  onChange={handleInput}
                  checked={emp.hobbies?.includes('coding') || false}
                  className="ms-2"
                />
                <label htmlFor="coding" className="me-3">
                  Coding
                </label>

                <input
                  id="reading"
                  type="checkbox"
                  name="hobbies"
                  value="reading"
                  onChange={handleInput}
                  checked={emp.hobbies?.includes('reading') || false}
                  className="ms-2"
                />
                <label htmlFor="reading" className="me-3">
                  Reading
                </label>

                <input
                  id="writing"
                  type="checkbox"
                  name="hobbies"
                  value="writing"
                  onChange={handleInput}
                  checked={emp.hobbies?.includes('writing') || false}
                  className="ms-2"
                />
                <label htmlFor="writing">Writing</label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              {editId ? 'Update' : 'Submit'}
            </button>
          </form>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Sr.no</th>
                <th>Emp Name</th>
                <th>Emp Salary</th>
                <th>Gender</th>
                <th>Hobbies</th>
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
                    <td>
                      <button className="btn btn-danger me-2" onClick={() => handleDelete(employee.id)}>
                        Delete
                      </button>
                      <button className="btn btn-warning" onClick={() => handleEdit(employee.id)}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center' }}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Form;