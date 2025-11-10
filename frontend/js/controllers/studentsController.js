/**
*    File        : frontend/js/controllers/studentsController.js
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/


import { studentsAPI } from '../api/studentsAPI.js';

document.addEventListener('DOMContentLoaded', () => 
{
    loadStudents();
    setupFormHandler();
    setupCancelHandler();
});
  
function setupFormHandler()
{
    const form = document.getElementById('studentForm');
    form.addEventListener('submit', async e => 
    {
        e.preventDefault();
        const student = getFormData();
    
        try 
        {
            if (student.id) 
            {
                await studentsAPI.update(student);
            } 
            else 
            {
                await studentsAPI.create(student);
                const msgBox = document.getElementById("msgBox"); // mensaje de validacion
                msgBox.classList.add("w3-green"); // agregamos verde para verificar creacion
                msgBox.innerHTML = `<b>Estudiante creado correctamente.</b>`; // texto
                msgBox.classList.remove("w3-hide"); // Mostrar

                setTimeout(() => msgBox.classList.add("w3-hide"), 4000);
            }
            clearForm();
            loadStudents();
        }
        catch (err)
        {
            console.error("Error al crear al estudiante: ", err.message);
            let errorMessage = "Error al crear al estudiante."
            if (err.message.includes("POST")){
                errorMessage = "Error en carga de datos. Revisalos nuevamente"
            }
            const msgBox = document.getElementById("msgBox");
            msgBox.classList.add("w3-red"); // agregamos rojo para remarcar error
            msgBox.innerHTML = `<b>Error:</b> ${errorMessage}`; // texto
            msgBox.classList.remove("w3-hide");

            setTimeout(() => msgBox.classList.add("w3-hide"), 4000);
            // luego de unos segundos, se agrega la clase para ocultar el mensaje de error, para que desaparezca
        }
    });
}

function setupCancelHandler()
{
    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', () => 
    {
        document.getElementById('studentId').value = '';
    });
}
  
function getFormData()
{
    return {
        id: document.getElementById('studentId').value.trim(),
        fullname: document.getElementById('fullname').value.trim(),
        email: document.getElementById('email').value.trim(),
        age: parseInt(document.getElementById('age').value.trim(), 10)
    };
}
  
function clearForm()
{
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
}
  
async function loadStudents()
{
    try 
    {
        const students = await studentsAPI.fetchAll();
        renderStudentTable(students);
    } 
    catch (err) 
    {
        console.error('Error cargando estudiantes:', err.message);
    }
}
  
function renderStudentTable(students)
{
    const tbody = document.getElementById('studentTableBody');
    tbody.replaceChildren();
  
    students.forEach(student => 
    {
        const tr = document.createElement('tr');
    
        tr.appendChild(createCell(student.fullname));
        tr.appendChild(createCell(student.email));
        tr.appendChild(createCell(student.age.toString()));
        tr.appendChild(createActionsCell(student));
    
        tbody.appendChild(tr);
    });
}
  
function createCell(text)
{
    const td = document.createElement('td');
    td.textContent = text;
    return td;
}
  
function createActionsCell(student)
{
    const td = document.createElement('td');
  
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'w3-button w3-blue w3-small';
    editBtn.addEventListener('click', () => fillForm(student));
  
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Borrar';
    deleteBtn.className = 'w3-button w3-red w3-small w3-margin-left';
    deleteBtn.addEventListener('click', () => confirmDelete(student.id));
  
    td.appendChild(editBtn);
    td.appendChild(deleteBtn);
    return td;
}
  
function fillForm(student)
{
    document.getElementById('studentId').value = student.id;
    document.getElementById('fullname').value = student.fullname;
    document.getElementById('email').value = student.email;
    document.getElementById('age').value = student.age;
}
  
async function confirmDelete(id) 
{
    if (!confirm('¿Estás seguro que deseas borrar este estudiante?')) return;
  
    try 
    {
        await studentsAPI.remove(id);
        loadStudents();
    } 
    catch (err) 
    {
        let customMessage = 'Ocurrió un error';

        if (err.message.includes('DELETE')) {
            customMessage = 'No se pudo eliminar el estudiante. Verifica que no tenga materias asociadas.';
        }

        alert(customMessage);
    }
}
  