INSERT INTO book_category (book_id, category_id) VALUES
  (
    (SELECT id FROM book WHERE title = 'Clean Code: A Handbook of Agile Software Craftsmanship'),
    (SELECT id FROM category WHERE name = 'Computers & Technology')
  ),
  (
    (SELECT id FROM book WHERE title = 'The Pragmatic Programmer'),
    (SELECT id FROM category WHERE name = 'Computers & Technology')
  ),
  (
    (SELECT id FROM book WHERE title = 'Head First Design Patterns'),
    (SELECT id FROM category WHERE name = 'Computers & Technology')
  ),
  (
    (SELECT id FROM book WHERE title = 'JavaScript: The Good Parts'),
    (SELECT id FROM category WHERE name = 'Computers & Technology')
  ),
  (
    (SELECT id FROM book WHERE title = 'JavaScript Patterns: Build Better Applications with Coding and Design Patterns'),
    (SELECT id FROM category WHERE name = 'Computers & Technology')
  ),
  (
    (SELECT id FROM book WHERE title = 'Cracking the Coding Interview, 6th Edition: 189 Programming Questions and Solutions'),
    (SELECT id FROM category WHERE name = 'Computers & Technology')
  ),
  (
    (SELECT id FROM book WHERE title = 'ng-book - The Complete Book on AngularJS'),
    (SELECT id FROM category WHERE name = 'Computers & Technology')
  ),
  (
    (SELECT id FROM book WHERE title = 'ng-book 2: The Complete Book on Angular 2: Volume 2'),
    (SELECT id FROM category WHERE name = 'Computers & Technology')
  ),
  (
    (SELECT id FROM book WHERE title = 'OCA: Oracle Certified Associate Java SE 8 Programmer I Study Guide: Exam 1Z0-808'),
    (SELECT id FROM category WHERE name = 'Computers & Technology')
  ),
  (
    (SELECT id FROM book WHERE title = 'OCP: Oracle Certified Professional Java Se 8 Programmer II Study Guide: Exam 1Z0-809'),
    (SELECT id FROM category WHERE name = 'Computers & Technology')
  ),
  (
    (SELECT id FROM book WHERE title = 'Pro AngularJS (Expert''s Voice in Web Development)'),
    (SELECT id FROM category WHERE name = 'Computers & Technology')
  ),
  (
    (SELECT id FROM book WHERE title = 'JS.Next: ECMAScript 6'),
    (SELECT id FROM category WHERE name = 'Computers & Technology')
  ),
  (
    (SELECT id FROM book WHERE title = 'You Don''t Know JS: ES6 & Beyond'),
    (SELECT id FROM category WHERE name = 'Computers & Technology')
  ),
  (
    (SELECT id FROM book WHERE title = 'Production-Ready Microservices: Building Standardized Systems Across an Engineering Organization'),
    (SELECT id FROM category WHERE name = 'Computers & Technology')
  ),
  (
    (SELECT id FROM book WHERE title = 'Building Microservices: Designing Fine-Grained Systems'),
    (SELECT id FROM category WHERE name = 'Computers & Technology')
  ),
  (
    (SELECT id FROM book WHERE title = 'The Hacker Playbook 2: Practical Guide To Penetration Testing'),
    (SELECT id FROM category WHERE name = 'Computers & Technology')
  ),
  (
    (SELECT id FROM book WHERE title = 'ng-book: The Complete Guide to Angular 4'),
    (SELECT id FROM category WHERE name = 'Computers & Technology')
  ),
  (
    (SELECT id FROM book WHERE title = 'Automate the Boring Stuff with Python: Practical Programming for Total Beginners'),
    (SELECT id FROM category WHERE name = 'Computers & Technology')
  ),
  (
    (SELECT id FROM book WHERE title = 'Node.js Design Patterns - Second Edition: Master best practices to build modular and scalable server-side web applications'),
    (SELECT id FROM category WHERE name = 'Computers & Technology')
  ),
  (
    (SELECT id FROM book WHERE title = 'Mastering TypeScript - Second Edition'),
    (SELECT id FROM category WHERE name = 'Computers & Technology')
  ),
  (
    (SELECT id FROM book WHERE title = 'TypeScript Microservices: A complete guide to build, deploy, test, & secure microservices with TypeScript and NodeJS'),
    (SELECT id FROM category WHERE name = 'Computers & Technology')
  ),
  (
    (SELECT id FROM book WHERE title = 'Data Structure and Algorithmic Thinking with Python: Data Structure and Algorithmic Puzzles'),
    (SELECT id FROM category WHERE name = 'Computers & Technology')
  );