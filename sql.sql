CREATE DATABASE HEER;
USE HEER;
create table USERS(
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username varchar(30) NOT NULL UNIQUE,
    PASSWORD CHAR(64) NOT NULL ,
    bio varchar(100) ,
    pfp varchar(255)
);
insert into users (username,password,bio) 
	values ("Prabh","akdhfkjasdkfjnsadfsk","Hi there im prabh");
create table POSTS(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT not null,
	pic varchar(255),
    caption text,
    FOREIGN KEY (user_id) REFERENCES USERS(id)
);
create table rels(
	user1 int PRIMARY KEY ,
    user2 int NOT NULL ,
    type enum('follow','block') ,
    foreign key (USER1) references USERS(id) ,
    foreign key (USER2) references USERS(id)
);

drop database heer;
ALTER TABLE posts
DROP FOREIGN KEY user_id;

ALTER TABLE posts 
  ADD CONSTRAINT user_id_cascade 
  FOREIGN KEY (user_id) 
  REFERENCES users(id) 
  ON DELETE CASCADE;
