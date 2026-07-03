
const studentGrid = document.getElementById("studentGrid");
const searchInput = document.getElementById("searchStudent");

// ================================
// DISPLAY STUDENTS
// ================================

function displayStudents(studentList) {

    studentGrid.innerHTML = "";

    if (studentList.length === 0) {

        studentGrid.innerHTML = `
            <div class="no-student">
                <h3>No Student Found</h3>
            </div>
        `;

        return;
    }

    studentList.forEach(student => {

        studentGrid.innerHTML += `

            <div class="student-card">

                <img src="${student.photo}"
                     alt="${student.name}">

                <h3>${student.name}</h3>

                <p>Student ID : ${student.id}</p>

                <a href="student.html?id=${student.id}"
                   class="btn">

                    View Portfolio

                </a>

            </div>

        `;

    });

}

// ================================
// INITIAL LOAD
// ================================

displayStudents(students);

// ================================
// SEARCH STUDENT
// ================================

searchInput.addEventListener("keyup", function () {

    const keyword = this.value.toLowerCase().trim();

    const filteredStudents = students.filter(student =>

        student.name.toLowerCase().includes(keyword) ||

        student.id.toString().includes(keyword)

    );

    displayStudents(filteredStudents);

});