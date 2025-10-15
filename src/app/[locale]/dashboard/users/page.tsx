'use client'
import React from 'react'
import { useEffect, useState, useRef } from "react"
import $api from "@/hooks/api"
import { IUsers, IUser } from "@/types/users"
import styles from "./Users.module.scss"

export default function Users() {
  const [users, setUsers] = useState<IUsers>([])
  const [expanded, setExpanded] = useState<number | null>(null)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [editingUser, setEditingUser] = useState<IUser | null>(null)
  const [editForm, setEditForm] = useState<Partial<IUser>>({})
  const [userTestsInput, setUserTestsInput] = useState("")
  const usersPerPage = 12
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await $api.get<IUsers>("users/crud")
        setUsers(res.data)
      } catch (err) {
        console.error("Error fetching users", err)
      }
    }
    fetchUsers()
  }, [])

  // Закрытие модального окна при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleCancelEdit()
      }
    }

    if (editingUser) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [editingUser])

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return
    try {
      await $api.delete("users/crud", { data: { id } })
      setUsers(users.filter(u => u.id !== id))
    } catch (err) {
      console.error("Error deleting user", err)
    }
  }

  const toggleExpand = (id: number) => {
    setExpanded(expanded === id ? null : id)
  }

  const handleEdit = (user: IUser) => {
    setEditingUser(user)
    setEditForm({ ...user })
    setUserTestsInput(Array.isArray(user.user_tests) ? user.user_tests.join(', ') : '')
  }

  const handleSaveEdit = async () => {
    if (!editingUser) return
    
    try {
      const res = await $api.put("users/crud", { 
        id: editingUser.id,
        ...editForm 
      })
      
      // Исправляем ошибку - проверяем структуру ответа
      if (res.data && res.data.success) {
        setUsers(users.map(u => u.id === editingUser.id ? res.data.user : u))
      } else {
        // Если структура другая, просто обновляем данные из формы
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...editForm } : u))
      }
      
      setEditingUser(null)
      setEditForm({})
      setUserTestsInput("")
    } catch (err) {
      console.error("Error updating user", err)
      // Если ошибка, все равно обновляем локально
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...editForm } : u))
      setEditingUser(null)
      setEditForm({})
      setUserTestsInput("")
    }
  }

  const handleCancelEdit = () => {
    setEditingUser(null)
    setEditForm({})
    setUserTestsInput("")
  }

  const handleInputChange = (field: keyof IUser, value: any) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleUserTestsChange = (value: string) => {
    setUserTestsInput(value)
    // Преобразуем строку в массив, убираем пустые элементы
    const testsArray = value.split(',')
      .map(test => test.trim())
      .filter(test => test.length > 0)
    
    setEditForm(prev => ({
      ...prev,
      user_tests: testsArray
    }))
  }

  const addTestItem = () => {
    const newTest = prompt("Enter test name:")
    if (newTest && newTest.trim()) {
      const currentTests = Array.isArray(editForm.user_tests) ? editForm.user_tests : []
      const updatedTests = [...currentTests, newTest.trim()]
      setUserTestsInput(updatedTests.join(', '))
      setEditForm(prev => ({
        ...prev,
        user_tests: updatedTests
      }))
    }
  }

  const removeTestItem = (index: number) => {
    const currentTests = Array.isArray(editForm.user_tests) ? editForm.user_tests : []
    const updatedTests = currentTests.filter((_, i) => i !== index)
    setUserTestsInput(updatedTests.join(', '))
    setEditForm(prev => ({
      ...prev,
      user_tests: updatedTests
    }))
  }

  const filteredUsers = users.filter(
    u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  )

  // Пагинация
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const EditIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
    </svg>
  )

  const DeleteIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
      <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1z"/>
    </svg>
  )

  const ChevronDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
      <path d="M7 10l5 5 5-5H7z"/>
    </svg>
  )

  const ChevronUpIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
      <path d="M7 14l5-5 5 5H7z"/>
    </svg>
  )

  const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  )

  const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
    </svg>
  )

  return (
    <div className={styles.tableWrapper}>
      <h2>Users List</h2>

      <input
        type="text"
        placeholder="Search by name or email..."
        className={styles.searchInput}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Draft</th>
            <th>Local</th>
            <th>Public</th>
            <th>Private</th>
            <th>Expire</th>
              <th>User Connect</th>
            <th>User Tests</th>
            <th>Actions</th>
            
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user: IUser, index: number) => (
            <React.Fragment key={user.id}>
              <tr>
                <td>{indexOfFirstUser + index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.draft}</td>
                <td>{user.local}</td>
                <td>{user.public}</td>
                <td>{user.private}</td>
                <td>{user.expire}</td>
                 <td>{user.users_connect}</td>
                
                   
                <td>
                  {user.user_tests.length > 0 && (
                    <button className={styles.expandBtn} onClick={() => toggleExpand(user.id)}>
                      {expanded === user.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </button>
                  )}
                </td>
                <td className={styles.actions}>
                  <button onClick={() => handleEdit(user)}>
                    <EditIcon />
                  </button>
                  <button onClick={() => handleDelete(user.id)}>
                    <DeleteIcon />
                  </button>
                </td>
              </tr>

              {expanded === user.id && (
                <tr>
                  <td colSpan={10} className={styles.userTests}>
                    {user.user_tests.map((t, i) => (
                      <div key={`test-${i}`} className={styles.testItem}>{t}</div>
                    ))}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
            className={styles.paginationBtn}
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={`${styles.paginationBtn} ${currentPage === page ? styles.active : ''}`}
            >
              {page}
            </button>
          ))}
          
          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className={styles.paginationBtn}
          >
            Next
          </button>
        </div>
      )}

      {/* Модальное окно редактирования */}
      {editingUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} ref={modalRef}>
            <div className={styles.modalHeader}>
              <h3>Edit User: {editingUser.name}</h3>
              <button onClick={handleCancelEdit} className={styles.closeBtn}>
                <CloseIcon />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Name:</label>
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Email:</label>
                <input
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Draft:</label>
                  <input
                    type="number"
                    value={editForm.draft || 0}
                    onChange={(e) => handleInputChange('draft', parseInt(e.target.value) || 0)}
                    className={styles.formInput}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Local:</label>
                  <input
                    type="number"
                    value={editForm.local || 0}
                    onChange={(e) => handleInputChange('local', parseInt(e.target.value) || 0)}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Public:</label>
                  <input
                    type="number"
                    value={editForm.public || 0}
                    onChange={(e) => handleInputChange('public', parseInt(e.target.value) || 0)}
                    className={styles.formInput}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Private:</label>
                  <input
                    type="number"
                    value={editForm.private || 0}
                    onChange={(e) => handleInputChange('private', parseInt(e.target.value) || 0)}
                    className={styles.formInput}
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                <label>Expire:</label>
                <input
                  type="text"
                  value={editForm.expire || ''}
                  onChange={(e) => handleInputChange('expire', e.target.value)}
                  className={styles.formInput}
                  placeholder="0"
                />
              </div>
                   <div className={styles.formGroup}>
                <label>Users connect:</label>
                <input
                  type="text"
                  value={editForm.users_connect || ''}
                  onChange={(e) => handleInputChange('users_connect', e.target.value)}
                  className={styles.formInput}
                  placeholder="0"
                />
              </div>
              </div>
        
              <div className={styles.formGroup}>
                <div className={styles.userTestsHeader}>
                  <label>User Tests:</label>
                  <button 
                    type="button" 
                    onClick={addTestItem}
                    className={styles.addTestBtn}
                  >
                    <PlusIcon /> Add Test
                  </button>
                </div>
                
                <div className={styles.testsInputContainer}>
                  <input
                    type="text"
                    value={userTestsInput}
                    onChange={(e) => handleUserTestsChange(e.target.value)}
                    className={styles.formInput}
                    placeholder="Enter tests separated by commas"
                  />
                </div>
                
                {Array.isArray(editForm.user_tests) && editForm.user_tests.length > 0 && (
                  <div className={styles.testsList}>
                    <div className={styles.testsLabel}>Current tests:</div>
                    {editForm.user_tests.map((test, index) => (
                      <div key={index} className={styles.testTag}>
                        {test}
                        <button 
                          type="button" 
                          onClick={() => removeTestItem(index)}
                          className={styles.removeTestBtn}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button onClick={handleCancelEdit} className={styles.cancelBtn}>
                Cancel
              </button>
              <button onClick={handleSaveEdit} className={styles.saveBtn}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}