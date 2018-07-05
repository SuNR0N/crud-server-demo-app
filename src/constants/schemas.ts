import Joi from 'joi';

const Authors = Joi.array().items(Joi.number())
  .error(new Error("The property 'authors' must contain numbers only"));
const Categories = Joi.array().items(Joi.number())
  .error(new Error("The property 'categories' must contain numbers only"));
const FirstName = Joi.string().required()
  .error(new Error("The property 'firstName' is required"));
const Id = Joi.number()
  .error(new Error("The path parameter 'id' must be a number"));
const ISBN13 = Joi.string().required()
  .error(new Error("The property 'isbn13' is required"));
const LastName = Joi.string().required()
  .error(new Error("The property 'lastName' is required"));
const Name = Joi.string().required()
  .error(new Error("The property 'name' is required"));
const Offset = Joi.number()
  .error(new Error("The query parameter 'offset' must be a number"));
const PageSize = Joi.number()
  .error(new Error("The query parameter 'page-size' must be a number"));
const Publishers = Joi.array().items(Joi.number())
  .error(new Error("The property 'publishers' must contain numbers only"));
const Title = Joi.string().required()
  .error(new Error("The property 'title' is required"));

const objectValidator: Joi.ValidationErrorFunction = (errors) => {
  for (const error of errors) {
    if (error.type === 'object.allowUnknown' && error.context) {
      return new Error(`The property '${error.context.key}' is not allowed`);
    }
  }
  return errors;
};

const AuthorUpdate = Joi.object().keys({
  firstName: Joi.string(),
  lastName: Joi.string(),
  middleName: Joi.string(),
}).error(objectValidator);
const BookUpdate = Joi.object().keys({
  authors: Authors,
  categories: Categories,
  isbn10: Joi.string(),
  isbn13: Joi.string(),
  publicationDate: Joi.string(),
  publishers: Publishers,
  title: Joi.string(),
}).error(objectValidator);
const Category = Joi.object().keys({
  name: Name,
}).error(objectValidator);
const GetAuthorsQuery = Joi.object().keys({
  q: Joi.string(),
});
const GetBooksQuery = Joi.object().keys({
  'offset': Offset,
  'page-size': PageSize,
  'q': Joi.string(),
});
const GetCategoriesQuery = Joi.object().keys({
  q: Joi.string(),
});
const GetPublishersQuery = Joi.object().keys({
  q: Joi.string(),
});
const NewAuthor = Joi.object().keys({
  firstName: FirstName,
  lastName: LastName,
  middleName: Joi.string(),
}).error(objectValidator);
const NewBook = Joi.object().keys({
  authors: Authors,
  categories: Categories,
  isbn10: Joi.string(),
  isbn13: ISBN13,
  publicationDate: Joi.string(),
  publishers: Publishers,
  title: Title,
}).error(objectValidator);
const Publisher = Joi.object().keys({
  name: Name,
}).error(objectValidator);

export const Schemas = {
  AuthorUpdate,
  BookUpdate,
  Category,
  GetAuthorsQuery,
  GetBooksQuery,
  GetCategoriesQuery,
  GetPublishersQuery,
  Id,
  NewAuthor,
  NewBook,
  Publisher,
};
