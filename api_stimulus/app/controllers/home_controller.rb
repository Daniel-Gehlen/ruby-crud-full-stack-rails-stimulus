class HomeController < ApplicationController
  # GET /alunos
  def index
    @students = Student.all

    render json: {
      message: "Welcome to the API for stimulus!",
      endpoints: [
        "/students"
      ]
    }
  end
end
