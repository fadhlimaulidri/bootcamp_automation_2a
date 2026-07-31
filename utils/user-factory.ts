import { faker } from '@faker-js/faker';
import { UserData } from '../models/user-data';

export class UserFactory {

  static createUser(): UserData {
    return {
      email: faker.internet.email().toLowerCase(),
      password: 'tester!3',
      fullName: faker.person.fullName(),
      phoneNumber: faker.string.numeric(12),
      companyName: faker.company.name(),
      industry: 'ecommerce',
      companySize: '11-50'
    };
  }

}