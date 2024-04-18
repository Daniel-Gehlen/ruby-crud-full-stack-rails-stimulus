import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  constructor(element) {
    super(element);
    this.renderList();
  }

  static base_uri = "http://127.0.0.1:3000";

  async register(event) {
    event.preventDefault();

    const name = this.element.querySelector("input[name='name']").value;
    const email = this.element.querySelector("input[name='email']").value;
    const phone = this.element.querySelector("input[name='phone']").value;

    if (!name || name === "") {
      alert("Name is required");
      this.element.querySelector("input[name='name']").focus();
      return;
    }

    if (!email || email === "") {
      alert("Email is required");
      this.element.querySelector("input[name='email']").focus();
      return;
    }

    if (!phone || phone === "") {
      alert("Phone is required");
      this.element.querySelector("input[name='phone']").focus();
      return;
    }

    const payload = {
      name: name,
      email: email,
      phone: phone,
      registration: this.generateRegistration()
    };

    const url = `${this.constructor.base_uri}/students`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (response.status === 422) {
          const errors = await response.json();
          alert(JSON.stringify(errors));
          return;
        }

        throw new Error(`HTTP Error: ${response.status}`);
      }

      this.renderList();

    } catch (error) {
      console.error('Error registering students:', error);
    }
  }

  generateRegistration() {
    const registeredStudents = document.querySelectorAll('.table tbody tr').length;
    const registration = registeredStudents + 1;
    const formattedRegistration = registration.toString().padStart(6, '0');
    return formattedRegistration;
  }

  newStudent() {
    this.element.innerHTML = `
      <form data-action="submit->students#register">
        <div class="form-group">
            <label for="name">Name</label>
            <input type="text" class="form-control" name="name" placeholder="Enter your name">
        </div>
        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" class="form-control" name="email" placeholder="Enter your email">
        </div>
        <div class="form-group">
            <label for="phone">Phone</label>
            <input type="tel" class="form-control" name="phone" placeholder="Enter your phone">
        </div>
        <br>
        <button type="submit" class="btn btn-primary">Submit</button>
        <button type="button" data-action="click->students#renderList" class="btn btn-danger">Cancel</button>
      </form>
    `;
  }

  async renderList() {
    try {
      const response = await fetch(`${this.constructor.base_uri}/students`);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const students = await response.json();

      if (students.length > 0) {
        this.element.innerHTML = `
          <button class="btn btn-primary mb-3" data-action="click->students#newStudent">New Student</button>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              ${
                students.map(student => `
                  <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.email}</td>
                    <td>${student.phone}</td>
                    <td style="width: 200px">
                      <button type="button" data-action="click->students#edit" data-student-id="${student.id}" class="btn btn-warning">Edit</button>
                      <button type="button" class="btn btn-danger" data-action="click->students#delete" data-student-id="${student.id}">Delete</button>
                    </td>
                  </tr>`
                ).join('')
              }
            </tbody>
          </table>
        `;
      } else {
        this.element.innerHTML = '<h3>No students registered...</h3>';
      }

    } catch (error) {
      console.error('Error fetching students:', error);
    }
  }

  async edit(event) {
    try {
      this.element.innerHTML = 'Loading...';
      const id = event.currentTarget.dataset.studentId;

      const url = `${this.constructor.base_uri}/students/${id}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const student = await response.json();

      this.element.innerHTML = `
        <form data-action="submit->students#update">
          <div class="form-group">
              <label for="name">Name</label>
              <input type="hidden" name="id" value="${student.id}">
              <input type="text" class="form-control" name="name" value="${student.name}" placeholder="Enter your name">
          </div>
          <div class="form-group">
              <label for="email">Email</label>
              <input type="email" class="form-control" name="email" value="${student.email}" placeholder="Enter your email">
          </div>
          <div class="form-group">
              <label for="phone">Phone</label>
              <input type="tel" class="form-control" name="phone" value="${student.phone}" placeholder="Enter your phone">
          </div>
          <br>
          <button type="submit" class="btn btn-primary">Submit</button>
          <button type="button" data-action="click->students#renderList" class="btn btn-danger">Cancel</button>
        </form>
      `;

    } catch (error) {
      console.error('Error updating students:', error);
    }
  }

  async update(event) {
    event.preventDefault();

    const id = this.element.querySelector("input[name='id']").value;
    const name = this.element.querySelector("input[name='name']").value;
    const email = this.element.querySelector("input[name='email']").value;
    const phone = this.element.querySelector("input[name='phone']").value;

    if (!id || id === "") {
      alert("ID is required");
      return;
    }

    if (!name || name === "") {
      alert("Name is required");
      this.element.querySelector("input[name='name']").focus();
      return;
    }

    if (!email || email === "") {
      alert("Email is required");
      this.element.querySelector("input[name='email']").focus();
      return;
    }

    if (!phone || phone === "") {
      alert("Phone is required");
      this.element.querySelector("input[name='phone']").focus();
      return;
    }

    const payload = {
      name: name,
      email: email,
      phone: phone
    };

    const url = `${this.constructor.base_uri}/students/${id}`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (response.status === 422) {
          const errors = await response.json();
          alert(JSON.stringify(errors));
          return;
        }

        throw new Error(`HTTP Error: ${response.status}`);
      }

      alert("Student updated successfully");
      this.renderList();

    } catch (error) {
      console.error('Error updating students:', error);
    }
  }

  async delete(event) {
    const id = event.currentTarget.dataset.studentId;
    if (confirm("Confirm deletion?")) {
      try {
        const url = `${this.constructor.base_uri}/students/${id}`
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 422) {
            const errors = await response.json();
            alert(JSON.stringify(errors));
            return;
          }

          throw new Error(`HTTP Error: ${response.status}`);
        }

        this.renderList();

      } catch (error) {
        console.error('Error deleting students:', error);
      }
    }
  }
}
