import React, { useEffect, useState,useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchData,
    selectRow,
    deleteSelectedRows,
    selectAllRows,
    deselectAllRows,
    deleteSingleRow,
    startEditUser,
    cancelEditUser,
    saveEditedUser,
} from '../slice/crudslice';
import { Link } from 'react-router-dom';

const Index = () => {
    const { users, selectedRows, editedUser } = useSelector((state) => state.crudOperation);
    const dispatch = useDispatch();
    const [editedUserData, setEditedUserData] = useState({});
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;



    const [isModalVisible, setIsModalVisible] = useState(false);
    const modalRef = useRef();
  


    useEffect(() => {
        dispatch(fetchData());
    }, [dispatch]);
    
    useEffect(() => {
        // Attach an event listener for the hidden.bs.modal event
        modalRef.current.addEventListener('hidden.bs.modal', () => {
          // Reset the edited user data
          setEditedUserData({});
          // Reset the modal visibility
          setIsModalVisible(false);
        });
      }, []);

    const openModal = () => {
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };










    const handleRowSelection = (id) => {
        dispatch(selectRow(id));
    };

    const handleDeleteSelectedRows = () => {
        dispatch(deleteSelectedRows());
    };

    const handleSelectAllRows = () => {
        if (selectedRows.length === users.length) {
            dispatch(deselectAllRows());
        } else {
            dispatch(selectAllRows());
        }
    };

    const handleDeleteSingleRow = (id) => {
        dispatch(deleteSingleRow(id));
    };

    const handleStartEditUser = (id) => {
        dispatch(startEditUser(id));
        setEditedUserData(users.find(user => user.id === id));
        setIsEditModalVisible(true);
    };

    const handleCancelEditUser = () => {
        dispatch(cancelEditUser());
        setEditedUserData({});
        setIsEditModalVisible(false);
    };

    const handleSaveEditedUser = () => {
        dispatch(saveEditedUser(editedUserData));
        setEditedUserData({});
        setIsEditModalVisible(false);
    };

    const handleEditInputChange = (e, field) => {
        setEditedUserData({ ...editedUserData, [field]: e.target.value });
    };



    const handlePageChange = (page) => {
        setCurrentPage(page);
      };


    const filteredUsers = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.role.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const indexOfLastRecord = currentPage * recordsPerPage;
      const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
      const currentRecords = filteredUsers.slice(indexOfFirstRecord, indexOfLastRecord);

      
       // Calculate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredUsers.length / recordsPerPage); i++) {
    pageNumbers.push(i);
  }

    
    return (
        <>
            <div className="container">
                <div className="row mt-4">
                    <div className="col-md-12">
                    
                    
                    <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Left side - Search input */}
        <div>
          <input
            type="text"
            placeholder="&nbsp;Enter Value..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>


        <div>
          <button onClick={handleDeleteSelectedRows} className="btn btn-danger">
          <i class="fa fa-trash-o"></i>

          </button>
        </div>
      </div>


                        {/* ... (existing code) */}
                        <table className="table table-bordered">
                        <thead>
                                <tr>
                                   <th>
                                   <input
                                type="checkbox"
                                checked={selectedRows.length === users.length}
                                onChange={handleSelectAllRows}
                            />
                                   </th>
                                    <th scope="col">Id</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Role</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {currentRecords.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(user.id)}
                        onChange={() => handleRowSelection(user.id)}
                      />
                    </td>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      {editedUser && editedUser.id === user.id ? (
                        <>
                          <button onClick={handleSaveEditedUser}>
                          <i class="fa fa-edit" ></i>
                          </button>
                          <button className='mx-2' onClick={handleCancelEditUser}>
                          <i class="fa fa-trash-o" style={{color:"red"}}></i>

                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleStartEditUser(user.id)}
                            data-bs-toggle="modal"
                            data-bs-target="#editModal"
                           style={{border:"1px solid black",backgroundColor:"#fff"}}
                          >
                           <i class="fa fa-edit" ></i>

                          </button>
                          <button
                            className="mx-2"
                            onClick={() => handleDeleteSingleRow(user.id)}
                            style={{border:"1px solid black",backgroundColor:"#fff"}}
                          >
                           <i class="fa fa-trash-o" style={{color:"red"}}></i>

                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
                        </table>




                        <nav className="justify-content-end" style={{float:'right'}}>
  <ul className="pagination">
    <li className="page-item mx-5">
      <span className="page-link">
        Page {currentPage} of {Math.ceil(filteredUsers.length / recordsPerPage)}
      </span>
    </li>

    {pageNumbers.map((number) => (
      <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
        <button className="page-link" onClick={() => handlePageChange(number)}>
          {number}
        </button>
      </li>
    ))}

    <li className="page-item">
      <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
        Next
      </button>
    </li>
  </ul>
</nav>


                    </div>
                </div>
            </div>


            

            <div
        className={`modal fade ${isModalVisible ? 'show' : ''}`}
        id="editModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="editModalLabel"
        aria-hidden={!isModalVisible}
        ref={modalRef}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit User</h5>
             
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="editName">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="editName"
                    value={editedUserData.name || ''}
                    onChange={(e) => handleEditInputChange(e, 'name')}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="editEmail">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    id="editEmail"
                    value={editedUserData.email || ''}
                    onChange={(e) => handleEditInputChange(e, 'email')}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="editRole">Role</label>
                  <input
                    type="text"
                    className="form-control"
                    id="editRole"
                    value={editedUserData.role || ''}
                    onChange={(e) => handleEditInputChange(e, 'role')}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={handleCancelEditUser}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  handleSaveEditedUser();
                  closeModal(); // Close the modal after saving changes
                }}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
        </>
    );
};

export default Index;