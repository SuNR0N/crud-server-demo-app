import Joi from 'joi';

const PROPERTY = 'property';
const QUERY_PARAMETER = 'query parameter';

interface ICustomJoi extends Joi.Root {
  coerceNull(): Joi.StringSchema;
}

const CustomJoi: ICustomJoi = Joi.extend({
  base: Joi.string().allow(null),
  coerce: (value, state, options) => value === '' ? null : value,
  name: 'coerceNull',
});

const Authors = CustomJoi.array().items(CustomJoi.number())
  .error(new Error("The property 'authors' must contain numbers only"));
const Categories = CustomJoi.array().items(CustomJoi.number())
  .error(new Error("The property 'categories' must contain numbers only"));
const FirstName = CustomJoi.string().required()
  .error(new Error("The property 'firstName' is required"));
const Id = CustomJoi.number()
  .error(new Error("The path parameter 'id' must be a number"));
const ISBN13 = CustomJoi.string().required()
  .error(new Error("The property 'isbn13' is required"));
const LastName = CustomJoi.string().required()
  .error(new Error("The property 'lastName' is required"));
const Name = CustomJoi.string().required()
  .error(new Error("The property 'name' is required"));
const Offset = CustomJoi.number()
  .error(new Error("The query parameter 'offset' must be a number"));
const PageSize = CustomJoi.number()
  .error(new Error("The query parameter 'page-size' must be a number"));
const Publishers = CustomJoi.array().items(CustomJoi.number())
  .error(new Error("The property 'publishers' must contain numbers only"));
const Title = CustomJoi.string().required()
  .error(new Error("The property 'title' is required"));

function objectValidator(name: string = PROPERTY): Joi.ValidationErrorFunction {
  return (errors) => {
    for (const error of errors) {
      if (error.type === 'object.allowUnknown' && error.context) {
        return new Error(`The ${name} '${error.context.key}' is not allowed`);
      }
    }
    return errors;
  };
}

const AuthorUpdate = CustomJoi.object().keys({
  firstName: CustomJoi.string(),
  lastName: CustomJoi.string(),
  middleName: CustomJoi.coerceNull().allow(''),
}).error(objectValidator());
const BookUpdate = CustomJoi.object().keys({
  authors: Authors,
  categories: Categories,
  isbn10: CustomJoi.coerceNull().allow(''),
  isbn13: CustomJoi.string(),
  publicationDate: CustomJoi.string().allow(null),
  publishers: Publishers,
  title: CustomJoi.string(),
}).error(objectValidator());
const Category = CustomJoi.object().keys({
  name: Name,
}).error(objectValidator());
const GetAuthorsQuery = CustomJoi.object().keys({
  q: CustomJoi.string(),
}).error(objectValidator(QUERY_PARAMETER));
const GetBooksQuery = CustomJoi.object().keys({
  'offset': Offset,
  'page-size': PageSize,
  'q': CustomJoi.string(),
}).error(objectValidator(QUERY_PARAMETER));
const GetCategoriesQuery = CustomJoi.object().keys({
  q: CustomJoi.string(),
}).error(objectValidator(QUERY_PARAMETER));
const GetPublishersQuery = CustomJoi.object().keys({
  q: CustomJoi.string(),
}).error(objectValidator(QUERY_PARAMETER));
const NewAuthor = CustomJoi.object().keys({
  firstName: FirstName,
  lastName: LastName,
  middleName: CustomJoi.string(),
}).error(objectValidator());
const NewBook = CustomJoi.object().keys({
  authors: Authors,
  categories: Categories,
  isbn10: CustomJoi.string(),
  isbn13: ISBN13,
  publicationDate: CustomJoi.string(),
  publishers: Publishers,
  title: Title,
}).error(objectValidator());
const Publisher = CustomJoi.object().keys({
  name: Name,
}).error(objectValidator());

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
