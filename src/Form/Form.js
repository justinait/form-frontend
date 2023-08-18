import React, { useEffect, useState } from 'react';
import './Form.css';
import Axios from "axios";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Table from 'react-bootstrap/Table';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);


function Form() {

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [years, setYears] = useState(0);
  const [position, setPosition] = useState('');
  const [id, setId] = useState('');

  const [edit, setEdit] = useState(false);
  const [usersList, setUsersList] = useState([]);

  useEffect(()=>{
    getUsers()  
  },[])
  const getUsers = ()=> {
    Axios.get("http://localhost:3001/users").then((res)=> {
      setUsersList(res.data);
    });
  }

  const addUser = ()=> {
    Axios.post("http://localhost:3001/create", {
      name,
      lastName,
      years,
      country,
      position
    }).then(()=> {
      getUsers();
      MySwal.fire({
        title: <strong>Listo</strong>,
        html: <i>{name} fue agregad@ correctamente</i>,
        icon: 'success',
        timer: 2000
      })
      cleanInputs();
    });
  }

  const cleanInputs = ()=> {
    setName('');
    setLastName('');
    setCountry('');
    setPosition('');
    setYears('');
    setId('');

    setEdit(false);
  }

  const updateUser = ()=> {
    Axios.put("http://localhost:3001/update", { //la url coincide con la q configuramos en server
      id,  
      name,
      lastName,
      years,
      country,
      position
    }).then(()=> {
      getUsers();
      MySwal.fire({
        title: <strong>Listo</strong>,
        html: <i>{name} fue actualizad@ correctamente</i>,
        icon: 'success',
        timer: 2000
      })
      cleanInputs();
      setEdit(false);
    });
  }

  const deleteUser = (id)=> {
    MySwal.fire({
      title: <strong>Estás seguro que deseas eliminarlo?</strong>,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: 'red',
      cancelButtonText: 'No',
      confirmButtonColor: 'green',
      confirmButtonText: 'Si'
    }).then(res=> {
      if(res.isConfirmed) {
        Axios.delete(`http://localhost:3001/delete/${id}`).then(()=> {
          getUsers();
          cleanInputs();
          setEdit(false);
        
          MySwal.fire({
            title: 'Eliminado',
            icon: 'success',
            timer: 2000
          })
        }).catch(function(error){
          MySwal.fire({
            title: 'Oops... Algo salió mal',
            icon: 'error'
          })
        })
      }
    })
  }

  const editUser = (val) => {
    setEdit(true);

    setName(val.name);
    setLastName(val.lastName);
    setYears(val.years);
    setPosition(val.position);
    setCountry(val.country);
    setId(val.id);
  }
  
  return (
    
    <div className='form'>
      <div className='inputs'>
        <label>Nombre: <input
          onChange={(event)=>{
            setName(event.target.value)
          }}
          type='text'
          value={name}
          /> 
        </label>
        <label>Apellido: <input
          onChange={(event)=>{
            setLastName(event.target.value)
          }}
          type='text' 
          value={lastName}
          />
        </label>
        <label>Edad: <input 
          onChange={(event)=>{
            setYears(event.target.value)
          }}
          type='number' 
          value={years}
          />
        </label>
        <label>País: <input 
          onChange={(event)=>{
            setCountry(event.target.value)
          }}
          type='text' 
          value={country}
          /> 
        </label>
        <label>Cargo: <input 
          onChange={(event)=>{
            setPosition(event.target.value)
          }}
          type='text' 
          value={position}
          />
        </label>
      </div>
      {
        edit ? 
        <>
          <Button onClick={updateUser} variant="outline-dark">Actualizar</Button>
          <Button onClick={cleanInputs} variant="outline-danger">Cancelar</Button>
        </>
        : <Button onClick={addUser} variant="outline-secondary">Guardar</Button>
      }
      
      {/* {getUsers()} */}

      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Edad</th>
            <th>País</th>
            <th>Cargo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usersList.map((val, key)=> {
            return (
              <tr>
                <td>{val.id}</td>
                <td>{val.name}</td>
                <td>{val.lastName}</td>
                <td>{val.years}</td>
                <td>{val.country}</td>
                <td>{val.position}</td>
                <ButtonGroup size="sm" color='light'>
                  <Button onClick={()=>{editUser(val)}}>Editar</Button>
                  <Button onClick={()=>{
                    deleteUser(val.id)
                  }}>Eliminar</Button>
                </ButtonGroup>
              </tr>
            )})
          }
        </tbody>
      </Table>
    </div>
  )
}

export default Form