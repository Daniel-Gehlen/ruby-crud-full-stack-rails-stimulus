class Student < ApplicationRecord
    validates :name, :email, :phone, presence: true
end
