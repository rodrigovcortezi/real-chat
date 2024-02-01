import type { User } from '~/model/user'

export interface CreateUserDTO {
  email: string
  password: string
}

export interface UpdateUserDTO {
  email?: string
  password?: string
}

export interface UserRepository {
  createUser(userData: CreateUserDTO): Promise<User>
  updateUser(id: string, userData: UpdateUserDTO): Promise<User>
  findUserByEmail(email: string): Promise<User | null>
}
