import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const contactValidator = vine.create({
  name: vine
    .string()
    .trim()
    .minLength(2)
    .maxLength(100)
    .regex(/^[\p{L}\s'’-]+$/u),

  email: vine.string().trim().email().maxLength(255),

  subject: vine.string().trim().minLength(3).maxLength(150),

  message: vine.string().trim().minLength(10).maxLength(3000),
})

contactValidator.messagesProvider = new SimpleMessagesProvider(
  {
    'required': 'Le champ {{ field }} est obligatoire.',
    'string': 'Le champ {{ field }} doit être un texte.',
    'email': 'Veuillez entrer une adresse e-mail valide.',
    'minLength': 'Le champ {{ field }} doit contenir au moins {{ min }} caractères.',
    'maxLength': 'Le champ {{ field }} ne doit pas dépasser {{ max }} caractères.',

    'name.regex': 'Veuillez renseigner un prénom et un nom valides.',
  },
  {
    name: 'prénom et nom',
    email: 'adresse e-mail',
    subject: 'sujet',
    message: 'message',
  }
)
