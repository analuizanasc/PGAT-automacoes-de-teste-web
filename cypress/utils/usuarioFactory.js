import { faker } from '@faker-js/faker'

const PAISES_DISPONIVEIS = ['India', 'United States', 'Canada', 'Australia', 'Israel', 'New Zealand', 'Singapore']
const MESES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

/**
 * Gera um usuário novo a cada chamada. O e-mail leva timestamp para não colidir
 * com cadastros de outras execuções (o site é público e compartilhado).
 */
export function criarUsuario() {
  const primeiroNome = faker.person.firstName()
  const sobrenome = faker.person.lastName()
  const nascimento = faker.date.birthdate({ min: 18, max: 70, mode: 'age' })

  return {
    titulo: faker.helpers.arrayElement(['Mr', 'Mrs']),
    nome: `${primeiroNome} ${sobrenome}`,
    email: `qa.${Date.now()}.${faker.string.alphanumeric(5)}@teste.com`.toLowerCase(),
    senha: faker.internet.password({ length: 10 }),
    diaNascimento: String(nascimento.getDate()),
    mesNascimento: MESES[nascimento.getMonth()],
    anoNascimento: String(nascimento.getFullYear()),
    primeiroNome,
    sobrenome,
    empresa: faker.company.name(),
    endereco: faker.location.streetAddress(),
    complemento: faker.location.secondaryAddress(),
    pais: faker.helpers.arrayElement(PAISES_DISPONIVEIS),
    estado: faker.location.state(),
    cidade: faker.location.city(),
    cep: faker.location.zipCode('#####'),
    celular: faker.string.numeric(11),
  }
}
