INSERT INTO book_author (book_id, author_id) VALUES
  (
    (SELECT id FROM book WHERE title = 'Clean Code: A Handbook of Agile Software Craftsmanship'),
    (SELECT id FROM author WHERE first_name = 'Robert' AND last_name = 'Martin')
  ),
  (
    (SELECT id FROM book WHERE title = 'The Pragmatic Programmer'),
    (SELECT id FROM author WHERE first_name = 'Andrew' AND last_name = 'Hunt')
  ),
  (
    (SELECT id FROM book WHERE title = 'The Pragmatic Programmer'),
    (SELECT id FROM author WHERE first_name = 'David' AND last_name = 'Thomas')
  ),
  (
    (SELECT id FROM book WHERE title = 'Head First Design Patterns'),
    (SELECT id FROM author WHERE first_name = 'Eric' AND last_name = 'Freeman')
  ),
  (
    (SELECT id FROM book WHERE title = 'Head First Design Patterns'),
    (SELECT id FROM author WHERE first_name = 'Elisabeth' AND last_name = 'Robson')
  ),
  (
    (SELECT id FROM book WHERE title = 'Head First Design Patterns'),
    (SELECT id FROM author WHERE first_name = 'Bert' AND last_name = 'Bates')
  ),
  (
    (SELECT id FROM book WHERE title = 'Head First Design Patterns'),
    (SELECT id FROM author WHERE first_name = 'Kathy' AND last_name = 'Sierra')
  ),
  (
    (SELECT id FROM book WHERE title = 'JavaScript: The Good Parts'),
    (SELECT id FROM author WHERE first_name = 'Douglas' AND last_name = 'Crockford')
  ),
  (
    (SELECT id FROM book WHERE title = 'JavaScript Patterns: Build Better Applications with Coding and Design Patterns'),
    (SELECT id FROM author WHERE first_name = 'Stoyan' AND last_name = 'Stefanov')
  ),
  (
    (SELECT id FROM book WHERE title = 'Cracking the Coding Interview, 6th Edition: 189 Programming Questions and Solutions'),
    (SELECT id FROM author WHERE first_name = 'Gayle' AND last_name = 'McDowell')
  ),
  (
    (SELECT id FROM book WHERE title = 'ng-book - The Complete Book on AngularJS'),
    (SELECT id FROM author WHERE first_name = 'Ari' AND last_name = 'Lerner')
  ),
  (
    (SELECT id FROM book WHERE title = 'ng-book 2: The Complete Book on Angular 2: Volume 2'),
    (SELECT id FROM author WHERE first_name = 'Nathan' AND last_name = 'Murray')
  ),
  (
    (SELECT id FROM book WHERE title = 'ng-book 2: The Complete Book on Angular 2: Volume 2'),
    (SELECT id FROM author WHERE first_name = 'Ari' AND last_name = 'Lerner')
  ),
  (
    (SELECT id FROM book WHERE title = 'ng-book 2: The Complete Book on Angular 2: Volume 2'),
    (SELECT id FROM author WHERE first_name = 'Felipe' AND last_name = 'Coury')
  ),
  (
    (SELECT id FROM book WHERE title = 'ng-book 2: The Complete Book on Angular 2: Volume 2'),
    (SELECT id FROM author WHERE first_name = 'Carlos' AND last_name = 'Taborda')
  ),
  (
    (SELECT id FROM book WHERE title = 'OCA: Oracle Certified Associate Java SE 8 Programmer I Study Guide: Exam 1Z0-808'),
    (SELECT id FROM author WHERE first_name = 'Jeanne' AND last_name = 'Boyarsky')
  ),
  (
    (SELECT id FROM book WHERE title = 'OCP: Oracle Certified Professional Java Se 8 Programmer II Study Guide: Exam 1Z0-809'),
    (SELECT id FROM author WHERE first_name = 'Jeanne' AND last_name = 'Boyarsky')
  ),
  (
    (SELECT id FROM book WHERE title = 'OCP: Oracle Certified Professional Java Se 8 Programmer II Study Guide: Exam 1Z0-809'),
    (SELECT id FROM author WHERE first_name = 'Scott' AND last_name = 'Selikoff')
  ),
  (
    (SELECT id FROM book WHERE title = 'Pro AngularJS (Expert''s Voice in Web Development)'),
    (SELECT id FROM author WHERE first_name = 'Adam' AND last_name = 'Freeman')
  ),
  (
    (SELECT id FROM book WHERE title = 'JS.Next: ECMAScript 6'),
    (SELECT id FROM author WHERE first_name = 'Aaron' AND last_name = 'Frost')
  ),
  (
    (SELECT id FROM book WHERE title = 'You Don''t Know JS: ES6 & Beyond'),
    (SELECT id FROM author WHERE first_name = 'Kyle' AND last_name = 'Simpson')
  ),
  (
    (SELECT id FROM book WHERE title = 'Production-Ready Microservices: Building Standardized Systems Across an Engineering Organization'),
    (SELECT id FROM author WHERE first_name = 'Susan' AND last_name = 'Fowler')
  ),
  (
    (SELECT id FROM book WHERE title = 'Building Microservices: Designing Fine-Grained Systems'),
    (SELECT id FROM author WHERE first_name = 'Sam' AND last_name = 'Newman')
  ),
  (
    (SELECT id FROM book WHERE title = 'The Hacker Playbook 2: Practical Guide To Penetration Testing'),
    (SELECT id FROM author WHERE first_name = 'Peter' AND last_name = 'Kim')
  ),
  (
    (SELECT id FROM book WHERE title = 'ng-book: The Complete Guide to Angular 4'),
    (SELECT id FROM author WHERE first_name = 'Nathan' AND last_name = 'Murray')
  ),
  (
    (SELECT id FROM book WHERE title = 'ng-book: The Complete Guide to Angular 4'),
    (SELECT id FROM author WHERE first_name = 'Ari' AND last_name = 'Lerner')
  ),
  (
    (SELECT id FROM book WHERE title = 'ng-book: The Complete Guide to Angular 4'),
    (SELECT id FROM author WHERE first_name = 'Felipe' AND last_name = 'Coury')
  ),
  (
    (SELECT id FROM book WHERE title = 'ng-book: The Complete Guide to Angular 4'),
    (SELECT id FROM author WHERE first_name = 'Carlos' AND last_name = 'Taborda')
  ),
  (
    (SELECT id FROM book WHERE title = 'Automate the Boring Stuff with Python: Practical Programming for Total Beginners'),
    (SELECT id FROM author WHERE first_name = 'Al' AND last_name = 'Sweigart')
  ),
  (
    (SELECT id FROM book WHERE title = 'Node.js Design Patterns - Second Edition: Master best practices to build modular and scalable server-side web applications'),
    (SELECT id FROM author WHERE first_name = 'Mario' AND last_name = 'Casciaro')
  ),
  (
    (SELECT id FROM book WHERE title = 'Node.js Design Patterns - Second Edition: Master best practices to build modular and scalable server-side web applications'),
    (SELECT id FROM author WHERE first_name = 'Luciano' AND last_name = 'Mammino')
  ),
  (
    (SELECT id FROM book WHERE title = 'Mastering TypeScript - Second Edition'),
    (SELECT id FROM author WHERE first_name = 'Nathan' AND last_name = 'Rozentals')
  ),
  (
    (SELECT id FROM book WHERE title = 'TypeScript Microservices: A complete guide to build, deploy, test, & secure microservices with TypeScript and NodeJS'),
    (SELECT id FROM author WHERE first_name = 'Parth' AND last_name = 'Ghiya')
  ),
  (
    (SELECT id FROM book WHERE title = 'Data Structure and Algorithmic Thinking with Python: Data Structure and Algorithmic Puzzles'),
    (SELECT id FROM author WHERE first_name = 'Narasimha' AND last_name = 'Karumanchi')
  );