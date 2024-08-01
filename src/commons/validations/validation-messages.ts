const ValidationMessages = {
  isNotEmpty: (name = 'Esse campo') => `${name} não pode ser vazio`,
  minLength: (length: number, name: string) =>
    `${name} deve conter no mínino ${length} caracteres`,
  isEmail: (name: string) => `${name} com formato incorreto`,
  passwordConfirmation: () => `Confirmação de senha não confere`,
};

export default ValidationMessages;
