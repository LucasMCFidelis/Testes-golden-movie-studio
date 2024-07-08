/// <reference types = "cypress"/>
import { faker } from '@faker-js/faker';
import { beforeEach } from 'mocha';

describe('US-012-Funcionalidade: Cadastro de membros', () => {
  beforeEach(() => {
    cy.visit('/')
  });

  const generateValidPassword = () => {
    let password;
    const specialChars = '!@#$&*';

    do {
      password = faker.internet.password(8, false, /[A-Za-z0-9!@#$&*]/);
    } while (
      !/[A-Z]/.test(password) ||   // Verifica se tem pelo menos uma letra maiúscula
      !/[0-9]/.test(password) ||   // Verifica se tem pelo menos um número
      !/[!@#$&*]/.test(password) || // Verifica se tem pelo menos um caractere especial
      password.length < 8          // Verifica se tem pelo menos 8 caracteres
    );

    return password;
  };

  const generateValidFirstName = () => {
    const name = faker.name.firstName();
    return name.replace(/[^a-zA-ZáéíóúÁÉÍÓÚãõÃÕâêîôûÂÊÎÔÛàèìòùÀÈÌÒÙçÇ\s]/g, '');
  };

  const generateValidLastName = () => {
    const lastName = faker.name.lastName();
    return lastName.replace(/[^a-zA-ZáéíóúÁÉÍÓÚãõÃÕâêîôûÂÊÎÔÛàèìòùÀÈÌÒÙçÇ\s]/g, '');
  };

  const generateInvalidName = (name) => {
    const invalidChars = '1234567890!@#$%^&*()_+';
    const randomIndex = Math.floor(Math.random() * name.length);
    const randomInvalidChar = invalidChars.charAt(Math.floor(Math.random() * invalidChars.length));
    return name.slice(0, randomIndex) + randomInvalidChar + name.slice(randomIndex);
  };

  const generateInvalidFirstName = () => {
    const name = faker.name.firstName();
    return generateInvalidName(name);
  };

  const generateInvalidLastName = () => {
    const name = faker.name.lastName();
    return generateInvalidName(name);
  };

  const vazio = '';

  it('Deve fazer cadastro com os campos controlados, adicionando o usuário com email luis@teste.com', () => {
    cy.preencherCadastro(generateValidFirstName(), generateValidLastName(), 'luis@teste.com', faker.phone.number('##########'), generateValidPassword())
    cy.get('#signup-response').should('contain', 'Cadastro realizado com sucesso!')
  });

  it('Deve fazer o cadastro de campos obrigatórios', () => {
    cy.preencherCadastro(generateValidFirstName(), generateValidLastName(), faker.internet.email(), null,generateValidPassword())
    cy.get('#signup-response').should('contain', 'Cadastro realizado com sucesso!')
  });

  it('Deve fazer o cadastro com todos os campos', () => {
    cy.preencherCadastro(generateValidFirstName(), generateValidLastName(), faker.internet.email(), faker.phone.number('##########'), generateValidPassword())
    cy.get('#signup-response').should('contain', 'Cadastro realizado com sucesso!')
  });

  it('Deve bloquear o cadastro utilizando uma senha fraca', () => {
    cy.preencherCadastro(generateValidFirstName(), generateValidLastName(), faker.internet.email(), faker.phone.number('##########'), faker.internet.password(8, true, /[A-Za-z0-9!@#$%^&*()_+{}\[\]:;"'<>?,.\/]/))
    cy.get('#signup-response').should('contain', '{"message":"Senha deve ter pelo menos 8 caracteres, incluir uma letra maiúscula, um número e um caractere especial (!@#$&*)"}')
  });
  
  it('Deve bloquear o cadastro com nome invalido', () => {
    cy.preencherCadastro(generateInvalidFirstName(), generateValidLastName(), faker.internet.email(), faker.phone.number('##########'), generateValidPassword())
    cy.get('#signup-response').should('contain', '{"message":"Nome deve conter apenas caracteres alfabéticos, acentuados e espaços"}')
  });

  it('Deve bloquear o cadastro com campo nome vazio', () => {
    cy.preencherCadastro(vazio, generateValidLastName(), faker.internet.email(), faker.phone.number('##########'), generateValidPassword());
    cy.get('#signup-response').should('contain', '{"message":"Nome não pode estar vazio"}');
  });
  
  it('Deve bloquear o cadastro com campo sobrenome vazio', () => {
    cy.preencherCadastro(generateValidFirstName(), vazio, faker.internet.email(), faker.phone.number('##########'), generateValidPassword());
    cy.get('#signup-response').should('contain', '{"message":"Sobrenome não pode estar vazio"}');
  });
  
  it('Deve bloquear o cadastro com campo email vazio', () => {
    cy.preencherCadastro(generateValidFirstName(), generateValidLastName(), vazio, faker.phone.number('##########'), generateValidPassword());
    cy.get('#signup-response').should('contain', '{"message":"E-mail não pode estar vazio"}');
  });
  
  it('Deve bloquear o cadastro com campo senha vazio', () => {
    cy.preencherCadastro(generateValidFirstName(), generateValidLastName(), faker.internet.email(), faker.phone.number('##########'), vazio);
    cy.get('#signup-response').should('contain', '{"message":"Senha não pode estar vazia"}')
  });

  it('Deve bloquear o cadastro com email repetido', () => {
    cy.preencherCadastro(generateValidFirstName(), generateValidLastName(), 'luis@teste.com', faker.phone.number('##########'), generateValidPassword())
    cy.get('#signup-response').should('contain', '{"message":"Este email já está cadastrado."}')
  });
  
  it('Deve realizar a validação do link de política de privacidade', () => {
    cy.on('uncaught:exception', (err) => {
      // Se o erro é `Cannot read properties of null (reading 'addEventListener')`, ignore-o
      if (err.message.includes('Cannot read properties of null (reading \'addEventListener\')')) {
        return false;
      }
      // Para qualquer outro erro, a execução do teste deve ser interrompida
      return true;
    });

    cy.get('a').contains('Política de Privacidade').click();
    cy.url().should('include', '/polices.html'); 
    cy.get('h1').should('contain', 'Política de Privacidade');
  });
  
});
